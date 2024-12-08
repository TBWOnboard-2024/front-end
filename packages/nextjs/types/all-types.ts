export enum PropertyType {
  Apartment = 0,
  House = 1,
}
export type ListingType = "sale" | "rent";

export interface ListingForm {
  propertyType: PropertyType;
  // listingType: ListingType;
  canBid: boolean;
  title: string;
  rooms: number;
  bathrooms: number;
  compartmentalization: string;
  comfort: string;
  floor: string;
  usableSurface: number;
  price: number;
  location: string;
  constructionYear: string;
  description: string;
  images: File[];
}
