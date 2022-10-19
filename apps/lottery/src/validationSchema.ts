import * as Yup from 'yup';

export const usernameSchema = Yup.string()
  .required('Username is required')
  .trim('The Username cannot include leading and trailing spaces')
  .strict(true)
  .matches(/^[A-Za-z_]*$/, 'Please enter a valid Username')
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must not exceed 20 characters');

export const passwordSchema = Yup.string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(20, 'Password must not exceed 20 characters')
  .matches(/^\S*$/, 'Password may not have white spaces')
  .matches(/(?=.*[a-z])/, 'Password must have atleast one small case letter')
  .matches(/(?=.*[A-Z])/, 'Password must have atleast one uppercase letter')
  .matches(/(?=.*\d)/, 'Password must have atleast one digit')
  .matches(
    /(?=.*[@$!%*#?&])/,
    'Password must have atleast one special character'
  );

export const confirmPasswordSchema = Yup.string()
  .required('Confirm Password is required')
  .oneOf([Yup.ref('password'), null], 'Confirm Password does not match');

export const stringRequired = (name: string) => {
  return Yup.string().required(`${name} is required`);
};

export const numberGeneralSchema = (name: string) => {
  return Yup.number()
    .typeError(`Please enter a valid ${name}`)
    .integer(`${name} can only be integer`)
    .positive(`${name} can't be negative`)
    .min(1, `Minimum ${name} can be 1`);
};

export const ticketNameSchema = Yup.string()
  .required('Ticket Name is required')
  .trim("Ticket can't include lead/trailing spaces")
  .strict(true)
  .matches(/^[A-Za-z0-9 ]*$/, 'Please enter a valid Ticket Name')
  .min(2, 'Ticket Name must be at least 2 characters')
  .max(30, 'Ticket Name must not exceed 30 characters');
