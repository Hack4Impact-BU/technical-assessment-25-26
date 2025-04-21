export function getBrowserId() { //Old way not secure
    let id = localStorage.getItem('browserId');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('browserId', id);
    }
    return id;
}

export const API_URL = import.meta.env.VITE_BACKEND

export async function getSecureBrowserIdentity() {
    const stored = localStorage.getItem('browserIdentity');
    if (stored) {
        const { browserId, signature } = JSON.parse(stored);

        const test = await fetch(`${API_URL}/api/history`, {
            method: "GET",
            headers: {
                "x-browser-id": browserId,
                "x-browser-signature": signature
            }
        });

        if (test.status === 403) {
            const result = await test.json();
            if (result.newBrowserId && result.newSignature) {
                const newIdentity = {
                    browserId: result.newBrowserId,
                    signature: result.newSignature
                };
                localStorage.setItem("browserIdentity", JSON.stringify(newIdentity));
                return newIdentity;
            }
        }

        return { browserId, signature };
    }

    const res = await fetch(`${API_URL}/api/browserid`);
    const identity = await res.json();
    localStorage.setItem('browserIdentity', JSON.stringify(identity));
    return identity;
}