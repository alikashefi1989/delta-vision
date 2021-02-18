import { ROUTE_BASE_CRUD } from '../component/page/_base/BaseUtility';
// import { GRID_CELL_TYPE } from "../enum/grid-cell-type.enum";
// import { BaseModel } from "./base.model";
import { IDynamicFilter } from '../model/dynamicFilter.model';
import { IEntityColumn } from '../model/column.model';

export interface IEntityRelatedAction {
    title: string;

    // wrapper: 'modal' | 'page'
    // type : 'create' | 'assign'
    // target
    // onConfirm
    // entity
    // endpoint
    // queryParams --> {filter, form, ...}
}

export interface IEntityRelated {
    title: string; // name
    entityName: ROUTE_BASE_CRUD; // name
    // filter: Object;
    mVAId: string;
    columns: Array<IEntityColumn>;
    filterOptions: Array<IDynamicFilter>;
    hidden: boolean;
    action?: Array<IEntityRelatedAction>;
    id: string;
}

// export interface IRelated extends BaseModel {
//   items: Array<IEntityRelated>;
// }
