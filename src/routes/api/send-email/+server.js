import { MAILGUN_API_KEY, MAILGUN_DOMAIN, RECIPIENT_EMAIL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import crypto from 'crypto';

// Rate limiting (simple in-memory store)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

// Input sanitization function
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>"'&]/g, '') // Remove potentially dangerous characters
        .trim()
        .substring(0, 1000); // Limit length
}

// Simple rate limiting
function checkRateLimit(clientIP) {
    const now = Date.now();
    const clientData = rateLimitStore.get(clientIP) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    
    if (now > clientData.resetTime) {
        clientData.count = 1;
        clientData.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
        clientData.count++;
    }
    
    rateLimitStore.set(clientIP, clientData);
    return clientData.count <= MAX_REQUESTS_PER_WINDOW;
}

export async function POST({ request, getClientAddress }) {
    try {
        // Rate limiting
        const clientIP = getClientAddress();
        if (!checkRateLimit(clientIP)) {
            return json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
        }
        
        const { name, email, subject, message } = await request.json();
        
        // Sanitize all inputs
        const sanitizedName = sanitizeInput(name);
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedSubject = sanitizeInput(subject);
        const sanitizedMessage = sanitizeInput(message);
        
        // Validate sanitized input
        if (!sanitizedName || !sanitizedEmail || !sanitizedSubject || !sanitizedMessage) {
            return json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        // Enhanced email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(sanitizedEmail)) {
            return json({ error: 'Invalid email format' }, { status: 400 });
        }
        
        // Check for suspicious content (basic spam detection)
        const suspiciousPatterns = [/http[s]?:\/\//gi, /www\./gi, /<script/gi, /javascript:/gi];
        const allContent = `${sanitizedName} ${sanitizedSubject} ${sanitizedMessage}`;
        if (suspiciousPatterns.some(pattern => pattern.test(allContent))) {
            return json({ error: 'Message contains suspicious content' }, { status: 400 });
        }
        
        // Generate unique message ID for tracking
        const messageId = crypto.randomUUID();
        const timestamp = new Date().toISOString();
        
        // Prepare email data with sanitized inputs
        const emailData = new FormData();
        emailData.append('from', `Secure Contact <noreply@${MAILGUN_DOMAIN}>`);
        emailData.append('to', RECIPIENT_EMAIL);
        emailData.append('subject', `[SECURE] Portfolio Contact: ${sanitizedSubject}`);
        emailData.append('o:tag', 'portfolio-contact');
        emailData.append('o:tracking', 'yes');
        emailData.append('text', `
🔐 SECURE CONTACT TRANSMISSION
═══════════════════════════════

Message ID: ${messageId}
Timestamp: ${timestamp}
Client IP: ${clientIP}

Contact Details:
├─ Name: ${sanitizedName}
├─ Email: ${sanitizedEmail}
└─ Subject: ${sanitizedSubject}

Message Content:
${sanitizedMessage}

═══════════════════════════════
Secure transmission completed via encrypted channel
        `);
        emailData.append('html', `
<div style="font-family: 'Source Code Pro', monospace; background: #000; color: #00ff00; padding: 20px; border: 2px solid #00ff00;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #00ff00; margin: 0; text-shadow: 0 0 10px #00ff00;">🔐 SECURE TRANSMISSION</h2>
        <div style="background: #00ff00; height: 1px; margin: 10px 0; box-shadow: 0 0 5px #00ff00;"></div>
    </div>
    
    <div style="background: rgba(0, 20, 0, 0.9); border: 1px solid #00ff00; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);">
        <div style="margin-bottom: 15px; font-size: 12px; color: #00aa00; border-bottom: 1px solid rgba(0, 255, 0, 0.3); padding-bottom: 10px;">
            <p style="margin: 5px 0;">Message ID: <span style="color: #00ff00;">${messageId}</span></p>
            <p style="margin: 5px 0;">Timestamp: <span style="color: #00ff00;">${timestamp}</span></p>
            <p style="margin: 5px 0;">Status: <span style="color: #00ff00;">ENCRYPTED & VERIFIED</span></p>
        </div>
        
        <div style="margin: 15px 0;">
            <p style="margin: 8px 0;"><strong>Name:</strong> <span style="color: #00aa00;">${sanitizedName}</span></p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #00aa00; text-decoration: none;">${sanitizedEmail}</a></p>
            <p style="margin: 8px 0;"><strong>Subject:</strong> <span style="color: #00aa00;">${sanitizedSubject}</span></p>
        </div>
        
        <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(0, 255, 0, 0.3);">
            <p style="margin-bottom: 10px;"><strong>Encrypted Message:</strong></p>
            <div style="background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(0, 255, 0, 0.2); padding: 15px; border-radius: 4px; white-space: pre-wrap; line-height: 1.6; font-family: 'Source Code Pro', monospace;">${sanitizedMessage}</div>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; padding: 10px; background: rgba(0, 255, 0, 0.1); border-radius: 4px;">
        <p style="font-size: 11px; color: #00aa00; margin: 0;">
            🛡️ This message was transmitted through a secure, encrypted channel<br/>
            Portfolio Security Terminal | Anti-Spam Verified | Rate Limited
        </p>
    </div>
</div>
        `);
        
        // Send email via Mailgun
        const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`
            },
            body: emailData
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Mailgun API error:', errorData);
            return json({ error: 'Failed to send email' }, { status: 500 });
        }
        
        const result = await response.json();
        
        // Log successful transmission (without sensitive data)
        console.log(`Secure message transmitted successfully - ID: ${messageId}`);
        
        return json(
            { success: true, message: 'Secure transmission completed successfully!', messageId },
            { 
                status: 200,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-XSS-Protection': '1; mode=block',
                    'Referrer-Policy': 'strict-origin-when-cross-origin'
                }
            }
        );
        
    } catch (error) {
        console.error('Email sending error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
}