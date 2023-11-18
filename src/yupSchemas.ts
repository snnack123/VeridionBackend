import * as Yup from 'yup';

interface ILoginReqDto {
  email: string;
  password: string;
}

interface IRegisterReqDto extends ILoginReqDto {
  name: string;
}

export const loginSchema: Yup.ObjectSchema<ILoginReqDto> = Yup.object({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

export const registerSchema: Yup.ObjectSchema<IRegisterReqDto> = Yup.object().shape({
  email: Yup.string().email("Email must be valid").required("A valid email is required"),
  name: Yup.string().required("Name is required").min(6, "Name must be at least 6 characters"),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});