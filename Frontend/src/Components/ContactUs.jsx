import React, { useState } from 'react';
import contactus from "../assets/contactUs.jpg";
import { toast } from 'react-toastify';


function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const validateName = (name) => {
        return /^[a-zA-Z\s]*$/.test(name);
    };

    // Email validation - doesn't start with number and valid format
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z][\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(email);
    };

    // Phone validation - exactly 10 digits
    const validatePhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    const handleInputChange = (setter, validator = null) => (e) => {
        const value = e.target.value;
        // For phone field, only allow numbers
        if (setter === setPhone) {
            if (/^\d*$/.test(value) && value.length <= 10) {
                setter(value);
            }
        } 
        // For name field, validate as user types
        else if (setter === setName) {
            if (validateName(value) || value === "") {
                setter(value);
            }
        }
        else {
            setter(value.trimStart());
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
        const trimmedMessage = message.trim();

        // Form validation
        if (!trimmedName) {
            setErrMsg("Name is required.");
            return;
        }
        if (!validateName(trimmedName)) {
            setErrMsg("Name should contain only letters and spaces.");
            return;
        }
        if (!trimmedEmail) {
            setErrMsg("Email is required.");
            return;
        }
        if (!validateEmail(trimmedEmail)) {
            setErrMsg("Please provide a valid email (should not start with numbers).");
            return;
        }
        if (!trimmedPhone) {
            setErrMsg("Phone number is required.");
            return;
        }
        if (!validatePhone(trimmedPhone)) {
            setErrMsg("Please provide a valid 10-digit phone number (numbers only).");
            return;
        }
        if (!trimmedMessage) {
            setErrMsg("Message is required.");
            return;
        }

        setErrMsg("");
        setSuccessMsg("");

        const formData = new FormData();
        formData.append("access_key", "93bbedf5-801c-4e52-a7c8-c15e3683a521");
        formData.append("name", trimmedName);
        formData.append("email", trimmedEmail);
        formData.append("phone", trimmedPhone);
        formData.append("message", trimmedMessage);

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: json,
            }).then((res) => res.json());

            if (res.success) {
                toast.success("Message sent successfully")
                setName("");
                setEmail("");
                setPhone("");
                setMessage("");
                
                setTimeout(() => {
                    setSuccessMsg("");
                }, 5000);
            } else {
                setErrMsg("Something went wrong. Please try again.");
            }
        } catch (error) {
            setErrMsg("Failed to send the message. Please check your connection.");
        }
    };

    return (
        <section id="contact" className="min-h-screen p-6">
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={handleInputChange(setName)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                    pattern="[a-zA-Z\s]+"
                                    title="Only letters and spaces are allowed"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                    title="Email should not start with numbers"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={phone}
                                    onChange={handleInputChange(setPhone)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                                    required
                                    pattern="\d{10}"
                                    title="Please enter exactly 10 digits"
                                    maxLength="10"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                    Message
                                </label>
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
                                className="w-full bg-gradient-to-r from-gradientStart to-gradientEnd text-white p-2 rounded-md hover:opacity-80 transition-opacity"
                            >
                                Submit
                            </button>
                            {errMsg && (
                                <p className="text-red-500 py-2 text-center animate-fadeIn">
                                    {errMsg}
                                </p>
                            )}
                            {successMsg && (
                                <p className="text-green-500 py-2 text-center animate-fadeIn">
                                    {successMsg}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ContactUs;