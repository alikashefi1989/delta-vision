import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FormikProps } from "formik";
import * as Yup from "yup";
import BaseSave, { IPropsBaseSave, IStateBaseSave } from '../../_base/BaseSave/BaseSave';
import { IDocAcc, TDocAccCreate, TDocAccUpdate } from '../../../../model/docAcc.model';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { DocAccService } from '../../../../service/docAcc.service';

interface IDocAccForm {
}

interface IState extends IStateBaseSave<IDocAcc> {
    formData: IDocAccForm;
}
interface IProps extends IPropsBaseSave {
}

class DocAccSaveComponent extends BaseSave<
    IDocAcc, TDocAccCreate, TDocAccUpdate,
    IProps, IState> {

    state: IState = {
        ...this.baseState,
        formData: {},
    };

    protected _entityService = new DocAccService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.docAcc;

    protected formValidation = Yup.object/* <IDocAccForm> */({
    });

    protected form2CreateModel(form: IDocAccForm): TDocAccCreate {
        return {
        };
    }
    protected form2UpdateModel(form: IDocAccForm): TDocAccUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IDocAcc): IDocAccForm {
        return {
        };
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return <div className="row"><div className="col-12">docAccount save</div></div>
    }

}

const state2props = (state: redux_state) => {
    return {
        internationalization: state.internationalization,
        language: state.language
    }
}
const dispatch2props = (dispatch: Dispatch) => { return {} }
export const DocAccSave = connect(state2props, dispatch2props)(DocAccSaveComponent);