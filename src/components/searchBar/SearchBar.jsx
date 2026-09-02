import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LucideSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SearchBar() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate("/search");
        }
    }, [navigate, searchTerm]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    }, [handleSearch]);

    return (
        <div className="w-full mb-5 my-2">
            <form onSubmit={handleSearch} className="relative sm:w-1/2 max-sm:w-[90%] mx-auto">
                <input
                    type="text"
                    placeholder={t("home.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border border-gray-300 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-black-500"
                />
                <button
                    type="submit"
                    aria-label={t("common.search")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <LucideSearch size={20} />
                </button>
            </form>
        </div>
    );
}
