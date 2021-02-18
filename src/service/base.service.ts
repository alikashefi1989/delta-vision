import Axios, {
    AxiosInstance,
    AxiosRequestConfig,
    CancelTokenSource,
} from 'axios';
import { Setup } from '../config/setup';
import { IToken } from '../model/token.model';
import { Store2 } from '../redux/store';
// import { action_set_token } from '../redux/action/token';
// import { Utility } from '../asset/script/utility';
import { NETWORK_STATUS } from '../enum/network-status.enum';
import { action_set_network_status } from '../redux/action/netwok-status';
import { IUser } from '../model/user.model';

enum META_MESSAGE_TYPE {
    success = 1,
    error,
}
export interface IAPI_ResponseMeta {
    code: number;
    message: string;
    messageType: META_MESSAGE_TYPE;
}
export interface IAPI_ResponseList<T> {
    data: {
        data: {
            items: Array<T>;
            explain: {
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                };
                sorts: {
                    [key: string]: 1 | -1;
                };
                filters: {};
                search: string;
            };
        };
        meta: IAPI_ResponseMeta;
    };
}
export interface IAPI_Response<T> {
    data: {
        data: T;
        meta: IAPI_ResponseMeta;
    };
}

export abstract class BaseService {
    protected baseURL = Setup.endpoint;
    private static token: IToken | null | undefined;
    protected axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = Axios.create(this.axiosRequestConfig);
    }

    protected axiosRequestConfigDefault: AxiosRequestConfig = {
        baseURL: this.baseURL,
        headers: { 'Content-Type': 'application/json' },
    };
    private _axiosRequestConfig: AxiosRequestConfig = this
        .axiosRequestConfigDefault;

    set axiosRequestConfig(config: AxiosRequestConfig) {
        if (config.headers) {
            config.headers = {
                ...this._axiosRequestConfig.headers,
                ...config.headers,
            };
        }
        this._axiosRequestConfig = { ...this._axiosRequestConfig, ...config };
    }

    get axiosRequestConfig() {
        return this._axiosRequestConfig;
    }

    protected set_axiosRequestConfig_default() {
        this._axiosRequestConfig = this.axiosRequestConfigDefault;
    }

    get axiosTokenInstance(): AxiosInstance {
        let newAX_instance: AxiosInstance;

        let token = BaseService.token;
        if (!BaseService.token) {
            token = Store2.getState().token;
            if (token) BaseService.setToken(token);
        }
        if (token) {
            this.axiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + token,
                },
            };
            newAX_instance = Axios.create({
                ...this.axiosRequestConfig,
            });
        } else {
            newAX_instance = this.axiosInstance;
        }
        // this.set_401_interceptors(newAX_instance);

        return newAX_instance;
    }

    private static setToken(t: IToken) {
        BaseService.token = t;
    }

    static removeToken() {
        BaseService.token = undefined;
    }

    // private set_401_interceptors(ax_instance: AxiosInstance) {
    //     ax_instance.interceptors.response.use((response) => {
    //         return response;
    //     }, async (error) => {
    //         if (error.response?.status !== 401 || Store2.getState().authentication === null) {
    //             return Promise.reject(error);
    //         }

    //         const authObj = Utility.get_decode_auth(Store2.getState().authentication!);
    //         const data = {
    //             email: authObj.username,
    //             password: authObj.password
    //         }
    //         try {
    //             const deviceToken = ''; // TO_DO: fix me
    //             const token_res = await this.getTokenfromServer(data, deviceToken);
    //             Store2.dispatch(action_set_token(token_res.data.data.token));
    //             BaseService.setToken(token_res.data.data.token);
    //             const config = error.config;
    //             config.headers['authorization'] = `Bearer ${token_res.data}`; // Authorization
    //             return Axios.request(config);

    //         } catch (tError) {
    //             if (tError.response.data.msg === "invalid_username") {
    //                 tError.response.data['msg_ui'] = 'login_again';
    //             }
    //             return Promise.reject(tError);
    //         }
    //     });
    // }

    protected getTokenfromServer(
        data: { email: string; password: string },
        deviceToken: string
    ): Promise<IAPI_Response<{ user: IUser; token: IToken }>> {
        const instance = Axios.create({
            baseURL: this.baseURL,
            headers: { authorization: `Bearer ${deviceToken}` },
        });
        return instance.post('/user/login', data);
    }

    static msgRequestCanceled = 'request-canceled';
    static cancelTokenSource(): CancelTokenSource {
        return Axios.CancelToken.source();
    }

    static isAppOffline(): boolean {
        BaseService.check_network_status();
        return BaseService._isAppOffline();
    }

    private static _isAppOffline(): boolean {
        if (navigator && !navigator.onLine) {
            return true;
        }
        return false;
    }

    static check_network_status() {
        if (Store2.getState().network_status === NETWORK_STATUS.ONLINE) {
            if (BaseService._isAppOffline()) {
                Store2.dispatch(
                    action_set_network_status(NETWORK_STATUS.OFFLINE)
                );
            }
        } else if (
            Store2.getState().network_status === NETWORK_STATUS.OFFLINE
        ) {
            if (!BaseService._isAppOffline()) {
                Store2.dispatch(
                    action_set_network_status(NETWORK_STATUS.ONLINE)
                );
            }
        }
    }
}
