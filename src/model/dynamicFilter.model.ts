import { APP_FILTER_FORM_CONTROL } from "../component/form/_formik/_filters/FilterFormControl/FilterFormControl";
import { ROUTE_BASE_CRUD } from '../component/page/_base/BaseUtility';

export interface IDynamicFilter {
    title: string;
    key: string;
    type: APP_FILTER_FORM_CONTROL;
    entity?: {
        name: ROUTE_BASE_CRUD;
        searchField: string;
        valueKey: string;
        label: string;
    };
    options?: Array<{ label: string; value: any; }>;
}
