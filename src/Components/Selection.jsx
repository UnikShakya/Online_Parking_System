import React from 'react'
import { FaBell } from "react-icons/fa6";

function Selection() {

    const today = new Date().toISOString().split('T')[0];

    const currentTime = new Date().toISOString().split('')[0].slice(0, 5);

    return (
        <div className='flex justify-around items-center my-4'>
            <div className='flex gap-4 items-center'>
                <label htmlFor="" className='text-lg text-gray-600 font-semibold'>
                    Select location:
                </label>
                <select id="location" name="location" className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="Paris">Lagankhel</option>
                    <option value="Paris">Sundhara</option>
                    <option value="Paris">Naxal</option>
                    <option value="Paris">Satdobato</option>
                </select>
            </div>

            <div className='flex gap-4 items-center'>
                <label htmlFor="" className='text-lg text-gray-600 font-semibold'>Select Date:</label>
                <input type="date" id="date" name="date" min={today} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>


            <div className='flex gap-4 items-center'>
                <label htmlFor="" className='text-lg text-gray-600 font-semibold'>Start time:</label>
                <input type="time" id="start-time" name="start-time" min={currentTime} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>


            <div className='flex gap-4 items-center'>
                <label htmlFor="" className='text-lg text-gray-600 font-semibold'>End time:</label>
                <input type="time" id="end-time" name="end-time" min={currentTime} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>


            <button className="bg-designColor text-white rounded-full px-6 py-2 text-lg hover:bg-opacity-70">
                Book Now
            </button>
            <FaBell size={30}/>



        </div>
    )
}

export default Selection
