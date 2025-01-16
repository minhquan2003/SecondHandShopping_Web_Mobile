import { useState, useEffect } from "react";
import axios from "axios";

const getCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5555/categories");
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    // alert(JSON.stringify(categories))
    return { categories, loading, error };
};

export {getCategories};