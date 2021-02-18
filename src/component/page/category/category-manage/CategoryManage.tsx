// import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import {
    ICategory,
    TCategoryCreate,
    TCategoryUpdate,
} from '../../../../model/category.model';
import { CategoryService } from '../../../../service/category.service';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import BaseManage, {
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IState extends IStateBaseManage<ICategory> {
    // toggleActiveModal: {
    //     show: boolean;
    //     loader: boolean;
    // };
}
interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class CategoryManageComponent extends BaseManage<
    ICategory,
    TCategoryCreate,
    TCategoryUpdate,
    IProps,
    IState
> {
    state: IState = {
        // toggleActiveModal: {
        //     show: false,
        //     loader: false
        // },
        ...this.baseState,
    };

    // private returnParentCategoryName(category: any): string {
    //     if (category &&
    //         category.name &&
    //         category.name[this.defaultLangCode] &&
    //         typeof category.name[this.defaultLangCode] === 'string') {
    //         return category.name[this.defaultLangCode] || '';
    //     } else {
    //         return '';
    //     }
    // }

    // private returnSubCategories(subCategories: any): JSX.Element | Array<JSX.Element> {
    //     if (Array.isArray(subCategories) === false) {
    //         return <></>;
    //     } else {
    //         return subCategories.map((item: any) => {
    //             return <>{
    //                 (item && item.name && item.name[this.defaultLangCode] &&
    //                     typeof item.name[this.defaultLangCode] === 'string')
    //                     ?
    //                     <span className="badge badge-secondary mx-1">
    //                         {item.name[this.defaultLangCode]}
    //                     </span>
    //                     :
    //                     <></>
    //             }</>
    //         })
    //     }
    // }

    // private returnAttributes(attributes: any): JSX.Element | Array<JSX.Element> {
    //     if (Array.isArray(attributes) === false) {
    //         return <></>;
    //     } else {
    //         return attributes.map((item: any) => {
    //             return <>{
    //                 (item && item[this.defaultLangCode] && typeof item[this.defaultLangCode] === 'string')
    //                     ?
    //                     <span className="badge badge-secondary mx-1">
    //                         {item[this.defaultLangCode]}
    //                     </span>
    //                     :
    //                     <></>
    //             }</>
    //         })
    //     }
    // }

    protected _entityService = new CategoryService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.category;
    protected titleBaseCRUD = Localization.category;

    async componentDidMount() {
        // if (!this.props.language.defaultLanguage?.id) {
        //     this.goToLanguageManage();
        //     setTimeout(() => {
        //         this.toastNotify(Localization.msg.ui.no_default_lang_create, { autoClose: Setup.notify.timeout.warning }, 'warn');
        //     }, 300);
        //     return;
        // }
        // this.fetchData();
        // this.fetchFilters();

        await this.handlChangeLazyLoad(true);
        await this.fetchData();
        this.fetchFilters();
        this.fetchColumns();
        this.checkScrollEnded();
    }

    protected filterOutspread() {
        const filterOutspread = this.state.filterOutspread;
        if (filterOutspread.nameStartWith !== '') {
            return {
                [`name.${this.defaultLangCode}`]: {
                    $regex: `^${filterOutspread.nameStartWith}`,
                    $options: 'i',
                },
            };
        }
    }

    // private toggleActiveModalOnHide() {
    //     this._chosenRow = undefined;
    //     this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, show: false } });
    // }
    // private toggleActiveModalOnShow(row: ICategory) {
    //     this._chosenRow = row;
    //     this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, show: true } });
    // }

    // private async toggleActiveRow() {
    //     // debugger;
    //     if (this._chosenRow === undefined) return;
    //     const isActive: boolean = !this._chosenRow.isActive;

    //     this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: true } });
    //     try {
    //         // const res =
    //         await this._entityService.setActivation(this._chosenRow.id, isActive);
    //         this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: false, show: false } });
    //         this.fetchData();
    //     } catch (e) {
    //         this.setState({ toggleActiveModal: { ...this.state.toggleActiveModal, loader: false } });
    //         this.handleError({ error: e.response, toastOptions: { toastId: 'toggleActiveRow_error' } });
    //     }
    // }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    // private appGridRowActionToggleActiveRender(row: ICategory) {
    //     if (row.isActive)
    //         return <li className="list-group-item list-group-item-action text-warning" onClick={() => this.toggleActiveModalOnShow(row)}>
    //             <i className="icon fa fa-times"></i><span className="text">{Localization.inactive}</span>
    //         </li>
    //     else
    //         return <li className="list-group-item list-group-item-action text-success" onClick={() => this.toggleActiveModalOnShow(row)}>
    //             <i className="icon fa fa-check"></i><span className="text">{Localization.active}</span>
    //         </li>
    // }
    // protected appGridRowActionsRender(row: ICategory, index: number) {
    //     return (
    //         <Popover
    //             id={`grid-action-menu-popover-${index}`}
    //             className="popper-action-menu-wrapper"
    //         >
    //             <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
    //                 <ul className="list-group list-group-flush">
    //                     {this.appGridRowActionViewRender(row)}
    //                     {this.appGridRowActionUpdateRender(row)}
    //                     {this.appGridRowActionCopyRender(row)}
    //                     {this.appGridRowActionRemoveRender(row)}
    //                     {/* {this.appGridRowActionToggleActiveRender(row)} */}
    //                 </ul>
    //             </Popover.Content>
    //         </Popover>
    //     );
    // }

    protected removeModalInfoLabel(chosenRow?: ICategory): string | undefined {
        return chosenRow?.name[this.defaultLangCode];
    }
}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language,
    };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const CategoryManage = connect(
    state2props,
    dispatch2props
)(CategoryManageComponent);
