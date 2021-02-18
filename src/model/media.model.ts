import { BaseModel } from "./base.model";

export interface IMedia extends BaseModel {
    // createdAt	string
    // updatedAt	string
    size: number;
    videoLength?: number;
    name: string;
    path: string;
    type: string;
    // width: number;
    // height: number;
    url: string;
    dimensions?: [number, number];
}

// export type TMediaCreate = Omit<IMedia, keyof BaseModel>;
// export type TMediaUpdate = TMediaCreate;
