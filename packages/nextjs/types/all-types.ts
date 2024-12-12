export enum PropertyType {
  Apartment = 0,
  House = 1,
}
export type ListingType = "sale" | "rent";

export interface ListingForm {
  propertyType: PropertyType;
  isShared: boolean;
  canBid: boolean;
  title: string;
  rooms: number;
  bathrooms: number;
  usableSurface: number;
  price: number;
  location: string;
  images: File[];
}
