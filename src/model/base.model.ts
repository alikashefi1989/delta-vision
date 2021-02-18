export interface BaseModel {
  id: string;
  // creator?: string;
  // creation_date: number;
  // version?: number;
  // modification_date?: number | null;
  // modifier?: string,
  // tags?: string[];
  createdAt: number;
  updatedAt: number;
  createdBy?: {
    email?: string;
    id?: string;
    name?: string;
  };
  store?: any;
  country?: any;
}
