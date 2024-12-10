import type { NextPage } from "next";
import CTA from "~~/components/landing/CTA";
import Features from "~~/components/landing/Features";
import Hero from "~~/components/landing/Hero";
import Properties from "~~/components/landing/Properties";
import Roadmap from "~~/components/landing/Roadmap";
import Team from "~~/components/landing/Team";

const Home: NextPage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Properties />
      <Roadmap />
      <Team />
      <CTA />
    </>
  );
};

export default Home;
