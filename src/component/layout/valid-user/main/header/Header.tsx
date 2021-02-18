import React, { Fragment } from 'react';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../../redux/app_state';
import { History } from 'history';
import { NETWORK_STATUS } from '../../../../../enum/network-status.enum';
import { IUser } from '../../../../../model/user.model';
import { Localization } from '../../../../../config/localization/localization';
import { Dropdown, Nav } from 'react-bootstrap';
import { TInternationalization } from '../../../../../config/setup';
import { action_change_app_flag } from '../../../../../redux/action/internationalization';
import { BaseComponent } from '../../../../_base/BaseComponent';
import { ITheme_schema } from '../../../../../redux/action/theme/themeAction';
import { action_update_theme } from '../../../../../redux/action/theme';
import { Navbar } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import { AppRoute } from '../../../../../config/route';
import { ILanguage_schema } from '../../../../../redux/action/language/languageAction';

interface RouteDataEntityItem {
    manage: {
        url: () => string;
        path: string;
        title: string;
    };
    create: {
        url: () => string;
        path: string;
        title: string;
    };
}

interface RouteDataOtherItem {
    manage?: any;
    create?: any;
    url: () => string;
    path: string;
    title: string;
}

interface RouteData {
    [key: string]: RouteDataEntityItem | RouteDataOtherItem;
}

interface IProps {
    history: History;
    match: any;
    network_status: NETWORK_STATUS;
    logged_in_user: IUser | null;
    internationalization: TInternationalization;
    change_app_flag?: (internationalization: TInternationalization) => void;
    theme: ITheme_schema;
    update_theme?: (theme: ITheme_schema) => any;
    language: ILanguage_schema;
}
interface IState {
    visibleMenuCount: number;
    sidebarAccountShow: boolean;
    menuItems: Array<{ itemName: string; url: string }>;
    createItems: Array<{ itemName: string; url: string }>;
    searchValue: string;
    o_Width: number | undefined;
}

class LayoutMainHeaderComponent extends BaseComponent<IProps, IState> {
    state = {
        visibleMenuCount: 1,
        sidebarAccountShow: false,
        menuItems: [],
        createItems: [],
        searchValue: '',
        o_Width: undefined,
    };

    constructor(p: IProps) {
        super(p);
        this.onWindowResize = this.onWindowResize.bind(this);
        // debugger
    }

    componentDidMount() {
        this.extractorEntitiesFromRoute();
        window.addEventListener('resize', this.onWindowResize);
        setTimeout(() => {
            this.onWindowResize();
        }, 500);
        setTimeout(() => {
            this.onWindowResize();
        }, 1000);
        setTimeout(() => {
            this.onWindowResize();
        }, 3000);
        setTimeout(() => {
            this.onWindowResize();
        }, 5000);
        setTimeout(() => {
            this.onWindowResize();
        }, 9000);
    }

