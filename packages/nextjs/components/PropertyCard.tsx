import Image from "next/image";

interface Property {
  id: string;
  title: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  coordinates: number[];
  imageUrl: string;
}

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  isSelected: boolean;
}

export const PropertyCard = ({ property, onClick, isSelected }: PropertyCardProps) => {
  return (
    <div
      className={`card card-compact bg-base-100 shadow-xl cursor-pointer transition-all hover:shadow-2xl ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <figure className="h-48 relative">
        <Image src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 badge badge-primary text-lg font-bold">
          ${property.price.toLocaleString()}
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{property.title}</h2>
        <p className="text-sm text-base-content/70">{property.address}</p>
        <div className="flex justify-between mt-2 text-sm">
          <span>{property.size} m²</span>
          <span>{property.bedrooms} beds</span>
          <span>{property.bathrooms} baths</span>
        </div>
      </div>
    </div>
  );
};
