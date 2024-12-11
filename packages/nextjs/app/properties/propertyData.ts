export interface Property {
  id: string;
  title: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  type: "sale" | "rent";
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    price: 450000,
    size: 85,
    bedrooms: 2,
    bathrooms: 1,
    address: "123 Main St, Taipei",
    coordinates: { lat: 25.033, lng: 121.565 },
    imageUrl: "https://picsum.photos/100/200",
    type: "sale",
  },
  {
    id: "2",
    title: "Luxury Penthouse",
    price: 890000,
    size: 150,
    bedrooms: 3,
    bathrooms: 2,
    address: "456 Park Ave, Taipei",
    coordinates: { lat: 25.045, lng: 121.557 },
    imageUrl: "https://picsum.photos/200/300",
    type: "sale",
  },
  {
    id: "3",
    title: "Cozy Studio",
    price: 1200,
    size: 45,
    bedrooms: 1,
    bathrooms: 1,
    address: "789 River Rd, Taipei",
    coordinates: { lat: 25.051, lng: 121.549 },
    imageUrl: "https://picsum.photos/300/400",
    type: "rent",
  },
  // Add more properties as needed
];
