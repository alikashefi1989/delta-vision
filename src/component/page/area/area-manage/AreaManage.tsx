import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import { IArea, TAreaCreate, TAreaUpdate } from '../../../../model/area.model';
import { AreaService } from '../../../../service/area.service';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import BaseManage, {
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IState extends IStateBaseManage<IArea> {}
interface IProps {
    internationalization: TInternationalization;
    language: ILanguage_schema;
}

class AreaManageComponent extends BaseManage<
    IArea,
    TAreaCreate,
    TAreaUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new AreaService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.area;
    protected titleBaseCRUD = Localization.area;

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

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
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

    // private appGridRowActionToggleActiveRender(row: IArea) {
    //     if (row.isActive)
    //         return <li className="list-group-item list-group-item-action text-warning" onClick={() => this.toggleActiveModalOnShow(row)}>
    //             <i className="icon fa fa-times"></i><span className="text">{Localization.inactive}</span>
    //         </li>
    //     else
    //         return <li className="list-group-item list-group-item-action text-success" onClick={() => this.toggleActiveModalOnShow(row)}>
    //             <i className="icon fa fa-check"></i><span className="text">{Localization.active}</span>
    //         </li>
    // }
    // protected appGridRowActionsRender(row: IArea, index: number) {
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

    protected removeModalInfoLabel(chosenRow?: IArea): string | undefined {
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
export const AreaManage = connect(
    state2props,
    dispatch2props
)(AreaManageComponent);
