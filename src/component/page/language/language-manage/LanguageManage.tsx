import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { TInternationalization } from '../../../../config/setup';
import { TAppColumn } from '../../../tool/AppGrid';
import { Localization } from '../../../../config/localization/localization';
import { ILanguage, TLanguageCreate, TLanguageUpdate } from '../../../../model/language.model';
import { LanguageService } from '../../../../service/language.service';
import { ConfirmNotify } from '../../../form/confirm-notify/ConfirmNotify';
import { Popover } from 'react-bootstrap';
import { DIRECTION } from '../../../../enum/direction.enum';
import { CmpUtility } from '../../../_base/CmpUtility';
import TopBarProgress from 'react-topbar-progress-indicator';
// import { Formik } from 'formik';
import { APP_FILTER_FORM_CONTROL, FilterFormControl } from '../../../form/_formik/_filters/FilterFormControl/FilterFormControl';
import BaseManage, { IStateBaseManage } from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { Row } from 'react-table';
import { TColumnsDetail } from '../../../tool/AppGrid/AppGridUtility';

interface IState extends IStateBaseManage<ILanguage> {
    // filter: Object;
    // filterOutspread: { nameStartWith: string; };
    setAsDefaultModal: {
        show: boolean;
        loader: boolean;
    };
    toggleActiveModal: {
        show: boolean;
        loader: boolean;
    };
}
interface IProps {
    internationalization: TInternationalization;
}

