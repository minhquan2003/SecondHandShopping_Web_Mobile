import { useState, useEffect } from "react";
import axios from "axios";

const useRegulation = (page = 1) => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState(null);

  // Hàm fetch regulations
  useEffect(() => {
    const fetchRegulations = async () => {
      let url = `http://localhost:5555/admin/regulations?${page}`;
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.data;

        if (data.success && Array.isArray(data.regulations)) {
          setRegulations(data.regulations);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setRegulations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRegulations();
  }, [page]);

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
    } catch {
      setError("Error posting regulation");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa regulation
  const deleteRegulation = async (selectedIds) => {
    try {
      const response = await axios.delete(
        "http://localhost:5555/admin/regulation",
        {
          regulationIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete regulations");

      setRegulations((prev) =>
        prev.filter((regulation) => !selectedIds.includes(regulation._id))
      );
      alert("Selected regulations deleted successfully");
    } catch {
      setError("Error deleting regulation");
    }
  };

  // Hàm tùy chỉnh regulation (cập nhật regulation)
  // const customRegulation = async (id, updatedData) => {
  //   try {
  //     await axios.put(
  //       `http://localhost:5555/admin/regulation/${id}`,
  //       updatedData
  //     );
  //     // After updating, fetch regulations again to refresh the list
  //     await fetchRegulations();
  //   } catch (err) {
  //     setError("Error updating regulation");
  //   }
  // };

  const customRegulation = async (id, updatedData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axios.put(
        `http://localhost:5555/admin/regulation/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess("Regulation updated successfully!");
      } else {
        throw new Error("Failed to update regulation");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating regulation");
    } finally {
      setLoading(false);
    }
  };

  return {
    regulations,
    loading,
    error,
    totalPages,
    deleteRegulation,
    customRegulation,
    postRegulation,
    success,
  };
};

export default useRegulation;
