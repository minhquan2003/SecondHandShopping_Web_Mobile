import React, { useEffect, useState } from "react";
import ListProductCard from "./ListProducts/ListProductCard";
import ListCategories from "./Categories/ListCategories";
import { getProducts } from "../../hooks/Products";
import RecommendedProducts from "./RecommendProduct/RecommendProduct";

const Home = () => {
  const { products, loading, error } = getProducts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Array of image URLs
  const images = [
    "https://res.cloudinary.com/dd6pnq2is/image/upload/v1747408890/online-shopping-vs-traditional-shopping-1024x512_uojp3x.jpg",
    "https://res.cloudinary.com/dd6pnq2is/image/upload/v1747395012/Featured-Image-Online-Shopping-Statistics_foeb9p.png",
    "https://res.cloudinary.com/dd6pnq2is/image/upload/v1747409561/online-shopping-vs-in-store-shopping-1024x614_pwdjar.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Cycle through images
    }, 3500);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="w-screen h-auto flex flex-col items-center bg-gray-100 overflow-x-hidden">
      <div className="relative w-[80vw] h-[460px] overflow-hidden rounded">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-col items-center w-full">
        <ListCategories />
        <RecommendedProducts />
        <ListProductCard data={{ products, loading, error }} />
      </div>
    </div>
  );
};

export default Home;
