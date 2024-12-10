import Image from "next/image";
// import chek from "~~/components/img/chek.png";
import kevo from "~~/components/img/kevo.jpg";

const teamMembers = [
  {
    name: "Kevo",
    role: "Fullstack Developer",
    image: kevo,
    linkedin: "https://linkedin.com",
  },
  {
    name: "Chek",
    role: "Smart Contract Developer",
    image: "https://picsum.photos/seed/team2/300/300",
    linkedin: "https://linkedin.com",
  },
];

export default function Team() {
  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">Our Team</h2>
        <div className="grid grid-cols-1 md:flex md:items-center md:justify-center lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <Image src={member.image} alt={member.name} fill className="rounded-full object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-gray-600 mb-2">{member.role}</p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-focus"
              >
                LinkedIn Profile
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
