import axios, { AxiosInstance } from 'axios';
import { IUser, IPoultry, AppRequest, ApiError } from '@cig-platform/core';

export interface PostUserRequestSuccess extends AppRequest {
  poultry: IPoultry;
  user: IUser;
}

export interface AuthUserRequestSuccess extends AppRequest {
  token: string;
}

export interface AppRequestError extends AppRequest {
  error: ApiError
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

  async registerUser(user: IUser, poultry: IPoultry) {
    try {
      const { data } = await this._axiosAuthBffInstance.post<PostUserRequestSuccess>('/v1/users', { user, poultry });

      return data;
    } catch (error) {
      if (!axios.isAxiosError(error)) return null;

      const bodyData = error.response?.data as AppRequestError;

      return bodyData;
    }
  }

  async authUser(email: string, password: string) {
    try {
      const { data } = await this._axiosAuthBffInstance.post<AuthUserRequestSuccess>('/v1/auth', { email, password });

      return data;
    } catch (error) {
      if (!axios.isAxiosError(error)) return null;

      const bodyData = error.response?.data as AppRequestError;

      return bodyData;
    }
  }
}
