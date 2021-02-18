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
import { TagService } from '../../../../service/tag.service';
import { ITag, TTagCreate, TTagUpdate } from '../../../../model/tag.model';
import * as Yup from 'yup';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { UploadService } from '../../../../service/upload.service';
import { IMedia } from '../../../../model/media.model';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
    SAVE_PAGE_MODE,
} from '../../_base/BaseSave/BaseSave';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { ProvidedFile } from '../../../form/_formik/MultiFileInput/MultiFileInput';

interface ITagForm {
    name: string;
    arabicName: string;
    ownerLog: string;
    dateLog: number;
}

interface IState extends IStateBaseSave<ITag> {
    formData: ITagForm;
    fetchData: ITag | undefined;
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

class TagSaveComponent extends BaseSave<
    ITag,
    TTagCreate,
    TTagUpdate,
    IProps,
    IState
> {
    state: IState = {
        formData: { name: '', arabicName: '', ownerLog: '', dateLog: 0 },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
    };

    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.tag;
    protected _entityService = new TagService();
    protected entityId: string | undefined;
    protected _uploadService = new UploadService();

    protected form2CreateModel(form: ITagForm): TTagCreate {
        return {
            title:
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
    protected form2UpdateModel(form: ITagForm): TTagUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: ITag): ITagForm {
        return {
            name: data.title[this.defaultLangCode],
            arabicName: data.title['ar'],
            ownerLog:
                data.createdBy && data.createdBy.name
                    ? data.createdBy.name
                    : '',
            dateLog: data.createdAt,
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

    protected async update(formikProps: FormikProps<ITagForm>) {
        if (!this.entityId) return;
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
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

    extractorFileData(list: Array<ProvidedFile>): Array<File | IMedia> {
        let fileArray: Array<File | IMedia> = list.map((item: ProvidedFile) => {
            return item.file;
        });
        return fileArray;
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        return (
            <>
                <h4 className="font-weight-bold text-capitalize mb-4">
                    tag information
                </h4>
                <div className="row">
                    {this.defaultLangCode && (
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <FormControl<ITagForm>
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
                        <FormControl<ITagForm>
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
                                <FormControl<ITagForm>
                                    control={APP_FORM_CONTROL.INPUT}
                                    name={'ownerLog'}
                                    label={'Owner'}
                                    placeholder={'Owner'}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    readOnly={true}
                                    disabled
                                    icon={
                                        <i className="fa fa-lock zoho-icon"></i>
                                    }
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                <FormControl<ITagForm>
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
export const TagSave = connect(state2props, dispatch2props)(TagSaveComponent);
