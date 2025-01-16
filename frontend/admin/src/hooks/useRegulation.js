import { useState, useEffect } from "react";
import axios from "axios";

const useRegulation = () => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Hàm fetch regulations
  const fetchRegulations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5555/admin/regulations/"
      );
      const activeRegulations = response.data.data.filter(
        (regulation) => regulation.status === true
      );
      setRegulations(activeRegulations);
    } catch (err) {
      setError("Error fetching regulations");
    } finally {
      setLoading(false);
    }
  };

  // Hàm post regulation
  const postRegulation = async (newRegulation) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/regulation/",
        newRegulation
      );
      const addedRegulation = response.data.data;
      setSuccess(true);

      // Ensure we add only active regulations to the list immediately
      if (addedRegulation.status === true) {
        setRegulations((prevRegulations) => [
          ...prevRegulations,
          addedRegulation,
        ]);
      }
    } catch (err) {
      setError("Error posting regulation");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa regulation
  const deleteRegulation = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/admin/regulation/${id}`);
      // After deleting, fetch regulations again to refresh the list
      await fetchRegulations();
    } catch (err) {
      setError("Error deleting regulation");
    }
  };

  // Hàm tùy chỉnh regulation (cập nhật regulation)
  const customRegulation = async (id, updatedData) => {
    try {
      await axios.put(
        `http://localhost:5555/admin/regulation/${id}`,
        updatedData
      );
      // After updating, fetch regulations again to refresh the list
      await fetchRegulations();
    } catch (err) {
      setError("Error updating regulation");
    }
  };

  // Fetch regulations based on search keyword
  const searchRegulations = async (searchKeyword = "") => {
    setLoading(true);
    try {
      const keywordParam = searchKeyword.trim() === "" ? "" : searchKeyword;

      const response = await axios.get(
        `http://localhost:5555/admin/regulation/search?keyword=${keywordParam}`
      );
      console.log("API Response:", response.data); // Log the API response

      const activeRegulations = response.data.data.filter(
        (regulation) => regulation.status === true
      );
      setRegulations(activeRegulations);
    } catch (err) {
      console.error("Error fetching regulations:", err); // Log the error
      setError("Error fetching regulations");
    } finally {
      setLoading(false);
    }
  };

  // Fetch regulations when the component is loaded
  useEffect(() => {
    fetchRegulations();
  }, []);

  return {
    regulations,
    loading,
    error,
    deleteRegulation,
    customRegulation,
    postRegulation,
    searchRegulations,
    success,
  };
};

export default useRegulation;
