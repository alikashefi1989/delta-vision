import React, { Fragment } from "react";
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
    onConfirm: (v: { name: { [key: string]: string }, value: { [key: string]: string } }) => any;
    languagelist: Array<ILanguage>;
    defaultlangcode: string;
    value: { name: { [key: string]: string }, value: { [key: string]: string } };
    readOnly?: boolean;
}

interface IState {
    value: { name: { [key: string]: string }, value: { [key: string]: string } };
}

interface MultiLangInputModalForm {
    name: { [key: string]: string },
    value: { [key: string]: string }
}

class AttibuteInputModalComponent extends React.Component<IProps, IState> {
    state = {
        value: this.convertOuter2Inner(this.props.value)
    };

    private convertOuter2Inner(v: { name: { [key: string]: string }, value: { [key: string]: string } }): { name: { [key: string]: string }, value: { [key: string]: string } } {
        const value = { ...v };
        // delete value.name[this.props.defaultlangcode];
        // delete value.value[this.props.defaultlangcode];
        return value;
    }
    private convertInner2Outer(v: { name: { [key: string]: string }, value: { [key: string]: string } }): { name: { [key: string]: string }, value: { [key: string]: string } } {
        const value = { ...v };
        // value.name[this.props.defaultlangcode] = this.props.value.name[this.props.defaultlangcode] || '';
        // value.value[this.props.defaultlangcode] = this.props.value.value[this.props.defaultlangcode] || '';
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
        delete value.name[code];
        delete value.value[code];
        this.setState({ value });
    }

    private formValidation = Yup.object/* <IAttributeForm> */({
        attribute: Yup.object().test('fill-default-attribute', Localization.validation.required_field, v => {
            console.log(v)
            if (v === undefined) {
                let newVal: MultiLangInputModalForm = this.state.value;
                if (!newVal.name || !newVal.value) {
                    // debugger
                    return false
                } else {
                    let fields: Array<string> = Object.keys(newVal.name);
                    // debugger
                    for (let i = 0; i < fields.length; i++) {
                        if (fields[i] !== this.props.defaultlangcode) {
                            if (!newVal.name[fields[i]] ||
                                !newVal.value[fields[i]] ||
                                typeof newVal.name[fields[i]] !== 'string' ||
                                typeof newVal.value[fields[i]] !== 'string' ||
                                newVal.name[fields[i]] === '' ||
                                newVal.value[fields[i]] === '') {
                                return false;
                            }
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        }),
    });

    modal_render() {
        return (
            <>
                <Modal size='lg' show={this.props.show} onHide={() => this.hideModal()}  >
                    <Formik
                        initialValues={this.state.value}
                        onSubmit={() => { }}
                        validationSchema={this.formValidation}
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

                                        {!this.props.readOnly && <div className="col-md-6">
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
                                                        if (Object.keys(this.state.value.name).includes(val.value.identifier)) return;
                                                        this.setState({
                                                            value: {
                                                                ...this.state.value,
                                                                name: { ...this.state.value.name, [val.value.identifier]: '' },
                                                                value: { ...this.state.value.value, [val.value.identifier]: '' }
                                                            }
                                                        }, () => {
                                                            // console.log(this.state.value)
                                                            // formikProps.setFieldValue('language', null);
                                                        });
                                                    }
                                                }}
                                            // cacheOptions={false}
                                            // cacheOptions={{}}
                                            // value={null}
                                            />
                                        </div>}
                                        {Object.keys(this.state.value.name).map(code => (

                                            code === this.props.defaultlangcode
                                                ?
                                                <Fragment key={code}></Fragment>
                                                :
                                                <div className="col-12" key={code}>
                                                    <div className="row">
                                                        <div className="col-5">
                                                            <FormControl<MultiLangInputModalForm>
                                                                control={APP_FORM_CONTROL.INPUT}
                                                                id={code + '-name'}
                                                                name={'name'}
                                                                label={Localization.name + ` (${code})`}
                                                                placeholder={Localization.name}
                                                                required
                                                                // defaultValue={this.state.value[code] || ''}
                                                                value={this.state.value.name[code] || ''}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const newNameVal = event.target.value || '';
                                                                    const name = { ...this.state.value.name, [code]: newNameVal }
                                                                    formikProps.setFieldValue('name', name);
                                                                    this.setState({ value: { ...this.state.value, name: { ...this.state.value.name, [code]: newNameVal } } });
                                                                }}
                                                                controlsize="sm"
                                                                readOnly={this.props.readOnly}
                                                            />
                                                        </div>
                                                        <div className="col-5">
                                                            <FormControl<MultiLangInputModalForm>
                                                                control={APP_FORM_CONTROL.INPUT}
                                                                id={code + '-value'}
                                                                name={'value'}
                                                                label={Localization.value + ` (${code})`}
                                                                placeholder={Localization.value}
                                                                required
                                                                // defaultValue={this.state.value[code] || ''}
                                                                value={this.state.value.value[code] || ''}
                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const newValueVal = event.target.value || '';
                                                                    const value = { ...this.state.value.value, [code]: newValueVal }
                                                                    formikProps.setFieldValue('value', value);
                                                                    this.setState({ value: { ...this.state.value, value: { ...this.state.value.value, [code]: newValueVal } } });
                                                                }}
                                                                controlsize="sm"
                                                                readOnly={this.props.readOnly}
                                                            />
                                                        </div>
                                                        {!this.props.readOnly && <div className="col-2 text-right">
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
export const AttibuteInputModal = connect(state2props, dispatch2props)(AttibuteInputModalComponent);
