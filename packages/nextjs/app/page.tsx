import Image from "next/image";
import type { NextPage } from "next";
import lilhelpersBuilding from "~~/components/img/lilhelpers-building.png";

const Home: NextPage = () => {
  return (
    <>
      <Image src={lilhelpersBuilding} alt="image" width={1000} height={1000} />
    </>
  );
};

export default Home;
