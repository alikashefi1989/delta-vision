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
    IReturn,
    TReturnCreate,
    TReturnUpdate,
} from '../../../../model/return.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { ReturnService } from '../../../../service/return.service';

interface IReturnForm {}

interface IState extends IStateBaseSave<IReturn> {
    formData: IReturnForm;
}
interface IProps extends IPropsBaseSave {}

class ReturnSaveComponent extends BaseSave<
    IReturn,
    TReturnCreate,
    TReturnUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        formData: {},
    };

    protected _entityService = new ReturnService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.return;

    protected formValidation = Yup.object(/* <IReturnForm> */ {});

    protected form2CreateModel(form: IReturnForm): TReturnCreate {
        return {};
    }
    protected form2UpdateModel(form: IReturnForm): TReturnUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IReturn): IReturnForm {
        return {};
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return (
            <div className="row">
                <div className="col-12">return save</div>
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
export const ReturnSave = connect(
    state2props,
    dispatch2props
)(ReturnSaveComponent);
