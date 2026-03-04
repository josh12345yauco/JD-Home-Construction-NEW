export interface WixDataItem {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  [key: string]: unknown;
}
