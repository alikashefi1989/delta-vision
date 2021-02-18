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
    IAdjustment,
    TAdjustmentCreate,
    TAdjustmentUpdate,
} from '../../../../model/adjustment.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { AdjustmentService } from '../../../../service/adjustment.service';

interface IAdjustmentForm {}

interface IState extends IStateBaseSave<IAdjustment> {
    formData: IAdjustmentForm;
}
interface IProps extends IPropsBaseSave {}

class AdjustmentSaveComponent extends BaseSave<
    IAdjustment,
    TAdjustmentCreate,
    TAdjustmentUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        formData: {},
    };

    protected _entityService = new AdjustmentService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.adjustment;

    protected formValidation = Yup.object(/* <IAdjustmentForm> */ {});

    protected form2CreateModel(form: IAdjustmentForm): TAdjustmentCreate {
        return {};
    }
    protected form2UpdateModel(form: IAdjustmentForm): TAdjustmentUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IAdjustment): IAdjustmentForm {
        return {};
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return (
            <div className="row">
                <div className="col-12">adjustment save</div>
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
export const AdjustmentSave = connect(
    state2props,
    dispatch2props
)(AdjustmentSaveComponent);
