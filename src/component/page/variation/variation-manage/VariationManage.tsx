import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Setup, TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { AppRoute } from '../../../../config/route';
import { IVariation, TVariationCreate, TVariationUpdate } from '../../../../model/variation.model';
import { VariationService } from '../../../../service/variation.service';
import { ConfirmNotify } from '../../../form/confirm-notify/ConfirmNotify';
import { Popover } from 'react-bootstrap';
import { CmpUtility } from '../../../_base/CmpUtility';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { VARIATION_TYPE } from '../../../../enum/variation-type.enum';
import TopBarProgress from 'react-topbar-progress-indicator';
import { APP_FILTER_FORM_CONTROL, FilterFormControl } from '../../../form/_formik/_filters/FilterFormControl/FilterFormControl';
import BaseManage, { IStateBaseManage } from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IState extends IStateBaseManage<IVariation> {
    toggleActiveModal: {
        show: boolean;
        loader: boolean;
    };
}
interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class VariationManageComponent extends BaseManage<
    IVariation, TVariationCreate, TVariationUpdate,
    IProps, IState
    > {

    state: IState = {
        toggleActiveModal: {
            show: false,
            loader: false
        },
        ...this.baseState
    };

    columns = [
        {
            Header: 'name',
            accessor: `name.${this.defaultLangCode}`,
            title: 'name',
            Cell: (cell: any) => {
                return <span className="text-primary cursor-pointer"
                    onClick={() => this.goToView(cell.row.original.id)}
                    title={Localization.view}
                >{cell.row.original.name[this.defaultLangCode]}</span>
            },
            minWidth: 100
        },
        {
            Header: 'type',
            accessor: 'type',
            Cell: (cell: any) => {
                return <span className="">
                    {Localization.variation_type[this.variationTypeByNumberReturn(cell.row.original.type)]}
                </span>
            },
            minWidth: 100
        },
        ...this.baseColumns
    ];

    protected _entityService = new VariationService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.variation;

    componentDidMount() {
        if (!this.props.language.defaultLanguage?.id) {
            this.goToLanguageManage();
            setTimeout(() => {
                this.toastNotify(Localization.msg.ui.no_default_lang_create, { autoClose: Setup.notify.timeout.warning }, 'warn');
            }, 300);
            return;
        }
        this.fetchData();
    }

    private variationTypeByNumberReturn(num: number): VARIATION_TYPE {
        if (num === 0) {
            return VARIATION_TYPE.STRING;
        } else if (num === 1) {
            return VARIATION_TYPE.NUMBER;
        } else if (num === 2) {
            return VARIATION_TYPE.COLOR;
        } else {
            return VARIATION_TYPE.SIZE;
        }
    }

    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    private toggleActiveModalOnHide() {
        this._chosenRow = undefined;
        this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, show: false } });
    }
    private toggleActiveModalOnShow(row: IVariation) {
        this._chosenRow = row;
        this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, show: true } });
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

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private appGridRowActionToggleActiveRender(row: IVariation) {
        if (row.isActive)
            return <li className="list-group-item list-group-item-action text-warning" onClick={() => this.toggleActiveModalOnShow(row)}>
                <i className="icon fa fa-times"></i><span className="text">{Localization.inactive}</span>
            </li>
        else
            return <li className="list-group-item list-group-item-action text-success" onClick={() => this.toggleActiveModalOnShow(row)}>
                <i className="icon fa fa-check"></i><span className="text">{Localization.active}</span>
            </li>
    }
    protected appGridRowActionsRender(row: IVariation, index: number) {
        return <Popover id={`grid-action-menu-popover-${index}`} className="popper-action-menu-wrapper" >
            <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
                <ul className="list-group list-group-flush">
                    {this.appGridRowActionViewRender(row)}
                    {this.appGridRowActionUpdateRender(row)}
                    {this.appGridRowActionCopyRender(row)}
                    {this.appGridRowActionRemoveRender(row)}
                    {this.appGridRowActionToggleActiveRender(row)}
                </ul>
            </Popover.Content>
        </Popover>
    }

    protected filter() {
        // let filter = { ...this.state.filter };
        // const fv = this.state.filterVisibility;
        // Object.keys(fv).forEach(v => {
        //     if (fv[v] === false) delete filter[v];
        // });
        let filter = super.filter();

        const filterOutspread = this.state.filterOutspread;
        if (filterOutspread.nameStartWith !== '') {
            filter = { $and: [filter, { [`name.${this.defaultLangCode}`]: { $regex: `^${filterOutspread.nameStartWith}`, $options: 'i' } }] };
        }
        return filter;
    }

    // protected filter2Form(filterValues: Object): Object {
    //     const v: any = { ...filterValues };
    //     const nameDefault = Object.keys(v).find(k => k.includes('name.'));
    //     if (nameDefault) {
    //         v[`name__${this.defaultLangCode}`] = v[nameDefault];
    //         delete v[nameDefault];
    //     }
    //     return v;
    // }
    // protected form2Filter(formValues: Object): Object {
    //     const v: any = { ...formValues };
    //     const nameDefault = Object.keys(v).find(k => k.includes('name__'));
    //     if (nameDefault) {
    //         v[`name.${this.defaultLangCode}`] = v[nameDefault];
    //         delete v[nameDefault];
    //     }
    //     return v;
    // }

    protected pageManageSidebarBody() {
        return <>
            <div className="row">
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_TEXT}
                        name={`name${this._F2FSymbol}${this.defaultLangCode}`}
                        // label={'name'}
                        controlClassName="ml-2"
                    />,
                    `name${this._F2FSymbol}${this.defaultLangCode}`,
                    'name'
                )}
                {this.filterRender(
                    <FilterFormControl
                        control={APP_FILTER_FORM_CONTROL.FILTER_SELECT}
                        name={"type"}
                        // label={'activation'}
                        options={[
                            { label: 'string', value: 0 },
                            { label: 'number', value: 1 },
                            { label: 'color', value: 2 },
                            { label: 'size', value: 3 },
                        ]}
                        controlClassName="ml-2"
                    />,
                    'type',
                    'type'
                )}
            </div>
            {super.pageManageSidebarBody()}
        </>
    }

    render() {
        return (
            <>
                {this.pageManageWrapper()}

                <ConfirmNotify
                    confirmBtn_className="text-danger"
                    confirmBtn_text={() => <span className="btn-- text-danger">{Localization.remove}</span>}
                    msgFunc={() => {
                        if (this._chosenRow === undefined) return <></>;
                        return <>
                            <div className="text-info mb-2">{this._chosenRow.name[this.defaultLangCode]}</div>
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
                    msgFunc={() => {
                        if (this._chosenRow === undefined) return <></>;
                        return <>
                            <div className="text-info mb-2--">{this._chosenRow.name[this.defaultLangCode]}</div>
                        </>
                    }}
                    show={this.state.toggleActiveModal.show}
                    btnLoader={this.state.toggleActiveModal.loader}
                    onHide={() => this.toggleActiveModalOnHide()}
                    onConfirm={() => this.toggleActiveRow()}
                />

                <ToastContainer {...this.getNotifyContainerConfig()} />
                {this.state.gridLoading && <TopBarProgress />}
            </>
        )
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language
    }
}
const dispatch2props = (dispatch: Dispatch) => { return {} }
export const VariationManage = connect(state2props, dispatch2props)(VariationManageComponent);