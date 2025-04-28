import * as bcrypt from 'bcryptjs';

export const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}
