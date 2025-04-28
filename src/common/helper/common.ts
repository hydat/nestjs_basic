import { ICommonRequest } from '../interfaces/system';

export const extractTokenFromHeader = (request: ICommonRequest): string => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : '';
};
