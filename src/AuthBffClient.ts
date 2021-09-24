import axios, { AxiosInstance } from 'axios';
import { IUser, IBreeder, ErrorRequest } from '@cig-platform/types';

export interface PostUserRequestSuccess {
  ok: true;
  breeder: IBreeder;
  user: IUser;
}

export interface AuthUserRequestSuccess {
  ok: true;
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

  async registerUser(user: IUser, breeder: IBreeder) {
    try {
      const { data } = await this._axiosAuthBffInstance.post<PostUserRequestSuccess>('/v1/users', { user, breeder });

      return data;
    } catch (error) {
      if (!axios.isAxiosError(error)) return null;

      const bodyData = error.response?.data as ErrorRequest;

      return bodyData;
    }
  }

  async authUser(email: string, password: string) {
    try {
      const { data } = await this._axiosAuthBffInstance.post<AuthUserRequestSuccess>('/v1/auth', { email, password });

      return data;
    } catch (error) {
      if (!axios.isAxiosError(error)) return null;

      const bodyData = error.response?.data as ErrorRequest;

      return bodyData;
    }
  }
}
