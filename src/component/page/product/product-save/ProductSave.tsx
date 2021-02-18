import React from 'react';
import { redux_state } from '../../../../redux/app_state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
// import { ToastContainer } from 'react-toastify';
// import { BaseComponent } from '../../../_base/BaseComponent';
import { Setup, TInternationalization } from '../../../../config/setup';
import {
    FormControl,
    APP_FORM_CONTROL,
} from '../../../form/_formik/FormControl/FormControl';
import { Localization } from '../../../../config/localization/localization';
import { /*Formik,*/ FormikProps } from 'formik';
// import { ContentLoader } from '../../../form/content-loader/ContentLoader';
// import { appColor, APP_COLOR_NAME } from "../../../../config/appColor";
// import { Action, Fab } from "react-tiny-fab";
import { AppRoute } from '../../../../config/route';
import { ProductService } from '../../../../service/product.service';
import {
    IProduct,
    ISkuOfProduct,
    ISkuOfProductCreateAndUpdate,
    IVariationValue,
    IVariationValueCreateAndUpdate,
    TProductCreate,
    TProductUpdate,
} from '../../../../model/product.model';
// import { BtnLoader } from '../../../form/btn-loader/BtnLoader';
import * as Yup from 'yup';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { UploadService } from '../../../../service/upload.service';
// import { IMedia } from '../../../../model/media.model';
// import { MEDIA_GROUP } from '../../../../enum/media-group.enum';
// import TopBarProgress from 'react-topbar-progress-indicator';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
    SAVE_PAGE_MODE,
} from '../../_base/BaseSave/BaseSave';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { IBrand } from '../../../../model/brand.model';
import { BrandService } from '../../../../service/brand.service';
import { IMedia } from '../../../../model/media.model';
import { ICategory } from '../../../../model/category.model';
import { ITag } from '../../../../model/tag.model';
import { ProvidedFile } from '../../../form/_formik/MultiFileInput/MultiFileInput';
import { ReactSortable } from 'react-sortablejs';
import { CategoryService } from '../../../../service/category.service';
import { TagService } from '../../../../service/tag.service';
import { QuickCreateBrand } from '../../brand/brand-save/QuickCreateBrand';
import { QuickCreateTag } from '../../tag/tag-save/QuickCreateTag';
import { MEDIA_GROUP } from '../../../../enum/media-group.enum';
import { IVariation, IVariationItem } from '../../../../model/variation.model';
import { components } from 'react-select';
// import { ReactSortable } from 'react-sortablejs';
// import { ProvidedFile } from '../../../form/_formik/MultiFileInput/MultiFileInput';

// enum SAVE_PAGE_MODE {
//     CREATE = "CREATE",
//     UPDATE = "UPDATE",
//     COPY = "COPY",
//     VIEW = "VIEW",
// }

interface IProductForm {
    name: string;
    arabicName: string;
    description: string;
    arabicDescription: string;
    slug: string;
    brand: { label: string; value: IBrand } | null;
    categories: Array<{ label: string; value: ICategory }> | null;
    tags: Array<{ label: string; value: ITag }> | null;
    media: Array<File | IMedia>;
    isActive: boolean;
    tax: boolean;
    price: number | '';
    hasSkuList: boolean;
    variationSku: {
        variationValuesList: Array<{
            variation: { label: string; value: IVariation } | null;
            values: Array<{ label: string; value: IVariationItem }> | null;
        }>;
        skuList: Array<ISkuOfProduct>;
    };
    ownerLog: string;
    dateLog: number;
}

interface IState extends IStateBaseSave<IProduct> {
    formData: IProductForm;
    fetchData: IProduct | undefined;
    formLoader: boolean;
    actionBtnVisibility: boolean;
    actionBtnLoading: boolean;
    savePageMode: SAVE_PAGE_MODE;
    brandQuickCreateModalStaus: boolean;
    tagQuickCreateModalStaus: boolean;
}
interface IProps extends IPropsBaseSave {
    internationalization: TInternationalization;
    match: any;
    language: ILanguage_schema;
}

class ProductSaveComponent extends BaseSave<
    IProduct,
    TProductCreate,
    TProductUpdate,
    IProps,
    IState
