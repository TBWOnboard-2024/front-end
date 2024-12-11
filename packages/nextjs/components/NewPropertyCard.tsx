import Image from "next/image";
import { Bath, BedSingle, Ruler } from "lucide-react";
import propertyImage from "~~/components/img/property.jpg";

export const NewPropertyCard = () => {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Property Image */}
      <div className="relative h-64 w-full">
        <Image src={propertyImage} alt="Beverly Springfield House" className="w-full h-full object-cover" />
      </div>

      {/* Property Details */}
      <div className="p-6 space-y-4">
        {/* Price */}
        <div className="text-4xl font-light text-blue-400">
          $2,700 <span className="text-gray-500 text-xl">/month</span>
        </div>

        {/* Property Name */}
        <h2 className="text-3xl font-bold text-navy-900">Beverly Springfield</h2>

        {/* Address */}
        <p className="text-xl text-gray-500">2821 Lake Sevilla, Palm Harbor, TX</p>

        {/* Property Features */}
        <div className="flex items-center gap-8 pt-4">
          {/* Bedrooms */}
          <div className="flex items-center gap-2">
            <BedSingle size={24} className="text-blue-400" /> <span className="text-xl">4</span>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center gap-2">
            <Bath size={24} className="text-blue-400" />
            <span className="text-xl">2</span>
          </div>

          {/* Size */}
          <div className="flex items-center gap-2">
            <Ruler size={24} className="text-blue-400" />
            <span className="text-xl">7.5 m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
