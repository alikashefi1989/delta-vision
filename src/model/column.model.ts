import { GRID_CELL_TYPE } from "../enum/grid-cell-type.enum";
import { BaseModel } from "./base.model";

export interface IEntityColumn {
    header: string; // name
    title: string; // name
    accessor: string; // name.en
    cell: GRID_CELL_TYPE;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    sortable?: boolean;
    hidden?: boolean;
}

export interface IColumn extends BaseModel {
    collectionName:string;
    columns: Array<IEntityColumn>;
    isDeleted: boolean;
    isActive: boolean;
}
