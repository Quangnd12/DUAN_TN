import React from "react";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold">Sportify Clone</h2>
            <p>&copy; 2024 My Website. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a
              href="/about"
              className="hover:underline"
            >
              About Us
            </a>
            <a
              href="/services"
              className="hover:underline"
            >
              Services
            </a>
            <a
              href="/contact"
              className="hover:underline"
            >
              Contact
            </a>
          </div>
          <div className="mt-4 md:mt-0">
            <p>Contact us: nhom6@frontendframework2.com</p>
            <p>Phone: 094662121212</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
