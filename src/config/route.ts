import { Localization } from './localization/localization';

interface IRouteBase {
    name: string;
    sidebarVisible: boolean;
    breadcrumbVisible: boolean;
    icon?: string;
}

export interface IRoute extends IRouteBase {
    path: string; // href for app outside link
    // pageTitle?: string;
    pageTitleVisible: boolean;
    // permission: () => boolean;
    isMe?: (path: string) => boolean;
}

export interface IRouteParent extends IRouteBase {
    children: Array<IRoute | IRouteParent>;
    link?: string;
}

export type IAppRoute = Array<IRoute | IRouteParent>;

export type TBreadcrumbItem = IRouteParent | (IRoute & { itIsMe: boolean });
export type TBreadcrumb = Array<TBreadcrumbItem>;

export class AppRoute {
    static get routeData() {
        return {
            login: {
                url: () => '/login',
                path: '/login',
                title: Localization.login,
            },
        };
    }
}