class LanguageManageComponent extends BaseManage<
    ILanguage, TLanguageCreate, TLanguageUpdate,
    IProps, IState
    > {

    state: IState = {
        // filterOutspread: this.filterOutspreadDefault,
        setAsDefaultModal: {
            show: false,
            loader: false
        },
        toggleActiveModal: {
            show: false,
            loader: false
        },
        // hiddenColumns: ['createdAt', 'updatedAt'],
        ...this.baseState,
        // filterVisibility: {
        //     name: true
        // },
    };

    columns_DELETE_ME: Array<TAppColumn<any>> = [
        {
            Header: 'name',
            accessor: 'name',
            Cell: (cell: any) => {
                return <span className="text-info cursor-pointer text-capitalize"
                    // onClick={() => this.goToView(cell.row.original.id)}
                    title={Localization.view}
                >{cell.row.original.name}</span>
            },
            minWidth: 100,
            // disableSortBy: true
        },
        {
            accessor: 'isActive',
            Header: 'is active',
            Cell: (cell: any) => {
                return cell.row.original.isActive ?
                    <span className="text-capitalize">yes</span> :
                    <span className="text-capitalize">no</span>
                // return <>{cell.row.original.isActive ?
                //     <i className="fa fa-check text-success"></i> :
                //     <i className="fa fa-times text-danger"></i>}</>
            },
            minWidth: 100,
            title: 'is active'
        },
        {
            Header: 'direction',
            accessor: 'direction',
            // disableResizing: true
            Cell: (cell: any) => {
                return <>{cell.row.original.direction === DIRECTION.LTR ?
                    <><i className="fa fa-align-left text-primary--" title={cell.row.original.direction}></i>
                        <span className="text-uppercase ml-2">{cell.row.original.direction}</span></> :
                    <><i className="fa fa-align-right text-info--" title={cell.row.original.direction}></i>
                        <span className="text-uppercase ml-2">{cell.row.original.direction}</span></>}</>
            },
            minWidth: 100
        },
        {
            Header: 'code',
            accessor: 'code',
            minWidth: 100
        },
        {
            accessor: 'isDefault',
            Header: 'is default',
            Cell: (cell: any) => {
                return cell.row.original.isDefault ?
                    <span className="text-capitalize">yes</span> :
                    <span className="text-capitalize">no</span>
                // return <>{cell.row.original.isDefault ?
                //     <i className="fa fa-star text-system"></i> :
                //     <i className="fa fa-star"></i>}</>
            },
            minWidth: 100,
            title: 'is default'
        },
        ...this.baseColumns
    ];
    columns: Array<TAppColumn<any>> = [];

    protected _entityService = new LanguageService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.language;

    // protected filter() {
    //     let filter = this.state.filter;
    //     const filterOutspread = this.state.filterOutspread;
    //     if (filterOutspread.nameStartWith !== 'all') {
    //         filter = { $and: [filter, { name: { $regex: `^${filterOutspread.nameStartWith}`, $options: 'i' } }] };
    //     }
    //     return filter;
    // }

    private toggleActiveModalOnHide() {
        this._chosenRow = undefined;
        this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, show: false } });
    }
    private toggleActiveModalOnShow(row: ILanguage) {
        this._chosenRow = row;
        this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, show: true } });
    }
    private setAsDefaultModalOnHide() {
        this._chosenRow = undefined;
        this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, show: false } });
    }
    private setAsDefaultModalOnShow(row: ILanguage) {
        this._chosenRow = row;
        this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, show: true } });
    }

    private async toggleActiveRow() {
        // debugger;
        if (this._chosenRow === undefined) return;
        const isActive: boolean = !this._chosenRow.isActive;

        this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: true } });
        try {
            // const res = 
            await this._entityService.setActivation(this._chosenRow.id, isActive);
            this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: false, show: false } });
            this.fetchData();
        } catch (e) {
            this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: false } });
            this.handleError({ error: e.response, toastOptions: { toastId: 'toggleActiveRow_error' } });
        }
    }
    private async setAsDefaultRow() {
        // debugger;
        if (this._chosenRow === undefined) return;

        this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, loader: true } });
        try {
            // const res = 
            await this._entityService.setAsDefault(this._chosenRow.id);
            this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, loader: false, show: false } });
            this.fetchData();
        } catch (e) {
            this.setState({ setAsDefaultModal: { ...this.state.setAsDefaultModal, loader: false } });
            this.handleError({ error: e.response, toastOptions: { toastId: 'setAsDefaultRow_error' } });
        }
    }

    private appGridRowActionToggleActiveRender(row: ILanguage) {
        if (row.isActive)
            return <li className="list-group-item list-group-item-action text-warning" onClick={() => this.toggleActiveModalOnShow(row)}>
                <i className="icon fa fa-times"></i><span className="text">{Localization.inactive}</span>
            </li>
        else
            return <li className="list-group-item list-group-item-action text-success" onClick={() => this.toggleActiveModalOnShow(row)}>
                <i className="icon fa fa-check"></i><span className="text">{Localization.active}</span>
            </li>
    }
    private appGridRowActionSetAsDefaultRender(row: ILanguage) {
        if (row.isDefault) return <></>;
        return <li className="list-group-item list-group-item-action text-system" onClick={() => this.setAsDefaultModalOnShow(row)}>
            <i className="icon fa fa-star"></i><span className="text">{Localization.set_as_default}</span>
        </li>
    }
    protected appGridRowActionsRender(row: ILanguage, index: number) {
        return <Popover id={`grid-action-menu-popover-${index}`} className="popper-action-menu-wrapper" >
            <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
                <ul className="list-group list-group-flush">
                    {this.appGridRowActionViewRender(row)}
                    {this.appGridRowActionUpdateRender(row)}
                    {this.appGridRowActionCopyRender(row)}
                    {this.appGridRowActionRemoveRender(row)}
                    {this.appGridRowActionToggleActiveRender(row)}
                    {this.appGridRowActionSetAsDefaultRender(row)}
                </ul>
            </Popover.Content>
        </Popover>
    }

    protected pageManageSidebarBody_DELETE_ME() {
        return <>
            <div className="row">
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_TEXT}
                        name={"name"}
                        // label={'name'}
                        controlClassName="ml-2"
                    />,
                    'name',
                    'name'
                )}
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_TEXT}
                        name={"code"}
                        // label={'code'}
                        controlClassName="ml-2"
                    />,
                    'code',
                    'code'
                )}
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_SELECT}
                        name={"isActive"}
                        // label={'activation'}
                        options={[
                            { label: 'active', value: true },
                            { label: 'inactive', value: false },
                        ]}
                        controlClassName="ml-2"
                    />,
                    'isActive',
                    'activation'
                )}
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_SELECT}
                        name={"isDefault"}
                        // label={'default'}
                        options={[
                            { label: 'true', value: true },
                            { label: 'false', value: false },
                        ]}
                        controlClassName="ml-2"
                    />,
                    'isDefault',
                    'default'
                )}
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_SELECT}
                        name={"direction"}
                        // label={'direction'}
                        options={[
                            { label: 'ltr', value: 'ltr' },
                            { label: 'rtl', value: 'rtl' },
                        ] as any}
                        controlClassName="ml-2"
                    />,
                    'direction', 'direction'
                )}
            </div>
            {super.pageManageSidebarBody()}
        </>
    }

    protected AppGridColumnsDetail(): TColumnsDetail {
        return { Cell: p => <span></span> };
    }
    protected gridOnRowClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: Row<any>) {
    }

    render() {
        return (
            <>
                {this.pageManageWrapper()}

                <ConfirmNotify
                    confirmBtn_className="text-danger"
                    confirmBtn_text={() => <span className="btn-- text-danger">{Localization.remove}</span>}
                    // msg={Localization.msg.ui.item_will_be_removed_continue}
                    msgFunc={() => {
                        if (this._chosenRow === undefined) return <></>;
                        return <>
                            <div className="text-info mb-2">{this._chosenRow.name}</div>
                            <div>{Localization.msg.ui.item_will_be_removed_continue}</div>
                        </>
                    }}
                    show={this.state.removeModal.show}
                    btnLoader={this.state.removeModal.loader}
                    onHide={() => this.removeModalOnHide()}
                    onConfirm={() => this.removeRow()}
                />

                <ConfirmNotify
                    confirmBtn_className="text-warning"
                    confirmBtn_text={() => <span className="btn-- text-warning">{this._chosenRow?.isActive ? Localization.inactive : Localization.active}</span>}
                    // msg={Localization.msg.ui.item_will_be_removed_continue}
                    msgFunc={() => {
                        if (this._chosenRow === undefined) return <></>;
                        return <>
                            <div className="text-info mb-2--">{this._chosenRow.name}</div>
                            {/* <div>{Localization.msg.ui.item_will_be_removed_continue}</div> */}
                            {/* <div>item_will_be_activated_continue</div> */}
                        </>
                    }}
                    show={this.state.toggleActiveModal.show}
                    btnLoader={this.state.toggleActiveModal.loader}
                    onHide={() => this.toggleActiveModalOnHide()}
                    onConfirm={() => this.toggleActiveRow()}
                />

                <ConfirmNotify
                    confirmBtn_className="text-system"
                    confirmBtn_text={() => <span className="btn-- text-system">{Localization.set_as_default}</span>}
                    // msg={Localization.msg.ui.item_will_be_removed_continue}
                    msgFunc={() => {
                        if (this._chosenRow === undefined) return <></>;
                        return <>
                            <div className="text-info mb-2--">{this._chosenRow.name}</div>
                            {/* <div>item_will_be_default_continue</div> */}
                        </>
                    }}
                    show={this.state.setAsDefaultModal.show}
                    btnLoader={this.state.setAsDefaultModal.loader}
                    onHide={() => this.setAsDefaultModalOnHide()}
                    onConfirm={() => this.setAsDefaultRow()}
                />

                <ToastContainer {...this.getNotifyContainerConfig()} />
                {this.state.gridLoading && <TopBarProgress />}
            </>
        )
    }
}

const state2props = (state: redux_state) => { return { internationalization: state.internationalization, } }
const dispatch2props = (dispatch: Dispatch) => { return {} }
export const LanguageManage = connect(state2props, dispatch2props)(LanguageManageComponent);