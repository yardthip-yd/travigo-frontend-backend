import React, { useEffect, useState } from "react";

const products = [
    {
        id: 1,
        title: "Hong Kong",
        image: "https://picsum.photos/400/400?random=1",
    },
    {
        id: 2,
        title: "Brazil",
        image: "https://picsum.photos/400/400?random=2",
    },
    {
        id: 3,
        title: "England",
        image: "https://picsum.photos/400/400?random=3",
    },
    {
        id: 4,
        title: "California",
        image: "https://picsum.photos/400/400?random=4",
    },
    {
        id: 2,
        title: "Brazil",
        image: "https://picsum.photos/400/400?random=2",
    },
    {
        id: 3,
        title: "England",
        image: "https://picsum.photos/400/400?random=3",
    },
    {
        id: 4,
        title: "California",
        image: "https://picsum.photos/400/400?random=4",
    },
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [item, setItem] = useState([...products])
   

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const newval = item
            const test = newval.unshift()
            newval.push(test)
           setItem(newval)
            nextSlide();
        }, 1000); // เปลี่ยนทุก 3 วินาที

        return () => clearInterval(interval);
    }, []);

    // Generate an infinite array by combining products
    let items = [...products, ...products];

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex transition-transform duration-500"
            //  style={{ transform: `translateX(-${(currentIndex) * (100 / 4)}%)` }}
             >
                {items.map((product) => (
                    <div key={product.id} className="card bg-base-100 shadow-xl rounded-lg overflow-hidden w-[200px] h-[200px] mx-2">
                        <figure>
                            <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                        </figure>
                        <div className="p-4 h-[40px] flex items-center bg-slate-900">
                            <h2 className="text-white text-lg">{product.title}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
