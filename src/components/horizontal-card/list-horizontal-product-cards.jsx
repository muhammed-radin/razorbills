import { Separator } from "../ui/separator"
import HorizontalProductCard from "./horizontal-card"

export default function ListHorizontalProductCards() {
    return (
        <div className="p-3 flex flex-col gap-2 w-full items-start justify-start mx-auto">
            <header className="my-3 sm:mb-8 sm:ml-9 text-center sm:text-left w-full flex flex-col items-center justify-center">
                <h2 className="scroll-m-20 text-xl font-semibold">Latest Products</h2>
                <div className="text-border w-50 h-[1px] mt-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </header>
            <div className="flex flex-row max-sm:flex-col flex-wrap items-center justify-center gap-2">
                <HorizontalProductCard variant="borderless" />
                <HorizontalProductCard variant="borderless" />
                <HorizontalProductCard variant="borderless" />
                <HorizontalProductCard variant="borderless" />
                <HorizontalProductCard variant="borderless" />
                <HorizontalProductCard variant="borderless" />
            </div>
        </div>)
}