import React from "react";
import ListProductCard from './ListProducts/ListProductCard';
import ListCategories from './Categories/ListCategories';
import { getProducts } from '../../hooks/Products';

const Home = () => {
    const { products, loading, error } = getProducts();
    return (
        <div className="w-screen h-auto flex flex-col justify-center items-center bg-gray-100 overflow-x-hidden">
            {/* https://cdn.optinmonster.com/wp-content/uploads/2024/01/Featured-Image-Online-Shopping-Statistics.png
            https://skywell.software/wp-content/uploads/2020/05/online-shopping-vs-traditional-shopping-1024x512.jpg
            https://skywell.software/wp-content/uploads/2020/05/online-shopping-vs-in-store-shopping-1024x614.jpg */}
            <ListCategories />
            <ListProductCard data={{ products, loading, error }} />
        </div>
    );
};

export default Home;