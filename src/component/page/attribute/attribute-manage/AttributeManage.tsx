import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
// import { AppRoute } from '../../../../config/route';
import {
    IAttribute,
    TAttributeCreate,
    TAttributeUpdate,
} from '../../../../model/attribute.model';
import { AttributeService } from '../../../../service/attribute.service';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import BaseManage, {
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IState extends IStateBaseManage<IAttribute> {}
interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class AttributeManageComponent extends BaseManage<
    IAttribute,
    TAttributeCreate,
    TAttributeUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new AttributeService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.attribute;
    protected titleBaseCRUD = Localization.attribute;

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

    // private goToLanguageManage() {
    //     this.navigate(AppRoute.routeData.language.manage.url());
    // }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    // protected appGridRowActionsRender(row: IAttribute, index: number) {
    //     return <Popover id={`grid-action-menu-popover-${index}`} className="popper-action-menu-wrapper" >
    //         <Popover.Content onClick={() => CmpUtility.dismissPopover()}>
    //             <ul className="list-group list-group-flush">
    //                 {this.appGridRowActionViewRender(row)}
    //                 {this.appGridRowActionUpdateRender(row)}
    //                 {this.appGridRowActionCopyRender(row)}
    //                 {this.appGridRowActionRemoveRender(row)}
    //                 {/* {this.appGridRowActionToggleActiveRender(row)} */}
    //             </ul>
    //         </Popover.Content>
    //     </Popover>
    // }

    // protected filter() {
    //     // let filter = { ...this.state.filter };
    //     // const fv = this.state.filterVisibility;
    //     // Object.keys(fv).forEach(v => {
    //     //     if (fv[v] === false) delete filter[v];
    //     // });
    //     let filter = super.filter();

    //     const filterOutspread = this.state.filterOutspread;
    //     if (filterOutspread.nameStartWith !== '') {
    //         filter = { $and: [filter, { [`name.${this.defaultLangCode}`]: { $regex: `^${filterOutspread.nameStartWith}`, $options: 'i' } }] };
    //     }
    //     return filter;
    // }

    protected removeModalInfoLabel(chosenRow?: IAttribute): string | undefined {
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
export const AttributeManage = connect(
    state2props,
    dispatch2props
)(AttributeManageComponent);
