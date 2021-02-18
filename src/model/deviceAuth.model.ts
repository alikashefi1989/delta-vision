export interface IDeviceAuth_DELETE_ME {
    device: {
        name: string;
        capacity: string;
        uid: string;
        platform: string;
    };
    os: {
        version: string;
        type: string;
    };
}

export interface IDeviceAuth {
    // isActive: boolean;
    build?: number;
    identifier: string;
    osType?: string;
    osVersion?: string;
    title?: string;
    name?: string;
    capacity?: string;
    notificationToken?: string;
}
