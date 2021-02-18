import { BaseModel } from "./base.model";

export interface ITimeLineItem {
  name: string | null | undefined;
  from?: string | null | undefined;
  to?: string | null | undefined;
}

export interface ITimeLine extends BaseModel {
  createdAt: number;
  action: string;
  fields?: Array<ITimeLineItem>;
  title: string;
  description?: string;
}
