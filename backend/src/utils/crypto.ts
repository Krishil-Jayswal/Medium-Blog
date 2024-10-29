export async function hashPassword(password: string, providedSalt?: Uint8Array): Promise<string> {
    const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );

    const exportedKey = (await crypto.subtle.exportKey('raw', key)) as ArrayBuffer;

    const hashBuffer = new Uint8Array(exportedKey);
    const hashArray = Array.from(hashBuffer);
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const saltArray = Array.from(salt);
    const saltHex = saltArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(inputPassword: string, storedHashString: string): Promise<boolean> {
    const [saltHex, originalHash] = storedHashString.split(':');

    const matchResult = saltHex.match(/.{1,2}/g) || [];
    const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)));
    
    const inputHashString = await hashPassword(inputPassword, salt);
    const [, inputHash] = inputHashString.split(':');

    return originalHash === inputHash;
}
