import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Setup, TInternationalization } from '../../../../config/setup';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../../config/localization/localization';
import { FormikProps } from 'formik';
import { AppRoute } from '../../../../config/route';
import { CategoryService } from '../../../../service/category.service';
import {
    ICategory,
    TCategoryCreate,
    TCategoryUpdate,
} from '../../../../model/category.model';
import * as Yup from 'yup';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { UploadService } from '../../../../service/upload.service';
import { IMedia } from '../../../../model/media.model';
import { MEDIA_GROUP } from '../../../../enum/media-group.enum';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
    SAVE_PAGE_MODE,
} from '../../_base/BaseSave/BaseSave';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { ReactSortable } from 'react-sortablejs';
import { ProvidedFile } from '../../../form/_formik/MultiFileInput/MultiFileInput';

interface ICategoryForm {
    name: string;
    arabicName: string;
    media: Array<File | IMedia>;
    ownerLog: string;
    dateLog: number;
}

interface IState extends IStateBaseSave<ICategory> {
    formData: ICategoryForm;
    fetchData: ICategory | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
    savePageMode: SAVE_PAGE_MODE;
}
interface IProps extends IPropsBaseSave {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class CategorySaveComponent extends BaseSave<
    ICategory,
    TCategoryCreate,
    TCategoryUpdate,
    IProps,
    IState
> {
    state: IState = {
        formData: {
            name: '',
            arabicName: '',
            media: [],
            ownerLog: '',
            dateLog: 0,
        },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
    };

    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.category;
    protected _entityService = new CategoryService();
    protected entityId: string | undefined;
    protected _uploadService = new UploadService();

    protected form2CreateModel(form: ICategoryForm): TCategoryCreate {
        return {
            name:
                form.arabicName === ''
                    ? {
                          [this.defaultLangCode]: form.name,
                      }
                    : {
                          [this.defaultLangCode]: form.name,
                          ar: form.arabicName,
                      },
        };
    }
    protected form2UpdateModel(form: ICategoryForm): TCategoryUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: ICategory): ICategoryForm {
        return {
            name: data.name[this.defaultLangCode],
            arabicName: data.name['ar'],
            media: data.media ? [data.media] : [],
            ownerLog:
                data.createdBy && data.createdBy.name
                    ? data.createdBy.name
                    : '',
            dateLog: data.createdAt,
        };
    }

    protected formValidation = Yup.object(
        /* <ICategoryForm> */ {
            name: Yup.string().test(
                'fill-default-name',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),

            // arabicName: Yup.string().test(
            //     'fill-arabicName',
            //     Localization.validation.required_field,
            //     (v) => {
            //         if (v) return true;
            //         return false;
            //     }
            // ),
        }
    );

