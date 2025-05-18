import { Button, ButtonToolbar, Divider, Form, HStack, Stack } from 'rsuite';
import { Controller, useForm } from 'react-hook-form';
import TextAreaControl from '@/components/TextAreaControl.tsx';
import { type SignUpForm, signUpSchema } from '@/pages/Signup/validation.ts';
import { signup, updateInfo } from '@/api/auth.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client.tsx';
import AvatarUploader from '@/components/AvatarUploader.tsx';

interface UserInfoFormProps {
  mode?: 'new' | 'edit';
}

export default function UserInfoForm({ mode = 'new' }: UserInfoFormProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const initRef = useRef(false);
  useEffect(() => {
    return () => {
      initRef.current = false;
    };
  }, []);
  const [originalFormData, setOriginalFormData] = useState<SignUpForm | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpForm>({
    resolver: yupResolver(signUpSchema as ObjectSchema<SignUpForm>),
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      about: '',
      password: '',
      passwordConfirm: '',
      avatar: { file: null, url: undefined },
    },
  });

  const { isLoading } = useQuery({
    queryKey: ['user', user?.userId],
    queryFn: async () =>
      api.get(`/users/${user?.userId}`).then((rsp) => {
        initRef.current = true;
        const formData = {
          username: rsp.data.name,
          email: rsp.data.email,
          password: '',
          passwordConfirm: '',
          about: rsp.data.about || '',
          avatar: { file: null, url: rsp.data.avatarUrl },
        };
        setOriginalFormData(formData);
        reset(formData);
        return rsp.data;
      }),
    enabled: !initRef.current && !!user?.userId && mode === 'edit',
  });

  const onSubmit = async (data: SignUpForm) => {
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const { passwordConfirm, avatar, ...payload } = data;
    if (mode === 'new') {
      await signup({ ...payload, avatarUrl: avatar.url });
      navigate(`/login?email=${encodeURIComponent(payload.email)}`);
    } else if (mode === 'edit') {
      await updateInfo({ ...payload, avatarUrl: avatar.url });
      setOriginalFormData(data);
    }
  };

  const onCancel = () => {
    if (mode === 'new') {
      navigate('/login');
    } else if (mode === 'edit') {
      reset(originalFormData as SignUpForm);
    }
  };

  return (
    <Form
      layout="vertical"
      disabled={isLoading}
      onSubmit={(_status, event) => handleSubmit(onSubmit)(event)}
    >
      <HStack justifyContent="space-between" spacing={20} className="mb-8">
        <Stack.Item>
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
              <Form.HelpText style={{ color: 'red' }}>
                {errors.passwordConfirm.message}
              </Form.HelpText>
            )}
          </Form.Group>
        </Stack.Item>
        <Divider vertical className="h-[300px]! shrink-0 grow-0" />
        <Stack.Item>
          <Form.Group>
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <AvatarUploader value={field.value} onChange={field.onChange} />
              )}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>About</Form.ControlLabel>
            <Controller
              name="about"
              control={control}
              render={({ field }) => (
                <Form.Control {...field} accepter={TextAreaControl} rows={3} />
              )}
            />
            {errors.about && (
              <Form.HelpText style={{ color: 'red' }}>{errors.about.message}</Form.HelpText>
            )}
          </Form.Group>
        </Stack.Item>
      </HStack>

      <Form.Group>
        <ButtonToolbar>
          <Button appearance="primary" type="submit" loading={isSubmitting}>
            Confirm
          </Button>
          <Button disabled={isSubmitting} onClick={onCancel}>
            Cancel
          </Button>
        </ButtonToolbar>
      </Form.Group>
    </Form>
  );
}
