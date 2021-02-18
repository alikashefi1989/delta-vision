import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { FormControl, APP_FORM_CONTROL } from "../../../form/_formik/FormControl/FormControl";
import { Localization } from '../../../../config/localization/localization';
import { FormikProps } from "formik";
import { LanguageService } from '../../../../service/language.service';
import { ILanguage, ILanguageNCS, TLanguageCreate, TLanguageUpdate } from '../../../../model/language.model';
import * as Yup from "yup";
import BaseSave, { IPropsBaseSave, IStateBaseSave, SAVE_PAGE_MODE } from '../../_base/BaseSave/BaseSave';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface ILanguageLabelValue { label: string, value: ILanguageNCS }

interface ILanguageForm {
    language: ILanguageLabelValue | null;
}

interface IState extends IStateBaseSave<ILanguage> {
    formData: ILanguageForm;
    languageOptions: Array<ILanguageLabelValue>;
}
interface IProps extends IPropsBaseSave { }

class LanguageSaveComponent extends BaseSave<
    ILanguage, TLanguageCreate, TLanguageUpdate,
    IProps, IState
    > {

    state: IState = {
        ...this.baseState,
        formData: {
            language: null,
        },
        languageOptions: []
    };

    protected _entityService = new LanguageService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.language;

    protected formValidation = Yup.object/* <ILanguageForm> */({
        language: Yup.object().shape({ label: Yup.string(), value: Yup.object() }).nullable().required(Localization.validation.required_field),
    });

    componentDidMount() {
        this.fetchLanguageList();
        super.componentDidMount();
    }

    private languageLabelValue(language: ILanguageNCS): { label: ILanguageNCS['name'], value: ILanguageNCS } {
        return { label: language.name, value: language };
    }
    private async fetchLanguageList() {
        try {
            const list = await this._entityService.languageList();
            const languageOptions = list.data.data.items.map(item => this.languageLabelValue(item));
            const code = this.state.fetchData?.identifier; // code
            const languageLabelValue = code ? this.languageLabelValueByCode(code, languageOptions) : undefined;
            const language = languageLabelValue || this.state.formData.language;

            this.setState((s) => ({ ...s, languageOptions, formData: { ...this.state.formData, language } }))
        } catch (e) {
            this.handleError({ error: e.response, toastOptions: { toastId: 'fetchLanguageList_error' } });
        }
    }

    private languageLabelValueByCode(code: string, languageOptions: Array<ILanguageLabelValue>): ILanguageLabelValue | undefined {
        const filtered = languageOptions.filter(c => c.value.identifier.toLocaleLowerCase().includes(code.toLocaleLowerCase()));
        return filtered.length ? filtered[0] : undefined;
    }

    protected form2CreateModel(form: ILanguageForm): TLanguageCreate {
        const lang = form.language!;
        return {
            name: lang.value.name,
            identifier: lang.value.identifier,
            direction: lang.value.direction
        };
    }
    protected form2UpdateModel(form: ILanguageForm): TLanguageUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: ILanguage): ILanguageForm {
        const languageLabelValue = this.languageLabelValueByCode(data.identifier, this.state.languageOptions);
        return {
            language: languageLabelValue ? languageLabelValue : null,
        };
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return <div className="row">
            <div className="col-md-4">
                <FormControl<ILanguageForm>
                    className="app-select"
                    control={APP_FORM_CONTROL.SELECT}
                    name="language"
                    placeholder={Localization.language}
                    label={Localization.language}
                    required
                    isClearable={true}
                    options={this.state.languageOptions}
                    readOnly={this.state.savePageMode === SAVE_PAGE_MODE.VIEW}
                />
            </div>
        </div>
    }

}

const state2props = (state: redux_state) => { return { internationalization: state.internationalization, } }
const dispatch2props = (dispatch: Dispatch) => { return {} }
export const LanguageSave = connect(state2props, dispatch2props)(LanguageSaveComponent);
