import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Setup } from '../../../../config/setup';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../../config/localization/localization';
import { FormikProps } from 'formik';
import { AppRoute } from '../../../../config/route';
import { BrandService } from '../../../../service/brand.service';
import {
    IBrand,
    TBrandCreate,
    TBrandUpdate,
} from '../../../../model/brand.model';
import * as Yup from 'yup';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { UploadService } from '../../../../service/upload.service';
import { IMedia } from '../../../../model/media.model';
import { MEDIA_GROUP } from '../../../../enum/media-group.enum';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
    SAVE_PAGE_MODE,
} from '../../_base/BaseSave/BaseSave';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';

interface IBrandForm {
    name: { [key: string]: string };
    media: Array<File | IMedia>;
}

interface IState extends IStateBaseSave<IBrand> {
    formData: IBrandForm;
}
interface IProps extends IPropsBaseSave {
    language: ILanguage_schema;
}

class BrandSaveComponent extends BaseSave<
    IBrand,
    TBrandCreate,
    TBrandUpdate,
    IProps,
    IState
> {
    state: IState = {
        ...this.baseState,
        formData: { name: {}, media: [] },
    };

    protected _entityService = new BrandService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.brand;
    private _uploadService = new UploadService();

    protected formValidation = Yup.object(
        /* <IBrandForm> */ {
            name: Yup.object().test(
                'fill-default-name',
                Localization.validation.required_field,
                (v) => {
                    if (v[this.defaultLangCode]) return true;
                    return false;
                }
            ),
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

    componentWillUnmount() {
        this.clearTmpUrl();
    }

    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    protected form2CreateModel(form: IBrandForm): TBrandCreate {
        // const media = await this.upload(form.logo);
        return {
            name: form.name,
            // logo: media.length ? media[0].id : undefined
        };
    }
    protected form2UpdateModel(form: IBrandForm): TBrandUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IBrand): IBrandForm {
        const logoUrl = data.media;
        return {
            name: data.name,
            media: logoUrl && logoUrl.id ? [logoUrl] : [],
        };
    }

    protected async create(formikProps: FormikProps<IBrandForm>) {
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
            const media = await this.upload(formikProps.values.media);
            if (media && media.length) {
                formikProps.setFieldValue('media', media);
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

    protected async update(formikProps: FormikProps<IBrandForm>) {
        if (!this.entityId) return;
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
            const logo = await this.upload(formikProps.values.media);
            if (logo && logo.length) {
                formikProps.setFieldValue('logo', logo);
            }
            this.setState({ actionBtnLoading: true }, () =>
                super.update(formikProps)
            );
            this.goToManage();
        } catch (e) {
            this.setState({ actionBtnLoading: false });
            this.handleError({
                error: e.response,
                toastOptions: { toastId: 'create_error' },
            });
        }
    }

    private async upload(image: IBrandForm['media']): Promise<IMedia[]> {
        if (!image.length || (image[0] as IMedia).id) {
            return image as IMedia[];
        }
        const res = await this._uploadService.upload(
            image as Array<File>,
            MEDIA_GROUP.BRAND
        );
        return res.data.data.items;
    }

    //#region tmpUrl
    private tmpUrl_list: string[] = [];
    private getTmpUrl(file: File): string {
        const tmpUrl = URL.createObjectURL(file);
        this.tmpUrl_list.push(tmpUrl);
        return tmpUrl;
    }
    private clearTmpUrl() {
        this.tmpUrl_list.forEach((url) => {
            URL.revokeObjectURL(url);
        });
    }
    //#endregion

    private fileRemoveItem(
        index: number,
        value: Array<File>,
        setFieldValue: (field: string, value: any) => void
    ) {
        const val = [...value];
        val.splice(index, 1);
        setFieldValue('logo', val);
    }
    private fileItemsRender(
        value: File[],
        setFieldValue: (field: string, value: any) => void
    ): React.ReactNode {
        return value && value.length ? (
            value.map((f, i) => {
                const file: any = f;
                const url = file.id ? file.url : this.getTmpUrl(f);
                return (
                    <div key={i} className="d-flex align-items-center mt-2">
                        <i
                            className="fa fa-times text-danger cursor-pointer mr-2"
                            onClick={() =>
                                this.fileRemoveItem(
                                    i,
                                    [...value],
                                    setFieldValue
                                )
                            }
                        ></i>
                        <div className="d-flex align-items-center justify-content-center w-50px h-50px mr-2">
                            <img
                                className="rounded max-w-50px max-h-50px"
                                src={url}
                                alt=""
                            />
                        </div>
                        <span>{f.name}</span>
                    </div>
                );
            })
        ) : (
            <></>
        );
    }

    protected saveFormBodyRender(formikProps: FormikProps<any>): JSX.Element {
        const languageList = this.props.language.list;

        return (
            <div className="row ">
                {this.defaultLangCode && (
                    <div className="col-md-4">
                        <FormControl<IBrandForm>
                            control={APP_FORM_CONTROL.MULTILANGUAGE_INPUT}
                            name={'name'}
                            label={Localization.name}
                            placeholder={Localization.name}
                            required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                            defaultlangcode={this.defaultLangCode}
                            languagelist={languageList}
                        />
                    </div>
                )}
                <div className="col-md-4">
                    <FormControl<IBrandForm>
                        control={APP_FORM_CONTROL.FILE_INPUT}
                        name={'media'}
                        label={Localization.logo}
                        placeholder={Localization.logo}
                        // required
                        readOnly={
                            this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                        }
                        // multiple
                        accept="image/*"
                        itemsrender={(v, set) => this.fileItemsRender(v, set)}
                    />
                </div>
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
export const BrandSave = connect(
    state2props,
    dispatch2props
)(BrandSaveComponent);
