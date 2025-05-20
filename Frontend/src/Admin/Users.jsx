import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaRegEdit, FaCheck, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function Users() {
  const [selectedRole, setSelectedRole] = useState("user");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: ""
  });

  // Fetch data from API
  useEffect(() => {
    fetchUsers();
  }, [selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint;
      switch (selectedRole) {
        case "user": endpoint = "/api/user/users"; break;
        case "middleman": endpoint = "/api/middleman/middlemen"; break;
        case "admin": endpoint = "/api/admin/admins"; break;
        default: throw new Error("Invalid role selected");
      }

      const response = await axios.get(`http://localhost:3000${endpoint}`);
      const data = Array.isArray(response.data) ? response.data : 
                 response.data[selectedRole] || response.data.data || 
                 response.data.users || response.data.middlemen || response.data.admins || [];
      
      setUserList(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingId(user._id);
    setEditFormData({
      username: user.username,
      email: user.email
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async (userId) => {
    try {
      if (!editFormData.username.trim() || !editFormData.email.trim()) {
        setError("Username and email are required");
        return;
      }

      const response = await axios.put(
        `http://localhost:4000/api/user/${userId}`,
        editFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setEditingId(null);
        fetchUsers();
      } else {
        throw new Error(response.data.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to update user. Please try again."
      );
    }
  };

  // In handleDelete
const handleDelete = async (userId) => {
  if (!window.confirm(`Are you sure you want to delete this ${selectedRole}?`)) return;
  try {
      const response = await axios.delete(`http://localhost:4000/api/user/${userId}`);
      if (response.data.success) {
          fetchUsers();
      }
  } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.message || "Failed to delete user.");
  }
};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Role selection dropdown */}
      <div className="mb-6">
        <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">
          Filter by Role:
        </label>
        <select
          id="role-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="user">Users</option>
          <option value="middleman">Middleman</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Error message display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="float-right font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* User list */}
      {!loading && (
        <div className="space-y-4">
          <div className="bg-white shadow overflow-hidden sm:rounded-md" style={{ maxHeight: "497px", overflowY: "auto" }}>
            <ul className="divide-y divide-gray-200">
              {userList.length > 0 ? (
                userList.map((user) => (
                  <li key={user._id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          {editingId === user._id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                name="username"
                                value={editFormData.username}
                                onChange={handleEditFormChange}
                                className="block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Username"
                              />
                              <input
                                type="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleEditFormChange}
                                className="block w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Email"
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="text-lg font-medium text-indigo-600">{user.username}</h3>
                              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                            </>
                          )}
                        </div>
                        <div className="ml-4 flex items-center">
                          {editingId === user._id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(user._id)}
                                className="text-green-500 hover:text-green-700 transition-colors p-2"
                                title="Save"
                              >
                                <FaCheck size={18} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 ml-2"
                                title="Cancel"
                              >
                                <FaTimes size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(user)}
                                className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                                title="Edit"
                              >
                                <FaRegEdit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-2 ml-2"
                                title="Delete"
                              >
                                <MdDelete size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-center text-gray-500">
                  No {selectedRole} found
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;