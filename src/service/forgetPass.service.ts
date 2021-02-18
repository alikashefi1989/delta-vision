import { BaseService, IAPI_Response } from './base.service';


export class ForgetPassService extends BaseService {
    static generalId_profile = 'user-profile-id';


    async forgotPassword(data: { email: string }): Promise<IAPI_Response<{}>> {
        return this.axiosInstance.post('/user/getResetPasswordLink', data);
    }

    resetPassword(data: {
        email: string;
        code: string;
        new_password: string;
    }): Promise<string> {

        return this.axiosInstance.post('/user/password/forgot/confirm', data);
    }

}
