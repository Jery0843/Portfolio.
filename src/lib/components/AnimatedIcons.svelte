<script>
export let icon = 'github'; // github, linkedin, x, email, discord, location, rocket, trophy, blog, mail, lightning, search
export let size = '18px';
export let color = 'currentColor';
</script>

<div class="animated-icon-wrapper" style="--icon-size: {size}; --icon-color: {color};">
    {#if icon === 'github'}
        <div class="github-icon">
            <div class="octocat-body"></div>
            <div class="octocat-head"></div>
            <div class="octocat-ear left"></div>
            <div class="octocat-ear right"></div>
            <div class="code-symbol">{'<>'}</div>
        </div>
    {:else if icon === 'linkedin'}
        <div class="linkedin-icon">
            <div class="linkedin-bg"></div>
            <div class="linkedin-in">in</div>
        </div>
    {:else if icon === 'x'}
        <div class="x-icon">
            <div class="x-line line-1"></div>
            <div class="x-line line-2"></div>
        </div>
    {:else if icon === 'email'}
        <div class="email-icon">
            <div class="envelope-body"></div>
            <div class="envelope-flap"></div>
            <div class="email-pulse pulse-1"></div>
            <div class="email-pulse pulse-2"></div>
        </div>
    {:else if icon === 'discord'}
        <div class="discord-icon">
            <div class="discord-body"></div>
            <div class="discord-eye left"></div>
            <div class="discord-eye right"></div>
            <div class="discord-smile"></div>
        </div>
    {:else if icon === 'location'}
        <div class="location-icon">
            <div class="pin-body"></div>
            <div class="pin-dot"></div>
            <div class="location-pulse"></div>
        </div>
    {:else if icon === 'rocket'}
        <div class="rocket-icon">
            <div class="rocket-body"></div>
            <div class="rocket-window"></div>
            <div class="rocket-fin left"></div>
            <div class="rocket-fin right"></div>
            <div class="rocket-flame flame-1"></div>
            <div class="rocket-flame flame-2"></div>
            <div class="rocket-flame flame-3"></div>
        </div>
    {:else if icon === 'trophy'}
        <div class="trophy-icon">
            <div class="trophy-cup"></div>
            <div class="trophy-base"></div>
            <div class="trophy-handle left"></div>
            <div class="trophy-handle right"></div>
            <div class="trophy-star">★</div>
        </div>
    {:else if icon === 'blog'}
        <div class="blog-icon">
            <div class="paper"></div>
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
            <div class="pen"></div>
        </div>
    {:else if icon === 'mail'}
        <div class="mail-icon">
            <div class="envelope-box"></div>
            <div class="envelope-top"></div>
            <div class="mail-shine"></div>
        </div>
    {:else if icon === 'lightning'}
        <div class="lightning-icon">
            <div class="bolt"></div>
            <div class="spark spark-1">✦</div>
            <div class="spark spark-2">✦</div>
            <div class="spark spark-3">✦</div>
        </div>
    {:else if icon === 'search'}
        <div class="search-icon">
            <div class="magnifier-circle"></div>
            <div class="magnifier-handle"></div>
            <div class="search-pulse"></div>
        </div>
    {/if}
</div>

<style>
.animated-icon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--icon-size);
    height: var(--icon-size);
    position: relative;
    color: var(--icon-color);
}

/* GitHub Icon */
.github-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: iconFloat 3s ease-in-out infinite;
}

.octocat-body {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 55%;
    height: 50%;
    background: currentColor;
    border-radius: 50% 50% 45% 45%;
}

.octocat-head {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 35%;
    background: currentColor;
    border-radius: 50%;
}

.octocat-ear {
    position: absolute;
    top: 18%;
    width: 18%;
    height: 18%;
    background: currentColor;
    border-radius: 50%;
}

.octocat-ear.left { left: 15%; }
.octocat-ear.right { right: 15%; }

.code-symbol {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.5em;
    font-weight: bold;
    color: #000;
    mix-blend-mode: difference;
    animation: codeFlicker 2s ease-in-out infinite;
}

/* LinkedIn Icon */
.linkedin-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: iconFloat 3s ease-in-out infinite 0.5s;
}

.linkedin-bg {
    position: absolute;
    inset: 0;
    background: currentColor;
    border-radius: 15%;
}

.linkedin-in {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.65em;
    font-weight: bold;
    color: #000;
    mix-blend-mode: difference;
    font-family: 'Arial', sans-serif;
}

/* X (Twitter) Icon */
.x-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: iconFloat 3s ease-in-out infinite 1s;
}

.x-line {
    position: absolute;
    width: 85%;
    height: 12%;
    background: currentColor;
    border-radius: 2px;
    top: 50%;
    left: 50%;
}

.line-1 {
    transform: translate(-50%, -50%) rotate(45deg);
    animation: xRotate 4s ease-in-out infinite;
}

