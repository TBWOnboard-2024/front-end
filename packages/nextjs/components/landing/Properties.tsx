import { NewPropertyCard } from "~~/components/NewPropertyCard";

export default function Properties() {
  return (
    <div className="bg-white min-h-screen">
      <div className="text-center pt-16 md:pt-24">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Properties</h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto px-4">
          Discover our selection of the finest properties available for sale or rent
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 py-20 md:py-[160px] px-4 md:px-[100px]">
        <NewPropertyCard />
        <NewPropertyCard />
        <NewPropertyCard />
      </div>
    </div>
  );
}
