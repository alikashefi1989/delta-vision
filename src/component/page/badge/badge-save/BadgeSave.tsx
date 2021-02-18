import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FormikProps } from "formik";
import * as Yup from "yup";
import BaseSave, { IPropsBaseSave, IStateBaseSave } from '../../_base/BaseSave/BaseSave';
import { IBadge, TBadgeCreate, TBadgeUpdate } from '../../../../model/badge.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { BadgeService } from '../../../../service/badge.service';

interface IBadgeForm {
}

interface IState extends IStateBaseSave<IBadge> {
    formData: IBadgeForm;
}
interface IProps extends IPropsBaseSave {
}

class BadgeSaveComponent extends BaseSave<
    IBadge, TBadgeCreate, TBadgeUpdate,
    IProps, IState> {

    state: IState = {
        ...this.baseState,
        formData: {},
    };

    protected _entityService = new BadgeService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.badge;

    protected formValidation = Yup.object/* <IBadgeForm> */({
    });

    protected form2CreateModel(form: IBadgeForm): TBadgeCreate {
        return {
        };
    }
    protected form2UpdateModel(form: IBadgeForm): TBadgeUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IBadge): IBadgeForm {
        return {
        };
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return <div className="row"><div className="col-12">badge save</div></div>
    }

}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language
    }
}
const dispatch2props = (dispatch: Dispatch) => { return {} }
export const BadgeSave = connect(state2props, dispatch2props)(BadgeSaveComponent);