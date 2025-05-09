import * as yup from 'yup';

export interface SignUpForm {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  about?: string;
  avatarUrl?: string;
}

export const signUpSchema = yup.object({
  username: yup
    .string()
    .trim() // strip spaces
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be within 30 characters'),

  email: yup.string().trim().email('Enter a valid email').required('Email is required'),

  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

  passwordConfirm: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  about: yup.string().trim().max(200, 'About must be within 200 characters').optional(),

  avatarUrl: yup.string().optional(),
});