    componentDidMount() {
        // debugger;
        if (!this.props.language.defaultLanguage?.id) {
            this.goToLanguageManage();
            setTimeout(() => {
                this.toastNotify(
                    Localization.msg.ui.no_default_lang_create,
                    { autoClose: Setup.notify.timeout.warning },
                    'warn'
                );
            }, 300);
            return;
        }
        super.componentDidMount();
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    protected async create(formikProps: FormikProps<ICategoryForm>) {
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
            const media = await this.upload(formikProps.values.media);
            if (media && media.length) {
                // formikProps.setFieldValue('media', media);
                let values: ICategoryForm = formikProps.values;
                values.media = media;
                formikProps.setValues(values);
                debugger;
            }
            this.setState({ actionBtnLoading: true }, () =>
                super.create(formikProps)
            );
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'create_error' },
            });
        }
    }

    protected async update(formikProps: FormikProps<ICategoryForm>) {
        if (!this.entityId) return;
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
            const media = await this.upload(formikProps.values.media);
            if (media && media.length) {
                // formikProps.setFieldValue('media', media);
                let values: ICategoryForm = formikProps.values;
                values.media = media;
                formikProps.setValues(values);
                debugger;
            }
            this.setState({ actionBtnLoading: true }, () =>
                super.update(formikProps)
            );
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'update_error' },
            });
        }
    }

    private async upload(image: ICategoryForm['media']): Promise<IMedia[]> {
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
            MEDIA_GROUP.CATEGORY
        );
        return res.data.data.items;
    }

    extractorFileData(list: Array<ProvidedFile>): Array<File | IMedia> {
        let fileArray: Array<File | IMedia> = list.map((item: ProvidedFile) => {
            return item.file;
        });
        return fileArray;
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        // const defaultLangCode = this.props.language.defaultLanguage?.identifier;
        // const languageList = this.props.language.list;

        return (
            <>
                <h4 className="font-weight-bold text-capitalize">
                    category image
                </h4>
                <div className="row">
                    <div className="col-md-12">
                        <FormControl<ICategoryForm>
                            control={APP_FORM_CONTROL.MULTI_FILE_INPUT}
                            name={'media'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            multiFileWrapperClass="category-save-page-image-wrapper"
                            multiFileInputClass="category-save-page-image-input"
                            multiFileLabelClass="category-save-page-image-label"
                            labelContent={
                                <span className="add-image-icon"></span>
                            }
                            ratio={1}
                            ratioError={(w: number, h: number) =>
                                this.toastNotify(
                                    'The aspect ratio should be 1',
                                    { autoClose: Setup.notify.timeout.warning },
                                    'warn'
                                )
                            }
                            provider={(providerProps: {
                                fieldName: string;
                                values: Array<File | IMedia>;
                                files: Array<ProvidedFile>;
                                setFieldValue: (
                                    field: string,
                                    value: Array<File | IMedia>
                                ) => void;
                                removeFunction: (
                                    index: number,
                                    fieldName: string,
                                    value: Array<File | IMedia>,
                                    setFieldValue: (
                                        field: string,
                                        value: any
                                    ) => void
                                ) => void;
                                sortFunction: (
                                    fieldName: string,
                                    value: Array<File | IMedia>,
                                    setFieldValue: (
                                        field: string,
                                        value: any
                                    ) => void
                                ) => void;
                            }) => {
                                return (
                                    <ReactSortable
                                        list={providerProps.files}
                                        setList={(newState) =>
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
                                            (item: ProvidedFile, i: number) => {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="category-dragable-item"
                                                    >
                                                        <i
                                                            className="fa fa-times-circle"
                                                            title={
                                                                Localization.remove +
                                                                ' ' +
                                                                item.file.name
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
                                                            src={item.src}
                                                            alt=""
                                                        />
                                                    </div>
                                                );
                                            }
                                        )}
                                    </ReactSortable>
                                );
                            }}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>
                <h4 className="font-weight-bold text-capitalize mb-4">
                    category information
                </h4>
                <div className="row">
                    {this.defaultLangCode && (
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <FormControl<ICategoryForm>
                                control={APP_FORM_CONTROL.INPUT}
                                name={'name'}
                                label={'Name'}
                                placeholder={'Name'}
                                apptheme={FORM_ELEMENT_THEME.ZOHO}
                                required
                                readOnly={
                                    this.state.savePageMode ===
                                    SAVE_PAGE_MODE.VIEW
                                }
                            />
                        </div>
                    )}
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<ICategoryForm>
                            control={APP_FORM_CONTROL.INPUT}
                            name={'arabicName'}
                            label={'Arabic Name'}
                            placeholder={'Arabic Name'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            // required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>
                {this.state.savePageMode !== SAVE_PAGE_MODE.CREATE &&
                this.state.savePageMode !== SAVE_PAGE_MODE.COPY ? (
                    <>
                        <h4 className="font-weight-bold text-capitalize mb-4">
                            log history
                        </h4>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                <FormControl<ICategoryForm>
                                    control={APP_FORM_CONTROL.INPUT}
                                    name={'ownerLog'}
                                    label={'Owner'}
                                    placeholder={'Owner'}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    readOnly={true}
                                    icon={
                                        <i className="fa fa-lock zoho-icon"></i>
                                    }
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                <FormControl<ICategoryForm>
                                    control={APP_FORM_CONTROL.DATE_TIME_PICKER}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    name={'dateLog'}
                                    label={'Date'}
                                    innerValue2Outer={(v: any) => {
                                        return v === null
                                            ? undefined
                                            : new Date(v).getTime();
                                    }}
                                    outerValue2Inner={(v: any) => {
                                        return new Date(
                                            !v ? '' : v
                                        ).toLocaleDateString('en-US');
                                    }}
                                    className="app-datepicker-input log-style"
                                    wrapperClassName="wrapper-log-style"
                                    selected={
                                        formikProps.values.date === undefined
                                            ? null
                                            : new Date(formikProps.values.date)
                                    }
                                    isClearable={true}
                                    placeholderText="date"
                                    readOnly={true}
                                    icon={
                                        <i className="fa fa-lock zoho-icon"></i>
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : undefined}
            </>
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
export const CategorySave = connect(
    state2props,
    dispatch2props
)(CategorySaveComponent);
