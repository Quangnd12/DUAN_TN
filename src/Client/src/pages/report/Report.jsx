import React, { useState } from "react";
import { handleAddReport, handleAcceptTerms } from "../../components/notification";
import '../../../src/assets/css/report/report.css';

const Report = () => {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  const reportReasons = [
    "Inappropriate content",
    "Copyright violation",
    "Hateful content",
    "Spam",
    "Impersonation",
    "Disruptive content",
  ];

  const handleSubmit = () => {
    if (!isTermsAccepted) {
      return;
    }
    console.log("Report Title:", reportTitle);
    console.log("Selected Reason:", selectedReason);
    console.log("Description:", description);
   
    setShowThankYouModal(true);

    setReportTitle("");
    setSelectedReason("");
    setDescription("");
    setIsTermsAccepted(false);

    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 p-6">
      <div className="w-full h-full bg-zinc-800 rounded-lg shadow-lg p-8 mb-20">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
          Report Content
        </h2>

        <div className="mb-8">
          <label htmlFor="reportTitle" className="block text-white text-lg font-medium mb-2">
            Report Title
          </label>
          <input
            type="text"
            id="reportTitle"
            value={reportTitle}
            onChange={(e) => setReportTitle(e.target.value)}
            className="w-full p-3 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 border-none"
            placeholder="Enter a title for the report"
          />
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="reason" className="block text-white text-lg font-medium mb-2">
              Select Reason
            </label>
            <select
              id="reason"
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full p-3 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 border-none"
            >
              <option value="">Choose a reason</option>
              {reportReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-white text-lg font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-3 bg-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 border-none"
              placeholder="Describe the report in detail..."
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="terms"
              checked={isTermsAccepted}
              onChange={() => setIsTermsAccepted((prev) => !prev)}
              className="custom-checkbox mr-3"
            />
            <label htmlFor="terms" className="text-white">
              I agree to the terms
            </label>
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition transform hover:scale-105"
            onClick={handleSubmit}
          >
            Submit Report
          </button>
        </div>
      </div>

      {showThankYouModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div className="bg-zinc-800 p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
            <div className="mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-16 h-16 text-green-500 mx-auto animate-checkmark" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p className="text-white">Your report has been submitted successfully.</p>
            <p className="text-white">Redirecting you to the home page...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;