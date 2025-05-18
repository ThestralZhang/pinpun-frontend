import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button, ButtonToolbar } from 'rsuite';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { login } from '@/api/auth.ts';
import { useAuthStore } from '@/stores/useAuthStore.ts';

// Define the shape of the login form data
interface LoginFormInputs {
  email: string;
  password: string;
}

// Yup validation schema
const schema = yup.object({
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // Initialize react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: { email: searchParams.get('email') ?? '', password: '' },
    mode: 'onBlur',
  });

  // Submit handler
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const user = await login(data);
      setUser(user);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const onSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="px-10 py-8 rounded-3xl shadow-md bg-white">
        <div className="text-center mb-10 text-[50px] text-blue-400 italic font-extrabold">
          PinPun
        </div>
        <Form layout="vertical" onSubmit={(_status, event) => handleSubmit(onSubmit)(event)}>
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
            <ButtonToolbar>
              <Button appearance="primary" type="submit" loading={isSubmitting}>
                Log in
              </Button>
              <Button disabled={isSubmitting} onClick={onSignUp}>
                Sign up
              </Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}
