import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FormikProps } from 'formik';
import * as Yup from 'yup';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
} from '../../_base/BaseSave/BaseSave';
import {
    IOrder,
    TOrderCreate,
    TOrderUpdate,
} from '../../../../model/order.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { OrderService } from '../../../../service/order.service';

interface IOrderForm {}

interface IState extends IStateBaseSave<IOrder> {
    formData: IOrderForm;
}
interface IProps extends IPropsBaseSave {}

class OrderSaveComponent extends BaseSave<
    IOrder,
    TOrderCreate,
    TOrderUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        formData: {},
    };

    protected _entityService = new OrderService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.order;

    protected formValidation = Yup.object(/* <IOrderForm> */ {});

    protected form2CreateModel(form: IOrderForm): any {
        return {};
    }
    protected form2UpdateModel(form: IOrderForm): TOrderUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IOrder): IOrderForm {
        return {};
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return (
            <div className="row">
                <div className="col-12">order save</div>
            </div>
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
    return {};
};
export const OrderSave = connect(
    state2props,
    dispatch2props
)(OrderSaveComponent);
