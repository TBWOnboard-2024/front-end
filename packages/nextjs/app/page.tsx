import type { NextPage } from "next";
import Features from "~~/components/landing/Features";
import Hero from "~~/components/landing/Hero";
import Properties from "~~/components/landing/Properties";

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Properties />
    </>
  );
};

export default Home;
