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
