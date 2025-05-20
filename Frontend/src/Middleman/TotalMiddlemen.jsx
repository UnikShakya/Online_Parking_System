import React, { useState, useEffect } from "react";
import axios from "axios";

function TotalMiddlemen() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMiddlemen();
  }, []);

  const fetchMiddlemen = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/middleman/");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.middlemen || response.data.data || [];
      setUserList(data);
    } catch (err) {
      console.error("Error fetching middlemen:", err);
      setError(err.response?.data?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Total Middlemen</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">
            &times;
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-md" style={{ maxHeight: "497px", overflowY: "auto" }}>
            <ul className="divide-y divide-gray-200">
              {userList.length > 0 ? (
                userList.map((user) => (
                  <li key={user._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-indigo-600">{user.username}</h3>
                          <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-gray-500">No middlemen found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default TotalMiddlemen;
