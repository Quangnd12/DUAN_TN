import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import NotificationDropdown from "../Dropdowns/NotificationDropdown.js";
import UserDropdown from "../Dropdowns/UserDropdown.js";
import {
  MdDashboard,
  MdSettings,
  MdMusicNote,
  MdLogout,
  MdHome,
  MdPerson,
  MdCategory,
  MdAlbum,
  MdQueueMusic,
  MdTrendingUp,
  MdLyrics,
  MdFavorite,
  MdPersonAdd,
  MdHistory,
  MdWatchLater,
  MdHeadset,
  MdEvent,
  MdReport,
  MdThumbUp
} from "react-icons/md";

export default function Sidebar() {
  const location = useLocation();
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  // Check if the current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-gray-700 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <NavLink
            className="md:block text-left md:pb-2 text-gray-300 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/admin/dashboard"
          >
            Music Heals
          </NavLink>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <NavLink
                    className="md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    Music Heals
                  </NavLink>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 px-3 py-2 h-12 border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-gray-300 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Admin Layout Pages
            </h6>
            {/* Navigation */}
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="flex items-center">
                <NavLink
                  to="/admin/dashboard"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/dashboard")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdDashboard
                    className={`mr-2 text-sm ${isActive("/admin/dashboard") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/home"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/home")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdHome
                    className={`mr-2 text-sm ${isActive("/admin/home") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Home</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/user"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/user")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdPerson
                    className={`mr-2 text-sm ${isActive("/admin/user") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>User</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/song"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/song")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdMusicNote
                    className={`mr-2 text-sm ${isActive("/admin/song") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Song</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/genre"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/genre")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdCategory
                    className={`mr-2 text-sm ${isActive("/admin/genre") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Genre</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/artist"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/artist")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdPerson
                    className={`mr-2 text-sm ${isActive("/admin/artist") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Artist</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/album"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/album")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdAlbum
                    className={`mr-2 text-sm ${isActive("/admin/album") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Album</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/playlist"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/playlist")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdQueueMusic
                    className={`mr-2 text-sm ${isActive("/admin/playlist") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Playlist</span>
                </NavLink>
              </li>

              <li className="flex items-center">
                <NavLink
                  to="/admin/lyric"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/lyric")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdLyrics
                    className={`mr-2 text-sm ${isActive("/admin/lyric") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Lyric</span>
                </NavLink>
              </li>

            </ul>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-gray-300 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Personal Experience Pages
            </h6>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="flex items-center">
                <NavLink
                  to="/admin/favorite"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/favorite")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdFavorite
                    className={`mr-2 text-sm ${isActive("/admin/favorite") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Favorite</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/follow"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/follow")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdPersonAdd
                    className={`mr-2 text-sm ${isActive("/admin/follow") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Follow</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/listening-history"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/listening-history")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdHistory
                    className={`mr-2 text-sm ${isActive("/admin/listening-history") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Listening history</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/waiting-list"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/waiting-list")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdWatchLater
                    className={`mr-2 text-sm ${isActive("/admin/waiting-list") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Waiting list</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/listening-count"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/listening-count")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdHeadset
                    className={`mr-2 text-sm ${isActive("/admin/listening-count") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Listening count</span>
                </NavLink>
              </li>

            </ul>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-gray-300 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Music Discovery Pages
            </h6>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="flex items-center">
                <NavLink
                  to="/admin/top-chart"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/top-chart")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdTrendingUp
                    className={`mr-2 text-sm ${isActive("/admin/top-chart") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Top chart</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/event"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/event")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdEvent
                    className={`mr-2 text-sm ${isActive("/admin/event") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Event</span>
                </NavLink>
              </li>
              <li className="flex items-center">
                <NavLink
                  to="/admin/recommendation"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/recommendation")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdThumbUp
                    className={`mr-2 text-sm ${isActive("/admin/recommendation") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Recommendation</span>
                </NavLink>
              </li>

            </ul>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-gray-300 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Report Pages
            </h6>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="flex items-center">
                <NavLink
                  to="/admin/report"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/report")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdReport
                    className={`mr-2 text-sm ${isActive("/admin/report") ? "text-cyan-400" : "text-gray-300"
                      }`}
                  />
                  <span>Report</span>
                </NavLink>
              </li>
            </ul>
            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-gray-300 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Profile Layout Pages
            </h6>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="flex items-center">
                <NavLink
                  to="/admin/settings"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/settings")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdSettings
                    className={`mr-2 text-sm ${isActive("/admin/settings")
                      ? "text-cyan-400"
                      : "text-gray-300"
                      }`}
                  />
                  <span>Settings</span>
                </NavLink>
              </li>

              <li className="flex items-center">
                <NavLink
                  to="/admin/logout"
                  className={`text-xs uppercase py-3 font-bold flex items-center ${isActive("/admin/logout")
                    ? "text-cyan-400 hover:text-cyan-500"
                    : "text-white hover:text-cyan-500"
                    }`}
                >
                  <MdLogout
                    className={`mr-2 text-sm ${isActive("/admin/logout")
                      ? "text-cyan-400"
                      : "text-gray-300"
                      }`}
                  />
                  <span>Log out</span>
                </NavLink>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-white text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              No Layout Pages
            </h6>
            {/* Navigation */}

            {/* <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <NavLink
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  to="/landing"
                >
                  <i className="fas fa-newspaper text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Landing Page
                </NavLink>
              </li>

              <li className="items-center">
                <NavLink
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  to="/profile"
                >
                  <i className="fas fa-user-circle text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Profile Page
                </NavLink>
              </li>
            </ul> */}
          </div>
        </div>
      </nav>
    </>
  );
}
