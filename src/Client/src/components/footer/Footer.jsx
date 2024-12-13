import React from "react";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { translations } from "../../utils/translations/translations";
import { useTheme } from "../../utils/ThemeContext";

const Footer = () => {
  const { language } = useTheme();

  return (
    <footer className="bg-zinc-900 text-white py-10 mt-4 rounded-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start m-4 border-b border-gray-600 pb-4">
          {/* Cột 1 */}
          <div className="flex-1">
            <h3 className="text-lg font-bold">{translations[language].company}</h3>
            <ul className="space-y-2 mt-2">
              <li>
                <Link to="#" className="hover:underline">
                  {translations[language].introduce}
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  {translations[language].forTheRecord}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 2 */}
          <div className="flex-1 mx-4">
            <h3 className="text-lg font-bold">{translations[language].community}</h3>
            <ul className="space-y-2 mt-2">
              <li>
                <Link
                  to="/artist-portal/auth/login"
                  className="hover:underline"
                >
                  {translations[language].forArtists}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  {translations[language].advertisement}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className="flex-1">
            <h3 className="text-lg font-bold">{translations[language].usefulLinks}</h3>
            <ul className="space-y-2 mt-2">
              <li>
                <Link href="#" className="hover:underline">
                  {translations[language].support}
                </Link>
              </li>
            </ul>
          </div>
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

        <div className="text-sm mt-4">
          <p>&copy; 2024 Our online music website. All rights reserved.</p>
          <div className="mt-2">
            <Link href="#" className="hover:underline mx-2">
              {translations[language].legal}
            </Link>
            <Link to="#" className="hover:underline mx-2">
              {translations[language].safetyAndPrivacy}
            </Link>
            <Link to="#" className="hover:underline mx-2">
              {translations[language].privacyPolicy}
            </Link>
            <Link to="#" className="hover:underline mx-2">
              {translations[language].cookie}
            </Link>
            <Link to="#" className="hover:underline mx-2">
              {translations[language].introduce}
            </Link>
            <Link to="#" className="hover:underline mx-2">
              {translations[language].advertisement}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
