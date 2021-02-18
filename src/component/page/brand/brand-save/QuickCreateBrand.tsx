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
import { IBrand, TBrandCreate } from '../../../../model/brand.model';
import { BrandService } from '../../../../service/brand.service';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import { BaseComponent } from '../../../_base/BaseComponent';
import { IMedia } from '../../../../model/media.model';
import { ProvidedFile } from '../../../form/_formik/MultiFileInput/MultiFileInput';
import { ReactSortable } from 'react-sortablejs';
import { UploadService } from '../../../../service/upload.service';
import { MEDIA_GROUP } from '../../../../enum/media-group.enum';
import { BtnLoader } from '../../../form/btn-loader/BtnLoader';

interface IBrandForm {
    name: string;
    arabicName: string;
    brandMedia: Array<File | IMedia>;
}

interface IProps {
    internationalization: TInternationalization;
    defaultlangcode: string;
    show: boolean;
    onHide: () => any;
    onCreate?: (newBrand: IBrand) => any;
}

interface IState {
    formData: IBrandForm;
    loader: boolean;
}

class QuickCreateBrandComponent extends BaseComponent<IProps, IState> {
    state = {
        formData: { name: '', arabicName: '', brandMedia: [] },
        loader: false,
    };

    componentDidMount() {
        this.setState({
            formData: { name: '', arabicName: '', brandMedia: [] },
            loader: false,
        });
    }

    protected onHide() {
        this.setState(
            {
                formData: { name: '', arabicName: '', brandMedia: [] },
                loader: false,
            },
            () => this.props.onHide()
        );
    }

    protected _entityService = new BrandService();
    protected _uploadService = new UploadService();

    protected form2CreateModel(form: IBrandForm): TBrandCreate {
        return {
            name: {
                [this.props.defaultlangcode]: form.name,
                ar: form.arabicName,
            },
        };
    }

    protected formValidation = Yup.object(
        /* <IBrandForm> */ {
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

    protected async create(values: IBrandForm, handleReset: () => void) {
        // debugger;
        this.setState({ loader: true });
        try {
            const media = await this.upload(values.brandMedia);
            let newEntity = this.form2CreateModel(values);
            if (media && media.length) {
                newEntity['mediaId'] = media[0].id;
            }
            let newBrand = await this._entityService.create(newEntity);
            this.setState({ loader: false }, () => {
                if (this.props.onCreate) {
                    this.props.onCreate(newBrand.data.data);
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

    private async upload(image: IBrandForm['brandMedia']): Promise<IMedia[]> {
        if (!image.length || (image[0] as IMedia).id) {
            return image as IMedia[];
        }
        if (image.length) {
            // this condition for check default image (default image haven't id)
            let keys: Array<string> = Object.keys(image[0]);
            if (keys.includes('url') === true) {
                return [];
            }
        }
        const res = await this._uploadService.upload(
            image as Array<File>,
            MEDIA_GROUP.BRAND
        );
        return res.data.data.items;
    }

    protected extractorFileData(
        list: Array<ProvidedFile>
    ): Array<File | IMedia> {
        let fileArray: Array<File | IMedia> = list.map((item: ProvidedFile) => {
            return item.file;
        });
        return fileArray;
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
                                            <h3 className="font-weight-bold text-capitalize text-center">
                                                {Localization.brand_create}
                                            </h3>
                                        </div>
                                        <div className="col-12">
                                            <h4 className="font-weight-bold text-capitalize">
                                                brand image
                                            </h4>
                                        </div>
                                        <div className="col-12">
                                            <FormControl<IBrandForm>
                                                control={
                                                    APP_FORM_CONTROL.MULTI_FILE_INPUT
                                                }
                                                name={'brandMedia'}
                                                apptheme={
                                                    FORM_ELEMENT_THEME.ZOHO
                                                }
                                                multiFileWrapperClass="category-save-page-image-wrapper"
                                                multiFileInputClass="category-save-page-image-input"
                                                multiFileLabelClass="category-save-page-image-label"
                                                labelContent={
                                                    <span className="add-image-icon"></span>
                                                }
                                                provider={(providerProps: {
                                                    fieldName: string;
                                                    values: Array<
                                                        File | IMedia
                                                    >;
                                                    files: Array<ProvidedFile>;
                                                    setFieldValue: (
                                                        field: string,
                                                        value: Array<
                                                            File | IMedia
                                                        >
                                                    ) => void;
                                                    removeFunction: (
                                                        index: number,
                                                        fieldName: string,
                                                        value: Array<
                                                            File | IMedia
                                                        >,
                                                        setFieldValue: (
                                                            field: string,
                                                            value: any
                                                        ) => void
                                                    ) => void;
                                                    sortFunction: (
                                                        fieldName: string,
                                                        value: Array<
                                                            File | IMedia
                                                        >,
                                                        setFieldValue: (
                                                            field: string,
                                                            value: any
                                                        ) => void
                                                    ) => void;
                                                }) => {
                                                    return (
                                                        <ReactSortable
                                                            list={
                                                                providerProps.files
                                                            }
                                                            setList={(
                                                                newState
                                                            ) =>
                                                                providerProps.sortFunction(
                                                                    providerProps.fieldName,
                                                                    this.extractorFileData(
                                                                        newState
                                                                    ),
                                                                    providerProps.setFieldValue
                                                                )
                                                            }
                                                            animation={300}
                                                            className="category-dragable-list-wrapper"
                                                            // style={{ flexWrap: 'wrap' }}
                                                        >
                                                            {providerProps.files.map(
                                                                (
                                                                    item: ProvidedFile,
                                                                    i: number
                                                                ) => {
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="category-dragable-item"
                                                                        >
                                                                            <i
                                                                                className="fa fa-times-circle"
                                                                                title={
                                                                                    Localization.remove +
                                                                                    ' ' +
                                                                                    item
                                                                                        .file
                                                                                        .name
                                                                                }
                                                                                onClick={() =>
                                                                                    providerProps.removeFunction(
                                                                                        item.index,
                                                                                        providerProps.fieldName,
                                                                                        providerProps.values,
                                                                                        providerProps.setFieldValue
                                                                                    )
                                                                                }
                                                                            ></i>
                                                                            <img
                                                                                src={
                                                                                    item.src
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </ReactSortable>
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <h4 className="font-weight-bold text-capitalize mb-3">
                                                brand information
                                            </h4>
                                        </div>
                                        {this.props.defaultlangcode && (
                                            <div className="col-12">
                                                <FormControl<IBrandForm>
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
                                            <FormControl<IBrandForm>
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
export const QuickCreateBrand = connect(
    state2props,
    dispatch2props
)(QuickCreateBrandComponent);
