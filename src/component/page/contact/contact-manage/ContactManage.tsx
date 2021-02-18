import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import BaseManage, {
    IPropsBaseManage,
    IStateBaseManage,
} from '../../_base/BaseManage/BaseManage';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { ContactService } from '../../../../service/contact.service';
import {
    IContact,
    TContactCreate,
    TContactUpdate,
} from '../../../../model/contact.model';

interface IState extends IStateBaseManage<IContact> {}

interface IProps extends IPropsBaseManage {}

class ContactManageComponent extends BaseManage<
    IContact,
    TContactCreate,
    TContactUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
    };

    protected _entityService = new ContactService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.contact;

    async componentDidMount() {
        this.handlChangeLazyLoad(true);
        this.fetchFilters();
        this.fetchColumns();
        await this.fetchData();
        this.checkScrollEnded();
    }

    protected removeModalInfoLabel(chosenRow?: IContact): string | undefined {
        return chosenRow?.name;
    }
}

const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization };
};
const dispatch2props = (dispatch: Dispatch) => {
    return {};
};
export const ContactManage = connect(
    state2props,
    dispatch2props
)(ContactManageComponent);
