import ProductCard from "./ProductCard";

const ClassicProcuctsSlider = ({ products, title }) => {
    return (
        <section className="w-full py-6 sm:py-8 md:py-10 overflow-hidden max-w-7xl mx-auto">
            <div className="w-full lg:max-w-[90%] xl:max-w-[85%] mx-auto py-6 sm:py-8 max-w-7xl max-auto">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 px-2">{title}</h2>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                    {products.slice(0, 8).map((product, index) => (
                        <ProductCard key={index} product={product} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ClassicProcuctsSlider;