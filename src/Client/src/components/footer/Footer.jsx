import React from "react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white py-10 mt-4 rounded-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start m-4 border-b border-gray-600 pb-4">
          {/* Cột 1 */}
          <div className="flex-1">
            <h3 className="text-lg font-bold">Company</h3>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="#" className="hover:underline">
                  Introduce
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  For the Record
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div className="flex-1 mx-4">
            <h3 className="text-lg font-bold">Community</h3>
            <ul className="space-y-2 mt-2">
              <li>
                <Link href="#" className="hover:underline">
                  For Artists
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Advertisement
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="flex-1">
            <h3 className="text-lg font-bold">Useful Links</h3>
            <ul className="space-y-2 mt-2">
              <li>
                <Link href="#" className="hover:underline">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <a
                href="https://facebook.com"
                className="flex items-center justify-center border border-[#292929] rounded-full p-2 hover:bg-[#292929] transition-colors"
              >
                <FaFacebook size="24px" />
              </a>
              <a
                href="https://twitter.com"
                className="flex items-center justify-center border border-[#292929] rounded-full p-2 hover:bg-[#292929] transition-colors"
              >
                <FaTwitter size="24px" />
              </a>
            </div>
          </div>
        </div>

        {/* Thêm các icon và liên kết mạng xã hội */}

        <div className="text-sm mt-4">
          <p>&copy; 2024 My Website. All rights reserved.</p>
          <div className="mt-2">
            <Link href="#" className="hover:underline mx-2">
              Pháp lý
            </Link>
            <Link to="#" className="hover:underline mx-2">
              Trung tâm an toàn và quyền riêng tư
            </Link>
            <Link to="#" className="hover:underline mx-2">
              Chính sách quyền riêng tư
            </Link>
            <Link to="#" className="hover:underline mx-2">
              Cookie
            </Link>
            <Link to="#" className="hover:underline mx-2">
              Giới thiệu
            </Link>
            <Link to="#" className="hover:underline mx-2">
              Quảng cáo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
