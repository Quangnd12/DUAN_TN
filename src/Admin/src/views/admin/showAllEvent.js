import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useGetAllEventsQuery } from "../../../../redux/slice/eventSlice";

const ShowAllEvents = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const {
    data: eventsData,
    isLoading,
    isError,
  } = useGetAllEventsQuery({
    page: currentPage,
    limit: 8,
    search: searchTerm,
    status: selectedStatus,
    eventCategory: selectedCategory,
    sort: "createdAt",
    order: "DESC",
  });

  const events = eventsData?.events || [];
  const totalPages = eventsData?.totalPages || 1;

  const eventCategories = [
    "Music Festival",
    "Concert",
    "Workshop",
    "Conference",
    "Art Exhibition",
    "Theater Performance",
  ];

  const statusOptions = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
  ];

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleEventDetail = (id) => {
    navigate(`/admin/event/detail/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">All Events</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="text-gray-400" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {eventCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="text-center text-gray-500">Loading events...</div>
      ) : isError ? (
        <div className="text-center text-red-500">Error loading events</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-500">No events found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                onClick={() => handleEventDetail(event.id)}
              >
                <img
                  src={event.coverUrl || "default-image-url"}
                  alt={event.name}
                  className="w-full h-28 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {truncateText(event.name, 30)}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        event.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : event.status === "ongoing"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.startTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50"
            >
              <ChevronLeftIcon />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-sm ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-full disabled:opacity-50"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShowAllEvents;
