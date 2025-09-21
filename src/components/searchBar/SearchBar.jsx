import { LucideSearch } from "lucide-react";
import { Link } from "react-router-dom";
export default function SearchBar() {
    return (
        <div className="w-full mb-5 my-2">
            <Link to"/search" >
            <div className="relative sm:w-1/2 max-sm:w-[90%] mx-auto">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-black-500"
                />
                <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 " size={20} />
            </div>
            </Link>
        </div>
    );
}
