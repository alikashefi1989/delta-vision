import React from 'react';
import { Localization } from '../../../../config/localization/localization';
import {
    IRefund,
    PurchaseType,
    TRefundCreate,
    TRefundUpdate,
} from '../../../../model/refund.model';
import { ILanguage_schema } from '../../../../redux/action/language/languageAction';
import { RefundService } from '../../../../service/refund.service';
import BaseSave, {
    IPropsBaseSave,
    IStateBaseSave,
    SAVE_PAGE_MODE,
} from '../../_base/BaseSave/BaseSave';
import { ROUTE_BASE_CRUD } from '../../_base/BaseUtility';
import { Setup } from '../../../../config/setup';
import { AppRoute } from '../../../../config/route';
import { redux_state } from '../../../../redux/app_state';
import { connect } from 'react-redux';
import { FieldArray, FormikProps } from 'formik';
import {
    APP_FORM_CONTROL,
    FormControl,
} from '../../../form/_formik/FormControl/FormControl';
import { FORM_ELEMENT_THEME } from '../../../form/_formik/FormElementBase/FormElementBase';
import * as Yup from 'yup';
import { IOrder } from '../../../../model/order.model';
import { GRID_CELL_TYPE } from '../../../../enum/grid-cell-type.enum';
import { CmpUtility } from '../../../_base/CmpUtility';
import { RefundReasonService } from '../../../../service/refundReason.service';

interface IRefundFrom {
    sale: IRefund | IOrder | null;
    refundAmount: number | '';
    refundType: {
        label: string;
        value: PurchaseType;
    } | null;
    refundReasons: {
        sku: {
            id: string;
            readableId: string;
        };
        qty: number;
        price: number;
        reason: { label: string; value: string };
    }[];
}

interface IState extends IStateBaseSave<IRefund> {
    formData: IRefundFrom;
}

interface IProps extends IPropsBaseSave {
    language: ILanguage_schema;
}

class RefundSaveComponent extends BaseSave<
    IRefund,
    TRefundCreate,
    TRefundUpdate,
    IProps,
    IState
