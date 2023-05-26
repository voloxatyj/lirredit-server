import * as argon2 from 'argon2';

export const hashingPassword = async (password: string) => {
  const hashed_password = await argon2.hash(password);
  return hashed_password;
};

export const verifyingPassword = async (passwordDB: string, comparingPassword: string) => {
  const isVerifyedPassword = await argon2.verify(passwordDB, comparingPassword);
  return !!isVerifyedPassword;
};
