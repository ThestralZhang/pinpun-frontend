import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { Input, type InputProps } from 'rsuite';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export default forwardRef<any, InputProps & TextareaHTMLAttributes<any>>(
  function TextareaControl(props, ref) {
    return <Input {...props} ref={ref} as="textarea" />;
  },
);
