import { LucideSearch } from "lucide-react";
export default function SearchBar() {
  return (
    <div className="w-full  mb-5">
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border border-gray-500 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-black-500"
        />
        <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 " size={20}  />
      </div>
    </div>
  );
}