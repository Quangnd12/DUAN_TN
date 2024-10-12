import React, { useState } from "react";
import { handleAddReport, handleAcceptTerms } from "../../components/notification"; // Adjust the path
import Tb from "../../../public/assets/img/tc.jpg";
import '../../../src/assets/css/report/report.css'; // Import CSS file

const Report = () => {
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [description, setDescription] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false); // New state for terms acceptance

  const reportReasons = [
    "Inappropriate content",
    "Copyright violation",
    "Hateful content",
    "Spam",
    "Impersonation",
    "Disruptive content",
  ];

  const handleReasonToggle = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = () => {
    if (!isTermsAccepted) {
      handleAcceptTerms(); // Show notification if terms are not accepted
      return; // Return if terms are not accepted
    }

    console.log("Selected Reasons:", selectedReasons);
    console.log("Description:", description);
    handleAddReport(); // Show notification when report is submitted

    // Open a new tab with the thank-you message
    window.open('/thankYou.html', '_blank');

    // Reset state
    setSelectedReasons([]);
    setDescription("");
    setIsTermsAccepted(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full md:w-5/4 bg-zinc-900 rounded-lg p-6 min-h-screen">
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="md:w-1/2 p-6">
            <h2 className="text-3xl font-extrabold text-white mb-6">
              Report Content
            </h2>
            <div className="space-y-4">
              {reportReasons.map((reason) => (
                <div key={reason} className="flex items-center">
                  <input
                    type="checkbox"
                    id={reason}
                    checked={selectedReasons.includes(reason)}
                    onChange={() => handleReasonToggle(reason)}
                    className="custom-checkbox"
                  />
                  <label
                    htmlFor={reason}
                    className="ml-3 text-lg font-medium text-white"
                  >
                    {reason}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 relative p-6 flex flex-col items-center justify-center">
            <div className="relative w-full h-80">
              <img
                src={Tb}
                alt="Reported content"
                className="w-full h-full object-cover filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold">MUSIC HEALS</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <textarea
            className="w-full p-4 bg-black border border-white rounded-lg text-white focus:ring-blue-400"
            placeholder="Describe the report in detail..."
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex items-center ml-7">
          <input
            type="checkbox"
            id="terms"
            checked={isTermsAccepted}
            onChange={() => setIsTermsAccepted((prev) => !prev)} // Toggle the checkbox state
            className="custom-checkbox"
          />
          <label htmlFor="terms" className="ml-2 text-white">
            I agree to the terms
          </label>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-500 transition transform hover:scale-105">
            Back
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition transform hover:scale-105"
            onClick={handleSubmit}
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
