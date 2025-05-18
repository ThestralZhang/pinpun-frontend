import * as yup from 'yup';

export interface SignUpForm {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  about?: string;
  avatar: {
    file: File | null;
    url: string | undefined;
  };
}

// 5 MB max file size
const MAX_SIZE = 5 * 1024 * 1024;
// allowed MIME types
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/gif'];

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

  avatar: yup.object({
    file: yup
      .mixed<File>()
      .nullable()
      .test('fileSize', 'File must be within 5MB', (file?: File | null) => {
        return !file || file.size <= MAX_SIZE;
      })
      .test('fileType', 'Unsupported file format', (file?: File | null) => {
        return !file || SUPPORTED_FORMATS.includes(file.type);
      }),
    url: yup.string().notRequired(),
  }),
});
