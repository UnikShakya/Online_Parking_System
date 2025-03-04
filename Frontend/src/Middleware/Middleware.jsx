import React, { useState } from 'react';

function Middleware() {
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState('');

//   const handleCheckPayment = async () => {
//     const response = await fetch('http://localhost:4000/check-payment', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId: parseInt(userId) }),
//     });

//     const data = await response.json();
//     setResult(data.message || data.error);
//   };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
  <div className="text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Method Checker</h1>
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <form>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID:</label>
        <input
          type="number"
          id="userId"
          name="userId"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter User ID"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Check Payment Method
        </button>
      </form>

    </div>
    <div id="result" className="mt-6 text-lg text-gray-700 bg-white p-4 rounded-lg shadow-md hidden">
      {/* <!-- Result will be displayed here --> */}
    </div>
  </div>
</div>
  );
}

export default Middleware;