import { CreateUserInput } from '../users/dto/create-user.input';

export const validateRegister = ({ email, password, username }: CreateUserInput) => {
  if (username.length === 0) {
    return [
      {
        field: 'username',
        message: 'username field is required',
      },
    ];
  }

  if (username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'username length must be greater than 2',
      },
    ];
  }

  if (username.length >= 30) {
    return [
      {
        field: 'username',
        message: "username length can't be greater than 30",
      },
    ];
  }

  let valide = validateEmail({ email });

  valide = validatePassword({ password });

  return valide;
};

export const validatePassword = ({ password }: Partial<CreateUserInput>) => {
  if (password.length === 0) {
    return [
      {
        field: 'password',
        message: 'password field is required',
      },
    ];
  }

  const isPassword = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');

  if (!isPassword.test(password)) {
    return [
      {
        field: 'password',
        message:
          'Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    ];
  }

  return null;
};

export const validateEmail = ({ email }: Partial<CreateUserInput>) => {
  if (email.length === 0) {
    return [
      {
        field: 'email',
        message: 'email field is required',
      },
    ];
  }

  const isEmail = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}.[a-z]{2,3}');

  if (!isEmail.test(email)) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  return null;
};
