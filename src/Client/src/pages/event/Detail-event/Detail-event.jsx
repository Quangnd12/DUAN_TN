import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { useGetEventQuery } from "../../../../../redux/slice/eventSlice";
import {
  Clock,
  MapPin,
  Share2,
  Heart,
  Calendar,
  ChevronDown,
  Loader2,
  AlertCircle,
  ArrowDown,
  List,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";

const MusicEventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: event, error, isLoading } = useGetEventQuery(id);
  const [isLiked, setIsLiked] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isArtistsExpanded, setIsArtistsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const contentsRef = useRef(null);

  const extractHeadings = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const headings = Array.from(
      tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6")
    );

    return headings.map((heading, index) => ({
      id: `section-${index}`,
      text: heading.textContent,
      element: heading,
    }));
  };

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Add IDs to headings for navigation
  const processDescription = (htmlContent) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    const headings = tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading, index) => {
      heading.id = `section-${index}`;
    });

    return tempDiv.innerHTML;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!descriptionRef.current) return;

      const sections = Array.from(
        descriptionRef.current.querySelectorAll("h1, h2, h3, h4, h5, h6")
      );
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section, index) => {
        const offsetTop = section.offsetTop;
        const offsetBottom = offsetTop + section.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition <= offsetBottom) {
          setActiveSection(`section-${index}`);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-black to-black">
        <Loader2 className="animate-spin text-white w-12 h-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-black to-black text-white p-8">
        <div className="text-center">
          <AlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Event Not Found</h2>
          <p className="text-gray-300">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/event")}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const processedDescription = processDescription(event.description);
  const headings = extractHeadings(event.description);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-black to-black text-white">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <img
          src={event.coverUrl || "/api/placeholder/1200/800"}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Navigation */}
        <nav className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate("/event")}
              className="text-white hover:text-blue-300 transition flex items-center"
            >
              <ChevronDown className="w-6 h-6 rotate-90 mr-2" /> Back to Events
            </button>
            <div className="flex space-x-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`${
                  isLiked ? "text-red-500" : "text-white"
                } hover:text-red-400 transition`}
              >
                <Heart className="w-6 h-6" />
              </button>
              <button className="text-white hover:text-blue-300 transition">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-md capitalize 
                ${
                  event.status === "upcoming"
                    ? "bg-green-500/20 text-green-300"
                    : event.status === "ongoing"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-gray-500/20 text-gray-300"
                }
              `}
              >
                {event.status}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-md">
                {event.eventCategory}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold">{event.name}</h1>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="body2" color="white">
                Created by: <strong>{event.createdByUsername}</strong>
              </Typography>
            </Box>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
          {/* Left Column - Description */}
          <div className="space-y-8">
            <div
              ref={descriptionRef}
              className="bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <div className="sticky top-0 bg-white/10 w-full backdrop-blur-sm z-10 p-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">About the Event</h2>
                <div className="flex items-center space-x-2 text-gray-400">
                  <ArrowDown className="w-5 h-5 text-gray-400 animate-bounce" />
                </div>
              </div>
              <div
                className="p-6 text-gray-300 leading-relaxed max-h-[700px] overflow-y-auto scrollbar-custom"
                dangerouslySetInnerHTML={{ __html: processedDescription }}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 relative">
            {/* Sticky Container for Contents and Other Details */}
            <div className="sticky top-4 space-y-4">
              {/* Event Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Calendar className="w-5 h-5" />
                    <span>Date</span>
                  </div>
                  <p>{format(new Date(event.startTime), "MMMM dd, yyyy")}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-300">
                    <Clock className="w-5 h-5" />
                    <span>Time</span>
                  </div>
                  <p>
                    {format(new Date(event.startTime), "hh:mm a")} -
                    {format(new Date(event.endTime), "hh:mm a")}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-blue-300">
                    <MapPin className="w-5 h-5" />
                    <span>Location</span>
                  </div>
                  <p>{event.location}</p>
                </div>
              </div>

              {/* Contents Navigation */}
              <div
                ref={contentsRef}
                className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm z-20 relative"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <List className="w-6 h-6 text-blue-300" />
                  <h3 className="text-xl font-semibold">Contents</h3>
                </div>
                <ul className="space-y-2">
                  {headings.map((heading) => (
                    <li
                      key={heading.id}
                      className={`cursor-pointer py-1 px-2 rounded-md transition ${
                        activeSection === heading.id
                          ? "bg-blue-500/20 text-blue-300"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => {
                        scrollToSection(heading.id);
                        setActiveSection(heading.id);
                      }}
                    >
                      {heading.text}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured Artists Section */}
              {event?.artists && event.artists.length > 0 && (
                <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">
                        Featured Artists
                      </h3>
                      <span className="text-sm text-gray-400">
                        ({event.artists.length})
                      </span>
                    </div>
                    <button
                      onClick={() => setIsArtistsExpanded(!isArtistsExpanded)}
                      className="text-blue-300 hover:text-blue-200 transition flex items-center"
                    >
                      {isArtistsExpanded ? (
                        <>
                          Collapse <ChevronUp className="ml-1 w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Expand <ChevronRight className="ml-1 w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <div
                    className={`grid grid-cols-2 gap-3 transition-all duration-300 ease-in-out ${
                      isArtistsExpanded
                        ? "max-h-[500px] opacity-100"
                        : "max-h-[120px] overflow-hidden opacity-70"
                    }`}
                  >
                    {event.artists.map((artist, index) => (
                      <div
                        key={artist.id || index}
                        className="bg-white/10 rounded-xl p-3 flex items-center space-x-3"
                      >
                        <img
                          src={artist.avatar || "/api/placeholder/200/200"}
                          alt={artist.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-semibold">
                            {artist.name}
                          </h4>
                          <p className="text-xs text-gray-400">Artist</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ticket Link */}
              <div className="bg-white/5 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold">Get Your Tickets!</h2>
                <a
                  href="https://ticketbox.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Buy Tickets Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicEventDetail;
