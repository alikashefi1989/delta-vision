import React from 'react';
import { Setup } from '../../../../config/setup';
import { IDynamicFilter } from '../../../../model/dynamicFilter.model';
import { APP_FILTER_FORM_CONTROL, FilterFormControl } from '../../../form/_formik/_filters/FilterFormControl/FilterFormControl';
import { BaseUtility } from '../BaseUtility';

interface IProps {
    dynamicFilter: IDynamicFilter;
    // entityName?: ROUTE_BASE_CRUD;
    name: string;
    controlClassName: string;
}

export default class DynamicFilterFormControl extends React.Component<IProps>{
    private _entityService = this.props.dynamicFilter.entity?.name ? BaseUtility.crudService(this.props.dynamicFilter.entity?.name) : undefined;

    private _debounceAsyncFilterTimer: NodeJS.Timeout | undefined;
    private debounceAsyncFilter(input: string, callback: any, searchField: string, label: string) {
        if (this._debounceAsyncFilterTimer) clearTimeout(this._debounceAsyncFilterTimer);
        this._debounceAsyncFilterTimer = setTimeout(() => { this.searchAsyncFilter(input, callback, searchField, label) }, 300);
    }
    private async searchAsyncFilter(input: string, callback: any, searchField: string, label: string): Promise<void> {
        // fix key bug --> https://github.com/JedWatson/react-select/issues/2656
        if (!this._entityService) {
            callback([]);
            return;
        }
        try {
            const res = await this._entityService.search({
                pagination: { page: 0, limit: Setup.recordDefaultLoadLength },
                filter: { [searchField]: { $regex: input, $options: 'i' } },
            });
            const result = res.data.data.items.map((item, i: number) => {
                let labelText = '';
                if (label.includes('.')) {
                    let newItem = item as any;
                    label.split('.').forEach(l => { newItem = newItem[l]; });
                    labelText = newItem;
                } else {
                    labelText = (item as any)[label];
                }
                return { label: labelText || `item ${i}`, value: item, };
            });
            callback(result);
        } catch (e) {
            callback([]);
        }
    }

    controlRender() {
        const DF = this.props.dynamicFilter;
        const control = DF.type;
        switch (control) {
            case APP_FILTER_FORM_CONTROL.FILTER_TEXT:
            case APP_FILTER_FORM_CONTROL.FILTER_NUMBER:
            case APP_FILTER_FORM_CONTROL.FILTER_DATE_PICKER:
            case APP_FILTER_FORM_CONTROL.FILTER_TAG_SELECT:
                const ctrl = control as APP_FILTER_FORM_CONTROL.FILTER_TEXT;
                return <FilterFormControl
                    control={ctrl}
                    controlClassName={this.props.controlClassName}
                    name={this.props.name}
                />

            case APP_FILTER_FORM_CONTROL.FILTER_SELECT:
                if (!DF.options) return null;
                const ctrl2 = control as APP_FILTER_FORM_CONTROL.FILTER_SELECT;
                return <FilterFormControl
                    control={ctrl2}
                    controlClassName={this.props.controlClassName}
                    name={this.props.name}
                    options={DF.options}
                />

            case APP_FILTER_FORM_CONTROL.FILTER_ASYNC_SELECT:
            case APP_FILTER_FORM_CONTROL.FILTER_ASYNC_TAG:
                const ctrl3 = control as APP_FILTER_FORM_CONTROL.FILTER_ASYNC_SELECT;
                return <FilterFormControl
                    control={ctrl3}
                    controlClassName={this.props.controlClassName}
                    name={this.props.name}
                    loadOptions={(inputValue: string, callback: any) => this.debounceAsyncFilter(
                        inputValue,
                        callback,
                        DF.entity?.searchField!,
                        DF.entity?.label!
                    )
                    }
                    pureValue2MongoValue={(value: any) => {
                        if (!value) return undefined;
                        if (Array.isArray(value)) {
                            return value.map(itm => itm.value[DF.entity?.valueKey || ''] || '');
                        }
                        return value[DF.entity?.valueKey || ''] || '';
                    }}
                    optionsLabelCreator={(value: any) => {
                        if (!value) return '';
                        const lbl = DF.entity?.label!;
                        let labelText = '';
                        if (lbl.includes('.')) {
                            let newItem = value as any;
                            lbl.split('.').forEach(l => { newItem = newItem[l]; });
                            labelText = newItem;
                        } else {
                            labelText = (value as any)[lbl];
                        }
                        return labelText || '';
                    }}
                />
            default: return null
        }
    }

    render() {
        return this.controlRender();
    }

}
