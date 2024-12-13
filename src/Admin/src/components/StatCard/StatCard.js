import React from "react";

// Thêm translations cho status và labels
const eventTranslations = {
  vi: {
    upcoming: "Sắp diễn ra",
    ongoing: "Đang diễn ra",
    date: "Ngày",
    time: "Giờ"
  },
  en: {
    upcoming: "Upcoming",
    ongoing: "Ongoing",
    date: "Date",
    time: "Time"
  }
};

function StatCard({ 
  icon, 
  value, 
  label, 
  color, 
  subValue, 
  topArtists,
  topUsers,
  upcomingEvents,
  language = 'vi' // Thêm prop language
}) {
  const t = eventTranslations[language];

  // Hàm format thời gian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (language === 'vi') {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hàm render nội dung tùy theo loại data
  const renderContent = () => {
    if (topArtists) {
      return (
        <div className="mt-3 flex-grow">
          <div className="space-y-2">
            {topArtists.map((artist, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-base bg-white/40 p-2 rounded-lg"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <span className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-gray-700 font-medium">
                    #{index + 1}
                  </span>
                  <span className="font-medium truncate ml-2 flex-1">
                    {artist.name}
                  </span>
                </div>
                <span className="text-gray-600 ml-3">{artist.count}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (topUsers) {
      return (
        <div className="mt-3 flex-grow">
          <div className="space-y-2">
            {topUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-base bg-white/40 p-2 rounded-lg"
              >
                <div className="flex items-center flex-1 min-w-0">
                  <span className="w-7 h-7 flex items-center justify-center bg-white rounded-full text-gray-700 font-medium">
                    #{index + 1}
                  </span>
                  <span className="font-medium truncate ml-2 max-w-[150px]">
                    {user.username}
                  </span>
                </div>
                <span className="text-gray-600 text-sm">
                  {user.role === 'user' ? 'Người dùng' : 'Admin'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (upcomingEvents) {
      return (
        <div className="mt-3 flex-grow">
          <div className="space-y-2">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm bg-white/40 p-2 rounded-lg"
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-gray-700 font-medium text-xs">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" title={event.name}>
                      {event.name}
                    </p>
                    <div className="flex items-center text-xs text-gray-600 mt-0.5 space-x-2">
                      <span>{formatDate(event.startTime)}</span>
                      <span>•</span>
                      <span>{formatTime(event.startTime)}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                  event.status === 'upcoming' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {event.status === 'upcoming' ? t.upcoming : t.ongoing}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return subValue && (
      <p className="text-base text-gray-600 mt-2">{subValue}</p>
    );
  };

  return (
    <div className={`${color} p-6 rounded-lg shadow h-auto`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-600 text-base">{label}</p>
            <h3 className="text-3xl font-bold mt-2">{value}</h3>
          </div>
          <div className="text-2xl text-gray-700 bg-white/50 p-3 rounded-lg">
            {icon}
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}

export default StatCard;
