import React, { Fragment } from 'react';
import { Field, /*FieldArray,*/ FieldProps } from 'formik';
import {
    FormElementBase,
    FORM_ELEMENT_THEME,
} from '../FormElementBase/FormElementBase';
import { APP_FORM_CONTROL, FormControl } from '../FormControl/FormControl';
import {
    IVariation,
    IVariationItem,
    IVariationItemCreate,
} from '../../../../model/variation.model';
import { IZohoFormElementBaseProps } from '../FormElementBase/ZohoFormElementBase';
import { ISkuOfProduct } from '../../../../model/product.model';
import { VariationService } from '../../../../service/variation.service';

interface FieldModel {
    variationValuesList: Array<{
        variation: { label: string; value: IVariation } | null;
        values: Array<{ label: string; value: IVariationItem }> | null;
    }>;
    skuList: Array<ISkuOfProduct>;
}

interface InitialArrayModel {
    list: Array<Array<{ variation: IVariation; item: IVariationItem }>>;
    baseSku: Array<Array<{ variation: IVariation; item: IVariationItem }>>;
}

export interface IProps<T> extends IZohoFormElementBaseProps<T> {
    control: APP_FORM_CONTROL.SKU_LIST_GENERATOR;
    defaultlangcode: string;
    errorToast: (msg: string, errorId: string) => void;
    initialVariationList: FieldModel['variationValuesList'] | undefined;
    initialSkuList: FieldModel['skuList'] | undefined;
}

interface IState {
    ignoredItems: Array<ISkuOfProduct>;
    addNewItemStatus: boolean;
}

export class ZohoSkuListGenerator<T> extends FormElementBase<
    T,
    IProps<T>,
    IState
