import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function BhaktapurMiddlemen() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initial token check:', token);
    if (!token) {
      setError('Please log in to view Bhaktapur middlemen.');
      setLoading(false);
      navigate('/login');
      return;
    }
    fetchMiddlemen();
  }, [navigate]);

  const fetchMiddlemen = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Retrieved token for BhaktapurMiddlemen:', token);
      if (!token) {
        setError('Please log in to view Bhaktapur middlemen.');
        navigate('/login');
        return;
      }
      console.log('Fetching Bhaktapur middlemen...');
      const response = await axios.get("http://localhost:3000/api/middleman/bhaktapur", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log('Bhaktapur middlemen response:', response.data);
      const data = Array.isArray(response.data.middlemen) ? response.data.middlemen : [];
      console.log('Parsed middlemen data:', data);
      setUserList(data);
    } catch (err) {
      console.error('Error fetching Bhaktapur middlemen:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to load Bhaktapur middlemen.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bhaktapur Middlemen</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Middlemen list */}
      {!loading && (
        <div className="space-y-4">
          <div
            className="bg-white shadow overflow-hidden sm:rounded-md"
            style={{ maxHeight: "497px", overflowY: "auto" }}
          >
            <ul className="divide-y divide-gray-200">
              {userList.length > 0 ? (
                userList.map((user) => (
                  <li key={user._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-indigo-600">
                          {user.username}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-gray-500">
                  No Bhaktapur middlemen found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default BhaktapurMiddlemen;