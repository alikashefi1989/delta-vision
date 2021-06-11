import React from 'react';
import { redux_state } from '../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TInternationalization } from '../../../config/setup';
import { BaseComponent, IBaseProps } from '../../_base/BaseComponent';
import { History } from 'history';
import { action_change_app_flag } from '../../../redux/action/internationalization';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
} from 'react-pro-sidebar';
import { Store2 } from '../../../redux/store';
import { Localization } from '../../../config/localization/localization';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../../config/route';

interface IProps extends IBaseProps {
    history?: History;
    internationalization: TInternationalization;
    changeLanguage: (payload: TInternationalization) => void;
}

interface IState {
    menuIsOpen: boolean;
    timeStamp: number | undefined;
    homeSliderCurrentSlideIndex: number;
}

export default class MainStructureComponent extends BaseComponent<
    IProps,
    IState
> {
    state = {
        menuIsOpen: false,
        timeStamp: undefined,
        homeSliderCurrentSlideIndex: 0,
    };

    private timeStampUpdater: any = undefined;

    componentDidMount() {
        this.timeStampUpdater = setInterval(() => {
            this.setState({ ...this.state, timeStamp: new Date().getTime() });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timeStampUpdater);
    }

    private changeLang(payload: TInternationalization) {
        if (this.props.internationalization.flag === payload.flag) {
            return;
        }
        this.props.changeLanguage(payload);
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }

    private toggleLanguageChange() {
        if (this.props.internationalization.flag === 'fa') {
            this.props.changeLanguage({
                rtl: false,
                language: 'english',
                flag: 'en',
            });
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } else {
            this.props.changeLanguage({
                rtl: true,
                language: 'فارسی',
                flag: 'fa',
            });
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    }

    private timestamp2Clock(timestamp: number | undefined): string {
        if (timestamp === undefined) {
            return '';
        } else {
            let hours =
                new Date(timestamp).getHours() < 10
                    ? '0' + new Date(timestamp).getHours()
                    : new Date(timestamp).getHours();
            let minutes =
                new Date(timestamp).getMinutes() < 10
                    ? '0' + new Date(timestamp).getMinutes()
                    : new Date(timestamp).getMinutes();
            let seconds =
                new Date(timestamp).getSeconds() < 10
                    ? '0' + new Date(timestamp).getSeconds()
                    : new Date(timestamp).getSeconds();
            let res: string = `${hours} : ${minutes} : ${seconds}`;
            let reverse_res: string = `${seconds} : ${minutes} : ${hours}`;
            if (this.props.internationalization.rtl === false) {
                return res;
            } else {
                return reverse_res;
            }
        }
    }

    private headerRendererFunction(): JSX.Element {
        return (
            <>
                <div
                    className="header-wrapper"
                    onClick={() =>
                        this.setState({ ...this.state, menuIsOpen: false })
                    }
                >
                    <div className="d-flex justify-content-around top-part">
                        <ul className="social-media">
                            <li className="social-media-item telegram">
                                <a
                                    href="https://t.me/deltaavision"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i
                                        title={Localization.telegram}
                                        className="fa fa-telegram text-primary"
                                    ></i>
                                </a>
                            </li>
                            <li className="social-media-item whatsapp">
                                <a
                                    href="https://wa.me/989121993039"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i
                                        title={Localization.whatsapp}
                                        className="fa fa-whatsapp text-success"
                                    ></i>
                                </a>
                            </li>
                            <li className="social-media-item instagram">
                                <a
                                    href="https://instagram.com/deltaavision?igshid=vikw0ihzqzvb"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <i
                                        title={Localization.instagram}
                                        className="fa fa-instagram text-danger"
                                    ></i>
                                </a>
                            </li>
                        </ul>
                        <div className="d-flex justify-content-center logo-brand">
                            <img
                                className="logo"
                                src={
                                    process.env.PUBLIC_URL +
                                    '/static/media/img/logo/dv.png'
                                }
                                alt=""
                            />
                        </div>
                        <div className="justify-content-around language-change-clock">
                            <div className="language-change">
                                <i
                                    className="fa fa-language text-white-"
                                    title={Localization.change_language}
                                    onClick={() => this.toggleLanguageChange()}
                                ></i>
                            </div>
                            <div className="clock">
                                {this.timestamp2Clock(this.state.timeStamp)}
                            </div>
                        </div>
                    </div>
                    <div className="text-capitalize font-weight-bold text-center text-white brand-name">
                        {Localization.text.company_brand}
                    </div>
                    <div className="d-flex justify-content-center bottom-part">
                        <ul className="menu">
                            <li
                                className="item"
                                onClick={() =>
                                    this.props.history?.push(
                                        AppRoute.routeData.home.path
                                    )
                                }
                            >
                                {Localization.home}
                            </li>
                            <li className="item">
                                {Localization.products}
                                <ul className="sub-menu">
                                    <li className="item">
                                        {Localization.packing}
                                        <ul className="sub-menu">
                                            <li
                                                className="item"
                                                onClick={() =>
                                                    this.props.history?.push(
                                                        AppRoute.routeData
                                                            .cellophane.path
                                                    )
                                                }
                                            >
                                                {Localization.cellophane}
                                            </li>
                                            <li
                                                className="item"
                                                onClick={() =>
                                                    this.props.history?.push(
                                                        AppRoute.routeData.bag
                                                            .path
                                                    )
                                                }
                                            >
                                                {Localization.bag}
                                            </li>
                                            <li
                                                className="item"
                                                onClick={() =>
                                                    this.props.history?.push(
                                                        AppRoute.routeData
                                                            .shrink.path
                                                    )
                                                }
                                            >
                                                {Localization.shrink}
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="item">
                                        {Localization.spare_car_for_cars}
                                        <ul className="sub-menu">
                                            <li
                                                className="item"
                                                onClick={() =>
                                                    this.props.history?.push(
                                                        AppRoute.routeData
                                                            .seat_cover.path
                                                    )
                                                }
                                            >
                                                {Localization.seat_cover}
                                            </li>
                                            <li
                                                className="item"
                                                onClick={() =>
                                                    this.props.history?.push(
                                                        AppRoute.routeData
                                                            .feethold.path
                                                    )
                                                }
                                            >
                                                {Localization.feethold}
                                            </li>
                                            <li
                                                className="item"
                                                onClick={() =>
                                                    this.props.history?.push(
                                                        AppRoute.routeData
                                                            .steering_wheel_cover
                                                            .path
                                                    )
                                                }
                                            >
                                                {
                                                    Localization.steering_wheel_cover
                                                }
                                            </li>
                                            <li
                                                className="item"
                                                onClick={() =>
                                                    this.props.history?.push(
                                                        AppRoute.routeData
                                                            .painting_promask
                                                            .path
                                                    )
                                                }
                                            >
                                                {Localization.painting_promask}
                                            </li>
                                            <li
                                                className="item"
                                                onClick={() =>
                                                    this.props.history?.push(
                                                        AppRoute.routeData
                                                            .fender_cover.path
                                                    )
                                                }
                                            >
                                                {Localization.fender_cover}
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li className="item">
                                {Localization.about_us}
                                <ul className="sub-menu">
                                    <li
                                        className="item"
                                        onClick={() =>
                                            this.props.history?.push(
                                                AppRoute.routeData.company.path
                                            )
                                        }
                                    >
                                        {Localization.company}
                                    </li>
                                    <li
                                        className="item"
                                        onClick={() =>
                                            this.props.history?.push(
                                                AppRoute.routeData.customers
                                                    .path
                                            )
                                        }
                                    >
                                        {Localization.customers}
                                    </li>
                                </ul>
                            </li>
                            <li
                                className="item"
                                onClick={() =>
                                    this.props.history?.push(
                                        AppRoute.routeData.contact.path
                                    )
                                }
                            >
                                {Localization.contact}
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }

    private smartHeaderRendererFunction(): JSX.Element {
        return (
            <>
                <ProSidebar
                    toggled={false}
                    // onToggle={() => this.setState({ ...this.state, menuIsOpen: true })}
                    collapsed={this.state.menuIsOpen ? false : true}
                    // collapsed={false}
                    rtl={Store2.getState().internationalization.rtl}
                >
                    {this.state.menuIsOpen ? (
                        <>
                            <SidebarHeader className="h-100vh">
                                <Menu iconShape="round">
                                    <MenuItem
                                        onClick={() =>
                                            this.setState({
                                                ...this.state,
                                                menuIsOpen: false,
                                            })
                                        }
                                        icon={
                                            <i className="fa fa-times-circle-o text-danger"></i>
                                        }
                                    >
                                        {Localization.close}
                                    </MenuItem>
                                </Menu>
                                <Menu iconShape="round">
                                    <MenuItem
                                        icon={
                                            <i
                                                title={Localization.home}
                                                className="fa fa-home text-white"
                                            ></i>
                                        }
                                    >
                                        {Localization.home}
                                        <Link
                                            to={AppRoute.routeData.home.path}
                                        />
                                    </MenuItem>
                                    <SubMenu
                                        icon={
                                            <i
                                                title={Localization.products}
                                                className="fa fa-shopping-cart text-white"
                                            ></i>
                                        }
                                        title={Localization.products}
                                    >
                                        <SubMenu
                                            icon={
                                                <i
                                                    title={Localization.packing}
                                                    className="fa fa-cube text-white"
                                                ></i>
                                            }
                                            title={Localization.packing}
                                        >
                                            <MenuItem className="text-white">
                                                {Localization.cellophane}
                                                <Link
                                                    to={
                                                        AppRoute.routeData
                                                            .cellophane.path
                                                    }
                                                />
                                            </MenuItem>
                                            <MenuItem className="text-white">
                                                {Localization.bag}
                                                <Link
                                                    to={
                                                        AppRoute.routeData.bag
                                                            .path
                                                    }
                                                />
                                            </MenuItem>
                                            <MenuItem className="text-white">
                                                {Localization.shrink}
                                                <Link
                                                    to={
                                                        AppRoute.routeData
                                                            .shrink.path
                                                    }
                                                />
                                            </MenuItem>
                                        </SubMenu>
                                        <SubMenu
                                            icon={
                                                <i
                                                    title={
                                                        Localization.spare_car_for_cars
                                                    }
                                                    className="fa fa-cube text-white"
                                                ></i>
                                            }
                                            title={
                                                Localization.spare_car_for_cars
                                            }
                                        >
                                            <MenuItem className="text-white">
                                                {Localization.seat_cover}
                                                <Link
                                                    to={
                                                        AppRoute.routeData
                                                            .seat_cover.path
                                                    }
                                                />
                                            </MenuItem>
                                            <MenuItem className="text-white">
                                                {Localization.feethold}
                                                <Link
                                                    to={
                                                        AppRoute.routeData
                                                            .feethold.path
                                                    }
                                                />
                                            </MenuItem>
                                            <MenuItem className="text-white">
                                                {
                                                    Localization.steering_wheel_cover
                                                }
                                                <Link
                                                    to={
                                                        AppRoute.routeData
                                                            .steering_wheel_cover
                                                            .path
                                                    }
                                                />
                                            </MenuItem>
                                            <MenuItem className="text-white">
                                                {Localization.painting_promask}
                                                <Link
                                                    to={
                                                        AppRoute.routeData
                                                            .painting_promask
                                                            .path
                                                    }
                                                />
                                            </MenuItem>
                                            <MenuItem className="text-white">
                                                {Localization.fender_cover}
                                                <Link
                                                    to={
                                                        AppRoute.routeData
                                                            .fender_cover.path
                                                    }
                                                />
                                            </MenuItem>
                                        </SubMenu>
                                    </SubMenu>
                                    <SubMenu
                                        icon={
                                            <i
                                                title={Localization.about_us}
                                                className="fa fa-university text-white"
                                            ></i>
                                        }
                                        title={Localization.about_us}
                                    >
                                        <MenuItem
                                            icon={
                                                <i className="fa fa-industry text-white"></i>
                                            }
                                        >
                                            {Localization.company}
                                            <Link
                                                to={
                                                    AppRoute.routeData.company
                                                        .path
                                                }
                                            />
                                        </MenuItem>
                                        <MenuItem
                                            icon={
                                                <i className="fa fa-users text-white"></i>
                                            }
                                        >
                                            {Localization.customers}
                                            <Link
                                                to={
                                                    AppRoute.routeData.customers
                                                        .path
                                                }
                                            />
                                        </MenuItem>
                                    </SubMenu>
                                    <MenuItem
                                        icon={
                                            <i
                                                title={Localization.contact}
                                                className="fa fa-phone text-white"
                                            ></i>
                                        }
                                    >
                                        {Localization.contact}
                                        <Link
                                            to={AppRoute.routeData.contact.path}
                                        />
                                    </MenuItem>
                                    <SubMenu
                                        icon={
                                            <i
                                                title={
                                                    Localization.change_language
                                                }
                                                className="fa fa-language text-white"
                                            ></i>
                                        }
                                        title={Localization.change_language}
                                    >
                                        <MenuItem
                                            onClick={() =>
                                                this.changeLang({
                                                    rtl: false,
                                                    language: 'english',
                                                    flag: 'en',
                                                })
                                            }
                                            icon={
                                                <i className="fa fa-hand-o-right text-white"></i>
                                            }
                                        >
                                            {Localization.english}
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() =>
                                                this.changeLang({
                                                    rtl: true,
                                                    language: 'فارسی',
                                                    flag: 'fa',
                                                })
                                            }
                                            icon={
                                                <i className="fa fa-hand-o-left text-white"></i>
                                            }
                                        >
                                            {Localization.persian}
                                        </MenuItem>
                                    </SubMenu>
                                </Menu>
                                <Menu iconShape="round">
                                    <MenuItem
                                        icon={
                                            <i
                                                title={Localization.telegram}
                                                className="fa fa-telegram text-primary"
                                            ></i>
                                        }
                                    >
                                        <a
                                            href="https://t.me/deltaavision"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {Localization.telegram}
                                        </a>
                                    </MenuItem>
                                    <MenuItem
                                        icon={
                                            <i
                                                title={Localization.whatsapp}
                                                className="fa fa-whatsapp text-success"
                                            ></i>
                                        }
                                    >
                                        <a
                                            href="https://wa.me/989121993039"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {Localization.whatsapp}
                                        </a>
                                    </MenuItem>
                                    <MenuItem
                                        icon={
                                            <i
                                                title={Localization.instagram}
                                                className="fa fa-instagram text-danger"
                                            ></i>
                                        }
                                    >
                                        <a
                                            href="https://instagram.com/deltaavision?igshid=vikw0ihzqzvb"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {Localization.instagram}
                                        </a>
                                    </MenuItem>
                                </Menu>
                            </SidebarHeader>
                        </>
                    ) : undefined}
                </ProSidebar>
            </>
        );
    }

    protected bodyRendererFunction(): JSX.Element {
        return <></>;
    }

    private footerRendererFunction(): JSX.Element {
        return (
            <>
                <div className="footer pb-4">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-md-6 col-sm-12 column-1">
                                <h3
                                    onClick={() => {
                                        this.props.history?.push(
                                            AppRoute.routeData.company.path
                                        );
                                    }}
                                    className="font-weight-bold text-capitalize cursor-pointer text-white pt-3 pb-1 px-5"
                                >
                                    {Localization.text.about_our_company}
                                </h3>
                                <h5
                                    className="text-justify text-white cursor-pointer px-5"
                                    onClick={() => {
                                        this.props.history?.push(
                                            AppRoute.routeData.company.path
                                        );
                                    }}
                                >
                                    {Localization.text.footer_text}
                                </h5>
                                <hr className="mx-5" />
                                <div className="d-flex justify-content-center">
                                    <div
                                        className="text-center cursor-pointer description-for-link"
                                        onClick={() => {
                                            this.props.history?.push(
                                                AppRoute.routeData.customers
                                                    .path
                                            );
                                        }}
                                    >
                                        {Localization.text.our_custumer}
                                    </div>
                                    <div
                                        className="text-center cursor-pointer description-for-link"
                                        onClick={() => {
                                            this.props.history?.push(
                                                AppRoute.routeData.contact.path
                                            );
                                        }}
                                    >
                                        {Localization.text.contact_us}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12 column-2">
                                <h3
                                    onClick={() => {
                                        this.props.history?.push(
                                            AppRoute.routeData.contact.path
                                        );
                                    }}
                                    className="font-weight-bold text-capitalize cursor-pointer text-white pt-3 pb-1 px-5"
                                >
                                    {Localization.text.address}
                                </h3>
                                <h5
                                    className="text-justify text-white cursor-pointer px-5"
                                    onClick={() => {
                                        this.props.history?.push(
                                            AppRoute.routeData.contact.path
                                        );
                                    }}
                                >
                                    {Localization.text.company_address}
                                </h5>
                                <h3
                                    onClick={() => {
                                        this.props.history?.push(
                                            AppRoute.routeData.contact.path
                                        );
                                    }}
                                    className="font-weight-bold text-capitalize cursor-pointer text-white py-1 px-5"
                                >
                                    {Localization.text.contact_info}
                                </h3>
                                <h5
                                    className="text-justify text-white cursor-pointer px-5"
                                    onClick={() => {
                                        this.props.history?.push(
                                            AppRoute.routeData.contact.path
                                        );
                                    }}
                                >
                                    {Localization.text.company_tel}
                                </h5>
                            </div>
                        </div>
                    </div>
                    <hr className="mx-5 my-4" />
                    <div className="social-media mx-5">
                        <div className="d-flex justify-content-center">
                            <a
                                href="https://t.me/deltaavision"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa fa-telegram fa-2x text-primary"></i>
                            </a>
                            <a
                                href="https://wa.me/989121993039"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mx-5"
                            >
                                <i className="fa fa-whatsapp fa-2x text-success"></i>
                            </a>
                            <a
                                href="https://instagram.com/deltaavision?igshid=vikw0ihzqzvb"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fa fa-instagram fa-2x text-danger"></i>
                            </a>
                        </div>
                    </div>
                    <hr className="mx-5 my-4" />
                    <div className="mx-5 text-center text-white">
                        {Localization.text.copy_right}
                    </div>
                </div>
            </>
        );
    }

    render() {
        return (
            <>
                {!this.state.menuIsOpen ? (
                    <>
                        <div
                            className="toggle-wrapeer"
                            onClick={() =>
                                this.setState({
                                    ...this.state,
                                    menuIsOpen: true,
                                })
                            }
                        >
                            <i className="fa fa-bars mx-1"></i>
                            {Localization.menu}
                        </div>
                    </>
                ) : undefined}
                {!this.state.menuIsOpen
                    ? undefined
                    : this.smartHeaderRendererFunction()}
                {this.headerRendererFunction()}
                <div
                    className="content-wrapper m-0 p-0"
                    onClick={() =>
                        this.setState({ ...this.state, menuIsOpen: false })
                    }
                >
                    {this.bodyRendererFunction()}
                    {this.footerRendererFunction()}
                </div>
            </>
        );
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language,
    };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {
        changeLanguage: (payload: TInternationalization) =>
            dispatch(action_change_app_flag(payload)),
    };
};
export const MainStructure = connect(
    state2props,
    dispatch2props
)(MainStructureComponent);