.line-2 {
    transform: translate(-50%, -50%) rotate(-45deg);
    animation: xRotate 4s ease-in-out infinite 0.5s;
}

/* Email Icon */
.email-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: iconFloat 3s ease-in-out infinite;
}

.envelope-body {
    position: absolute;
    bottom: 15%;
    left: 10%;
    width: 80%;
    height: 60%;
    background: transparent;
    border: 2px solid currentColor;
    border-radius: 4px;
}

.envelope-flap {
    position: absolute;
    bottom: 45%;
    left: 10%;
    width: 80%;
    height: 0;
    border-left: calc(var(--icon-size) * 0.4) solid transparent;
    border-right: calc(var(--icon-size) * 0.4) solid transparent;
    border-bottom: calc(var(--icon-size) * 0.3) solid currentColor;
    animation: flapOpen 3s ease-in-out infinite;
}

.email-pulse {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 30%;
    height: 30%;
    border: 2px solid currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pulsate 2s ease-out infinite;
}

.pulse-1 { animation-delay: 0s; }
.pulse-2 { animation-delay: 1s; }

/* Discord Icon */
.discord-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: iconFloat 3s ease-in-out infinite 1.5s;
}

.discord-body {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 75%;
    height: 65%;
    background: currentColor;
    border-radius: 35%;
}

.discord-eye {
    position: absolute;
    top: 35%;
    width: 15%;
    height: 20%;
    background: #000;
    border-radius: 50%;
    mix-blend-mode: difference;
    animation: discordBlink 4s ease-in-out infinite;
}

.discord-eye.left { left: 25%; }
.discord-eye.right { right: 25%; }

.discord-smile {
    position: absolute;
    bottom: 25%;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 10%;
    border-bottom: 2px solid #000;
    border-radius: 0 0 50% 50%;
    mix-blend-mode: difference;
}

/* Location Icon */
.location-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: locationBounce 2s ease-in-out infinite;
}

.pin-body {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 60%;
    background: currentColor;
    border-radius: 50% 50% 50% 0;
    transform: translateX(-50%) rotate(-45deg);
}

.pin-dot {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20%;
    height: 20%;
    background: #000;
    border-radius: 50%;
    mix-blend-mode: difference;
}

.location-pulse {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border: 2px solid currentColor;
    border-radius: 50%;
    animation: pulsate 2s ease-out infinite;
}

/* Animations */
@keyframes iconFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
}

@keyframes codeFlicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

@keyframes xRotate {
    0%, 100% { transform: translate(-50%, -50%) rotate(45deg); }
    50% { transform: translate(-50%, -50%) rotate(50deg); }
}

@keyframes flapOpen {
    0%, 80%, 100% { border-bottom-width: calc(var(--icon-size) * 0.3); }
    90% { border-bottom-width: calc(var(--icon-size) * 0.35); }
}

@keyframes pulsate {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

@keyframes discordBlink {
    0%, 90%, 100% { height: 20%; }
    95% { height: 3%; }
}

@keyframes locationBounce {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
}

/* Rocket Icon */
.rocket-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: rocketFly 3s ease-in-out infinite;
}

.rocket-body {
    position: absolute;
    bottom: 25%;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 50%;
    background: currentColor;
    border-radius: 50% 50% 20% 20%;
}

.rocket-window {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    width: 25%;
    height: 20%;
    background: #000;
    border-radius: 50%;
    mix-blend-mode: difference;
}

.rocket-fin {
    position: absolute;
    bottom: 25%;
    width: 0;
    height: 0;
    border-bottom: calc(var(--icon-size) * 0.25) solid currentColor;
}

.rocket-fin.left {
    left: 15%;
    border-left: calc(var(--icon-size) * 0.15) solid transparent;
}

.rocket-fin.right {
    right: 15%;
    border-right: calc(var(--icon-size) * 0.15) solid transparent;
}

.rocket-flame {
    position: absolute;
    bottom: 5%;
    left: 50%;
    width: 15%;
    height: 20%;
    background: linear-gradient(to bottom, #ff6600, #ff3300);
    border-radius: 50% 50% 50% 50%;
    animation: flameFlicker 0.3s ease-in-out infinite;
}

.flame-1 { transform: translateX(-50%); animation-delay: 0s; }
.flame-2 { transform: translateX(-70%); animation-delay: 0.1s; }
.flame-3 { transform: translateX(-30%); animation-delay: 0.2s; }

@keyframes rocketFly {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(-5deg); }
}

@keyframes flameFlicker {
    0%, 100% { opacity: 1; height: 20%; }
    50% { opacity: 0.7; height: 15%; }
}

/* Trophy Icon */
.trophy-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: trophyShine 4s ease-in-out infinite;
}

