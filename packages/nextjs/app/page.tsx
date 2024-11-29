import Image from "next/image";
import type { NextPage } from "next";
import { ArrowPathIcon, BuildingOffice2Icon, ChartBarIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import lilhelpersBuilding from "~~/components/img/lilhelpers-vacation.png";

const features = [
  {
    name: "Tokenized Real Estate",
    description: "Transform real estate into digital tokens, enabling fractional ownership and increased liquidity.",
    icon: BuildingOffice2Icon,
  },
  {
    name: "Blockchain Security",
    description: "Leverage blockchain technology for transparent and secure property transactions.",
    icon: LockClosedIcon,
  },
  {
    name: "Market Analytics",
    description: "Access real-time market data and analytics to make informed investment decisions.",
    icon: ChartBarIcon,
  },
  {
    name: "Automated Compliance",
    description: "Smart contracts ensure regulatory compliance and automate property management.",
    icon: ArrowPathIcon,
  },
];

const roadmap = [
  {
    phase: "Phase 1 - Q2 2024",
    items: ["Platform Launch", "Initial Property Listings", "Smart Contract Deployment"],
  },
  {
    phase: "Phase 2 - Q3 2024",
    items: ["Secondary Market Integration", "Property Management Tools", "Mobile App Release"],
  },
  {
    phase: "Phase 3 - Q4 2024",
    items: ["International Expansion", "Advanced Analytics", "DAO Governance"],
  },
];

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 lg:px-10 gap-8 lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Revolutionizing Real Estate with <span className="text-secondary">Blockchain Technology</span>
          </h1>
          <p className="text-lg lg:text-xl mb-8 text-base-content/80">
            Invest in tokenized real estate assets with transparency, security, and liquidity powered by blockchain
            technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="btn btn-primary btn-lg">Get Started</button>
            <button className="btn btn-outline btn-lg">Learn More</button>
          </div>
        </div>
        <div className="flex-1">
          <Image src={lilhelpersBuilding} alt="Real Estate Platform" width={1000} height={1000} priority />
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-20 px-4 lg:px-10 bg-base-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">Why Choose Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(feature => (
              <div key={feature.name} className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <feature.icon className="h-12 w-12 text-secondary mb-4" />
                  <h3 className="card-title mb-2">{feature.name}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="w-full py-20 px-4 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">Development Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roadmap.map(phase => (
              <div key={phase.phase} className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title text-secondary mb-4">{phase.phase}</h3>
                  <ul className="space-y-2">
                    {phase.items.map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-20 px-4 lg:px-10 bg-base-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Start Investing?</h2>
          <p className="text-lg mb-8 text-base-content/80">
            Join our platform today and discover the future of real estate investment.
          </p>
          <button className="btn btn-primary btn-lg">Connect Wallet</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
