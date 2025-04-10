export function formatTime(date, timeZone) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
}


export function getBrowserId() { //Old way not secure
    let id = localStorage.getItem('browserId');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('browserId', id);
    }
    return id;
}


export async function getSecureBrowserIdentity() {
    const stored = localStorage.getItem('browserIdentity');
    if (stored) return JSON.parse(stored);

    const res = await fetch('http://localhost:3000/api/browserid');
    const identity = await res.json();
    localStorage.setItem('browserIdentity', JSON.stringify(identity));
    return identity;
}