> {
    state = {
        ignoredItems: [],
        addNewItemStatus: false,
    };

    private _variationService = new VariationService();

    componentDidMount() {
        if (
            !this.props.initialVariationList ||
            this.props.initialVariationList.length === 0 ||
            (this.props.initialSkuList !== undefined &&
                this.props.initialSkuList.length === 1 &&
                (this.props.initialSkuList[0].variations === undefined ||
                    this.props.initialSkuList[0].variations.length === 0))
        ) {
            this.setState({ ...this.state, ignoredItems: [] });
        } else {
            let listOfVariatioValue: InitialArrayModel = this.initialArrayCreator(
                this.props.initialVariationList
            );

            let initialSkuVariations: Array<
                Array<{
                    variation: IVariation;
                    item: IVariationItem;
                }>
            > = this.variationMixer(listOfVariatioValue);

            let initialPureSkuList: Array<ISkuOfProduct> = initialSkuVariations.map(
                (
                    item: Array<{
                        variation: IVariation;
                        item: IVariationItem;
                    }>
                ) => {
                    return {
                        sku: '',
                        varianteName: this.varianteNameCreator(item),
                        medias: [],
                        variations: item,
                        isDiscountable: true,
                        barcode: '',
                    };
                }
            );

            let ignoredIndex: Array<number> = [];
            let initialSkulist: Array<ISkuOfProduct> =
                this.props.initialSkuList === undefined
                    ? []
                    : this.props.initialSkuList;

            for (let i = 0; i < initialPureSkuList.length; i++) {
                let item: ISkuOfProduct = initialPureSkuList[i];
                let isRendered: boolean = false;
                for (let j = 0; j < initialSkulist.length; j++) {
                    let renderdItem: ISkuOfProduct = initialSkulist[j];
                    let res: boolean = this.isEqual(renderdItem, item);
                    if (res === true) {
                        isRendered = true;
                        break;
                    }
                }
                if (isRendered === false) {
                    ignoredIndex.push(i);
                }
            }

            let newIgnoredItems: Array<ISkuOfProduct> = [];
            for (let i = 0; i < ignoredIndex.length; i++) {
                let index: number = ignoredIndex[i];
                newIgnoredItems.push(initialPureSkuList[index]);
            }
            this.setState({ ...this.state, ignoredItems: newIgnoredItems });
        }
    }

    skuIdGenerator(list: ISkuOfProduct['variations'] | undefined): string {
        if (!list || list.length === 0) {
            return '';
        } else {
            let IdOfSku: string = '';
            for (let i = 0; i < list.length; i++) {
                IdOfSku =
                    IdOfSku +
                    list[i].variation.id +
                    '-' +
                    list[i].item.id +
                    '-';
            }
            return IdOfSku;
        }
    }

    addNewRowToVariationValuesList(
        fieldValue: FieldModel,
        setFieldValue: (field: string, value: FieldModel) => void
    ) {
        let value: FieldModel['variationValuesList'] =
            fieldValue.variationValuesList;
        let newItem: {
            variation: { label: string; value: IVariation } | null;
            values: Array<{ label: string; value: IVariationItem }> | null;
        } = { variation: null, values: null };
        value.push(newItem);
        let newFieldValue: FieldModel = fieldValue;
        newFieldValue.variationValuesList = value;
        setFieldValue(this.props.name as string, newFieldValue);
    }

    clearFromIgnoredItems(v_id: string, sku: ISkuOfProduct): boolean {
        let skuId: string = this.skuIdGenerator(sku.variations);
        return skuId.includes(v_id);
    }

    removeRowFromVariationValuesList(
        fieldValue: FieldModel,
        index: number,
        setFieldValue: (field: string, value: FieldModel) => void
    ) {
        let value: FieldModel['variationValuesList'] =
            fieldValue.variationValuesList;
        let IdOfVariationForREmove: string | undefined =
            value[index].variation === null
                ? undefined
                : value[index].variation?.value.id;
        value.splice(index, 1);
        let newFieldValue: FieldModel = fieldValue;
        newFieldValue.variationValuesList = value;
        setFieldValue(this.props.name as string, newFieldValue);
        if (IdOfVariationForREmove) {
            let newIgnoredItems: Array<ISkuOfProduct> = [];
            for (let i = 0; i < this.state.ignoredItems.length; i++) {
                let item: ISkuOfProduct = this.state.ignoredItems[i];
                if (
                    this.clearFromIgnoredItems(IdOfVariationForREmove, item) ===
                    false
                ) {
                    newIgnoredItems.push(item);
                }
            }
            this.setState(
                { ...this.state, ignoredItems: newIgnoredItems },
                () => this.skuListGenerator(newFieldValue, setFieldValue)
            );
        }
    }

    isExistSelectedVariationInList(
        selectedVariationId: string,
        variationValuesList: Array<{
            variation: { label: string; value: IVariation } | null;
            values: Array<{ label: string; value: IVariationItem }> | null;
        }>
    ): boolean {
        let isExist: boolean = false;
        for (let i = 0; i < variationValuesList.length; i++) {
            let item: {
                variation: { label: string; value: IVariation } | null;
                values: Array<{ label: string; value: IVariationItem }> | null;
            } = variationValuesList[i];
            let itemVariationId: string | undefined =
                item.variation === null ? undefined : item.variation.value.id;
            if (
                typeof itemVariationId === 'string' &&
                selectedVariationId === itemVariationId
            ) {
                isExist = true;
                break;
            }
        }
        return isExist;
    }

    onVariationChange(
        fieldValue: FieldModel,
        index: number,
        newValue: { label: string; value: IVariation } | null,
        setFieldValue: (field: string, value: FieldModel) => void
    ) {
        if (newValue !== null) {
            if (
                this.isExistSelectedVariationInList(
                    newValue.value.id,
                    fieldValue.variationValuesList
                )
            ) {
                this.props.errorToast(
                    'This variation exists in other rows',
                    'variation_duplicate_error'
                );
                return;
            } else {
                let previousVariation: {
                    label: string;
                    value: IVariation;
                } | null = fieldValue.variationValuesList[index].variation;
                let rowNewVariationValue: {
                    variation: { label: string; value: IVariation } | null;
                    values: Array<{
                        label: string;
                        value: IVariationItem;
                    }> | null;
                } = { variation: newValue, values: null };
                let newFieldValue: FieldModel = fieldValue;
                newFieldValue.variationValuesList[index] = rowNewVariationValue;
                setFieldValue(this.props.name as string, newFieldValue);
                if (previousVariation !== null) {
                    let previousVariationId: string =
                        previousVariation.value.id;
                    let newIgnoredItems: Array<ISkuOfProduct> = [];
                    for (let i = 0; i < this.state.ignoredItems.length; i++) {
                        let item: ISkuOfProduct = this.state.ignoredItems[i];
                        if (
                            this.clearFromIgnoredItems(
                                previousVariationId,
                                item
                            ) === false
                        ) {
                            newIgnoredItems.push(item);
                        }
                    }
                    this.setState(
                        { ...this.state, ignoredItems: newIgnoredItems },
                        () =>
                            this.skuListGenerator(newFieldValue, setFieldValue)
                    );
                }
            }
        } else {
            this.props.errorToast(
                "The value can't null",
                'variation_can_not_null_error'
            );
        }
    }

    detectRemovedItemId(
        previousValue: Array<{ label: string; value: IVariationItem }>,
        newValue: Array<{ label: string; value: IVariationItem }>
    ): string {
        let previousValueIds: Array<string> = previousValue.map(
            (item: { label: string; value: IVariationItem }) => {
                return item.value.id;
            }
        );
        let newValueIds: Array<string> = newValue.map(
            (item: { label: string; value: IVariationItem }) => {
                return item.value.id;
            }
        );
        let result: Array<string> = previousValueIds.filter((id: string) => {
            return !newValueIds.includes(id);
        });
        let id: string = result.length > 0 ? result[0] : '';
        return id;
    }

    isExistDuplicate(
        newValue: Array<{ label: string; value: IVariationItem }>
    ): boolean {
        if (newValue.length <= 1) {
            return false;
        } else {
            let result: boolean = false;
            for (let i = 0; i < newValue.length; i++) {
                if (result === true) {
                    break;
                }
                let testedItem: string = newValue[i].value.id;
                let count: number = 0;
                for (let j = 0; j < newValue.length; j++) {
                    let item: string = newValue[j].value.id;
                    if (testedItem === item) {
                        count = count + 1;
                    }
                    if (count > 1) {
                        result = true;
                        break;
                    }
                }
            }
            return result;
        }
    }

    onVariationItemsChange(
        fieldValue: FieldModel,
        index: number,
        newValue: Array<{ label: string; value: IVariationItem }> | null,
        setFieldValue: (field: string, value: FieldModel) => void
    ) {
        let previousValue: Array<{
            label: string;
            value: IVariationItem;
        }> | null = fieldValue.variationValuesList[index].values;
        if (
            (newValue === null || newValue.length === 0) &&
            (previousValue === null || previousValue.length === 0)
        ) {
            return;
        } else if (
            (newValue === null || newValue.length === 0) &&
            previousValue !== null &&
            previousValue.length > 0
        ) {
            let removedValuesItemId: string = previousValue[0].value.id;
            let newFieldValue: FieldModel = fieldValue;
            newFieldValue.variationValuesList[index].values = newValue;
            setFieldValue(this.props.name as string, newFieldValue);
            let newIgnoredItems: Array<ISkuOfProduct> = [];
            for (let i = 0; i < this.state.ignoredItems.length; i++) {
                let item: ISkuOfProduct = this.state.ignoredItems[i];
                if (
                    this.clearFromIgnoredItems(removedValuesItemId, item) ===
                    false
                ) {
                    newIgnoredItems.push(item);
                }
            }
            this.setState(
                { ...this.state, ignoredItems: newIgnoredItems },
                () => this.skuListGenerator(newFieldValue, setFieldValue)
            );
        } else if (
            (previousValue === null || previousValue.length === 0) &&
            newValue !== null &&
            newValue.length > 0
        ) {
            let newFieldValue: FieldModel = fieldValue;
            newFieldValue.variationValuesList[index].values = newValue;
            setFieldValue(this.props.name as string, newFieldValue);
            this.skuListGenerator(newFieldValue, setFieldValue);
        } else if (
            previousValue !== null &&
            previousValue.length > 0 &&
            newValue !== null &&
            newValue.length > 0
        ) {
            let previousValueLength: number = previousValue.length;
            let newValueLength: number = newValue.length;
            if (newValueLength > previousValueLength) {
                if (this.isExistDuplicate(newValue) === true) {
                    this.props.errorToast(
                        'This value already exists',
                        'value_duplicate_exist_error'
                    );
                    return;
                }
                let newFieldValue: FieldModel = fieldValue;
                newFieldValue.variationValuesList[index].values = newValue;
                setFieldValue(this.props.name as string, newFieldValue);
                this.skuListGenerator(newFieldValue, setFieldValue);
            } else if (newValueLength < previousValueLength) {
                let removedValuesItemId: string = this.detectRemovedItemId(
                    previousValue,
                    newValue
                );
                let newFieldValue: FieldModel = fieldValue;
                newFieldValue.variationValuesList[index].values = newValue;
                setFieldValue(this.props.name as string, newFieldValue);
                let newIgnoredItems: Array<ISkuOfProduct> = [];
                for (let i = 0; i < this.state.ignoredItems.length; i++) {
                    let item: ISkuOfProduct = this.state.ignoredItems[i];
                    if (
                        this.clearFromIgnoredItems(
                            removedValuesItemId,
                            item
                        ) === false
                    ) {
                        newIgnoredItems.push(item);
                    }
                }
                this.setState(
                    { ...this.state, ignoredItems: newIgnoredItems },
                    () => this.skuListGenerator(newFieldValue, setFieldValue)
                );
            } else {
                return;
            }
        } else {
            return;
        }
    }

    onSkuItemRemove(
        fieldValue: FieldModel,
        index: number,
        setFieldValue: (field: string, value: FieldModel) => void
    ) {
        let removedSku: ISkuOfProduct = fieldValue.skuList[index];
        let newSkuList: Array<ISkuOfProduct> = fieldValue.skuList;
        newSkuList.splice(index, 1);
        let newFieldValue: FieldModel = fieldValue;
        newFieldValue.skuList = newSkuList;
        let newIgnoredItems: Array<ISkuOfProduct> = this.state.ignoredItems;
        newIgnoredItems.push(removedSku);
        this.setState({ ...this.state, ignoredItems: newIgnoredItems }, () =>
            setFieldValue(this.props.name as string, newFieldValue)
        );
    }

    initialArrayCreator(
        list?: FieldModel['variationValuesList']
    ): InitialArrayModel {
        if (list !== undefined && list.length && list.length > 0) {
            let finalList: Array<
                Array<{ variation: IVariation; item: IVariationItem }>
            > = [];
            for (let i = 0; i < list.length; i++) {
                let listOfItem: Array<{
                    variation: IVariation;
                    item: IVariationItem;
                }> = [];
                let item: {
                    variation: { label: string; value: IVariation } | null;
                    values: Array<{
                        label: string;
                        value: IVariationItem;
                    }> | null;
                } = list[i];
                if (
                    item.variation !== null &&
                    item.values !== null &&
                    item.values.length > 0
                ) {
                    for (let j = 0; j < item.values.length; j++) {
                        let itemOfVariatioValue: {
                            variation: IVariation;
                            item: IVariationItem;
                        } = {
                            variation: item.variation.value,
                            item: item.values[j].value,
                        };
                        listOfItem.push(itemOfVariatioValue);
                    }
                }
                if (listOfItem.length > 0) {
                    finalList.push(listOfItem);
                }
            }
            if (finalList.length && finalList.length > 0) {
                let zeroIndexValue: Array<
                    Array<{ variation: IVariation; item: IVariationItem }>
                > = finalList[0].map(
                    (item: { variation: IVariation; item: IVariationItem }) => {
                        return [item];
                    }
                );
                let result: Array<
                    Array<{ variation: IVariation; item: IVariationItem }>
                > = finalList;
                result.splice(0, 1);
                // debugger
                return {
                    list: result,
                    baseSku: zeroIndexValue,
                };
            } else {
                return {
                    list: [],
                    baseSku: [],
                };
            }
        } else {
            return {
                list: [],
                baseSku: [],
            };
        }
    }

    variationMixer(
        data: InitialArrayModel
    ): Array<Array<{ variation: IVariation; item: IVariationItem }>> {
        // debugger
        if (data.baseSku.length && data.baseSku.length > 0) {
            if (!data.list.length || data.list.length === 0) {
                return data.baseSku;
            } else {
                let baseSku: Array<
                    Array<{ variation: IVariation; item: IVariationItem }>
                > = data.baseSku;
                let newBaseSku: Array<
                    Array<{ variation: IVariation; item: IVariationItem }>
                > = [];
                let zeroIndex: Array<{
                    variation: IVariation;
                    item: IVariationItem;
                }> = data.list[0];
                for (let i = 0; i < baseSku.length; i++) {
                    // debugger
                    for (let j = 0; j < zeroIndex.length; j++) {
                        // let sku: Array<{ variation: IVariation; item: IVariationItem }> = data.baseSku[i];
                        // debugger
                        let variationValue: {
                            variation: IVariation;
                            item: IVariationItem;
                        } = zeroIndex[j];
                        // debugger
                        // sku.push(variationValue);
                        let newSku: Array<{
                            variation: IVariation;
                            item: IVariationItem;
                        }> = [...data.baseSku[i], variationValue];
                        if (newSku.length && newSku.length > 0) {
                            newBaseSku.push(newSku);
                        }
                        // debugger
                    }
                }
                let newList: Array<
                    Array<{ variation: IVariation; item: IVariationItem }>
                > = data.list;
                newList.splice(0, 1);
                // debugger
                return this.variationMixer({
                    baseSku: newBaseSku,
                    list: newList,
                });
            }
        } else {
            return [];
        }
    }

    varianteNameCreator(
        list: Array<{ variation: IVariation; item: IVariationItem }>
    ): string {
        let varianteName: string = '';
        for (let i = 0; i < list.length; i++) {
            let variant: {
                variation: IVariation;
                item: IVariationItem;
            } = list[i];
            if (
                variant.item.name &&
                variant.item.name[this.props.defaultlangcode] &&
                typeof variant.item.name[this.props.defaultlangcode] ===
                    'string' &&
                variant.item.name[this.props.defaultlangcode] !== ''
            ) {
                if (list.length - i > 1) {
                    varianteName =
                        varianteName +
                        variant.item.name[this.props.defaultlangcode] +
                        '/';
                } else {
                    varianteName =
                        varianteName +
                        variant.item.name[this.props.defaultlangcode];
                }
            }
        }
        return varianteName;
    }

    isEqual(previousSku: ISkuOfProduct, currentSku: ISkuOfProduct): boolean {
        let previousSkuIds: Array<string> = [];
        for (let i = 0; i < previousSku.variations.length; i++) {
            let item: {
                variation: IVariation;
                item: IVariationItem;
            } = previousSku.variations[i];
            previousSkuIds.push(item.variation.id, item.item.id);
        }
        let currentSkuIds: Array<string> = [];
        for (let i = 0; i < currentSku.variations.length; i++) {
            let item: {
                variation: IVariation;
                item: IVariationItem;
            } = currentSku.variations[i];
            currentSkuIds.push(item.variation.id, item.item.id);
        }
        let dif: Array<string> = currentSkuIds.filter((id: string) => {
            return !previousSkuIds.includes(id);
        });
        if (!dif.length && currentSkuIds.length === previousSkuIds.length) {
            return true;
        } else {
            return false;
        }
    }

    isSimilar(previousSku: ISkuOfProduct, currentSku: ISkuOfProduct): boolean {
        let previousSkuIds: Array<string> = [];
        for (let i = 0; i < previousSku.variations.length; i++) {
            let item: {
                variation: IVariation;
                item: IVariationItem;
            } = previousSku.variations[i];
            previousSkuIds.push(item.variation.id, item.item.id);
        }
        let currentSkuIds: Array<string> = [];
        for (let i = 0; i < currentSku.variations.length; i++) {
            let item: {
                variation: IVariation;
                item: IVariationItem;
            } = currentSku.variations[i];
            currentSkuIds.push(item.variation.id, item.item.id);
        }
        let dif: Array<string> = previousSkuIds.filter((id: string) => {
            return !currentSkuIds.includes(id);
        });
        if (!dif.length && currentSkuIds.length >= previousSkuIds.length) {
            return true;
        } else {
            return false;
        }
    }

    skuListGenerator(
        fieldValue: FieldModel,
        setFieldValue: (field: string, value: FieldModel) => void
    ) {
        let listOfVariatioValue: InitialArrayModel = this.initialArrayCreator(
            fieldValue.variationValuesList
        );
        let skuVariations: Array<
            Array<{
                variation: IVariation;
                item: IVariationItem;
            }>
        > = this.variationMixer(listOfVariatioValue);

        let newSkuList: Array<ISkuOfProduct> = skuVariations.map(
            (
                item: Array<{
                    variation: IVariation;
                    item: IVariationItem;
                }>
            ) => {
                return {
                    sku: '',
                    varianteName: this.varianteNameCreator(item),
                    medias: [],
                    variations: item,
                    isDiscountable: true,
                    barcode: '',
                };
            }
        );

        let ignoredIndex: Array<number> = [];
        for (let i = 0; i < newSkuList.length; i++) {
            let item: ISkuOfProduct = newSkuList[i];
            for (let j = 0; j < this.state.ignoredItems.length; j++) {
                let ignoredItem: ISkuOfProduct = this.state.ignoredItems[j];
                let isIgnord: boolean = this.isEqual(ignoredItem, item);
                if (isIgnord === true) {
                    ignoredIndex.push(i);
                    break;
                }
            }
        }
        for (let i = ignoredIndex.length - 1; i >= 0; i--) {
            let index: number = ignoredIndex[i];
            newSkuList.splice(index, 1);
        }

        let previousSkuList: Array<ISkuOfProduct> = fieldValue.skuList;

        for (let i = 0; i < newSkuList.length; i++) {
            const item: ISkuOfProduct = newSkuList[i];
            for (let j = 0; j < previousSkuList.length; j++) {
                const preItem: ISkuOfProduct = previousSkuList[j];
                if (this.isSimilar(preItem, item)) {
                    newSkuList[i].sku = previousSkuList[j].sku;
                    newSkuList[i].isDiscountable =
                        previousSkuList[j].isDiscountable;
                    newSkuList[i].barcode = previousSkuList[j].barcode;
                    newSkuList[i].medias = previousSkuList[j].medias;
                    break;
                }
            }
        }

        for (let i = 0; i < newSkuList.length; i++) {
            const item: ISkuOfProduct = newSkuList[i];
            for (let j = 0; j < previousSkuList.length; j++) {
                const preItem: ISkuOfProduct = previousSkuList[j];
                if (this.isEqual(preItem, item)) {
                    newSkuList[i].sku = previousSkuList[j].sku;
                    newSkuList[i].isDiscountable =
                        previousSkuList[j].isDiscountable;
                    newSkuList[i].barcode = previousSkuList[j].barcode;
                    newSkuList[i].medias = previousSkuList[j].medias;
                    break;
                }
            }
        }

        let newFieldValue: FieldModel = fieldValue;
        newFieldValue.skuList = newSkuList;
        setFieldValue(this.props.name as string, newFieldValue);
    }

    private _debounceSearchVariationsList: any;
    private debounceSearchVariationsList(input: string, callback: any) {
        if (this._debounceSearchVariationsList)
            clearTimeout(this._debounceSearchVariationsList);
        this._debounceSearchVariationsList = setTimeout(() => {
            this.variationsList(input, callback);
        }, 300);
    }

    protected async variationsList(search: any, callBack: any): Promise<void> {
        try {
            let res = await this._variationService.search({
                filter: {
                    [`name.${this.props.defaultlangcode}`]: {
                        $regex: search,
                        $options: 'i',
                    },
                },
            });
            let options: Array<{
                label: string;
                value: IVariation;
            }> = res.data.data.items.map((item: IVariation) => {
                return {
                    label: item.name[this.props.defaultlangcode] || '',
                    value: item,
                };
            });
            callBack(options);
        } catch (error) {
            callBack([]);
        }
    }

    private _debounceSearchVariationItemsList: any;
    private debounceSearchVariationItemsList(
        variationId: string | undefined,
        search: any,
        callBack: any
    ) {
        if (this._debounceSearchVariationItemsList)
            clearTimeout(this._debounceSearchVariationItemsList);
        this._debounceSearchVariationItemsList = setTimeout(() => {
            this.variationItemsList(variationId, search, callBack);
        }, 300);
    }

    protected async variationItemsList(
        variationId: string | undefined,
        search: any,
        callBack: any
    ): Promise<void> {
        if (variationId === undefined) {
            callBack([]);
        } else {
            try {
                let requestBody = {
                    filter: {
                        [`name.${this.props.defaultlangcode}`]: {
                            $regex: search,
                            $options: 'i',
                        },
                        variationId: variationId,
                    },
                };
                let res = await this._variationService.searchItemsOfVariation(
                    requestBody
                );
                let options: Array<{
                    label: string;
                    value: IVariationItem;
                }> = res.data.data.items.map((item: IVariationItem) => {
                    return {
                        label: item.name[this.props.defaultlangcode] || '',
                        value: item,
                    };
                });
                callBack(options);
            } catch (error) {
                callBack([]);
            }
        }
    }

    protected async addNewVariationItem(
        event: any,
        variationId: string | undefined,
        index: number,
        fieldValue: FieldModel,
        setFieldValue: (field: string, value: FieldModel) => void
    ) {
        if (event.keyCode === 13) {
            if (variationId === undefined) {
                this.props.errorToast(
                    'Please select variation type',
                    'variation_type_null_error'
                );
                return;
            }
            this.setState({ ...this.state, addNewItemStatus: true });
            let newItem: IVariationItemCreate = {
                name: { [this.props.defaultlangcode]: event.target.value },
                values: [],
            };

            try {
                const res = await this._variationService.addNewItemToVariation(
                    variationId,
                    newItem
                );
                const addedItem: {
                    label: string;
                    value: IVariationItem;
                } = {
                    label: res.data.data.name[this.props.defaultlangcode]
                        ? res.data.data.name[this.props.defaultlangcode]
                        : '',
                    value: res.data.data,
                };

                let newFieldValue: FieldModel = fieldValue;
                let currentValues: Array<{
                    label: string;
                    value: IVariationItem;
                }> | null = fieldValue.variationValuesList[index].values;
                if (currentValues === null) {
                    newFieldValue.variationValuesList[index].values = [
                        addedItem,
                    ];
                } else {
                    currentValues.push(addedItem);
                    newFieldValue.variationValuesList[
                        index
                    ].values = currentValues;
                }
                this.setState({ ...this.state, addNewItemStatus: false }, () =>
                    setFieldValue(this.props.name as string, newFieldValue)
                );
            } catch (error) {
                this.setState({ ...this.state, addNewItemStatus: false }, () =>
                    this.props.errorToast(
                        'Failed to add a new item, please try again',
                        'add_variation_item_failed'
                    )
                );
            }
        }
    }

    protected fieldRender() {
        const { name, ...rest } = this.props;
        return (
            <>
                <Field name={name} {...rest}>
                    {({ form, field }: FieldProps<FieldModel, T>) => {
                        const { value } = field;
                        const { setFieldValue } = form;
                        return (
                            <>
                                {/* <FieldArray name={name as string}>
                            {arrayHelpers => <> */}
                                {value.variationValuesList.map(
                                    (
                                        variationValue: {
                                            variation: {
                                                label: string;
                                                value: IVariation;
                                            } | null;
                                            values: Array<{
                                                label: string;
                                                value: IVariationItem;
                                            }> | null;
                                        },
                                        index: number
                                    ) => (
                                        <Fragment key={'variation' + index}>
                                            <div
                                                className="row"
                                                key={'variation' + index}
                                            >
                                                <div className="col-3">
                                                    <FormControl
                                                        control={
                                                            APP_FORM_CONTROL.ASYNCSELECT
                                                        }
                                                        name={`${name}['variationValuesList'][${index}][variation]`}
                                                        isMulti={false}
                                                        components={{
                                                            DropdownIndicator: () => (
                                                                <i className="fa fa-caret-down mx-3"></i>
                                                            ),
                                                            IndicatorSeparator: () =>
                                                                null,
                                                        }}
                                                        placeholder={
                                                            'variation'
                                                        }
                                                        apptheme={
                                                            FORM_ELEMENT_THEME.ZOHO
                                                        }
                                                        controlClassName={
                                                            'without-label'
                                                        }
                                                        isClearable={false}
                                                        loadOptions={(
                                                            inputValue: string,
                                                            callback: (
                                                                options: any
                                                            ) => void
                                                        ) =>
                                                            this.debounceSearchVariationsList(
                                                                inputValue,
                                                                callback
                                                            )
                                                        }
                                                        onChange={(
                                                            v: {
                                                                label: string;
                                                                value: IVariation;
                                                            } | null
                                                        ) =>
                                                            this.onVariationChange(
                                                                value,
                                                                index,
                                                                v,
                                                                setFieldValue
                                                            )
                                                        }
                                                        defaultOptions
                                                        // required
                                                        isDisabled={
                                                            this.state
                                                                .addNewItemStatus
                                                        }
                                                        styles={{
                                                            control: (
                                                                provided: any
                                                            ) => ({
                                                                ...provided,
                                                                height: 'auto',
                                                                borderStyle:
                                                                    'none',
                                                                boxShadow:
                                                                    'none',
                                                                borderColor:
                                                                    'none',
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        index === 0
                                                            ? 'col-9'
                                                            : 'col-8'
                                                    }
                                                >
                                                    <FormControl
                                                        control={
                                                            APP_FORM_CONTROL.ASYNCSELECT
                                                        }
                                                        name={`${name}['variationValuesList'][${index}][values]`}
                                                        isMulti={true}
                                                        components={{
                                                            DropdownIndicator: () => (
                                                                <i className="fa fa-caret-down mx-3"></i>
                                                            ),
                                                            IndicatorSeparator: () =>
                                                                null,
                                                        }}
                                                        placeholder={'values'}
                                                        apptheme={
                                                            FORM_ELEMENT_THEME.ZOHO
                                                        }
                                                        controlClassName={
                                                            'without-label'
                                                        }
                                                        isClearable={false}
                                                        loadOptions={(
                                                            inputValue: string,
                                                            callback: (
                                                                options: any
                                                            ) => void
                                                        ) =>
                                                            this.debounceSearchVariationItemsList(
                                                                value
                                                                    .variationValuesList[
                                                                    index
                                                                ] ===
                                                                    undefined ||
                                                                    value
                                                                        .variationValuesList[
                                                                        index
                                                                    ]
                                                                        .variation ===
                                                                        undefined ||
                                                                    value
                                                                        .variationValuesList[
                                                                        index
                                                                    ]
                                                                        .variation ===
                                                                        null
                                                                    ? undefined
                                                                    : value
                                                                          .variationValuesList[
                                                                          index
                                                                      ]
                                                                          .variation
                                                                          ?.value
                                                                          .id,
                                                                inputValue,
                                                                callback
                                                            )
                                                        }
                                                        // onKeyDown={(e: any) => this.addNewVariationItem(e,
                                                        //     ((value.variationValuesList[index] === undefined ||
                                                        //         value.variationValuesList[index].variation === undefined ||
                                                        //         value.variationValuesList[index].variation === null) ?
                                                        //         undefined : value.variationValuesList[index].variation?.value.id),
                                                        //     index, value, setFieldValue)}
                                                        onChange={(
                                                            v: Array<{
                                                                label: string;
                                                                value: IVariationItem;
                                                            }> | null
                                                        ) =>
                                                            this.onVariationItemsChange(
                                                                value,
                                                                index,
                                                                v,
                                                                setFieldValue
                                                            )
                                                        }
                                                        defaultOptions
                                                        // required
                                                        isDisabled={
                                                            this.state
                                                                .addNewItemStatus
                                                        }
                                                        styles={{
                                                            control: (
                                                                provided: any
                                                            ) => ({
                                                                ...provided,
                                                                height: 'auto',
                                                                borderStyle:
                                                                    'none',
                                                                boxShadow:
                                                                    'none',
                                                                borderColor:
                                                                    'none',
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-1 text-right">
                                                    {index === 0 ? undefined : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                this.removeRowFromVariationValuesList(
                                                                    value,
                                                                    index,
                                                                    setFieldValue
                                                                )
                                                            }
                                                            className="btn btn-danger btn-xs icon-only rounded-circle mt-2 mr-1"
                                                        >
                                                            <i className="fa fa-minus"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                )}
                                <div className="row">
                                    <div className="col-12">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                this.addNewRowToVariationValuesList(
                                                    value,
                                                    setFieldValue
                                                )
                                            }
                                            className="btn btn-circle btn-success btn-xs"
                                        >
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                {/* </>}
                        </FieldArray> */}
                                {value.skuList &&
                                value.skuList.length &&
                                value.skuList.length > 0 ? (
                                    <>
                                        <h4 className="font-weight-bold text-capitalize my-4">
                                            product sku list
                                        </h4>
                                        <hr />
                                        <div className="row mb-3">
                                            <div className="col-1">index</div>
                                            <div className="col-3">
                                                variante name
                                            </div>
                                            <div className="col-3">sku</div>
                                            <div className="col-3">barcode</div>
                                            <div className="col-1">
                                                discountable
                                            </div>
                                        </div>
                                    </>
                                ) : undefined}
                                {/* <FieldArray name={name as string}>
                            {arrayHelpers => <> */}
                                {value.skuList.map(
                                    (item: ISkuOfProduct, index: number) => (
                                        <Fragment key={'sku' + index}>
                                            <div
                                                className="row"
                                                key={'sku' + index}
                                            >
                                                <div className="col-1">
                                                    {index + 1}
                                                </div>
                                                <div className="col-3">
                                                    {item.varianteName}
                                                </div>
                                                <div className="col-3">
                                                    <FormControl
                                                        control={
                                                            APP_FORM_CONTROL.INPUT
                                                        }
                                                        name={`${name}['skuList'][${index}][sku]`}
                                                        placeholder={'sku'}
                                                        apptheme={
                                                            FORM_ELEMENT_THEME.ZOHO
                                                        }
                                                        controlClassName={
                                                            'without-label'
                                                        }
                                                    />
                                                </div>
                                                <div className="col-3">
                                                    <FormControl
                                                        control={
                                                            APP_FORM_CONTROL.INPUT
                                                        }
                                                        name={`${name}['skuList'][${index}][barcode]`}
                                                        placeholder={'barcode'}
                                                        apptheme={
                                                            FORM_ELEMENT_THEME.ZOHO
                                                        }
                                                        controlClassName={
                                                            'without-label'
                                                        }
                                                    />
                                                </div>
                                                <div className="col-1">
                                                    <FormControl
                                                        control={
                                                            APP_FORM_CONTROL.SWITCH
                                                        }
                                                        name={`${name}['skuList'][${index}][isDiscountable]`}
                                                        // label={'SKU'}
                                                        apptheme={
                                                            FORM_ELEMENT_THEME.ZOHO
                                                        }
                                                    />
                                                </div>
                                                <div className="col-1 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            this.onSkuItemRemove(
                                                                value,
                                                                index,
                                                                setFieldValue
                                                            )
                                                        }
                                                        className="btn btn-circles-- btn-danger btn-xs icon-only rounded-circle mr-1"
                                                    >
                                                        <i className="fa fa-minus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </Fragment>
                                    )
                                )}
                                {/* </>}
                        </FieldArray> */}
                            </>
                        );
                    }}
                </Field>
            </>
        );
    }

    protected errorRender() {
        return <></>;
    }
}
