import type { NextPage } from "next";
import Features from "~~/components/landing/Features";
import Hero from "~~/components/landing/Hero";

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <Features />
    </>
  );
};

export default Home;
