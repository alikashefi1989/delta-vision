import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FormikProps } from "formik";
import * as Yup from "yup";
import BaseSave, { IPropsBaseSave, IStateBaseSave } from '../../_base/BaseSave/BaseSave';
import { ICoupon, TCouponCreate, TCouponUpdate } from '../../../../model/coupon.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { CouponService } from '../../../../service/coupon.service';

interface ICouponForm {
}

interface IState extends IStateBaseSave<ICoupon> {
    formData: ICouponForm;
}
interface IProps extends IPropsBaseSave {
}

class CouponSaveComponent extends BaseSave<
    ICoupon, TCouponCreate, TCouponUpdate,
    IProps, IState> {

    state: IState = {
        ...this.baseState,
        formData: {},
    };

    protected _entityService = new CouponService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.coupon;

    protected formValidation = Yup.object/* <ICouponForm> */({
    });

    protected form2CreateModel(form: ICouponForm): TCouponCreate {
        return {
        };
    }
    protected form2UpdateModel(form: ICouponForm): TCouponUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: ICoupon): ICouponForm {
        return {
        };
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return <div className="row"><div className="col-12">coupon save</div></div>
    }

}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language
    }
}
const dispatch2props = (dispatch: Dispatch) => { return {} }
export const CouponSave = connect(state2props, dispatch2props)(CouponSaveComponent);