import React from "react";
import { MapDispatchToProps, connect } from "react-redux";
import { Dispatch } from "redux";
import { redux_state } from "../../../../redux/app_state";
import { TInternationalization } from "../../../../config/setup";
import { Localization } from "../../../../config/localization/localization";
import Modal from "react-bootstrap/Modal";
import { ILanguage } from "../../../../model/language.model";
import { Formik, FormikProps } from "formik";
import { FormControl, APP_FORM_CONTROL } from "../../../form/_formik/FormControl/FormControl";
import * as Yup from "yup";

interface IProps {
    internationalization: TInternationalization;
    show: boolean;
    onHide: () => any;
    onConfirm: (v: { [key: string]: string }) => any;
    languagelist: Array<ILanguage>;
    defaultlangcode: string;
    value: { [key: string]: string };
    readOnly?: boolean;
    textareaRows?: number;
}

interface IState {
    value: { [key: string]: string };
}

interface MultiLangTextareaModalForm {
    [key: string]: string;
}

class MultiLangTextareaModalComponent extends React.Component<IProps, IState> {
    state = {
        value: this.convertOuter2Inner(this.props.value)
    };

    private convertOuter2Inner(v: { [key: string]: string }): { [key: string]: string } {
        const value = { ...v };
        delete value[this.props.defaultlangcode];
        return value;
    }
    private convertInner2Outer(v: { [key: string]: string }): { [key: string]: string } {
        const value = { ...v };
        value[this.props.defaultlangcode] = this.props.value[this.props.defaultlangcode] || '';
        return value;
    }

    componentDidUpdate(prevProps: IProps) {
        if (/* this.props.show && */ JSON.stringify(this.props.value) !== JSON.stringify(prevProps.value)) {
            if (JSON.stringify(this.convertOuter2Inner(this.props.value)) !== JSON.stringify(this.state.value)) {
                // debugger;
                this.setState({ value: this.convertOuter2Inner(this.props.value) });
            }
        }
    }

    private hideModal() { this.props.onHide(); }
    private confirmModal(formikProps: FormikProps<any>) {
        // debugger;
        // this.props.onConfirm(this.convertInner2Outer(this.state.value));
        this.setState({ value: formikProps.values }, () => {
            this.props.onConfirm(this.convertInner2Outer(formikProps.values));
        });
        // this.props.onConfirm(this.convertInner2Outer(formikProps.values));
    }

    private searchOptions(langName: string): Array<{ label: string; value: ILanguage; }> {
        const all = this.props.languagelist;
        const exclude = [...Object.keys(this.state.value), this.props.defaultlangcode];
        const filtered = all.filter(c => {
            return c.name.toLocaleLowerCase().includes(langName.toLocaleLowerCase())
                && !exclude.includes(c.identifier);
        });
        const limit = filtered.slice(0, 10);
        const res = limit.map(l => ({ label: `${l.name} (${l.identifier})`, value: l }));
        return res;
    }

    // private searchLanguageList(input: string, callback: any): void {
    //     callback(this.searchOptions(input));
    // }

    // private defaultOptions() {
    //     return this.searchOptions('');
    // }

    private removeCode(code: string) {
        const value = { ...this.state.value };
        delete value[code];
        this.setState({ value });
    }

    private validationSchema() {
        const schema: { [key: string]: Yup.StringSchema<string> } = {};
        Object.keys(this.state.value).forEach(code => {
            schema[code] = Yup.string().required(Localization.validation.required_field)
        });
        return Yup.object(schema);
    }

    modal_render() {
        return (
            <>
                <Modal size='xl' show={this.props.show} onHide={() => this.hideModal()}  >
                    <Formik
                        initialValues={this.state.value}
                        onSubmit={() => { }}
                        validationSchema={this.validationSchema()}
                        enableReinitialize
                        // validateOnChange
                        validateOnMount
                    >
                        {(formikProps) => (
                            <>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-12">
                                            <h4>{Localization.other_languages}</h4>
                                        </div>

                                        {!this.props.readOnly && <div className="col-md-4">
                                            <FormControl
                                                key={`unique_key_${Math.random()}`}
                                                control={APP_FORM_CONTROL.ASYNCSELECT}
                                                name="language"
                                                placeholder={Localization.choose_language}
                                                // label={Localization.language}
                                                // required
                                                // isClearable={true}
                                                loadOptions={(inputValue, callback) => callback(this.searchOptions(inputValue))}
                                                // defaultOptions
                                                defaultOptions={this.searchOptions('')}
                                                onChange={(val: { label: string; value: ILanguage } | null) => {
                                                    // console.log('aa',formikProps.values.language)
                                                    if (val) {
                                                        if (Object.keys(this.state.value).includes(val.value.identifier)) return;
                                                        this.setState({ value: { ...this.state.value, [val.value.identifier]: '' } }, () => {
                                                            // formikProps.setFieldValue('language', null);
                                                        });
                                                    }
                                                }}
                                            // cacheOptions={false}
                                            // cacheOptions={{}}
                                            // value={null}
                                            />
                                        </div>}
                                        {Object.keys(this.state.value).map(code => (
                                            <div className="col-12" key={code}>
                                                <div className="row">
                                                    <div className="col-11">
                                                        <FormControl<MultiLangTextareaModalForm>
                                                            control={APP_FORM_CONTROL.TEXTAREA}
                                                            name={code}
                                                            label={code}
                                                            placeholder={code}
                                                            required
                                                            // defaultValue={this.state.value[code] || ''}
                                                            value={this.state.value[code] || ''}
                                                            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                                const newVal = event.target.value || '';
                                                                formikProps.setFieldValue(code, newVal);
                                                                this.setState({ value: { ...this.state.value, [code]: newVal } });
                                                            }}
                                                            readOnly={this.props.readOnly}
                                                            rows={this.props.textareaRows}
                                                        />
                                                    </div>
                                                    {!this.props.readOnly && <div className="col-1 text-right">
                                                        <label className="d-block text-transparent">.</label>
                                                        <div className="btn btn-sm btn-circlec text-danger icon-only"
                                                            onClick={() => this.removeCode(code)}
                                                        >
                                                            <i className="fa fa-times"></i>
                                                        </div>
                                                    </div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Modal.Body>
                                {!this.props.readOnly && <Modal.Footer className="pt-0 border-top-0">
                                    <button className="btn btn-sm text-uppercase min-w-70px"
                                        onClick={() => this.hideModal()}>
                                        {Localization.close}
                                    </button>
                                    <button className="btn text-primary btn-sm text-uppercase min-w-70px"
                                        disabled={!formikProps.isValid}
                                        onClick={() => this.confirmModal(formikProps)}>
                                        {Localization.confirm}
                                    </button>
                                </Modal.Footer>}
                            </>
                        )}
                    </Formik>
                </Modal>
            </>
        )
    }

    render() { return (<>{this.modal_render()}</>); }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => { return {}; };
const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization, };
};
export const MultiLangTextareaModal = connect(state2props, dispatch2props)(MultiLangTextareaModalComponent);
