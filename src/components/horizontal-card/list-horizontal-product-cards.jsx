import { Separator } from "../ui/separator"
import HorizontalProductCard from "./horizontal-card"

export default function ListHorizontalProductCards() {
    return (
        <div className="p-3 flex flex-col gap-2 w-full items-start justify-start mx-auto">
            <header className="my-3 sm:ml-9">
                <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">Latest Products</h2>
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