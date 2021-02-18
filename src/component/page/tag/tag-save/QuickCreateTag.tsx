import React from 'react';
import { MapDispatchToProps, connect } from 'react-redux';
import { Dispatch } from 'redux';
import { redux_state } from '../../../../redux/app_state';
import { TInternationalization } from '../../../../config/setup';
import { Localization } from '../../../../config/localization/localization';
import Modal from 'react-bootstrap/Modal';
import { Formik } from 'formik';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../../form/_formik/FormControl/FormControl';
import * as Yup from 'yup';
import { ITag, TTagCreate } from '../../../../model/tag.model';
import { TagService } from '../../../../service/tag.service';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import { BaseComponent } from '../../../_base/BaseComponent';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';

interface ITagForm {
    name: string;
    arabicName: string;
}

interface IProps {
    internationalization: TInternationalization;
    defaultlangcode: string;
    show: boolean;
    onHide: () => any;
    onCreate?: (newTag: ITag) => any;
}

interface IState {
    formData: ITagForm;
    loader: boolean;
}

class QuickCreateTagComponent extends BaseComponent<IProps, IState> {
    state = {
        formData: { name: '', arabicName: '' },
        loader: false,
    };

    componentDidMount() {
        this.setState({
            formData: { name: '', arabicName: '' },
            loader: false,
        });
    }

    protected onHide() {
        this.setState(
            {
                formData: { name: '', arabicName: '' },
                loader: false,
            },
            () => this.props.onHide()
        );
    }

    protected _entityService = new TagService();

    protected form2CreateModel(form: ITagForm): TTagCreate {
        return {
            title: {
                [this.props.defaultlangcode]: form.name,
                ar: form.arabicName,
            },
        };
    }

    protected formValidation = Yup.object(
        /* <ITagForm> */ {
            name: Yup.string().test(
                'fill-default-name',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),
        }
    );

    protected async create(values: ITagForm, handleReset: () => void) {
        // debugger;
        this.setState({ loader: true });
        try {
            let newEntity = this.form2CreateModel(values);
            let newTag = await this._entityService.create(newEntity);
            this.setState({ loader: false }, () => {
                if (this.props.onCreate) {
                    this.props.onCreate(newTag.data.data);
                }
            });
            handleReset();
        } catch (e) {
            this.setState({ loader: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'create_error' },
            });
        }
    }

    protected modal_render() {
        return (
            <>
                <Modal
                    size="lg"
                    show={this.props.show}
                    onHide={() => this.onHide()}
                    backdropClassName="profile-info-modal-in-header-with-sidebar-style-wrapper-backdrop-background-color"
                >
                    <Formik
                        initialValues={this.state.formData}
                        onSubmit={() => {}}
                        validationSchema={this.formValidation}
                        enableReinitialize
                        validateOnMount
                    >
                        {(formikProps) => (
                            <>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col-12">
                                            <h3 className="font-weight-bold text-capitalize text-center mb-3">
                                                {Localization.tag_create}
                                            </h3>
                                        </div>
                                        <div className="col-12">
                                            <h4 className="font-weight-bold text-capitalize mb-3">
                                                tag information
                                            </h4>
                                        </div>
                                        {this.props.defaultlangcode && (
                                            <div className="col-12">
                                                <FormControl<ITagForm>
                                                    control={
                                                        APP_FORM_CONTROL.INPUT
                                                    }
                                                    name={'name'}
                                                    label={'Name'}
                                                    placeholder={'Name'}
                                                    apptheme={
                                                        FORM_ELEMENT_THEME.ZOHO
                                                    }
                                                    required
                                                />
                                            </div>
                                        )}
                                        <div className="col-12">
                                            <FormControl<ITagForm>
                                                control={APP_FORM_CONTROL.INPUT}
                                                name={'arabicName'}
                                                label={'Arabic Name'}
                                                placeholder={'Arabic Name'}
                                                apptheme={
                                                    FORM_ELEMENT_THEME.ZOHO
                                                }
                                            />
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer className="pt-0 border-top-0">
                                    <button
                                        className="btn btn-sm text-uppercase min-w-70px"
                                        onClick={() => this.onHide()}
                                    >
                                        {Localization.close}
                                    </button>
                                    <BtnLoader
                                        btnClassName="btn text-primary btn-sm text-uppercase min-w-70px"
                                        onClick={() =>
                                            this.create(
                                                formikProps.values,
                                                formikProps.handleReset
                                            )
                                        }
                                        disabled={!formikProps.isValid}
                                        loading={this.state.loader}
                                    >
                                        {Localization.create}
                                    </BtnLoader>
                                </Modal.Footer>
                            </>
                        )}
                    </Formik>
                </Modal>
            </>
        );
    }

    render() {
        return <>{this.modal_render()}</>;
    }
}

const dispatch2props: MapDispatchToProps<{}, {}> = (dispatch: Dispatch) => {
    return {};
};
const state2props = (state: redux_state) => {
    return { internationalization: state.internationalization };
};
export const QuickCreateTag = connect(
    state2props,
    dispatch2props
)(QuickCreateTagComponent);
