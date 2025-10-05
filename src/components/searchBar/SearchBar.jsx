'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideSearch } from "lucide-react";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            router.push("/search");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <div className="w-full mb-5 my-2">
            <form onSubmit={handleSearch} className="relative sm:w-1/2 max-sm:w-[90%] mx-auto">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-black-500"
                />
                <button
                    type="submit"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <LucideSearch size={20} />
                </button>
            </form>
        </div>
    );
}
