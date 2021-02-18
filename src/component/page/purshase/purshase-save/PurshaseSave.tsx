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
    IPurshase,
    TPurshaseCreate,
    TPurshaseUpdate,
} from '../../../../model/purshase.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { PurshaseService } from '../../../../service/purshase.service';

interface IPurshaseForm {}

interface IState extends IStateBaseSave<IPurshase> {
    formData: IPurshaseForm;
}
interface IProps extends IPropsBaseSave {}

class PurshaseSaveComponent extends BaseSave<
    IPurshase,
    TPurshaseCreate,
    TPurshaseUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        formData: {},
    };

    protected _entityService = new PurshaseService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.purshase;

    protected formValidation = Yup.object(/* <IPurshaseForm> */ {});

    protected form2CreateModel(form: IPurshaseForm): TPurshaseCreate {
        return {};
    }
    protected form2UpdateModel(form: IPurshaseForm): TPurshaseUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IPurshase): IPurshaseForm {
        return {};
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return (
            <div className="row">
                <div className="col-12">purshase save</div>
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
export const PurshaseSave = connect(
    state2props,
    dispatch2props
)(PurshaseSaveComponent);
