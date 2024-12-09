import { NewPropertyCard } from "~~/components/NewPropertyCard";

export default function Properties() {
  return (
    <div className="grid grid-cols-3 gap-16 py-[160px] px-[100px] bg-white h-screen">
      <NewPropertyCard />
    </div>
  );
}
