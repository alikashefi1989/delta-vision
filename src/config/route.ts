import { Localization } from './localization/localization';

export interface HeaderRoute {
    title: string;
    isMain: boolean;
    hasPath: boolean;
    path?: string;
    hasChildren: boolean;
    children?: Array<HeaderRoute>;
}

export class AppRoute {
    static get routeData() {
        return {
            home: {
                url: () => '/home',
                path: '/home',
                title: Localization.home,
            },
            cellophane: {
                url: () => '/product/packing/cellophane',
                path: '/product/packing/cellophane',
                title: Localization.cellophane,
            },
            bag: {
                url: () => '/product/packing/bag',
                path: '/product/packing/bag',
                title: Localization.bag,
            },
            shrink: {
                url: () => '/product/packing/shrink',
                path: '/product/packing/shrink',
                title: Localization.shrink,
            },
            seat_cover: {
                url: () => '/product/spare_car_for_cars/seat_cover',
                path: '/product/spare_car_for_cars/seat_cover',
                title: Localization.seat_cover,
            },
            feethold: {
                url: () => '/product/spare_car_for_cars/feethold',
                path: '/product/spare_car_for_cars/feethold',
                title: Localization.feethold,
            },
            steering_wheel_cover: {
                url: () => '/product/spare_car_for_cars/steering_wheel_cover',
                path: '/product/spare_car_for_cars/steering_wheel_cover',
                title: Localization.steering_wheel_cover,
            },
            painting_promask: {
                url: () => '/product/spare_car_for_cars/painting_promask',
                path: '/product/spare_car_for_cars/painting_promask',
                title: Localization.painting_promask,
            },
            fender_cover: {
                url: () => '/product/spare_car_for_cars/fender_cover',
                path: '/product/spare_car_for_cars/fender_cover',
                title: Localization.fender_cover,
            },
            company: {
                url: () => '/about_us/company',
                path: '/about_us/company',
                title: Localization.company,
            },
            customers: {
                url: () => '/about_us/customers',
                path: '/about_us/customers',
                title: Localization.customers,
            },
            contact: {
                url: () => '/contact',
                path: '/contact',
                title: Localization.contact,
            },
            redirect: {
                url: () => '/',
                path: '/',
                title: Localization.home,
            },
        };
    }
}

export const HeaderRoute: Array<HeaderRoute> = [
    {
        title: Localization.home,
        isMain: true,
        hasPath: true,
        hasChildren: false,
        path: AppRoute.routeData.home.path,
    },
    {
        title: Localization.products,
        isMain: true,
        hasPath: false,
        hasChildren: true,
        children: [
            {
                title: Localization.packing,
                isMain: false,
                hasPath: false,
                hasChildren: true,
                children: [
                    {
                        title: Localization.cellophane,
                        isMain: false,
                        hasPath: true,
                        path: AppRoute.routeData.cellophane.path,
                        hasChildren: false,
                    },
                    {
                        title: Localization.bag,
                        isMain: false,
                        hasPath: true,
                        path: AppRoute.routeData.bag.path,
                        hasChildren: false,
                    },
                    {
                        title: Localization.shrink,
                        isMain: false,
                        hasPath: true,
                        path: AppRoute.routeData.shrink.path,
                        hasChildren: false,
                    },
                ],
            },
            {
                title: Localization.spare_car_for_cars,
                isMain: false,
                hasPath: false,
                hasChildren: true,
                children: [
                    {
                        title: Localization.seat_cover,
                        isMain: false,
                        hasPath: true,
                        path: AppRoute.routeData.seat_cover.path,
                        hasChildren: false,
                    },
                    {
                        title: Localization.feethold,
                        isMain: false,
                        hasPath: true,
                        path: AppRoute.routeData.feethold.path,
                        hasChildren: false,
                    },
                    {
                        title: Localization.steering_wheel_cover,
                        isMain: false,
                        hasPath: true,
                        path: AppRoute.routeData.steering_wheel_cover.path,
                        hasChildren: false,
                    },
                    {
                        title: Localization.painting_promask,
                        isMain: false,
                        hasPath: true,
                        path: AppRoute.routeData.painting_promask.path,
                        hasChildren: false,
                    },
                    {
                        title: Localization.fender_cover,
                        isMain: false,
                        hasPath: true,
                        path: AppRoute.routeData.fender_cover.path,
                        hasChildren: false,
                    },
                ],
            },
        ],
    },
    {
        title: Localization.contact,
        isMain: true,
        hasPath: true,
        path: AppRoute.routeData.contact.path,
        hasChildren: false,
    },
    {
        title: Localization.about_us,
        isMain: true,
        hasPath: false,
        hasChildren: true,
        children: [
            {
                title: Localization.company,
                isMain: false,
                hasPath: true,
                path: AppRoute.routeData.company.path,
                hasChildren: false,
            },
            {
                title: Localization.customers,
                isMain: false,
                hasPath: true,
                path: AppRoute.routeData.customers.path,
                hasChildren: false,
            },
        ],
    },
];
