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
    private static readonly routes: IAppRoute = [
        // dashboard
        {
            path: '/dashboard',
            name: 'dashboard',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-dashboard',
            isMe: (path) => {
                if (path.includes('dashboard')) return true;
                return false;
            },
        },
        // profile
        {
            path: '/profile',
            name: 'profile',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-address-card-o',
        },
        // User Entity
        {
            path: '/user/manage',
            name: 'customer', // used customer instead user
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-user',
        },
        {
            name: 'customer', // used customer instead user
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-user',
            link: '/user/manage',
            children: [
                {
                    path: '/user/create',
                    name: 'user_create', // TODO: User change to customer
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/user/update',
                    name: 'user_update', // TODO: User change to customer
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/user/update/');
                    },
                },
                {
                    path: '/user/copy',
                    name: 'user_copy', // TODO: User change to customer
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/user/copy/');
                    },
                },
                {
                    path: '/user/view',
                    name: 'user_view', // TODO: User change to customer
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/user/view/');
                    },
                },
            ],
        },
        // Store Entity
        {
            path: '/store/manage',
            name: 'vendor', // used vendor instead store
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-bank',
        },
        {
            name: 'vendor', // used vendor instead store
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-bank',
            link: '/store/manage',
            children: [
                {
                    path: '/store/create',
                    name: 'store_create', // TODO: Store change to vendor
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/store/update',
                    name: 'store_update', // TODO: Store change to vendor
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/store/update/');
                    },
                },
                {
                    path: '/store/copy',
                    name: 'store_copy', // TODO: Store change to vendor
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/store/copy/');
                    },
                },
                {
                    path: '/store/view',
                    name: 'store_view', // TODO: Store change to vendor
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/store/view/');
                    },
                },
            ],
        },
        // Category Entity
        {
            path: '/category/manage',
            name: 'category_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-sitemap',
        },
        {
            name: 'category_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-sitemap',
            link: '/category/manage',
            children: [
                {
                    path: '/category/create',
                    name: 'category_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/category/update',
                    name: 'category_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/category/update/');
                    },
                },
                {
                    path: '/category/copy',
                    name: 'category_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/category/copy/');
                    },
                },
                {
                    path: '/category/view',
                    name: 'category_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/category/view/');
                    },
                },
            ],
        },
        // Product Entity
        {
            path: '/product/manage',
            name: 'product_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-cube',
        },
        {
            name: 'product_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-cube',
            link: '/product/manage',
            children: [
                {
                    path: '/product/create',
                    name: 'product_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/product/update',
                    name: 'product_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/product/update/');
                    },
                },
                {
                    path: '/product/copy',
                    name: 'product_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/product/copy/');
                    },
                },
                {
                    path: '/product/view',
                    name: 'product_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/product/view/');
                    },
                },
            ],
        },
        // Language Entity
        {
            path: '/language/manage',
            name: 'language_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-language',
        },
        {
            name: 'language_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-language',
            link: '/language/manage',
            children: [
                {
                    path: '/language/create',
                    name: 'language_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/language/update',
                    name: 'language_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/language/update/');
                    },
                },
                {
                    path: '/language/copy',
                    name: 'language_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/language/copy/');
                    },
                },
                {
                    path: '/language/view',
                    name: 'language_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/language/view/');
                    },
                },
            ],
        },
        // Brand Entity
        {
            path: '/brand/manage',
            name: 'brand_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-flag-checkered',
        },
        {
            name: 'brand_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-flag-checkered',
            link: '/brand/manage',
            children: [
                {
                    path: '/brand/create',
                    name: 'brand_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/brand/update',
                    name: 'brand_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/brand/update/');
                    },
                },
                {
                    path: '/brand/copy',
                    name: 'brand_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/brand/copy/');
                    },
                },
                {
                    path: '/brand/view',
                    name: 'brand_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/brand/view/');
                    },
                },
            ],
        },
        // Country Entity
        {
            path: '/country/manage',
            name: 'country_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-globe',
        },
        {
            name: 'country_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-globe',
            link: '/country/manage',
            children: [
                {
                    path: '/country/create',
                    name: 'country_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/country/update',
                    name: 'country_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/country/update/');
                    },
                },
                {
                    path: '/country/copy',
                    name: 'country_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/country/copy/');
                    },
                },
                {
                    path: '/country/view',
                    name: 'country_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/country/view/');
                    },
                },
            ],
        },
        // Area Entity
        {
            path: '/area/manage',
            name: 'area_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-map-marker',
        },
        {
            name: 'area_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-map-marker',
            link: '/area/manage',
            children: [
                {
                    path: '/area/create',
                    name: 'area_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/area/update',
                    name: 'area_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/area/update/');
                    },
                },
                {
                    path: '/area/copy',
                    name: 'area_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/area/copy/');
                    },
                },
                {
                    path: '/area/view',
                    name: 'area_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/area/view/');
                    },
                },
            ],
        },
        // Warehouse Entity
        {
            path: '/warehouse/manage',
            name: 'warehouse_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-industry',
        },
        {
            name: 'warehouse_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-industry',
            link: '/warehouse/manage',
            children: [
                {
                    path: '/warehouse/create',
                    name: 'warehouse_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/warehouse/update',
                    name: 'warehouse_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/warehouse/update/');
                    },
                },
                {
                    path: '/warehouse/copy',
                    name: 'warehouse_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/warehouse/copy/');
                    },
                },
                {
                    path: '/warehouse/view',
                    name: 'warehouse_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/warehouse/view/');
                    },
                },
            ],
        },
        // Variaion Entity
        {
            path: '/variation/manage',
            name: 'variation_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-sliders',
        },
        {
            name: 'variation_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-sliders',
            link: '/variation/manage',
            children: [
                {
                    path: '/variation/create',
                    name: 'variation_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/variation/update',
                    name: 'variation_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/variation/update/');
                    },
                },
                {
                    path: '/variation/copy',
                    name: 'variation_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/variation/copy/');
                    },
                },
                {
                    path: '/variation/view',
                    name: 'variation_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/variation/view/');
                    },
                },
            ],
        },
        // Attribute Entity
        {
            path: '/attribute/manage',
            name: 'attribute_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-tags',
        },
        {
            name: 'attribute_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-tags',
            link: '/attribute/manage',
            children: [
                {
                    path: '/attribute/create',
                    name: 'attribute_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/attribute/update',
                    name: 'attribute_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/attribute/update/');
                    },
                },
                {
                    path: '/attribute/copy',
                    name: 'attribute_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/attribute/copy/');
                    },
                },
                {
                    path: '/attribute/view',
                    name: 'attribute_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/attribute/view/');
                    },
                },
            ],
        },
        // Order Entity
        {
            path: '/order/manage',
            name: 'order_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-shopping-cart',
        },
        {
            name: 'order_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-shopping-cart',
            link: '/order/manage',
            children: [
                {
                    path: '/order/create',
                    name: 'order_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/order/update',
                    name: 'order_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/order/update/');
                    },
                },
                {
                    path: '/order/copy',
                    name: 'order_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/order/copy/');
                    },
                },
                {
                    path: '/order/view',
                    name: 'order_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/order/view/');
                    },
                },
            ],
        },
        // Tag Entity
        {
            path: '/tag/manage',
            name: 'tag_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-shopping-cart',
        },
        {
            name: 'tag_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-shopping-cart',
            link: '/tag/manage',
            children: [
                {
                    path: '/tag/create',
                    name: 'tag_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/tag/update',
                    name: 'tag_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/tag/update/');
                    },
                },
                {
                    path: '/tag/copy',
                    name: 'tag_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/tag/copy/');
                    },
                },
                {
                    path: '/tag/view',
                    name: 'tag_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/tag/view/');
                    },
                },
            ],
        },
        // Coupon Entity
        {
            path: '/coupon/manage',
            name: 'coupon_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-ticket',
        },
        {
            name: 'coupon_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-ticket',
            link: '/coupon/manage',
            children: [
                {
                    path: '/coupon/create',
                    name: 'coupon_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/coupon/update',
                    name: 'coupon_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/coupon/update/');
                    },
                },
                {
                    path: '/coupon/copy',
                    name: 'coupon_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/coupon/copy/');
                    },
                },
                {
                    path: '/coupon/view',
                    name: 'coupon_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/coupon/view/');
                    },
                },
            ],
        },
        // Badge Entity
        {
            path: '/badge/manage',
            name: 'badge_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-id-badge',
        },
        {
            name: 'badge_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-id-badge',
            link: '/badge/manage',
            children: [
                {
                    path: '/badge/create',
                    name: 'badge_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/badge/update',
                    name: 'badge_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/badge/update/');
                    },
                },
                {
                    path: '/badge/copy',
                    name: 'badge_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/badge/copy/');
                    },
                },
                {
                    path: '/badge/view',
                    name: 'badge_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/badge/view/');
                    },
                },
            ],
        },
        // DocAcc Entity
        {
            path: '/docAcc/manage',
            name: 'docAccount_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-address-card',
        },
        {
            name: 'docAccount_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-address-card',
            link: '/docAcc/manage',
            children: [
                {
                    path: '/docAcc/create',
                    name: 'docAccount_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/docAcc/update',
                    name: 'docAccount_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/docAcc/update/');
                    },
                },
                {
                    path: '/docAcc/copy',
                    name: 'docAccount_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/docAcc/copy/');
                    },
                },
                {
                    path: '/docAcc/view',
                    name: 'docAccount_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/docAcc/view/');
                    },
                },
            ],
        },
        // Return Entity
        {
            path: '/return/manage',
            name: 'return_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-reply',
        },
        {
            name: 'return_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-reply',
            link: '/return/manage',
            children: [
                {
                    path: '/return/create',
                    name: 'return_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/return/update',
                    name: 'return_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/return/update/');
                    },
                },
                {
                    path: '/return/copy',
                    name: 'return_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/return/copy/');
                    },
                },
                {
                    path: '/return/view',
                    name: 'return_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/return/view/');
                    },
                },
            ],
        },
        // Purshase Entity
        {
            path: '/purshase/manage',
            name: 'purshase_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-cubes',
        },
        {
            name: 'purshase_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-cubes',
            link: '/purshase/manage',
            children: [
                {
                    path: '/purshase/create',
                    name: 'purshase_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/purshase/update',
                    name: 'purshase_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/purshase/update/');
                    },
                },
                {
                    path: '/purshase/copy',
                    name: 'purshase_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/purshase/copy/');
                    },
                },
                {
                    path: '/purshase/view',
                    name: 'purshase_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/purshase/view/');
                    },
                },
            ],
        },
        // PurshaseReturn Entity
        {
            path: '/purchaseReturn/manage',
            name: 'purchaseReturn_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-reply',
        },
        {
            name: 'purchaseReturn_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-reply',
            link: '/purchaseReturn/manage',
            children: [
                {
                    path: '/purchaseReturn/create',
                    name: 'purchaseReturn_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/purchaseReturn/update',
                    name: 'purchaseReturn_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/purchaseReturn/update/');
                    },
                },
                {
                    path: '/purchaseReturn/copy',
                    name: 'purchaseReturn_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/purchaseReturn/copy/');
                    },
                },
                {
                    path: '/purchaseReturn/view',
                    name: 'purchaseReturn_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/purchaseReturn/view/');
                    },
                },
            ],
        },
        // Contact Entity
        {
            path: '/contact/manage',
            name: 'contact_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-address-book',
        },
        {
            name: 'contact_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-address-book',
            link: '/contact/manage',
            children: [
                {
                    path: '/contact/create',
                    name: 'contact_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/contact/update',
                    name: 'contact_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/contact/update/');
                    },
                },
                {
                    path: '/contact/copy',
                    name: 'contact_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/contact/copy/');
                    },
                },
                {
                    path: '/contact/view',
                    name: 'contact_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/contact/view/');
                    },
                },
            ],
        },
        // Adjustment Entity
        {
            path: '/adjustment/manage',
            name: 'adjustment_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-adjust',
        },
        {
            name: 'adjustment_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-adjust',
            link: '/adjustment/manage',
            children: [
                {
                    path: '/adjustment/create',
                    name: 'adjustment_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/adjustment/update',
                    name: 'adjustment_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/adjustment/update/');
                    },
                },
                {
                    path: '/adjustment/copy',
                    name: 'adjustment_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/adjustment/copy/');
                    },
                },
                {
                    path: '/adjustment/view',
                    name: 'adjustment_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/adjustment/view/');
                    },
                },
            ],
        },
        // PurshaseOrder Entity
        {
            path: '/purchaseOrder/manage',
            name: 'purchaseOrder_manage',
            sidebarVisible: true,
            pageTitleVisible: true,
            breadcrumbVisible: true,
            icon: 'fa fa-reply',
        },
        {
            name: 'purchaseOrder_manage',
            sidebarVisible: false,
            breadcrumbVisible: true,
            icon: 'fa fa-reply',
            link: '/purchaseOrder/manage',
            children: [
                {
                    path: '/purchaseOrder/create',
                    name: 'purchaseOrder_create',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                },
                {
                    path: '/purchaseOrder/update',
                    name: 'purchaseOrder_update',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-edit',
                    isMe: (path) => {
                        return path.includes('/purchaseOrder/update/');
                    },
                },
                {
                    path: '/purchaseOrder/copy',
                    name: 'purchaseOrder_copy',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-plus',
                    isMe: (path) => {
                        return path.includes('/purchaseOrder/copy/');
                    },
                },
                {
                    path: '/purchaseOrder/view',
                    name: 'purchaseOrder_view',
                    sidebarVisible: true,
                    pageTitleVisible: true,
                    breadcrumbVisible: true,
                    icon: 'fa fa-eye',
                    isMe: (path) => {
                        return path.includes('/purchaseOrder/view/');
                    },
                },
            ],
        },
    ];

    static getRoutes(): IAppRoute {
        return this.routes;
    }

    static getAllChildrenPath(parentRoute: IRouteParent): Array<string> {
        const list: string[] = [];
        const getPath = (children: IRouteParent['children']) => {
            children.forEach((item) => {
                if ((item as any).children) {
                    getPath((item as any).children);
                } else {
                    list.push((item as IRoute).path);
                }
            });
        };
        getPath(parentRoute.children);
        return list;
    }

    static getRouteByPath(path: string): IRoute | undefined {
        let rtn: IRoute | undefined;

        const findRoute = (rs: Array<IRouteParent | IRoute>) => {
            for (let i = 0; i < rs.length; i++) {
                const r = rs[i];
                if (r.hasOwnProperty('path')) {
                    const cr = r as IRoute;
                    if (cr.isMe && cr.isMe(path)) {
                        rtn = cr;
                        break;
                    } else if (cr.path === path) {
                        rtn = cr;
                        break;
                    }
                } else if (r.hasOwnProperty('children')) {
                    findRoute((r as IRouteParent).children);
                    if (rtn) break;
                }
            }
        };
        findRoute(this.routes);

        return rtn;
    }

    static getBreadcrumbsByPath(path: string): TBreadcrumb {
        const list: TBreadcrumb = [];
        let found = false;

        const findRoute = (rs: Array<IRouteParent | IRoute>) => {
            for (let i = 0; i < rs.length; i++) {
                const r = rs[i];
                if (r.hasOwnProperty('path')) {
                    const cr = r as IRoute;
                    if (cr.isMe && cr.isMe(path)) {
                        list.push({ ...cr, itIsMe: true });
                        found = true;
                        break;
                    } else if (cr.path === path) {
                        list.push({ ...cr, itIsMe: true });
                        found = true;
                        break;
                    }
                } else if (r.hasOwnProperty('children')) {
                    findRoute((r as IRouteParent).children);
                    if (found) {
                        list.unshift(r as IRouteParent);
                        break;
                    }
                }
            }
        };
        findRoute(this.routes);

        return list;
    }

    static get routeData() {
        return {
            user: {
                manage: {
                    url: () => '/user/manage',
                    path: '/user/manage',
                    title: Localization.customer, // used customer instead user
                },
                create: {
                    url: () => `/user/create`,
                    path: '/user/create',
                    // url: () => `/dashboard`, //TODO : should modify
                    // path: '/dashboard', //TODO : should modify
                    title: Localization.customer, // used customer instead user
                },
                copy: {
                    url: (id: string) => `/user/copy/${id}`,
                    path: '/user/copy/:id',
                    // url: () => `/dashboard`, //TODO : should modify
                    // path: '/dashboard', //TODO : should modify
                    title: Localization.customer, // used customer instead user
                },
                update: {
                    url: (id: string) => `/user/update/${id}`,
                    path: '/user/update/:id',
                    // url: () => `/dashboard`, //TODO : should modify
                    // path: '/dashboard', //TODO : should modify
                    title: Localization.customer, // used customer instead user
                },
                view: {
                    url: (id: string) => `/user/view/${id}`,
                    path: '/user/view/:id',
                    // url: () => `/dashboard`, //TODO : should modify
                    // path: '/dashboard', //TODO : should modify
                    title: Localization.customer,
                },
            },
            store: {
                manage: {
                    url: () => '/store/manage',
                    path: '/store/manage',
                    title: Localization.vendor, // used vendor instead store
                },
                create: {
                    url: () => `/store/create`,
                    path: '/store/create',
                    title: Localization.vendor, // used vendor instead store
                },
                copy: {
                    url: (id: string) => `/store/copy/${id}`,
                    path: '/store/copy/:id',
                    title: Localization.vendor, // used vendor instead store
                },
                update: {
                    url: (id: string) => `/store/update/${id}`,
                    path: '/store/update/:id',
                    title: Localization.vendor, // used vendor instead store
                },
                view: {
                    url: (id: string) => `/store/view/${id}`,
                    path: '/store/view/:id',
                    title: Localization.vendor, // used vendor instead store
                },
            },

            refund: {
                manage: {
                    url: () => '/refund/manage',
                    path: '/refund/manage',
                    title: Localization.refund,
                },
                create: {
                    url: () => `/refund/create`,
                    path: '/refund/create',
                    title: Localization.refund,
                },
                copy: {
                    url: (id: string) => `/refund/copy/${id}`,
                    path: '/refund/copy/:id',
                    title: Localization.refund,
                },
                update: {
                    url: (id: string) => `/refund/update/${id}`,
                    path: '/refund/update/:id',
                    title: Localization.refund,
                },
                view: {
                    url: (id: string) => `/refund/view/${id}`,
                    path: '/refund/view/:id',
                    title: Localization.refund,
                },
            },

            category: {
                manage: {
                    url: () => '/category/manage',
                    path: '/category/manage',
                    title: Localization.category,
                },
                create: {
                    url: () => `/category/create`,
                    path: '/category/create',
                    title: Localization.category,
                },
                copy: {
                    url: (id: string) => `/category/copy/${id}`,
                    path: '/category/copy/:id',
                    title: Localization.category,
                },
                update: {
                    url: (id: string) => `/category/update/${id}`,
                    path: '/category/update/:id',
                    title: Localization.category,
                },
                view: {
                    url: (id: string) => `/category/view/${id}`,
                    path: '/category/view/:id',
                    title: Localization.category,
                    // lazy:true
                },
            },
            product: {
                manage: {
                    url: () => '/product/manage',
                    path: '/product/manage',
                    title: Localization.product,
                },
                create: {
                    url: () => `/product/create`,
                    path: '/product/create',
                    title: Localization.product,
                },
                copy: {
                    url: (id: string) => `/product/copy/${id}`,
                    path: '/product/copy/:id',
                    title: Localization.product,
                },
                update: {
                    url: (id: string) => `/product/update/${id}`,
                    path: '/product/update/:id',
                    title: Localization.product,
                },
                view: {
                    url: (id: string) => `/product/view/${id}`,
                    path: '/product/view/:id',
                    title: Localization.product,
                },
                skuList: {
                    url: (product_id: string) =>
                        `/product/sku_list/${product_id}`,
                    path: '/product/sku_list/:product_id',
                    title: Localization.get_sku_list,
                },
            },
            language: {
                manage: {
                    url: () => '/language/manage',
                    path: '/language/manage',
                    title: Localization.language,
                },
                create: {
                    url: () => `/language/create`,
                    path: '/language/create',
                    title: Localization.language,
                },
                copy: {
                    url: (id: string) => `/language/copy/${id}`,
                    path: '/language/copy/:id',
                    title: Localization.language,
                },
                update: {
                    url: (id: string) => `/language/update/${id}`,
                    path: '/language/update/:id',
                    title: Localization.language,
                },
                view: {
                    url: (id: string) => `/language/view/${id}`,
                    path: '/language/view/:id',
                    title: Localization.language,
                },
            },
            dashboard: {
                url: () => '/dashboard',
                // title: 'dashboard'
                path: '/dashboard',
                title: Localization.dashboard,
            },
            profile: {
                url: () => '/profile',
                path: '/profile',
                title: Localization.profile,
            },
            login: {
                url: () => '/login',
                path: '/login',
                title: Localization.login,
            },
            forgetPassword: {
                url: () => '/forgetPassword',
                path: '/forgetPassword',
                title: Localization.forgot_password,
            },
            brand: {
                manage: {
                    url: () => '/brand/manage',
                    path: '/brand/manage',
                    title: Localization.brand,
                },
                create: {
                    url: () => `/brand/create`,
                    path: '/brand/create',
                    title: Localization.brand,
                },
                copy: {
                    url: (id: string) => `/brand/copy/${id}`,
                    path: '/brand/copy/:id',
                    title: Localization.brand,
                },
                update: {
                    url: (id: string) => `/brand/update/${id}`,
                    path: '/brand/update/:id',
                    title: Localization.brand,
                },
                view: {
                    url: (id: string) => `/brand/view/${id}`,
                    path: '/brand/view/:id',
                    title: Localization.brand,
                },
            },
            country: {
                manage: {
                    url: () => '/country/manage',
                    path: '/country/manage',
                    title: Localization.country,
                },
                create: {
                    url: () => `/country/create`,
                    path: '/country/create',
                    title: Localization.country,
                },
                copy: {
                    url: (id: string) => `/country/copy/${id}`,
                    path: '/country/copy/:id',
                    title: Localization.country,
                },
                update: {
                    url: (id: string) => `/country/update/${id}`,
                    path: '/country/update/:id',
                    title: Localization.country,
                },
                view: {
                    url: (id: string) => `/country/view/${id}`,
                    path: '/country/view/:id',
                    title: Localization.country,
                    // lazy:true
                },
            },
            area: {
                manage: {
                    url: () => '/area/manage',
                    path: '/area/manage',
                    title: Localization.area,
                },
                create: {
                    url: () => `/area/create`,
                    path: '/area/create',
                    title: Localization.area,
                },
                copy: {
                    url: (id: string) => `/area/copy/${id}`,
                    path: '/area/copy/:id',
                    title: Localization.area,
                },
                update: {
                    url: (id: string) => `/area/update/${id}`,
                    path: '/area/update/:id',
                    title: Localization.area,
                },
                view: {
                    url: (id: string) => `/area/view/${id}`,
                    path: '/area/view/:id',
                    title: Localization.area,
                },
            },
            warehouse: {
                manage: {
                    url: () => '/warehouse/manage',
                    path: '/warehouse/manage',
                    title: Localization.warehouse,
                },
                create: {
                    url: () => `/warehouse/create`,
                    path: '/warehouse/create',
                    title: Localization.warehouse,
                },
                copy: {
                    url: (id: string) => `/warehouse/copy/${id}`,
                    path: '/warehouse/copy/:id',
                    title: Localization.warehouse,
                },
                update: {
                    url: (id: string) => `/warehouse/update/${id}`,
                    path: '/warehouse/update/:id',
                    title: Localization.warehouse,
                },
                view: {
                    url: (id: string) => `/warehouse/view/${id}`,
                    path: '/warehouse/view/:id',
                    title: Localization.warehouse,
                },
            },
            variation: {
                manage: {
                    url: () => '/variation/manage',
                    path: '/variation/manage',
                    title: Localization.variation,
                },
                create: {
                    url: () => `/variation/create`,
                    path: '/variation/create',
                    title: Localization.variation,
                },
                copy: {
                    url: (id: string) => `/variation/copy/${id}`,
                    path: '/variation/copy/:id',
                    title: Localization.variation,
                },
                update: {
                    url: (id: string) => `/variation/update/${id}`,
                    path: '/variation/update/:id',
                    title: Localization.variation,
                },
                view: {
                    url: (id: string) => `/variation/view/${id}`,
                    path: '/variation/view/:id',
                    title: Localization.variation,
                },
            },
            attribute: {
                manage: {
                    url: () => '/attribute/manage',
                    path: '/attribute/manage',
                    title: Localization.attribute,
                },
                create: {
                    url: () => `/attribute/create`,
                    path: '/attribute/create',
                    title: Localization.attribute,
                },
                copy: {
                    url: (id: string) => `/attribute/copy/${id}`,
                    path: '/attribute/copy/:id',
                    title: Localization.attribute,
                },
                update: {
                    url: (id: string) => `/attribute/update/${id}`,
                    path: '/attribute/update/:id',
                    title: Localization.attribute,
                },
                view: {
                    url: (id: string) => `/attribute/view/${id}`,
                    path: '/attribute/view/:id',
                    title: Localization.attribute,
                },
            },
            order: {
                manage: {
                    url: () => '/order/manage',
                    path: '/order/manage',
                    title: Localization.order,
                },
                create: {
                    url: () => `/order/create`,
                    path: '/order/create',
                    title: Localization.order,
                },
                copy: {
                    url: (id: string) => `/order/copy/${id}`,
                    path: '/order/copy/:id',
                    title: Localization.order,
                },
                update: {
                    url: (id: string) => `/order/update/${id}`,
                    path: '/order/update/:id',
                    title: Localization.order,
                },
                view: {
                    url: (id: string) => `/order/view/${id}`,
                    path: '/order/view/:id',
                    title: Localization.order,
                },
            },
            tag: {
                manage: {
                    url: () => '/tag/manage',
                    path: '/tag/manage',
                    title: Localization.tag,
                },
                create: {
                    url: () => `/tag/create`,
                    path: '/tag/create',
                    title: Localization.tag,
                },
                copy: {
                    url: (id: string) => `/tag/copy/${id}`,
                    path: '/tag/copy/:id',
                    title: Localization.tag,
                },
                update: {
                    url: (id: string) => `/tag/update/${id}`,
                    path: '/tag/update/:id',
                    title: Localization.tag,
                },
                view: {
                    url: (id: string) => `/tag/view/${id}`,
                    path: '/tag/view/:id',
                    title: Localization.tag,
                },
            },
            coupon: {
                manage: {
                    url: () => '/coupon/manage',
                    path: '/coupon/manage',
                    title: Localization.coupon,
                },
                create: {
                    url: () => `/coupon/create`,
                    path: '/coupon/create',
                    title: Localization.coupon,
                },
                copy: {
                    url: (id: string) => `/coupon/copy/${id}`,
                    path: '/coupon/copy/:id',
                    title: Localization.coupon,
                },
                update: {
                    url: (id: string) => `/coupon/update/${id}`,
                    path: '/coupon/update/:id',
                    title: Localization.coupon,
                },
                view: {
                    url: (id: string) => `/coupon/view/${id}`,
                    path: '/coupon/view/:id',
                    title: Localization.coupon,
                },
            },
            badge: {
                manage: {
                    url: () => '/badge/manage',
                    path: '/badge/manage',
                    title: Localization.badge,
                },
                create: {
                    url: () => `/badge/create`,
                    path: '/badge/create',
                    title: Localization.badge,
                },
                copy: {
                    url: (id: string) => `/badge/copy/${id}`,
                    path: '/badge/copy/:id',
                    title: Localization.badge,
                },
                update: {
                    url: (id: string) => `/badge/update/${id}`,
                    path: '/badge/update/:id',
                    title: Localization.badge,
                },
                view: {
                    url: (id: string) => `/badge/view/${id}`,
                    path: '/badge/view/:id',
                    title: Localization.badge,
                },
            },
            docAcc: {
                manage: {
                    url: () => '/docAcc/manage',
                    path: '/docAcc/manage',
                    title: Localization.docAccount,
                },
                create: {
                    url: () => `/docAcc/create`,
                    path: '/docAcc/create',
                    title: Localization.docAccount,
                },
                copy: {
                    url: (id: string) => `/docAcc/copy/${id}`,
                    path: '/docAcc/copy/:id',
                    title: Localization.docAccount,
                },
                update: {
                    url: (id: string) => `/docAcc/update/${id}`,
                    path: '/docAcc/update/:id',
                    title: Localization.docAccount,
                },
                view: {
                    url: (id: string) => `/docAcc/view/${id}`,
                    path: '/docAcc/view/:id',
                    title: Localization.docAccount,
                },
            },
            return: {
                manage: {
                    url: () => '/return/manage',
                    path: '/return/manage',
                    title: Localization.return,
                },
                create: {
                    url: () => `/return/create`,
                    path: '/return/create',
                    title: Localization.return,
                },
                copy: {
                    url: (id: string) => `/return/copy/${id}`,
                    path: '/return/copy/:id',
                    title: Localization.return,
                },
                update: {
                    url: (id: string) => `/return/update/${id}`,
                    path: '/return/update/:id',
                    title: Localization.return,
                },
                view: {
                    url: (id: string) => `/return/view/${id}`,
                    path: '/return/view/:id',
                    title: Localization.return,
                },
            },
            purshase: {
                manage: {
                    url: () => '/purshase/manage',
                    path: '/purshase/manage',
                    title: Localization.purshase,
                },
                create: {
                    url: () => `/purshase/create`,
                    path: '/purshase/create',
                    title: Localization.purshase,
                },
                copy: {
                    url: (id: string) => `/purshase/copy/${id}`,
                    path: '/purshase/copy/:id',
                    title: Localization.purshase,
                },
                update: {
                    url: (id: string) => `/purshase/update/${id}`,
                    path: '/purshase/update/:id',
                    title: Localization.purshase,
                },
                view: {
                    url: (id: string) => `/purshase/view/${id}`,
                    path: '/purshase/view/:id',
                    title: Localization.purshase,
                },
            },
            purchaseReturn: {
                manage: {
                    url: () => '/purchaseReturn/manage',
                    path: '/purchaseReturn/manage',
                    title: Localization.purchaseReturn,
                },
                create: {
                    url: () => `/purchaseReturn/create`,
                    path: '/purchaseReturn/create',
                    title: Localization.purchaseReturn,
                },
                copy: {
                    url: (id: string) => `/purchaseReturn/copy/${id}`,
                    path: '/purchaseReturn/copy/:id',
                    title: Localization.purchaseReturn,
                },
                update: {
                    url: (id: string) => `/purchaseReturn/update/${id}`,
                    path: '/purchaseReturn/update/:id',
                    title: Localization.purchaseReturn,
                },
                view: {
                    url: (id: string) => `/purchaseReturn/view/${id}`,
                    path: '/purchaseReturn/view/:id',
                    title: Localization.purchaseReturn,
                },
            },
            contact: {
                manage: {
                    url: () => '/contact/manage',
                    path: '/contact/manage',
                    title: Localization.contact,
                },
                create: {
                    url: () => `/contact/create`,
                    path: '/contact/create',
                    title: Localization.contact,
                },
                copy: {
                    url: (id: string) => `/contact/copy/${id}`,
                    path: '/contact/copy/:id',
                    title: Localization.contact,
                },
                update: {
                    url: (id: string) => `/contact/update/${id}`,
                    path: '/contact/update/:id',
                    title: Localization.contact,
                },
                view: {
                    url: (id: string) => `/contact/view/${id}`,
                    path: '/contact/view/:id',
                    title: Localization.contact,
                },
            },
            adjustment: {
                manage: {
                    url: () => '/adjustment/manage',
                    path: '/adjustment/manage',
                    title: Localization.adjustment,
                },
                create: {
                    url: () => `/adjustment/create`,
                    path: '/adjustment/create',
                    title: Localization.adjustment,
                },
                copy: {
                    url: (id: string) => `/adjustment/copy/${id}`,
                    path: '/adjustment/copy/:id',
                    title: Localization.adjustment,
                },
                update: {
                    url: (id: string) => `/adjustment/update/${id}`,
                    path: '/adjustment/update/:id',
                    title: Localization.adjustment,
                },
                view: {
                    url: (id: string) => `/adjustment/view/${id}`,
                    path: '/adjustment/view/:id',
                    title: Localization.adjustment,
                },
            },
            purchaseOrder: {
                manage: {
                    url: () => '/purchaseOrder/manage',
                    path: '/purchaseOrder/manage',
                    title: Localization.purchaseOrder,
                },
                create: {
                    url: () => `/purchaseOrder/create`,
                    path: '/purchaseOrder/create',
                    title: Localization.purchaseOrder,
                },
                copy: {
                    url: (id: string) => `/purchaseOrder/copy/${id}`,
                    path: '/purchaseOrder/copy/:id',
                    title: Localization.purchaseOrder,
                },
                update: {
                    url: (id: string) => `/purchaseOrder/update/${id}`,
                    path: '/purchaseOrder/update/:id',
                    title: Localization.purchaseOrder,
                },
                view: {
                    url: (id: string) => `/purchaseOrder/view/${id}`,
                    path: '/purchaseOrder/view/:id',
                    title: Localization.purchaseOrder,
                },
            },
            test: {
                manage: {
                    url: () => '/test/manage',
                    path: '/test/manage',
                    title: 'TEST PAGE',
                },
                create: {
                    url: () => '/test/manage',
                    path: '/test/manage',
                    title: 'TEST PAGE',
                },
            },
        };
    }
}
