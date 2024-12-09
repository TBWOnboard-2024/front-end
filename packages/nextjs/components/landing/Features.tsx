import Image from "next/image";
import feature1 from "~~/components/img/features/1.png";

export default function Features() {
  return (
    <div className="grid grid-cols-3 gap-16 py-[160px] px-[100px] bg-white h-screen">
      <div className="flex flex-col row-span-2 justify-center space-y-6 border-2 border-primary rounded-3xl p-6 bg-secondary/35">
        <Image src={feature1} alt="feature1" width={64} height={64} />
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Find your dream home</h3>
          <p className="text-lg text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-6">
        <Image src={feature1} alt="feature1" width={64} height={64} />
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Find your dream home</h3>
          <p className="text-lg text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-6">
        <Image src={feature1} alt="feature1" width={64} height={64} />
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Find your dream home</h3>
          <p className="text-lg text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-6">
        <Image src={feature1} alt="feature1" width={64} height={64} />
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Find your dream home</h3>
          <p className="text-lg text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center space-y-6">
        <Image src={feature1} alt="feature1" width={64} height={64} />
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Find your dream home</h3>
          <p className="text-lg text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
}
