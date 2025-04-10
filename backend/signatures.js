import crypto from 'crypto';

export function signBrowserId(id) {
    const secret = process.env.SIGNING_SECRET;
    return crypto.createHmac('sha256', secret).update(id).digest('hex');
}

function isValidSignature(id, signature) {
    const expected = signBrowserId(id);
    return expected === signature;
}

export function validateBrowserIdentity(browserId, signature, res) {
    if (!isValidSignature(browserId, signature)) {
        const newId = crypto.randomUUID();
        const newSignature = signBrowserId(newId);
        res.status(403).json({
            message: 'Invalid signature',
            newBrowserId: newId,
            newSignature: newSignature
        });
        return false;
    }
    return true;
}