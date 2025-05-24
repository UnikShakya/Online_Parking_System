import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Activity() {
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                // Check token in localStorage
                const token = localStorage.getItem('token');
                console.log("Token from localStorage:", token);

                const response = await axios.get('http://localhost:3000/api/user/activities', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Ensure token is passed correctly
                    }
                });

                console.log("Full Response Data from Backend:", response.data); // Debugging

                // Assuming the structure is correct, let's extract the activities
                if (response.data.activities && Array.isArray(response.data.activities)) {
                    // Extracting actions (simple strings now)
                    const extractedActions = response.data.activities
                        .map(activity => activity.activity); // Get activity strings (not objects)

                    setRecentActivities(extractedActions); // Store only actions
                } else {
                    setRecentActivities([]); // If no activities
                }
            } catch (error) {
                console.error("Error fetching activities:", error);
                setRecentActivities([]); // Set empty list on error
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white max-w-2xl p-6 shadow-md col-span-1 md:col-span-2 lg:col-span-3 hover:shadow-lg transform transition duration-300">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
        <ul className="space-y-3 text-gray-600 max-h-[331px] overflow-auto">
            {recentActivities.length > 0 ? (
                [...recentActivities].reverse().map((activity, index) => (
                    <li key={index} className="flex items-center">
                        <span className={`h-3 w-3 rounded-full ${index % 3 === 0 ? 'bg-blue-500' : index % 3 === 1 ? 'bg-red-500' : 'bg-green-500'} mr-2`}></span>
                        {activity}
                    </li>
                ))
            ) : (
                <p className="text-gray-500">No recent activity.</p>
            )}
        </ul>
    </div>
    
    );
}

export default Activity;
