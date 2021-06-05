export interface IInternationalization {
    rtl: boolean;
    language: string;
    flag: string;
}

interface IInternationalization_en extends IInternationalization {
    rtl: false;
    language: 'english';
    flag: 'en';
}
interface IInternationalization_fa extends IInternationalization {
    rtl: true;
    language: 'فارسی';
    flag: 'fa';
}

export type TInternationalization =
    | IInternationalization_en
    | IInternationalization_fa;

interface ISetup {
    endpoint: string;
    documentTitle: string;
    notify: {
        timeout: {
            error: number;
            success: number;
            warning: number;
            info: number;
            default: number;
        };
    };
    recordDefaultLoadLength: number;
    internationalization: TInternationalization;
    mapConfig: {
        zoom: number;
        defaultLocation: [number, number];
    };
}

export const Setup: ISetup = {
    endpoint: process.env.REACT_APP_ENDPOINT as string,
    documentTitle: 'DELTA AVARAN VISION',
    notify: {
        timeout: {
            error: 4000,
            success: 2500,
            warning: 3000,
            info: 3000,
            default: 3000,
        },
    },
    recordDefaultLoadLength: 10,
    internationalization: {
        rtl: false,
        language: 'english',
        flag: 'en',
    },
    mapConfig: {
        zoom: 18,
        defaultLocation: [35.783378, 51.355672],
    },
};
