import Image from "next/image";
import Link from "next/link";
import feature1 from "~~/components/img/features/1.png";
import feature2 from "~~/components/img/features/2.png";
import feature3 from "~~/components/img/features/3.png";
import feature4 from "~~/components/img/features/4.png";
import house from "~~/components/img/features/house.png";

const features = [
  {
    icon: feature1,
    title: "Find your dream home",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: feature2,
    title: "Find your dream home",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: feature3,
    title: "Find your dream home",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    icon: feature4,
    title: "Find your dream home",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

export default function Features() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 py-20 lg:py-[160px] px-6 lg:px-[100px] bg-white min-h-screen">
      <div className="relative overflow-hidden flex flex-col col-span-1 md:col-span-1 md:row-span-2 border-2 border-primary rounded-3xl p-6 bg-secondary/35 min-h-[300px]">
        <Image src={house} alt="house" width={400} height={400} className="absolute bottom-0 right-0 w-2/3 md:w-auto" />
        <div className="space-y-4 relative z-10">
          <h3 className="text-xl md:text-2xl font-bold">The new way to find your dream home</h3>
          <p className="text-base md:text-lg text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          <Link href="/properties" className="btn btn-primary btn-sm">
            Browse Properties
          </Link>
        </div>
      </div>

      {features.map((feature, index) => (
        <div key={index} className="flex flex-col justify-center space-y-4 md:space-y-6 p-4">
          <Image src={feature.icon} alt={`feature-${index + 1}`} width={64} height={64} className="w-12 md:w-16" />
          <div className="space-y-2">
            <h3 className="text-lg md:text-2xl font-bold">{feature.title}</h3>
            <p className="text-base md:text-lg text-gray-500">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
