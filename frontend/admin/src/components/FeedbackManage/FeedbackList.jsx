import { useState } from "react";
import useFeedback from "../../hooks/useFeedback";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const FeedbackList = () => {
  const [page, setPage] = useState(1);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [replyData, setReplyData] = useState({
    feedbackId: "",
    subject: "",
    message: "",
  });

  const {
    feedbacks = [],
    loading,
    error,
    totalPages,
    ReplyFeedback,
  } = useFeedback(page, fieldSort, orderSort, searchKey);

  const handleReplySend = async () => {
    const { feedbackId, subject, message } = replyData;
    if (!subject || !message) {
      alert("Please fill in both subject and message.");
      return;
    }

    const result = await ReplyFeedback(feedbackId, subject, message);
    if (result) {
      alert("Reply sent successfully!");
      setReplyingId(null);
      setReplyData({ feedbackId: "", subject: "", message: "" });
    }
  };

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleSelectOne = (feedbackId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(feedbackId)
        ? prev.filter((id) => id != feedbackId)
        : [...prev, feedbackId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(feedbacks.map((feedback) => feedback._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg ">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Feedback List
      </h2>

      <div className="flex items-center">
        {/* <select
          className="text-sm border border-black p-2 mb-4"
          defaultValue="choose"
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="deleteProducts">Delete selected feedbacks</option>
        </select> */}
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Search by username..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="submit" className="m-2 rounded text-blue-600">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    feedbacks.length > 0 &&
                    selectedCheckBox.length === feedbacks.length
                  }
                />
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Username <FaSort onClick={() => handleSort("username")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Email <FaSort onClick={() => handleSort("email")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  Message <FaSort onClick={() => handleSort("message")} />
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                Reply
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(feedback._id)}
                      onChange={() => handleSelectOne(feedback._id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {feedback.username}
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {feedback.email}
                  </td>
                  <td className="border px-4 py-2 text-sm ">
                    {feedback.message}
                  </td>
                  <td className="text-sm px-4 py-2 text-center">
                    <button
                      className="bg-green-500 text-white px-2 py-1 text-sm rounded"
                      onClick={() => {
                        setReplyingId(feedback._id);
                        setReplyData({
                          feedbackId: feedback._id,
                          subject: "",
                          message: "",
                        });
                      }}
                    >
                      Reply
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  No feedbacks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {replyingId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-blue-600">
              Reply Feedback
            </h3>
            <input
              type="text"
              placeholder="Subject"
              className="border w-full px-3 py-2 mb-3 text-sm rounded"
              value={replyData.subject}
              onChange={(e) =>
                setReplyData({
                  ...replyData,
                  subject: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Message"
              className="border w-full px-3 py-2 mb-3 text-sm rounded"
              rows={4}
              value={replyData.message}
              onChange={(e) =>
                setReplyData({
                  ...replyData,
                  message: e.target.value,
                })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 text-sm rounded hover:bg-blue-700"
                onClick={handleReplySend}
              >
                Send
              </button>
              <button
                className="text-red-500 px-4 py-2 text-sm rounded border border-red-500 hover:bg-red-200"
                onClick={() => setReplyingId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="text-sm px-3 py-1 mx-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeedbackList;
