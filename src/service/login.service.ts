import { IUser, TUserUpdate } from '../model/user.model';
import { BaseService, IAPI_Response } from './base.service';
import { IToken } from '../model/token.model';
import { AxiosResponse } from 'axios';
import { IDeviceAuth } from '../model/deviceAuth.model';

export class LoginService extends BaseService {

    static generalId_profile = 'user-profile-id';

    getToken(data: { email: string, password: string }, token: string): Promise<IAPI_Response<{ user: IUser; token: IToken }>> {
        return this.getTokenfromServer(data, token)
    }

    profile(userId: IUser['id']): Promise<IAPI_Response<IUser>> {
        return this.axiosTokenInstance.get(`/user/${userId}`);
    }

    profileUpdate(data: TUserUpdate, userId: IUser['id']): Promise<IAPI_Response<IUser>> {
        return this.axiosTokenInstance.put(`/user/edit/${userId}`, data);
    }

    profile_check(): Promise<AxiosResponse<{}>> {
        return this.axiosTokenInstance.head('/users/profile');
    }

    async forgotPassword(data: { email: string }): Promise<IAPI_Response<{ email: string, tmp_code: string }>> {
        return this.axiosInstance.post('/user/password/forgot', data);
    }

    resetPassword(data: {
        email: string;
        code: string;
        new_password: string;
    }): Promise<string> {

        return this.axiosInstance.post('/user/password/forgot/confirm', data);
    }

    deviceAuth(data: IDeviceAuth): Promise<IAPI_Response<{ token: string; }>> {
        return this.axiosInstance.post('/device/auth', data);
    }

}