.trophy-cup {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 50%;
    background: currentColor;
    border-radius: 0 0 40% 40%;
}

.trophy-cup::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: currentColor;
    border-radius: 20% 20% 0 0;
}

.trophy-base {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 15%;
    background: currentColor;
    border-radius: 4px;
}

.trophy-handle {
    position: absolute;
    top: 30%;
    width: 15%;
    height: 30%;
    border: 2px solid currentColor;
    border-radius: 50%;
}

.trophy-handle.left { left: 5%; border-right: none; }
.trophy-handle.right { right: 5%; border-left: none; }

.trophy-star {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.4em;
    color: #000;
    mix-blend-mode: difference;
    animation: starTwinkle 2s ease-in-out infinite;
}

@keyframes trophyShine {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.3); }
}

@keyframes starTwinkle {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.2); }
}

/* Blog Icon */
.blog-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: iconFloat 3s ease-in-out infinite;
}

.paper {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    height: 80%;
    background: transparent;
    border: 2px solid currentColor;
    border-radius: 4px;
}

.paper::before {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 20%;
    height: 20%;
    background: currentColor;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
}

.line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 50%;
    height: 2px;
    background: currentColor;
    opacity: 0.7;
}

.line-1 { top: 35%; }
.line-2 { top: 48%; }
.line-3 { top: 61%; width: 35%; }

.pen {
    position: absolute;
    bottom: 15%;
    right: 15%;
    width: 8%;
    height: 30%;
    background: currentColor;
    border-radius: 2px;
    transform: rotate(45deg);
    animation: penWrite 2s ease-in-out infinite;
}

@keyframes penWrite {
    0%, 100% { transform: rotate(45deg) translateY(0); }
    50% { transform: rotate(45deg) translateY(-3px); }
}

/* Mail Icon */
.mail-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: iconFloat 3s ease-in-out infinite 0.5s;
}

.envelope-box {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 75%;
    height: 50%;
    background: transparent;
    border: 2px solid currentColor;
    border-radius: 4px;
}

.envelope-top {
    position: absolute;
    bottom: 45%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: calc(var(--icon-size) * 0.375) solid transparent;
    border-right: calc(var(--icon-size) * 0.375) solid transparent;
    border-bottom: calc(var(--icon-size) * 0.25) solid currentColor;
}

.mail-shine {
    position: absolute;
    top: 40%;
    left: 20%;
    width: 60%;
    height: 30%;
    background: linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.3) 50%, transparent 60%);
    animation: mailShine 3s ease-in-out infinite;
}

@keyframes mailShine {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
}

/* Lightning Icon */
.lightning-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: lightningStrike 2s ease-in-out infinite;
}

.bolt {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: calc(var(--icon-size) * 0.2) solid transparent;
    border-right: calc(var(--icon-size) * 0.15) solid transparent;
    border-top: calc(var(--icon-size) * 0.35) solid currentColor;
}

.bolt::after {
    content: '';
    position: absolute;
    top: calc(var(--icon-size) * 0.2);
    left: calc(var(--icon-size) * -0.15);
    width: 0;
    height: 0;
    border-left: calc(var(--icon-size) * 0.15) solid transparent;
    border-right: calc(var(--icon-size) * 0.2) solid transparent;
    border-top: calc(var(--icon-size) * 0.4) solid currentColor;
}

.spark {
    position: absolute;
    font-size: 0.3em;
    animation: sparkTwinkle 1.5s ease-in-out infinite;
}

.spark-1 { top: 10%; left: 20%; animation-delay: 0s; }
.spark-2 { top: 30%; right: 15%; animation-delay: 0.5s; }
.spark-3 { bottom: 25%; left: 25%; animation-delay: 1s; }

@keyframes lightningStrike {
    0%, 90%, 100% { opacity: 1; }
    95% { opacity: 0.3; }
}

@keyframes sparkTwinkle {
    0%, 100% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.2); }
}

/* Search Icon */
.search-icon {
    position: relative;
    width: 100%;
    height: 100%;
    animation: iconFloat 3s ease-in-out infinite 1s;
}

.magnifier-circle {
    position: absolute;
    top: 15%;
    left: 25%;
    width: 50%;
    height: 50%;
    border: 2.5px solid currentColor;
    border-radius: 50%;
}

.magnifier-handle {
    position: absolute;
    bottom: 15%;
    right: 15%;
    width: 4px;
    height: 40%;
    background: currentColor;
    border-radius: 2px;
    transform: rotate(45deg);
}

.search-pulse {
    position: absolute;
    top: 15%;
    left: 25%;
    width: 50%;
    height: 50%;
    border: 2px solid currentColor;
    border-radius: 50%;
    animation: searchPulse 2s ease-out infinite;
}

@keyframes searchPulse {
    0% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.8); opacity: 0; }
}
</style>
