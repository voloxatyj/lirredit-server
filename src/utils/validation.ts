import { CreateUserInput } from '../users/dto/create-user.input';

export const validateRegister = ({ email, password, username }: CreateUserInput) => {
  const isEmail = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}.[a-z]{2,3}');
  if (!isEmail.test(email)) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  if (username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'length must be greater than 2',
      },
    ];
  }

  if (username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'cannot include an @',
      },
    ];
  }

  const valide_password = validatePassword({ password });

  return valide_password;
};

export const validatePassword = ({ password }: Partial<CreateUserInput>) => {
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
