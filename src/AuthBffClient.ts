import axios, { AxiosInstance } from 'axios';
import { IUser, IBreeder } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

export interface PostUserRequestSuccess {
  ok: true;
  breeder: IBreeder;
  user: IUser;
}

export interface RequestSuccess {
  ok: true;
}

export interface TokenRequestSuccess extends RequestSuccess {
  token: string;
}

export default class AuthBffClient {
  private _axiosAuthBffInstance: AxiosInstance;

  constructor(authBffUrl: string) {
    this._axiosAuthBffInstance = axios.create({
      baseURL: authBffUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
      }
    });
  }

  @RequestErrorHandler()
  async recoverPassword(email: string) {
    const { data } = await this._axiosAuthBffInstance.post<RequestSuccess>('/v1/recover-password', { email });

    return data;
  }

  @RequestErrorHandler()
  async registerUser(user: IUser, breeder: IBreeder) {
    const { data } = await this._axiosAuthBffInstance.post<PostUserRequestSuccess>('/v1/users', { user, breeder });

    return data;
  }

  @RequestErrorHandler()
  async authUser(email: string, password: string) {
    const { data } = await this._axiosAuthBffInstance.post<TokenRequestSuccess>('/v1/auth', { email, password });

    return data;
  }

  @RequestErrorHandler()
  async refreshToken(token: string) {
    const { data } = await this._axiosAuthBffInstance.post<TokenRequestSuccess>('/v1/refresh-token', {}, {
      headers: {
        'X-Cig-Token': token
      }
    });

    return data;
  }

  @RequestErrorHandler()
  async editPassword(password: string, confirmPassword: string, token: string) {
    const { data } = await this._axiosAuthBffInstance.patch('/v1/users/password', { password, confirmPassword }, {
      headers: {
        'X-Cig-Token': token
      }
    });

    return data;
  }
}
