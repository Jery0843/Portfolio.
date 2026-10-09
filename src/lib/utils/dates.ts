// Portfolio dates include short/full month names, years, and date ranges.
export function portfolioDate(value: string): number {
    if (/present|ongoing/i.test(value)) return Number.MAX_SAFE_INTEGER;
    const last = value.split(/\s*[–—]\s*|\s+-\s+/).slice(-1)[0] ?? value;
    const year = last.match(/\d{4}/)?.[0];
    if (!year) return 0;
    const month = last.match(/[a-z]+/i)?.[0].toLowerCase().slice(0, 3);
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIndex = month ? Math.max(0, months.indexOf(month)) : 11;
    return Number(year) * 12 + monthIndex;
}