> {
    state: IState = {
        formData: {
            name: '',
            arabicName: '',
            description: '',
            arabicDescription: '',
            slug: '',
            brand: null,
            categories: null,
            tags: null,
            media: [],
            isActive: false,
            tax: false,
            price: '',
            hasSkuList: false,
            variationSku: {
                variationValuesList: [{ variation: null, values: null }],
                skuList: [],
            },
            ownerLog: '',
            dateLog: 0,
        },
        fetchData: undefined,
        formLoader: false,
        actionBtnVisibility: false,
        actionBtnLoading: false,
        savePageMode: SAVE_PAGE_MODE.CREATE,
        brandQuickCreateModalStaus: false,
        tagQuickCreateModalStaus: false,
    };

    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.product;
    protected _entityService = new ProductService();
    protected brandService = new BrandService();
    protected categoryService = new CategoryService();
    protected tagService = new TagService();
    protected entityId: string | undefined;
    protected _uploadService = new UploadService();

    protected form2CreateModel(form: IProductForm): TProductCreate {
        debugger;
        return {
            product: {
                name:
                    form.arabicName === ''
                        ? {
                              [this.defaultLangCode]: form.name,
                          }
                        : {
                              [this.defaultLangCode]: form.name,
                              ar: form.arabicName,
                          },
                description: {
                    [this.defaultLangCode]: form.description,
                    ar: form.arabicDescription,
                },
                slug: form.slug,
                brandId: form.brand?.value.id || '',
                categoryIds:
                    form.categories === null
                        ? undefined
                        : form.categories.map(
                              (item: { label: string; value: ICategory }) => {
                                  return item.value.id;
                              }
                          ),
                tagIds:
                    form.tags === null
                        ? undefined
                        : form.tags.map(
                              (item: { label: string; value: ITag }) => {
                                  return item.value.id;
                              }
                          ),
                isActive: form.isActive,
                mediaId:
                    form.media && form.media.length
                        ? (form.media[0] as IMedia).id
                        : undefined,
                tax: form.tax,
                variationValuesList: form.hasSkuList
                    ? this.convertVariationValuesToCreateOrUpdateModel(
                          form.variationSku.variationValuesList
                      )
                    : [],
            },
            hasSkuList: form.hasSkuList,
            price: typeof form.price === 'number' ? form.price : undefined,
            skuList: form.hasSkuList
                ? this.convertSkuListToCreateOrUpdateModel(
                      form.variationSku.skuList
                  )
                : [],
        };
    }
    protected form2UpdateModel(form: IProductForm): TProductUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IProduct): IProductForm {
        return {
            name: data.name[this.defaultLangCode],
            arabicName: data.name['ar'],
            description: data.description[this.defaultLangCode],
            arabicDescription: data.description['ar'],
            slug: data.slug || '',
            brand:
                data.brand === undefined
                    ? null
                    : {
                          label: data.brand.name[this.defaultLangCode] || '',
                          value: data.brand,
                      },
            categories:
                data.categories === undefined
                    ? null
                    : data.categories.map((item: ICategory) => {
                          return {
                              label: item.name[this.defaultLangCode] || '',
                              value: item,
                          };
                      }),
            tags:
                data.tags === undefined
                    ? null
                    : data.tags.map((item: ITag) => {
                          return {
                              label: item.title[this.defaultLangCode] || '',
                              value: item,
                          };
                      }),
            media: data.media ? [data.media] : [],
            isActive: data.isActive ? true : false,
            tax: data.tax ? true : false,
            price:
                data.price &&
                data.price.originalPrice &&
                isNaN(data.price.originalPrice) === false
                    ? Number(data.price.originalPrice)
                    : '',
            hasSkuList:
                data.variationValuesList && data.variationValuesList.length
                    ? true
                    : false,
            // hasSkuList: data.skuList === undefined ? false : data.skuList.length ? true : false,
            variationSku: this.extractModelVariationAndSkuList(data),
            ownerLog:
                data.createdBy && data.createdBy.name
                    ? data.createdBy.name
                    : '',
            dateLog: data.createdAt,
        };
    }

    protected extractModelVariationAndSkuList(
        data: IProduct
    ): IProductForm['variationSku'] {
        if (
            data.variationValuesList === undefined ||
            data.variationValuesList.length === 0 ||
            (data.variationValuesList.length === 1 &&
                (data.variationValuesList[0].variation === null ||
                    data.variationValuesList[0].variation === undefined)) ||
            (data.variationValuesList.length === 1 &&
                (data.variationValuesList[0].values === null ||
                    data.variationValuesList[0].values === undefined))
        ) {
            return {
                variationValuesList: [{ variation: null, values: null }],
                skuList: [],
            };
        } else {
            return {
                variationValuesList: data.variationValuesList.map(
                    (item: IVariationValue) => {
                        return {
                            variation: {
                                label:
                                    item.variation.name[this.defaultLangCode] ||
                                    '',
                                value: item.variation,
                            },
                            values: item.values.map((value: IVariationItem) => {
                                return {
                                    label:
                                        value.name[this.defaultLangCode] || '',
                                    value: value,
                                };
                            }),
                        };
                    }
                ),
                skuList:
                    data.skuList && data.skuList.length ? data.skuList : [],
            };
        }
    }

    convertVariationValuesToCreateOrUpdateModel(
        list: IProductForm['variationSku']['variationValuesList']
    ): Array<IVariationValueCreateAndUpdate> {
        let res: Array<IVariationValueCreateAndUpdate> = [];
        for (let i = 0; i < list.length; i++) {
            if (
                list[i].variation !== null &&
                list[i].values !== null &&
                list[i].values?.length
            ) {
                let item: IVariationValueCreateAndUpdate = {
                    variation: list[i].variation?.value.id!,
                    values: list[i].values?.map(
                        (item: { label: string; value: IVariationItem }) => {
                            return item.value.id;
                        }
                    )!,
                };
                res.push(item);
            }
        }
        return res;
    }

    convertSkuListToCreateOrUpdateModel(
        list: IProductForm['variationSku']['skuList']
    ): Array<ISkuOfProductCreateAndUpdate> {
        let res: Array<ISkuOfProductCreateAndUpdate> = [];
        for (let i = 0; i < list.length; i++) {
            let item: ISkuOfProduct = list[i];
            let convertedVariations: Array<{
                variationId: string;
                itemId: string;
            }> = [];
            if (item.variations.length) {
                for (let j = 0; j < item.variations.length; j++) {
                    if (
                        item.variations[j].variation &&
                        item.variations[j].variation !== null &&
                        item.variations[j].item &&
                        item.variations[j].item !== null
                    ) {
                        let convertedItem: {
                            variationId: string;
                            itemId: string;
                        } = {
                            variationId: item.variations[j].variation.id,
                            itemId: item.variations[j].item.id,
                        };
                        convertedVariations.push(convertedItem);
                    }
                }
            }
            let convertedSku: ISkuOfProductCreateAndUpdate = {
                sku: item.sku,
                varianteName: item.varianteName,
                medias: item.medias?.length
                    ? item.medias.map((media: IMedia) => {
                          return media.id;
                      })
                    : undefined,
                variations: convertedVariations,
                isDiscountable: item.isDiscountable,
                barcode: item.barcode,
            };
            res.push(convertedSku);
        }
        return res;
    }

    protected formValidation = Yup.object(
        /* <IProductForm> */ {
            name: Yup.string().test(
                'fill-default-name',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),

            arabicName: Yup.string().test(
                'fill-arabicName',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),

            description: Yup.string().test(
                'fill-description',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),

            arabicDescription: Yup.string().test(
                'fill-arabicDescription',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),

            brand: Yup.object()
                .nullable()
                .required(Localization.validation.required_field),

            slug: Yup.string().test(
                'fill-default-slug',
                Localization.validation.required_field,
                (v) => {
                    if (v) return true;
                    return false;
                }
            ),
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
        // debugger;
        // if (this.props.match.params.id) {
        //     this.entityId = this.props.match.params.id;
        //     // debugger;
        //     this.setState(
        //         {
        //             formLoader: true,
        //             savePageMode: this.savePageMode(this.props.match.path),
        //         },
        //         () => this.fetchData()
        //     );
        // } else {
        //     this.setState({
        //         actionBtnVisibility: true,
        //     });
        // }
    }

    // componentDidUpdate(prevProps: Readonly<IProps>) {
    //     const prevPath = prevProps.match.path;
    //     const currentPath = this.props.match.path;
    //     if (prevPath !== currentPath) {
    //         // debugger;
    //         this.setState({
    //             savePageMode: this.savePageMode(currentPath),
    //         });
    //     }
    // }

    // protected savePageMode(path: string): SAVE_PAGE_MODE {
    //     switch (path) {
    //         case AppRoute.routeData.product.create.path:
    //             return SAVE_PAGE_MODE.CREATE;
    //         case AppRoute.routeData.product.update.path:
    //             return SAVE_PAGE_MODE.UPDATE;
    //         case AppRoute.routeData.product.view.path:
    //             return SAVE_PAGE_MODE.VIEW;
    //         case AppRoute.routeData.product.copy.path:
    //             return SAVE_PAGE_MODE.COPY;
    //         default:
    //             return SAVE_PAGE_MODE.CREATE;
    //     }
    // }

    // protected async fetchData() {
    //     // debugger;
    //     if (!this.entityId) return;

    //     try {
    //         const res = await this._entityService.byId(this.entityId);
    //         this.setState({
    //             fetchData: res.data.data,
    //             formData: this.model2Form(res.data.data),
    //             formLoader: false,
    //             actionBtnVisibility: true
    //         });
    //     } catch (e) {
    //         this.setState({
    //             formLoader: false
    //         });
    //         this.handleError({ error: e.response, toastOptions: { toastId: 'fetchData_error' } });
    //     }
    // }

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    // protected goToManage() {
    //     this.navigate(AppRoute.routeData.product.manage.url());
    // }
    // protected goToUpdate() {
    //     if (!this.entityId) return;
    //     this.navigate(AppRoute.routeData.product.update.url(this.entityId));
    // }
    private goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    protected async create(formikProps: FormikProps<IProductForm>) {
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
            const media = await this.upload(formikProps.values.media);
            if (media && media.length) {
                // formikProps.setFieldValue('media', media);
                let values: IProductForm = formikProps.values;
                values.media = media;
                formikProps.setValues(values);
                debugger;
            }
            this.setState({ actionBtnLoading: false }, () =>
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

    protected async update(formikProps: FormikProps<IProductForm>) {
        if (!this.entityId) return;
        // debugger;
        this.setState({ actionBtnLoading: true });
        try {
            const media = await this.upload(formikProps.values.media);
            if (media && media.length) {
                // formikProps.setFieldValue('media', media);
                let values: IProductForm = formikProps.values;
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

    private _debounceSearchBrandList: any;
    private debounceSearchBrandList(input: string, callback: any) {
        if (this._debounceSearchBrandList)
            clearTimeout(this._debounceSearchBrandList);
        this._debounceSearchBrandList = setTimeout(() => {
            this.searchBrandList(input, callback);
        }, 300);
    }

    private async searchBrandList(input: string, callback: any): Promise<void> {
        try {
            const res = await this.brandService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                filter: {
                    [`name.${this.defaultLangCode}`]: {
                        $regex: input,
                        $options: 'i',
                    },
                },
                // search: input,
            });

            // const result = this.nestedAreaList(res.data.data.items);
            const result = res.data.data.items.map((brand: IBrand) => ({
                label: brand.name[this.defaultLangCode],
                value: brand,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    private _debounceSearchCategoryList: any;
    private debounceSearchCategoryList(input: string, callback: any) {
        if (this._debounceSearchCategoryList)
            clearTimeout(this._debounceSearchCategoryList);
        this._debounceSearchCategoryList = setTimeout(() => {
            this.searchCategoryList(input, callback);
        }, 300);
    }

    private async searchCategoryList(
        input: string,
        callback: any
    ): Promise<void> {
        try {
            const res = await this.categoryService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                filter: {
                    [`name.${this.defaultLangCode}`]: {
                        $regex: input,
                        $options: 'i',
                    },
                },
                // search: input,
            });

            // const result = this.nestedAreaList(res.data.data.items);
            const result = res.data.data.items.map((category: ICategory) => ({
                label: category.name[this.defaultLangCode],
                value: category,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    private _debounceSearchTagList: any;
    private debounceSearchTagList(input: string, callback: any) {
        if (this._debounceSearchTagList)
            clearTimeout(this._debounceSearchTagList);
        this._debounceSearchTagList = setTimeout(() => {
            this.searchTagList(input, callback);
        }, 300);
    }

    private async searchTagList(input: string, callback: any): Promise<void> {
        try {
            const res = await this.tagService.search({
                pagination: {
                    page: 0,
                    limit: Setup.recordDefaultLoadLength,
                },
                filter: {
                    [`title.${this.defaultLangCode}`]: {
                        $regex: input,
                        $options: 'i',
                    },
                },
                // search: input,
            });

            // const result = this.nestedAreaList(res.data.data.items);
            const result = res.data.data.items.map((tag: ITag) => ({
                label: tag.title[this.defaultLangCode],
                value: tag,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    private async upload(image: IProductForm['media']): Promise<IMedia[]> {
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
            MEDIA_GROUP.PRODUCT
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
                    product image
                </h4>
                <div className="row">
                    <div className="col-md-12">
                        <FormControl<IProductForm>
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
                    product information
                </h4>
                <div className="row">
                    {this.defaultLangCode && (
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <FormControl<IProductForm>
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
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.INPUT}
                            name={'arabicName'}
                            label={'Arabic Name'}
                            placeholder={'Arabic Name'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>
                <div className="row">
                    {this.defaultLangCode && (
                        <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                            <FormControl<IProductForm>
                                control={APP_FORM_CONTROL.TEXTAREA}
                                name={'description'}
                                label={'Description'}
                                placeholder={'Description'}
                                apptheme={FORM_ELEMENT_THEME.ZOHO}
                                required
                                rows={2}
                                readOnly={
                                    this.state.savePageMode ===
                                    SAVE_PAGE_MODE.VIEW
                                }
                            />
                        </div>
                    )}
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.TEXTAREA}
                            name={'arabicDescription'}
                            label={'Arabic Description'}
                            placeholder={'Arabic Description'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            required
                            rows={2}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.ASYNCSELECT}
                            name={'brand'}
                            components={{
                                DropdownIndicator: () => (
                                    <i className="fa fa-caret-down mx-3"></i>
                                ),
                                IndicatorSeparator: () => null,
                                MenuList: (props: any) => (
                                    <components.MenuList {...props}>
                                        <div
                                            className="text-center cursor-pointer py-1"
                                            onClick={() =>
                                                this.setState({
                                                    ...this.state,
                                                    brandQuickCreateModalStaus: true,
                                                })
                                            }
                                        >
                                            <span className="mx-2">
                                                Add new Brand
                                            </span>
                                            <i className="fa fa-plus-circle text-success"></i>
                                        </div>
                                        {props.children}
                                    </components.MenuList>
                                ),
                            }}
                            label={'Brand'}
                            placeholder={'Brand'}
                            required
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            // isClearable={true}
                            loadOptions={(
                                inputValue: string,
                                callback: (options: any) => void
                            ) =>
                                this.debounceSearchBrandList(
                                    inputValue,
                                    callback
                                )
                            }
                            defaultOptions
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                            // icon={
                            //     <i
                            //         title={'Add New Brand'}
                            //         className="fa fa-plus-circle zoho-icon"
                            //         onClick={() =>
                            //             this.setState({
                            //                 ...this.state,
                            //                 brandQuickCreateModalStaus: true,
                            //             })
                            //         }
                            //     ></i>
                            // }
                        />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.INPUT}
                            name={'slug'}
                            label={'Slug'}
                            placeholder={'Slug'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            required
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.ASYNCSELECT}
                            name={'categories'}
                            isMulti={true}
                            components={{
                                DropdownIndicator: () => (
                                    <i className="fa fa-caret-down mx-3"></i>
                                ),
                                IndicatorSeparator: () => null,
                            }}
                            label={'Categories'}
                            placeholder={'Categories'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            isClearable={true}
                            loadOptions={(
                                inputValue: string,
                                callback: (options: any) => void
                            ) =>
                                this.debounceSearchCategoryList(
                                    inputValue,
                                    callback
                                )
                            }
                            defaultOptions
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.ASYNCSELECT}
                            name={'tags'}
                            isMulti={true}
                            components={{
                                DropdownIndicator: () => (
                                    <i className="fa fa-caret-down mx-3"></i>
                                ),
                                IndicatorSeparator: () => null,
                                MenuList: (props: any) => (
                                    <components.MenuList {...props}>
                                        <div
                                            className="text-center cursor-pointer py-1"
                                            onClick={() =>
                                                this.setState({
                                                    ...this.state,
                                                    tagQuickCreateModalStaus: true,
                                                })
                                            }
                                        >
                                            <span className="mx-2">
                                                Add new Tag
                                            </span>
                                            <i className="fa fa-plus-circle text-success"></i>
                                        </div>
                                        {props.children}
                                    </components.MenuList>
                                ),
                            }}
                            styles={{
                                control: (provided: any) => ({
                                    ...provided,
                                    height: 'auto',
                                    borderStyle: 'none',
                                    boxShadow: 'none',
                                    borderColor: 'none',
                                }),
                            }}
                            label={'Tags'}
                            placeholder={'Tags'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            isClearable={false}
                            loadOptions={(
                                inputValue: string,
                                callback: (options: any) => void
                            ) =>
                                this.debounceSearchTagList(inputValue, callback)
                            }
                            defaultOptions
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                            // icon={
                            //     <i
                            //         title={'Add New Tag'}
                            //         className="fa fa-plus-circle zoho-icon"
                            //         onClick={() =>
                            //             this.setState({
                            //                 ...this.state,
                            //                 tagQuickCreateModalStaus: true,
                            //             })
                            //         }
                            //     ></i>
                            // }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.NUMBER}
                            name={'price'}
                            label={'Price'}
                            placeholder={'Price'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.CHECKBOX}
                            name={'isActive'}
                            label={'Activation'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.CHECKBOX}
                            name={'tax'}
                            label={'Tax'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                        <FormControl<IProductForm>
                            control={APP_FORM_CONTROL.SWITCH}
                            name={'hasSkuList'}
                            label={'SKU'}
                            apptheme={FORM_ELEMENT_THEME.ZOHO}
                            readOnly={
                                this.state.savePageMode === SAVE_PAGE_MODE.VIEW
                            }
                        />
                    </div>
                </div>
                {formikProps.values.hasSkuList ? (
                    <>
                        <h4 className="font-weight-bold text-capitalize mb-4">
                            product variations
                        </h4>
                        <div className="row">
                            <div className="col-12">
                                <FormControl<IProductForm>
                                    control={
                                        APP_FORM_CONTROL.SKU_LIST_GENERATOR
                                    }
                                    name={'variationSku'}
                                    defaultlangcode={this.defaultLangCode}
                                    errorToast={(
                                        msg: string,
                                        errorId: string
                                    ) =>
                                        this.toastNotify(
                                            msg,
                                            { toastId: errorId },
                                            'warn'
                                        )
                                    }
                                    initialVariationList={
                                        formikProps.values.variationSku
                                            .variationValuesList
                                    }
                                    initialSkuList={
                                        formikProps.values.variationSku.skuList
                                    }
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    readOnly={
                                        this.state.savePageMode ===
                                        SAVE_PAGE_MODE.VIEW
                                    }
                                />
                            </div>
                        </div>
                    </>
                ) : undefined}
                {this.state.savePageMode !== SAVE_PAGE_MODE.CREATE &&
                this.state.savePageMode !== SAVE_PAGE_MODE.COPY ? (
                    <>
                        <h4 className="font-weight-bold text-capitalize mb-4">
                            log history
                        </h4>
                        <div className="row">
                            <div className="col-lg-6 col-md-12 col-sm-12 mb-3">
                                <FormControl<IProductForm>
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
                                <FormControl<IProductForm>
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
                <QuickCreateBrand
                    defaultlangcode={this.defaultLangCode}
                    show={this.state.brandQuickCreateModalStaus}
                    onHide={() =>
                        this.setState({
                            ...this.state,
                            brandQuickCreateModalStaus: false,
                        })
                    }
                    onCreate={(newBrand: IBrand) => {
                        if (newBrand !== undefined) {
                            formikProps.setFieldValue('brand', {
                                label:
                                    newBrand.name[this.defaultLangCode] || '',
                                value: newBrand,
                            });
                        } else {
                            return;
                        }
                    }}
                />
                <QuickCreateTag
                    defaultlangcode={this.defaultLangCode}
                    show={this.state.tagQuickCreateModalStaus}
                    onHide={() =>
                        this.setState({
                            ...this.state,
                            tagQuickCreateModalStaus: false,
                        })
                    }
                    onCreate={(newTag: ITag) => {
                        if (newTag !== undefined) {
                            if (formikProps.values.tags !== null) {
                                let currentValues: Array<{
                                    label: string;
                                    value: ITag;
                                }> = formikProps.values.tags;
                                let newItem: { label: string; value: ITag } = {
                                    label:
                                        newTag.title[this.defaultLangCode] ||
                                        '',
                                    value: newTag,
                                };
                                formikProps.setFieldValue('tags', [
                                    ...currentValues,
                                    newItem,
                                ]);
                            } else {
                                formikProps.setFieldValue('tags', [
                                    {
                                        label:
                                            newTag.title[
                                                this.defaultLangCode
                                            ] || '',
                                        value: newTag,
                                    },
                                ]);
                            }
                        } else {
                            return;
                        }
                    }}
                />
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
export const ProductSave = connect(
    state2props,
    dispatch2props
)(ProductSaveComponent);
