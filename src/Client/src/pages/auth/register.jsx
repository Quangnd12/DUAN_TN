import React from "react";
import 'tailwindcss/tailwind.css';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './auth.css';

const Register = () => {
    return (
        <section className="h-screen bg-[#202020] flex items-center justify-center">
            <div className="container py-5 h-full flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-black shadow-lg rounded-xl p-5">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-8 text-white">Sign up</h3>

                            <div className="relative mb-4">
                                <input
                                    type="email"
                                    id="typeEmailX-2"
                                    className="form-input w-full py-2 px-3 border border-[#6a6a6a] border-0.5 rounded-lg bg-black placeholder-gray-500 text-white focus:outline-none focus:border-[#1db954] focus:ring-0 transition-all duration-300"
                                    placeholder="Email"
                                />
                            </div>                                     
                            <button
                                className="w-full py-2 px-4 bg-[#1ed760] font-semibold text-black rounded-3xl shadow-md transform transition-transform duration-300  hover:ring-2 hover:ring-[#1ed760] shake-on-hover"
                                type="submit"
                            >
                                Sign up
                            </button>
                            <div className="flex items-center my-4">
                                <hr className="flex-1 border-t border-gray-300" />
                                <p className="text-gray-500 font-semibold mx-3 mb-0 text-sm">OR</p>
                                <hr className="flex-1 border-t border-gray-300" />
                            </div>

                            <button
                                className="w-full py-2 px-4 bg-black border border-[#6a6a6a]  text-white rounded-3xl shadow-md flex items-center justify-center hover:border-white hover:border-[1px] hover:ring-1 hover:ring-white transition-all"
                                type="submit"
                            >
                                <img src="assets/images/google.png" alt="Google" className="w-5 h-5 mr-2" />
                                <span className="flex-1 text-center">Sign up with Google</span>
                            </button>
                            <button
                                className="w-full py-2 px-4 bg-black border border-[#6a6a6a]  text-white rounded-3xl shadow-md flex items-center justify-center mt-2 hover:border-white hover:border-[1px] hover:ring-1 hover:ring-white transition-all"
                                type="submit"
                            >
                                <img src="assets/images/fb.png" alt="Facebook" className="w-5 h-5 mr-2" />
                                <span className="flex-1 text-center">Sign up with Facebook</span>
                            </button>

                            <div className="text-center mt-8 ">
                                <p className="text-gray-500 font-semibold mx-3 mb-0 text-sm">Already have an account? <Link to="/login" className="custom-text no-underline"> Sign in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
