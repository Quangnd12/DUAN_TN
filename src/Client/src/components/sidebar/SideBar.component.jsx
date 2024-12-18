import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import StarRateIcon from "@mui/icons-material/StarRate";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import CelebrationIcon from '@mui/icons-material/Celebration';
import LanguageIcon from "@mui/icons-material/Language";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Logo from "../../assets/images/logo.png";
import { createAlbumSlug } from "../../components/createSlug"
import { useTheme } from "../../utils/ThemeContext";
import { translations } from "../../utils/translations/translations";

const SideBar = () => {
  const { language, toggleLanguage } = useTheme();
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
    className={`flex flex-col h-[calc(100vh-90px)] transition-all mr-1 duration-300 ease-in-out ${
      isOpen ? "w-72" : "w-16"
    } bg-zinc-900 p-2 rounded-md sticky top-0`}
  >
      <div className="flex items-center justify-start mb-4">
        <Link to={"/"}>
          <img
            width={isOpen ? 70 : 60}
            height={isOpen ? 70 : 60}
            src={Logo}
            alt="logo"
            className="transition-all duration-300"
          />
        </Link>
      </div>
      <div className="relative left-0 my-2 ">
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-600 hover:rounded-md px-3 py-3"
        >
          <Tooltip title={isOpen ? translations[language].collapseLibrary : translations[language].expandLibrary}>
            {isOpen ? (
              <MenuIcon fontSize="medium" />
            ) : (
              <ArrowForwardIosIcon />
            )}
          </Tooltip>
        </button>
      </div>
      <NavItem
        to="/search"
        icon={<SearchIcon />}
        text={translations[language].search}
        isOpen={isOpen}
      />
      <NavItem to="/" icon={<HomeIcon />} text={translations[language].home} isOpen={isOpen} />
      <NavItem
        to="/event"
        icon={<CelebrationIcon />}
        text={translations[language].event}
        isOpen={isOpen}
      />
      <NavItem
        to="/library"
        icon={<LibraryMusicIcon />}
        text={translations[language].myLibrary}
        isOpen={isOpen}
      />
      <NavItem
        to="/playlistall"
        icon={<QueueMusicIcon />}
        text={translations[language].playlist}
        isOpen={isOpen}
      />
      <NavItem
        to="/toprank"
        icon={<StarRateIcon />}
        text={translations[language].topRank}
        isOpen={isOpen}
      />

      <div className="mt-auto">
        <div
          className={`flex items-center gap-3 rounded-full w-max p-2 mb-9 font-bold transition-all cursor-pointer ${isClicked ? "bg-white text-black" : "bg-black text-white"
            } hover:scale-105 ${isOpen ? "" : "justify-center"}`}
          onClick={() => {
            toggleLanguage();
            setIsClicked(!isClicked);
          }}
        >
          <Tooltip title={translations[language].changeLanguage}>
            <div>
              <LanguageIcon
                className={isClicked ? "text-black" : "text-white"}
              />
              {isOpen && (
                <span className="ml-0">
                  {language === 'vi' ? "Tiếng Việt" : "English"}
                </span>
              )}
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, text, isOpen }) => (
  <Link to={to}>
    <Tooltip title={text} placement="bottom">
      <div className="flex items-center gap-2 hover:bg-gray-600 rounded py-2 px-2 mb-2">

        {React.cloneElement(icon, {
          fontSize: "large",
          sx: { color: "white" },
        })}
        {isOpen && <div className="text-white font-bold">{text}</div>}

      </div>
    </Tooltip>
  </Link>
);

export default SideBar;
