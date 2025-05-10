import React, { useState } from 'react';
import contactus from "../assets/contactUs.jpg";

function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    // Email validation regex
    const emailValidation = () => {
        return String(email)
            .toLowerCase()
            .match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    };

    const handleInputChange = (setter) => (e) => {
        // Trim leading spaces while typing
        setter(e.target.value.trimStart());
    };

    const handleSend = async (e) => {
        e.preventDefault();

        // Trim all inputs to remove leading/trailing spaces
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
        const trimmedMessage = message.trim();

        // Form validation
        if (!trimmedName) {
            setErrMsg("Name cannot be empty or just spaces.");
            return;
        }
        if (!isNaN(trimmedName)) {
            setErrMsg("Name cannot contain only numbers.");
            return;
        }
        if (!trimmedEmail) {
            setErrMsg("Email cannot be empty or just spaces.");
            return;
        }
        if (!emailValidation()) {
            setErrMsg("Please provide a valid email.");
            return;
        }
        if (!trimmedPhone) {
            setErrMsg("Phone number cannot be empty or just spaces.");
            return;
        }
        if (isNaN(trimmedPhone) || trimmedPhone.length < 10) {
            setErrMsg("Please provide a valid phone number (at least 10 digits).");
            return;
        }
        if (!trimmedMessage) {
            setErrMsg("Message cannot be empty or just spaces.");
            return;
        }

        // Reset error message
        setErrMsg("");

        // Prepare form data for submission
        const formData = new FormData();
        formData.append("access_key", "93bbedf5-801c-4e52-a7c8-c15e3683a521"); // Replace with your Web3Forms access key
        formData.append("name", trimmedName);
        formData.append("email", trimmedEmail);
        formData.append("phone", trimmedPhone);
        formData.append("message", trimmedMessage);

        // Convert formData to JSON for the API request
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            // Make API request
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: json,
            }).then((res) => res.json());

            // Handle response
            if (res.success) {
                setSuccessMsg("Message sent successfully!");
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
            } else {
                setErrMsg("Something went wrong. Please try again.");
            }
        } catch (error) {
            setErrMsg("Failed to send the message. Please check your connection.");
        }
    };

    return (
        <div id="contact-us" className="min-h-screen p-6">
            <h2 className="text-5xl font-bold text-gray-800 text-center my-6">
                Get in Touch with <span className="">ParkEase</span>
            </h2>
            <div className="flex items-center justify-center">
                <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Left Side - Image */}
                    <div className="w-full md:w-1/2">
                        <img src={contactus} alt="Contact Us" className="w-full h-full object-cover" />
                    </div>
                    {/* Right Side - Form */}
                    <div className="w-full md:w-1/2 p-8">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Contact Us</h2>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={handleInputChange(setName)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={phone}
                                    onChange={handleInputChange(setPhone)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={message}
                                    onChange={handleInputChange(setMessage)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-gradientStart to-gradientEnd text-white p-2 rounded-md hover:opacity-80"
                            >
                                Submit
                            </button>
                            {errMsg && <p className="text-red-500 py-2 text-center">{errMsg}</p>}
                            {successMsg && <p className="text-gradientStart py-2 text-center">{successMsg}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;