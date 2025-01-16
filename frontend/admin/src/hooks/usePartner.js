import { useState, useEffect } from "react";

const usePartners = () => {
  const [partners, setPartners] = useState([]);
  const [requestPartners, setRequestPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);

        // Fetch partners
        const partnersResponse = await fetch(
          "http://localhost:5555/admin/all-partners"
        );
        const partnersData = await partnersResponse.json();

        // Filter users with the role of 'partner'
        const partnerUsers = partnersData.users.filter(
          (user) => user.role === "partner"
        );

        // Fetch request partners
        const requestPartnersResponse = await fetch(
          "http://localhost:5555/admin/all-requestpartners"
        );
        const requestPartnersData = await requestPartnersResponse.json();

        const requestpartnerUsers = requestPartnersData.users.filter(
          (user) => user.role === "regisPartner"
        );

        // Update state
        setPartners(partnerUsers);
        setRequestPartners(requestpartnerUsers);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Function to approve a partner
  const approvePartner = async (userId) => {
    try {
      await fetch(`http://localhost:5555/admin/approve-partner/${userId}`, {
        method: "PUT",
      });
      setRequestPartners((prev) =>
        prev.filter((partner) => partner._id !== userId)
      );
      alert("Partner approved!");
    } catch {
      alert("Failed to approve the Partner.");
    }
  };

  // Function to deny a partner
  const denyPartner = async (userId) => {
    try {
      await fetch(`http://localhost:5555/admin/switch-to-user/${userId}`, {
        method: "PUT",
      });
      setRequestPartners((prev) =>
        prev.filter((partner) => partner._id !== userId)
      );
      alert("Partner deny!");
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePartner = async (userId) => {
    try {
      await fetch(`http://localhost:5555/admin/delete-role-partner/${userId}`, {
        method: "PUT",
      });
      setRequestPartners((prev) =>
        prev.filter((partner) => partner._id !== userId)
      );
      alert("Partner delete!");
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    partners,
    requestPartners,
    loading,
    error,
    approvePartner,
    denyPartner,
    deletePartner,
  };
};

export default usePartners;
