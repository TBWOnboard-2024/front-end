import Image from "next/image";
import Link from "next/link";
import { Bath, BedSingle, Ruler } from "lucide-react";

interface NewPropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  imageUrl: string;
}

export const NewPropertyCard = ({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  size,
  imageUrl,
}: NewPropertyCardProps) => {
  return (
    <Link href={`/properties/${id}`}>
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Property Image */}
        <div className="relative h-64 w-full">
          <Image src={imageUrl} alt={title} width={1000} height={1000} className="w-full h-full object-cover" />
        </div>

        {/* Property Details */}
        <div className="p-6 space-y-4">
          {/* Price */}
          <div className="text-4xl font-light text-blue-400">${price.toLocaleString()}</div>

          {/* Property Name */}
          <h2 className="text-3xl font-bold text-navy-900">{title}</h2>

          {/* Address */}
          <p className="text-xl text-gray-500">{location}</p>

          {/* Property Features */}
          <div className="flex items-center gap-8 pt-4">
            {/* Bedrooms */}
            <div className="flex items-center gap-2">
              <BedSingle size={24} className="text-blue-400" />
              <span className="text-xl">{bedrooms}</span>
            </div>

            {/* Bathrooms */}
            <div className="flex items-center gap-2">
              <Bath size={24} className="text-blue-400" />
              <span className="text-xl">{bathrooms}</span>
            </div>

            {/* Size */}
            <div className="flex items-center gap-2">
              <Ruler size={24} className="text-blue-400" />
              <span className="text-xl">{size} m²</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
