export enum APP_COLOR_NAME {
    DEFAULT = 'default',
    PRIMARY = 'primary',
    SUCCESS = "success",
    INFO = 'info',
    WARNING = 'warning',
    DANGER = "danger",
    SYSTEM = 'system',
    DARK = "dark",
    ORANGE = "orange",
}

type TAppColors = {
    [key in APP_COLOR_NAME]: {
        color: string;
        inverse: string;
    };
}

const appColors: TAppColors = {
    default: {
        'color': '#a2a3a5',
        'inverse': '#333333',
    },
    primary: {
        'color': '#337ab7', // '#3439B7', // #337ab7, '#fe3366',
        'inverse': '#fff',
    },
    success: {
        'color': '#40b292',
        'inverse': '#ffffff',
    },
    info: {
        'color': '#338cf0', // #2dc3e8
        'inverse': '#e7f5fa',
    },
    warning: {
        'color': '#ffb729',
        'inverse': '#ffffff',
    },
    danger: {
        'color': '#b44848',
        'inverse': '#fef7f6',
    },
    system: {
        'color': '#01aaa4',
        'inverse': '#ffffff',
    },
    dark: {
        'color': '#313949', // '#112442',
        'inverse': '#ffffff',
    },
    orange: {
        'color': '#e96454',
        'inverse': '#ffffff',
    }
};

export function appColor(name: APP_COLOR_NAME, type: 'color' | 'inverse' = 'color'): string {
    return appColors[name][type];
}