export const sleep = async(ms:number = 1000)=>{
    return new Promise((resolve)=>{
        setTimeout(()=>resolve(true), ms);
    })
}
/**
 * Fast way to pas start a string or number, used typically for dates
 * @param n The number to pad start
 * @param count the pad start count (default 2)
 * @returns string
 */
export const p = (n: string|number, count: number = 2) => (typeof n === 'string' ? n : n.toString() ).padStart(count, '0');


export const getOS = (): string|undefined => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.includes("windows")) return "windows";
    if (userAgent.includes("macintosh") || userAgent.includes("mac os")) return "macos";
    if (userAgent.includes("linux")) return "linux";
    if (userAgent.includes("android")) return "android";
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "ios";
}

// export const sshKeyRegex = /^ssh-rsa AAAA[0-9A-Za-z+\/]+[=]{0,3} ([^@]+@[^@]+)#$/
export const sshKeyRegex = /^(ssh-(rsa|dss|ed25519|ecdsa)|ecdsa-sha2-nistp(256|384|521))\s+([A-Za-z0-9+/=]{20,})\s*(.*)(\s)*?$/;
