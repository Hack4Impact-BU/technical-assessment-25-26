export function formatTime(date, timeZone) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
}