> {
    private EMPTY_FORM: IRefundFrom = {
        sale: null,
        refundAmount: '',
        refundType: null,
        refundReasons: [],
    };

    state: IState = {
        ...this.baseState,
        formData: this.EMPTY_FORM,
    };

    private modalColumns = [
        {
            accessor: 'readableId',
            cell: GRID_CELL_TYPE.CELL_TEXT_INFO,
            header: 'id',
            title: 'id',
        },
        {
            accessor: 'status',
            cell: GRID_CELL_TYPE.CELL_TEXT,
            header: 'status',
            title: 'status',
        },
        {
            accessor: 'country.name.en',
            cell: GRID_CELL_TYPE.CELL_TEXT,
            header: 'country',
            title: 'country',
        },
        {
            accessor: 'subTotal',
            cell: GRID_CELL_TYPE.CELL_NUMBER,
            header: 'total amount',
            title: 'total amount',
        },
        {
            accessor: 'createdAt',
            cell: GRID_CELL_TYPE.CELL_DATE,
            header: 'creation time',
            title: 'creation time',
        },
    ];

    private _refundReasonService = new RefundReasonService();

    private get defaultLangCode(): string {
        return this.props.language.defaultLanguage?.identifier || '';
    }

    protected _entityService = new RefundService();
    protected appRouteBaseCRUD = ROUTE_BASE_CRUD.refund;

    private _debounceSearchStoreList: any;
    private debounceSearchStoreList(input: string, callback: any) {
        if (this._debounceSearchStoreList)
            clearTimeout(this._debounceSearchStoreList);
        this._debounceSearchStoreList = setTimeout(() => {
            this.searchStoreList(input, callback);
        }, 300);
    }

    private async searchStoreList(input: string, callback: any): Promise<void> {
        try {
            const res = await this._refundReasonService.search({
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
            });

            // const result = this.nestedStoreList(res.data.data.items);
            const result = res.data.data.items.map((a) => ({
                label: a.name[this.defaultLangCode],
                value: a.id,
            }));
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    protected form2CreateModel(form: IRefundFrom): TRefundCreate {
        return {
            orderId: form.sale?.id as string,
            amount: form.refundAmount as number,
            type: form.refundType?.value as PurchaseType,
            items: form.refundReasons.map((reason) => {
                return {
                    skuId: reason.sku.id,
                    qty: reason.qty,
                    price: reason.price,
                    reason: reason.reason.value,
                };
            }),
        };
    }
    protected form2UpdateModel(form: IRefundFrom): TRefundUpdate {
        return this.form2CreateModel(form);
    }
    protected model2Form(data: IRefund): IRefundFrom {
        return {
            sale: data,
            refundAmount: data.returnAmount,
            refundType: {
                label: this.refundTypeLabelCreator(data.returnPaymentType),
                value: data.returnPaymentType,
            },
            refundReasons: data.items.map((item) => {
                return {
                    sku: item.sku,
                    qty: item.qty,
                    price: item.price,
                    reason: {
                        label: item.reason.name[this.defaultLangCode], // TODO: edit this later
                        value: item.reason.id,
                    },
                };
            }),
        };
    }

    refundTypeLabelCreator(type: string): string {
        if (type === PurchaseType.CASH) {
            return PurchaseType.CASH;
        } else {
            return PurchaseType.WALLET;
        }
    }

    protected formValidation = Yup.object({
        name: Yup.string().required(Localization.validation.required_field),
        email: Yup.string()
            .email(Localization.validation.email_format)
            .required(Localization.validation.required_field),
    });

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

    protected goToLanguageManage() {
        this.navigate(AppRoute.routeData.language.manage.url());
    }

    // Country: ${address.country.name[this.defaultLangCode]}
    getOrderAddress(address: IOrder['extraDetail']['address']) {
        return `City: ${address.area.name[this.defaultLangCode]} Street: ${
            address.detail.Street
        }`;
    }

    private generateForm(fromikProps: FormikProps<IRefundFrom>, data: IOrder) {
        if (data) {
            fromikProps.setFieldValue('sale', data);
            fromikProps.setFieldValue('refundAmount', '');
            fromikProps.setFieldValue('refundType', null);
            fromikProps.setFieldValue(
                'refundReasons',
                data.items.map((item) => {
                    return {
                        sku: item.sku,
                        qty: item.qty,
                        price: item.price,
                        reason: null,
                    };
                })
            );
        } else {
            fromikProps.setValues(this.EMPTY_FORM);
        }
    }

    saleInformationRender(sale: IRefund | IOrder | null) {
        // try {
        if (sale) {
            return (
                <div className="card w-100 my-2">
                    <h5 className="card-header bg-transparent font-weight-bold">
                        Sales Information
                    </h5>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className="col-6 text-muted mb-2">
                                        Order ID
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.readableId}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Date
                                    </div>
                                    <div className="col-6 mb-3">
                                        {CmpUtility.timestamp2Date(
                                            sale.updatedAt / 1000
                                        )}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Customer Email
                                    </div>
                                    <div className="col-6 text-info mb-3">
                                        {sale.extraDetail.customer.email}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Phone Number
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.extraDetail.customer.phone}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Delivery Address
                                    </div>
                                    <div className="col-6 mb-3">
                                        {this.getOrderAddress(
                                            sale.extraDetail.address
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6">
                                <div className="row">
                                    <div className="col-6 text-muted mb-3">
                                        Payment Type
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.readableId}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Total Amount
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.subTotal
                                            ? sale.subTotal
                                            : 'there is no data'}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Total Delivery Charges
                                    </div>
                                    <div className="col-6 text-info mb-3">
                                        {}
                                    </div>

                                    <div className="col-6 text-muted mb-3">
                                        Cupon
                                    </div>
                                    <div className="col-6 mb-3">
                                        {sale.extraDetail.coupon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
        // } catch (error) {
        //     this.toastNotify(
        //         'there is an error with api response',
        //         {
        //             delay: 1000,
        //             toastId: 'djsensv39r74387q',
        //         },
        //         'error'
        //     );
        // }
    }

    refundDetailsRender(formikProps: FormikProps<IRefundFrom>) {
        return (
            <div className="card w-100 my-2">
                <h5 className="card-header bg-transparent font-weight-bold">
                    Sales Information
                </h5>
                <div className="card-body p-0">
                    <table className="table table-hover text-center">
                        <thead>
                            <tr>
                                <th scope="col" className="text-muted">
                                    SKU
                                </th>
                                <th scope="col" className="text-muted">
                                    Price
                                </th>
                                <th scope="col" className="text-muted">
                                    Amount
                                </th>
                                <th scope="col" className="text-muted">
                                    Refund reasons
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <FieldArray
                                name="refundReasons"
                                render={(arrHelper) => {
                                    return (
                                        <>
                                            {formikProps.values.refundReasons.map(
                                                (res, index) => (
                                                    <tr key={index}>
                                                        <th
                                                            scope="row"
                                                            className="text-info font-weight-normal"
                                                        >
                                                            {res.sku.readableId}
                                                        </th>
                                                        <td className="font-weight-normal">
                                                            {res.price} KD
                                                        </td>
                                                        <td className="font-weight-normal">
                                                            {res.qty}
                                                        </td>
                                                        <td className="font-weight-normal d-flex justify-content-center">
                                                            <FormControl
                                                                control={
                                                                    APP_FORM_CONTROL.ASYNCSELECT
                                                                }
                                                                name={`${'refundReasons'}[${index}][reason]`}
                                                                required
                                                                controlClassName="m-0 w-50"
                                                                apptheme={
                                                                    FORM_ELEMENT_THEME.DEFAULT
                                                                }
                                                                // isClearable={true}
                                                                loadOptions={(
                                                                    inputValue: string,
                                                                    callback: (
                                                                        options: any
                                                                    ) => void
                                                                ) =>
                                                                    this.debounceSearchStoreList(
                                                                        inputValue,
                                                                        callback
                                                                    )
                                                                }
                                                                defaultOptions
                                                                readOnly={
                                                                    this.state
                                                                        .savePageMode ===
                                                                    SAVE_PAGE_MODE.VIEW
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </>
                                    );
                                }}
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    saveFormBodyRender(formikProps: FormikProps<IRefundFrom>): JSX.Element {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-7">
                        <div className="row">
                            <div className="col-12 mb-3">
                                <h4 className="font-weight-bold">
                                    Sales Return Information
                                </h4>
                            </div>
                            <div className="col-12">
                                <FormControl<IRefundFrom>
                                    control={APP_FORM_CONTROL.LOOKUP}
                                    name={'sale'}
                                    label={Localization.sales_id}
                                    placeholder={Localization.sales_id}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    required
                                    readOnly={
                                        this.state.savePageMode ===
                                        SAVE_PAGE_MODE.VIEW
                                    }
                                    isClearable
                                    modalHeader={
                                        <span className="text-capitalize">
                                            choose sale id
                                        </span>
                                    }
                                    icon={
                                        <i className="fa fa-user zoho-icon"></i>
                                    }
                                    modalColumns={this.modalColumns}
                                    entityName={ROUTE_BASE_CRUD.order}
                                    searchAccessor={'readableId'}
                                    defaultFilter={{ status: 'success' }}
                                    onChange={(e: IOrder) => {
                                        this.generateForm(formikProps, e);
                                    }}
                                />
                            </div>
                            <div className="col-12">
                                <FormControl<IRefundFrom>
                                    control={APP_FORM_CONTROL.INPUT}
                                    name={'refundAmount'}
                                    label={Localization.refund_amount}
                                    placeholder={Localization.refund_amount}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    required
                                    readOnly={
                                        this.state.savePageMode ===
                                        SAVE_PAGE_MODE.VIEW
                                    }
                                />
                            </div>
                            <div className="col-12">
                                <FormControl<IRefundFrom>
                                    control={APP_FORM_CONTROL.SELECT}
                                    name={'refundType'}
                                    label={Localization.refund_type}
                                    placeholder={Localization.refund_type}
                                    required
                                    options={[
                                        {
                                            label: 'Wallet',
                                            value: PurchaseType.WALLET,
                                        },
                                        {
                                            label: 'Cash',
                                            value: PurchaseType.CASH,
                                        },
                                    ]}
                                    apptheme={FORM_ELEMENT_THEME.ZOHO}
                                    readOnly={
                                        this.state.savePageMode ===
                                        SAVE_PAGE_MODE.VIEW
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {formikProps.values.sale ? (
                    <div className="row mt-3">
                        {this.saleInformationRender(formikProps.values.sale)}
                        {this.refundDetailsRender(formikProps)}
                    </div>
                ) : null}
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

export const RefundSave = connect(state2props)(RefundSaveComponent);
