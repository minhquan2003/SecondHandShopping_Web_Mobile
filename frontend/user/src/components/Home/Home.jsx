import React from "react";
import ListProductCard from './ListProducts/ListProductCard';
import ListCategories from './Categories/ListCategories';
import { getProducts } from '../../hooks/Products';

const Home = () => {
    const { products, loading, error } = getProducts();
    return (
        <div className="w-screen h-auto flex flex-col justify-center items-center bg-gray-100 overflow-x-hidden">
            <ListCategories />
            <ListProductCard data={{ products, loading, error }} />
        </div>
    );
};

export default Home;