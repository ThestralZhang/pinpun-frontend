import { Message, toaster } from 'rsuite';

export function pushSuccessMessage(content: string) {
  toaster.push(
    <Message showIcon type="success" header="Operation Succeeds">
      {content}
    </Message>,
    { placement: 'bottomEnd', duration: 2000 },
  );
}

export function pushErrorMessage(content: string) {
  toaster.push(
    <Message showIcon type="error" header="Operation Fails">
      {content}
    </Message>,
    { placement: 'bottomEnd', duration: 2000 },
  );
}

export function timeAgo(time: Date): string {
  const now = Date.now();
  const diff = now - time.getTime();

  const sec = 1_000;
  const min = sec * 60;
  const hour = min * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diff < min) {
    return 'seconds ago';
  }
  if (diff < hour) {
    const m = Math.floor(diff / min);
    return `${m} minute${m !== 1 ? 's' : ''} ago`;
  }
  if (diff < day) {
    const h = Math.floor(diff / hour);
    return `${h} hour${h !== 1 ? 's' : ''} ago`;
  }
  if (diff < week) {
    const d = Math.floor(diff / day);
    if (d === 1) return 'yesterday';
    return `${d} days ago`;
  }
  if (diff < month) {
    const w = Math.floor(diff / week);
    if (w === 1) return 'last week';
    return `${w} weeks ago`;
  }
  if (diff < year) {
    const m = Math.floor(diff / month);
    if (m === 1) return 'last month';
    return `${m} months ago`;
  }
  const y = Math.floor(diff / year);
  if (y === 1) return 'last year';
  return `${y} years ago`;
}

export function getDateTimeString(time: Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return formatter.format(time);
}
