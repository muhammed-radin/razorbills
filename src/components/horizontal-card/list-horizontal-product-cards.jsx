import HorizontalProductCard from "./horizontal-card"

export default function ListHorizontalProductCards({ products = [] }) {
    // Default demo products if none provided
    const demoProducts = [
        { title: "Premium Wireless Headphones", description: "Experience crystal-clear audio with active noise cancellation and premium sound quality.", price: 89.99, originalPrice: 129.99, rating: 4.5, reviews: 128 },
        { title: "Smart Fitness Tracker", description: "Track your health metrics, sleep patterns, and daily activities with precision.", price: 49.99, originalPrice: 79.99, rating: 4.3, reviews: 256 },
        { title: "Portable Bluetooth Speaker", description: "Powerful bass and 360° sound in a compact, waterproof design for any adventure.", price: 59.99, originalPrice: 89.99, rating: 4.7, reviews: 312 },
        { title: "USB-C Fast Charger", description: "65W fast charging for laptops, tablets, and phones with intelligent power delivery.", price: 29.99, originalPrice: 49.99, rating: 4.8, reviews: 445 },
        { title: "Mechanical Gaming Keyboard", description: "RGB backlit keys with tactile switches for the ultimate gaming experience.", price: 79.99, originalPrice: 119.99, rating: 4.6, reviews: 189 },
        { title: "Wireless Ergonomic Mouse", description: "Comfortable design with adjustable DPI settings for all-day productivity.", price: 39.99, originalPrice: 59.99, rating: 4.4, reviews: 267 },
    ];

    const displayProducts = products.length > 0 ? products : demoProducts;

    return (
        <div className="p-3 sm:p-4 flex flex-col gap-4 w-full items-center justify-start mx-auto">
            <header className="my-2 sm:my-4 text-center w-full flex flex-col items-center justify-center">
                <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold tracking-tight">
                    Latest Products
                </h2>
                <div className="w-24 h-0.5 mt-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 w-full max-w-7xl">
                {displayProducts.map((product, index) => (
                    <HorizontalProductCard 
                        key={product.id || product.title || index} 
                        variant="borderless" 
                        product={product}
                        index={index}
                    />
                ))}
            </div>
        </div>
    )
}