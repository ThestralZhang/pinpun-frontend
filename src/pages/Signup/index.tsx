import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Button, Message, useToaster } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { signup } from '@/api/auth.ts';
import { type SignUpForm, signUpSchema } from '@/pages/Signup/validation.ts';
import type { ObjectSchema } from 'yup';
import TextAreaControl from '@/components/TextAreaControl.tsx';

export default function Signup() {
  const navigate = useNavigate();

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: yupResolver(signUpSchema as ObjectSchema<SignUpForm>),
    mode: 'onBlur',
    defaultValues: { username: '', email: '', about: '', password: '', passwordConfirm: '' },
  });

  const successMessage = (
    <Message showIcon type="success" closable>
      Successfully signed up!
    </Message>
  );
  const toast = useToaster();

  const onSubmit = async (data: SignUpForm) => {
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const { passwordConfirm, ...payload } = data;
    await signup(payload);
    toast.push(successMessage, { placement: 'bottomEnd', duration: 2000 });
    navigate(`/login?email=${encodeURIComponent(payload.email)}`);
  };

  const onBack = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Form layout="vertical" onSubmit={(_status, event) => handleSubmit(onSubmit)(event)}>
        <Form.Group>
          <Form.ControlLabel>Username</Form.ControlLabel>
          <Controller
            name="username"
            control={control}
            render={({ field }) => <Form.Control {...field} />}
          />
          {errors.username && (
            <Form.HelpText style={{ color: 'red' }}>{errors.username.message}</Form.HelpText>
          )}
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Email</Form.ControlLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Form.Control {...field} />}
          />
          {errors.email && (
            <Form.HelpText style={{ color: 'red' }}>{errors.email.message}</Form.HelpText>
          )}
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Password</Form.ControlLabel>
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Form.Control {...field} type="password" />}
          />
          {errors.password && (
            <Form.HelpText style={{ color: 'red' }}>{errors.password.message}</Form.HelpText>
          )}
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>Confirm Password</Form.ControlLabel>
          <Controller
            name="passwordConfirm"
            control={control}
            render={({ field }) => <Form.Control {...field} type="password" />}
          />
          {errors.passwordConfirm && (
            <Form.HelpText style={{ color: 'red' }}>{errors.passwordConfirm.message}</Form.HelpText>
          )}
        </Form.Group>

        <Form.Group>
          <Form.ControlLabel>About</Form.ControlLabel>
          <Controller
            name="about"
            control={control}
            render={({ field }) => <Form.Control {...field} accepter={TextAreaControl} rows={3} />}
          />
          {errors.about && (
            <Form.HelpText style={{ color: 'red' }}>{errors.about.message}</Form.HelpText>
          )}
        </Form.Group>

        <Form.Group>
          <Button appearance="primary" type="submit" loading={isSubmitting}>
            Confirm
          </Button>
          <Button disabled={isSubmitting} onClick={onBack}>
            Back
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
