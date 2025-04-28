import { IAuthResponse } from 'src/auth/interface/auth.interface';

export interface ICommonRequest extends Request {
  headers: Request['headers'] & {
    authorization: string;
  };
  user?: IAuthResponse;
  [key: string]: any;
}
