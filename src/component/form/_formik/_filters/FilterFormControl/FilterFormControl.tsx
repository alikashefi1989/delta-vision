import React from 'react';
import { FilterSelect, IProps as IProps_FilterSelect } from '../FilterSelect/FilterSelect';
import { FilterText, IProps as IProps_FilterText } from '../FilterText/FilterText';
import { FilterDatePicker, IProps as IProps_FilterDatepicker } from '../FilterDatePicker/FilterDatePicker';
import { FilterNumber, IProps as IProps_FilterNumber } from '../FilterNumber/FilterNumber';
import { FilterTagSelect, IProps as IProps_FilterTagSelect } from '../FilterTagSelect/FilterTagSelect';
import { FilterAsyncSelect, IProps as IProps_FilterAsyncSelect } from '../FilterAsyncSelect/FilterAsyncSelect';
import { FilterAsyncTag, IProps as IProps_FilterAsyncTag } from '../FilterAsyncTag/FilterAsyncTag';


export enum APP_FILTER_FORM_CONTROL {
    FILTER_TEXT = 'FILTER_TEXT',
    FILTER_SELECT = 'FILTER_SELECT',
    FILTER_ASYNC_SELECT = 'FILTER_ASYNC_SELECT',
    FILTER_ASYNC_TAG = 'FILTER_ASYNC_TAG',
    FILTER_TAG_SELECT = 'FILTER_TAG_SELECT',
    FILTER_DATE_PICKER = 'FILTER_DATE_PICKER',
    FILTER_NUMBER = 'FILTER_NUMBER',
}
type TProps<T> =
    IProps_FilterText<T> |
    IProps_FilterSelect<T> |
    IProps_FilterAsyncSelect<T> |
    IProps_FilterAsyncTag<T> |
    IProps_FilterDatepicker<T> |
    IProps_FilterNumber<T> |
    IProps_FilterTagSelect<T>
    ;

export class FilterFormControl<T> extends React.Component<TProps<T>> {

    controlRender() {
        const { control } = this.props;
        switch (control) {
            case APP_FILTER_FORM_CONTROL.FILTER_TEXT:
                return <FilterText {...this.props as IProps_FilterText<T>} />
            case APP_FILTER_FORM_CONTROL.FILTER_SELECT:
                return <FilterSelect {...this.props as IProps_FilterSelect<T>} />
            case APP_FILTER_FORM_CONTROL.FILTER_ASYNC_SELECT:
                return <FilterAsyncSelect {...this.props as IProps_FilterAsyncSelect<T>} />
            case APP_FILTER_FORM_CONTROL.FILTER_ASYNC_TAG:
                return <FilterAsyncTag {...this.props as IProps_FilterAsyncTag<T>} />
            case APP_FILTER_FORM_CONTROL.FILTER_DATE_PICKER:
                return <FilterDatePicker {...this.props as IProps_FilterDatepicker<T>} />
            case APP_FILTER_FORM_CONTROL.FILTER_NUMBER:
                return <FilterNumber {...this.props as IProps_FilterNumber<T>} />
            case APP_FILTER_FORM_CONTROL.FILTER_TAG_SELECT:
                return <FilterTagSelect {...this.props as IProps_FilterTagSelect<T>} />
            default: return null
        }
    }

    render() {
        return this.controlRender();
    }
}