    componentDidUpdate(prevProps: IProps) {
        // console.log('componentDidUpdate 1')
        // if (this.props === prevProps) return;
        this.onWindowResize();
        let prevPath: string | undefined = prevProps.match.path;
        let currentPath = this.props.match.path;
        let prevUrlStatus: string =
            prevPath !== undefined
                ? prevPath.slice(prevPath.length - 7, prevPath.length)
                : '';
        let currentUrlStatus: string =
            currentPath !== undefined
                ? currentPath.slice(currentPath.length - 7, currentPath.length)
                : '';
        if (prevUrlStatus !== '/manage' && currentUrlStatus === '/manage') {
            const windowOuterWidth = window.outerWidth;
            this.afterChangeWindowsWidthOrChangePath(windowOuterWidth);
            // console.log('componentDidUpdate 2')
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private async onWindowResize() {
        // console.log('onWindowResize 1')
        const windowOuterWidth = window.outerWidth;
        if (this.state.o_Width === windowOuterWidth) return;
        // console.log('onWindowResize 2')
        this.afterChangeWindowsWidthOrChangePath(windowOuterWidth);
    }

    private afterChangeWindowsWidthOrChangePath(windowOuterWidth: number) {
        let numberOfVisible: number =
            windowOuterWidth < 1000
                ? 1
                : Math.floor((windowOuterWidth - 800) / 100);
        const currentPath = this.props.match.path;
        let items: Array<{ itemName: string; url: string }> = this.state
            .menuItems;

        let dashboardPathIndexInItemsArray: number | undefined = undefined;
        for (let i = 0; i < items.length; i++) {
            if (items[i].url === AppRoute.routeData.dashboard.url()) {
                dashboardPathIndexInItemsArray = i;
                break;
            }
        }
        if (
            dashboardPathIndexInItemsArray &&
            typeof dashboardPathIndexInItemsArray === 'number' &&
            numberOfVisible > 1
        ) {
            let dashboard: { itemName: string; url: string } =
                items[dashboardPathIndexInItemsArray];
            items.splice(dashboardPathIndexInItemsArray, 1);
            items.splice(0, 0, dashboard);
        }

        let currentPathIndexInItemsArray: number | undefined = undefined;
        for (let i = 0; i < items.length; i++) {
            if (items[i].url === currentPath) {
                currentPathIndexInItemsArray = i;
                break;
            }
        }

        if (
            currentPathIndexInItemsArray &&
            typeof currentPathIndexInItemsArray === 'number'
        ) {
            if (numberOfVisible <= 1) {
                let activeItem: { itemName: string; url: string } =
                    items[currentPathIndexInItemsArray];
                items.splice(currentPathIndexInItemsArray, 1);
                items.splice(0, 0, activeItem);
                setTimeout(() => {
                    this.setState({
                        visibleMenuCount: numberOfVisible,
                        menuItems: items,
                        o_Width: windowOuterWidth,
                    });
                }, 100);
                return;
            } else {
                let activeItemPathIndexInItemsArray:
                    | number
                    | undefined = undefined;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].url === currentPath) {
                        activeItemPathIndexInItemsArray = i;
                        break;
                    }
                }
                if (
                    activeItemPathIndexInItemsArray &&
                    typeof activeItemPathIndexInItemsArray === 'number' &&
                    activeItemPathIndexInItemsArray > numberOfVisible - 1
                ) {
                    let activeItem: { itemName: string; url: string } =
                        items[activeItemPathIndexInItemsArray];
                    items.splice(numberOfVisible - 1, 0, activeItem);
                    items.splice(activeItemPathIndexInItemsArray + 1, 1);
                    // debugger
                }
                setTimeout(() => {
                    this.setState({
                        visibleMenuCount: numberOfVisible,
                        menuItems: items,
                        o_Width: windowOuterWidth,
                    });
                }, 100);
            }
        } else {
            setTimeout(() => {
                this.setState({
                    visibleMenuCount: numberOfVisible,
                    o_Width: windowOuterWidth,
                });
            }, 100);
        }
    }

    extractorEntitiesFromRoute() {
        let route: RouteData = AppRoute.routeData;
        let MenuItems: Array<{ itemName: string; url: string }> = [];
        let CreateItems: Array<{ itemName: string; url: string }> = [];
        let allItem = Object.keys(route);
        for (let i = 0; i < allItem.length; i++) {
            const item: string = allItem[i];
            if (route[item] && item === 'dashboard') {
                let entity: RouteDataOtherItem = route[
                    item
                ] as RouteDataOtherItem;
                let menuItem: { itemName: string; url: string } = {
                    itemName: entity.title,
                    url: entity.url(),
                };
                MenuItems.splice(0, 0, menuItem);
            }
            if (route[item] && route[item].manage && item !== 'test') {
                let entity: RouteDataEntityItem = route[
                    item
                ] as RouteDataEntityItem;
                let menuItem: { itemName: string; url: string } = {
                    itemName: entity.manage.title,
                    url: entity.manage.url(),
                };
                MenuItems.push(menuItem);
            }
            if (route[item] && route[item].create && item !== 'test') {
                let entity: RouteDataEntityItem = route[
                    item
                ] as RouteDataEntityItem;
                let createItem: { itemName: string; url: string } = {
                    itemName: entity.create.title,
                    url: entity.create.url(),
                };
                CreateItems.push(createItem);
            }
        }
        this.setState({
            ...this.state,
            menuItems: MenuItems,
            createItems: CreateItems,
        });
    }

    private logout() {
        this.onApplogout(this.props.history);
    }

    redirecterAndReplacer(
        item: { itemName: string; url: string },
        index: number
    ) {
        let items: Array<{ itemName: string; url: string }> = this.state
            .menuItems;
        let commingItem: { itemName: string; url: string } =
            items[index + this.state.visibleMenuCount];
        let lastShowItem: { itemName: string; url: string } =
            items[this.state.visibleMenuCount - 1];
        items.splice(this.state.visibleMenuCount - 1, 1, commingItem);
        items.splice(index + this.state.visibleMenuCount, 1, lastShowItem);
        this.setState({ ...this.state, menuItems: items }, () =>
            this.navigate(item.url)
        );
    }

    menuItemSearchInputOnChange(value: string | undefined) {
        if (value === undefined || value === '') {
            this.setState({ ...this.state, searchValue: '' });
        } else {
            this.setState({ ...this.state, searchValue: value });
        }
    }

    isShowBySearchValue(itemName: string, searchValue: string): string {
        if (searchValue === '') {
            return '';
        } else {
            let exist: boolean = itemName.includes(searchValue);
            if (exist === true) {
                return '';
            } else {
                return ' d-none';
            }
        }
    }

    private menuItemsRender(itemForRender: number): Array<JSX.Element> {
        let items: Array<{
            itemName: string;
            url: string;
        }> = this.state.menuItems.slice(0, itemForRender - 1);
        return items.map(
            (item: { itemName: string; url: string }, i: number) => {
                return (
                    <Fragment key={i}>
                        <li className="nav-item">
                            <NavLink
                                to={item.url}
                                className="nav-link text-capitalize"
                                activeClassName="active pointer-events-none"
                            >
                                {item.itemName}
                            </NavLink>
                        </li>
                    </Fragment>
                );
            }
        );
    }

    private menuFixItemRender(itemForRender: number): Array<JSX.Element> {
        let items: Array<{
            itemName: string;
            url: string;
        }> = this.state.menuItems.slice(itemForRender - 1, itemForRender);
        return items.map(
            (item: { itemName: string; url: string }, i: number) => {
                return (
                    <Fragment key={i}>
                        <li className="nav-item">
                            <NavLink
                                to={item.url}
                                className="nav-link text-capitalize"
                                activeClassName="active pointer-events-none"
                            >
                                {item.itemName}
                            </NavLink>
                        </li>
                    </Fragment>
                );
            }
        );
    }

    private extraItemsRender(itemForRender: number): JSX.Element {
        let itemsArrayLenght: number = this.state.menuItems.length;
        let items: Array<{
            itemName: string;
            url: string;
        }> = this.state.menuItems.slice(itemForRender, itemsArrayLenght);
        return (
            <Dropdown
                className={`extra-items px-3 d-flex justify-content-center align-items-center `}
            >
                <Dropdown.Toggle
                    as="li"
                    id="headerMenuExtraItemsRender"
                    className="nan-item m-auto cursor-pointer"
                >
                    <i className="fa fa-ellipsis-h menu-icon"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className="menu-extra-items-wrapper"
                    flip={false}
                >
                    {this.menuExtraItemsRender(items)}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    private menuExtraItemsRender(
        items: Array<{ itemName: string; url: string }>
    ): JSX.Element {
        return (
            <Fragment>
                <div className="menu-extra-items">
                    <div className="header">
                        <span>
                            <img
                                src="/static/media/img/icon/search-extra-menu-item.svg"
                                className="w-25px"
                                alt=""
                            />
                        </span>
                        <input
                            autoFocus={true}
                            type="text"
                            placeholder="Search Modules"
                            className="input-filter-items"
                            onChange={(e: any) =>
                                this.menuItemSearchInputOnChange(e.target.value)
                            }
                        />
                        <hr />
                    </div>
                    {items.length === 0 ? undefined : (
                        <ul className="body">
                            {items.map(
                                (
                                    item: { itemName: string; url: string },
                                    i: number
                                ) => {
                                    return (
                                        <li
                                            className={
                                                'm-0 p-0' +
                                                this.isShowBySearchValue(
                                                    item.itemName,
                                                    this.state.searchValue
                                                )
                                            }
                                            key={i}
                                        >
                                            <Dropdown.Item
                                                className="menu-item text-capitalize cursor-pointer"
                                                onClick={() =>
                                                    this.redirecterAndReplacer(
                                                        item,
                                                        i
                                                    )
                                                }
                                            >
                                                {item.itemName}
                                            </Dropdown.Item>
                                        </li>
                                    );
                                }
                            )}
                        </ul>
                    )}
                    {/* <div className="create-new-module">
                        <Dropdown.Item
                            className="m-0 p-0 menu-item cursor-pointer"
                            // onClick={() => this.navigate(AppRoute.routeData.dashboard.url())}
                        >
                            <span className="create-icon">+</span>
                            <span className="creation-text text-capitalize">
                                create new module
                            </span>
                        </Dropdown.Item>
                    </div> */}
                </div>
            </Fragment>
        );
    }

    private createPathOfEntitiesList(
        items: Array<{ itemName: string; url: string }>
    ): JSX.Element {
        if (items.length === 0) return <></>;
        return (
            <Fragment>
                <div className="create-path-items">
                    <ul className="body">
                        {items.map(
                            (
                                item: { itemName: string; url: string },
                                i: number
                            ) => {
                                return (
                                    <li
                                        className={
                                            'm-0 p-0' +
                                            this.isShowBySearchValue(
                                                item.itemName,
                                                this.state.searchValue
                                            )
                                        }
                                        key={i}
                                    >
                                        <Dropdown.Item
                                            className="menu-item text-capitalize cursor-pointer"
                                            onClick={() =>
                                                this.navigate(item.url)
                                            }
                                        >
                                            <span className="">+</span>
                                            {item.itemName}
                                        </Dropdown.Item>
                                    </li>
                                );
                            }
                        )}
                    </ul>
                </div>
            </Fragment>
        );
    }

    private showSidebar() {
        this.setState({ sidebarAccountShow: true });
    }
    private hideSidebar() {
        this.setState({ sidebarAccountShow: false });
    }
    private sidebarAccountrender() {
        const user = this.props.logged_in_user;
        if (!user) return <></>;
        const fullname = user.name;
        const email = user.email;
        const phone = user.phone;
        const country = user.country;
        // const avatar = CmpUtility.personImg();

        return (
            <>
                <Modal
                    className="profile-info-modal-in-header-with-sidebar-style-wrapper right"
                    id="ProfileInfoModalInHeaderWithSidebarStyle"
                    size="xl"
                    show={this.state.sidebarAccountShow}
                    onHide={() => this.hideSidebar()}
                    backdropClassName="profile-info-modal-in-header-with-sidebar-style-wrapper-backdrop-background-color"
                    animation={true}
                >
                    <Modal.Body>
                        {/* <div
              className={"account-sidebar-backdrop " + (this.state.sidebarAccountShow ? 'open' : 'd-none--')}
              onClick={() => this.hideSidebar()}
            ></div> */}

                        <div className={'account-sidebar-wrapper open '}>
                            <div className={'account-sidebar open '}>
                                <div className="account-sidebar-header bg-dark text-white text-center">
                                    <div
                                        className="close-btn"
                                        onClick={() => this.hideSidebar()}
                                    >
                                        &times;
                                    </div>
                                    <div className="profile-img-wrapper px-3 pb-3">
                                        <img
                                            src="/static/media/img/icon/avatar.png"
                                            className=""
                                            alt=""
                                        />
                                    </div>
                                    <h5 className="p-3 font-weight-bold">
                                        {fullname}
                                    </h5>
                                    <div className="btn-group action-section">
                                        <button
                                            type="button"
                                            className="btn btn-dark profile-btn"
                                            onClick={() => {
                                                this.hideSidebar();
                                                this.navigate(
                                                    AppRoute.routeData.profile.url()
                                                );
                                            }}
                                        >
                                            {Localization.profile}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-dark sign-out-btn"
                                            onClick={() => {
                                                this.hideSidebar();
                                                this.logout();
                                            }}
                                        >
                                            {Localization.sign_out}
                                        </button>
                                    </div>
                                </div>

                                <div className="account-sidebar-body thin-scroll px-4">
                                    <div className="item-section">
                                        <div className="item-section-heading">
                                            information
                                        </div>
                                        <div className="item-section-detail">
                                            <i className="item-icon fa fa-envelope"></i>
                                            <span className="item-label">
                                                email
                                            </span>
                                            <span className="item-text">
                                                {email}
                                            </span>
                                        </div>
                                        <div className="item-section-detail">
                                            <i className="item-icon fa fa-phone"></i>
                                            <span className="item-label">
                                                phone
                                            </span>
                                            <span className="item-text">
                                                {phone}
                                            </span>
                                        </div>
                                        <div className="item-section-detail">
                                            <i className="item-icon fa fa-globe"></i>
                                            <span className="item-label">
                                                country
                                            </span>
                                            <span className="item-text">
                                                {country?.name[
                                                    this.defaultLangCode
                                                ] || ''}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="item-section">
                                        <div className="item-section-heading">
                                            application
                                        </div>
                                        <div className="item-section-detail">
                                            <i className="item-icon fa fa-tablet fa-certificate--"></i>
                                            <span className="item-label">
                                                version
                                            </span>
                                            <span className="item-text">
                                                {process.env.REACT_APP_VERSION}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </>
        );
    }

    render() {
        // debugger
        return (
            <>
                <div className="container-fluid layout-main-header-wrapper bg-dark">
                    <Navbar
                        collapseOnSelect
                        // expand="lg"
                        // expand="md"
                        expand
                        variant="dark"
                        className={'px-0 py-0'}
                    >
                        {/* brand logo */}
                        <NavLink
                            to={AppRoute.routeData.dashboard.url()}
                            className="navbar-brand font-weight-bold-- p-0 mr-1"
                            activeClassName=""
                        >
                            {/* Modish */}
                            {/* <img src="/static/media/img/other/modish-logo.svg" className="max-h-48px" alt="modish logo" /> */}
                            <img
                                src="/static/media/img/other/NES.svg"
                                className="max-h-48px"
                                alt="modish logo"
                            />
                        </NavLink>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            {/* left hand */}
                            <Nav className="mr-auto">
                                {this.menuItemsRender(
                                    this.state.visibleMenuCount
                                )}
                                {this.menuFixItemRender(
                                    this.state.visibleMenuCount
                                )}
                                {this.extraItemsRender(
                                    this.state.visibleMenuCount
                                )}
                            </Nav>

                            {/* right hand */}
                            <Nav>
                                <Dropdown className="mr-3 px-1-- d-flex justify-content-center align-items-center">
                                    <Dropdown.Toggle
                                        as="div"
                                        id="dropdown-search-area"
                                        className="dropdown-search-area cursor-pointer"
                                    >
                                        {/* <i className="fa fa-search menu-icon"></i> */}
                                        <img
                                            src="/static/media/img/icon/search-all-items-header.svg"
                                            className="w-25px"
                                            alt=""
                                        />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu
                                        alignRight
                                        flip={false}
                                        as="div"
                                        className="header-total-search-wrapper"
                                    >
                                        <div className="header-total-search">
                                            <img
                                                src="/static/media/img/icon/search-extra-menu-item.svg"
                                                className="w-25px"
                                                alt=""
                                            />
                                            <input
                                                autoFocus={true}
                                                type="text"
                                                placeholder="Search"
                                                className="input-search-entities"
                                                onChange={(e: any) =>
                                                    console.log(e.target.value)
                                                }
                                            />
                                            <span className="remove-icon-wrapper">
                                                <Dropdown.Item className="p-0 m-0">
                                                    <i className="fa fa-times remove-icon"></i>
                                                </Dropdown.Item>
                                            </span>
                                        </div>
                                        <div className="link-to-other-app">
                                            <span className="link-to-new-tab">
                                                Search across Modish
                                                <i
                                                    className="fa fa-external-link ex-link-icon"
                                                    aria-hidden="true"
                                                ></i>
                                            </span>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>

                                <Dropdown className="mr-3 px-1-- d-flex justify-content-center align-items-center">
                                    <Dropdown.Toggle
                                        as="li"
                                        id="dropdown-create-area"
                                        className="nan-item m-auto cursor-pointer"
                                    >
                                        <span>+</span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu
                                        flip={false}
                                        alignRight
                                        className="create-entities-path-list-wrapper"
                                    >
                                        {this.createPathOfEntitiesList(
                                            this.state.createItems
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>

                                <li className="nav-item pl-1--">
                                    <img
                                        src="/static/media/img/icon/avatar.png"
                                        className="w-25px rounded cursor-pointer"
                                        alt=""
                                        onClick={() => this.showSidebar()}
                                    />
                                </li>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>

                    {this.sidebarAccountrender()}
                </div>
            </>
        );
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {
        change_app_flag: (internationalization: TInternationalization) =>
            dispatch(action_change_app_flag(internationalization)),
        update_theme: (theme: ITheme_schema) =>
            dispatch(action_update_theme(theme)),
    };
};

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        network_status: state.network_status,
        logged_in_user: state.logged_in_user,
        theme: state.theme,
        language: state.language,
    };
};

export const LayoutMainHeader = connect(
    state2props,
    dispatch2props
)(LayoutMainHeaderComponent);
