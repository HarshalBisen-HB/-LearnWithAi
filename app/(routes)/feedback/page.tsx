"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface FormDetails {
  name: string;
  email: string;
  feedback: string;
  rating: string;
}

interface Status {
  success?: boolean;
  message?: string;
}

export const FeedbackForm = () => {
  const formInitialDetails: FormDetails = {
    name: "",
    email: "",
    feedback: "",
    rating: "",
  };

  const [formDetails, setFormDetails] =
    useState<FormDetails>(formInitialDetails);
  const [status, setStatus] = useState<Status>({});
  const [formValid, setFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Basic form validation
    const { name, email, feedback } = formDetails;
    setFormValid(name !== "" && email !== "" && feedback !== "");
  }, [formDetails]);

  const onFormUpdate = (category: keyof FormDetails, value: string) => {
    setFormDetails({
      ...formDetails,
      [category]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response = await fetch(
        "https://port-folio-ed7x-git-main-harshs-projects-f2cd1ad8.vercel.app/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            firstName: formDetails.name,
            lastName: "",
            email: formDetails.email,
            phone: "",
            message: `Feedback (Rating: ${formDetails.rating || "Not provided"}): ${formDetails.feedback}`,
          }),
        }
      );

      let result = await response.json();
      setFormDetails(formInitialDetails);

      if (result.code === 200) {
        setStatus({ success: true, message: "Thank you for your feedback!" });
      } else {
        setStatus({
          success: false,
          message: "Something went wrong, please try again later.",
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: "Network error, please check your connection.",
      });
    }

    setLoading(false);

    // Auto-clear status message after 5 seconds
    setTimeout(() => {
      setStatus({});
    }, 5000);
  };

  return (
    <div className="max-w-lg mx-auto bg-[#dae1ff] p-8 rounded-2xl shadow-2xl border border-blue-100 backdrop-blur-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8bb3e9] rounded-full mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold bg-[#8bb3e9] bg-clip-text text-transparent mb-2">
          Share Your Feedback
        </h2>
        <p className="text-gray-600">We'd love to hear your thoughts! ✨</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors"
          >
            Your Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formDetails.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFormUpdate("name", e.target.value)
              }
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:border-blue-300"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors"
          >
            Your Email *
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formDetails.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onFormUpdate("email", e.target.value)
              }
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:border-blue-300"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label
            htmlFor="rating"
            className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors"
          >
            Rating (Optional)
          </label>
          <div className="relative">
            <select
              id="rating"
              name="rating"
              value={formDetails.rating}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                onFormUpdate("rating", e.target.value)
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:border-blue-300 appearance-none cursor-pointer"
            >
              <option value="">Select a rating</option>
              <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
              <option value="4">⭐⭐⭐⭐ Good</option>
              <option value="3">⭐⭐⭐ Average</option>
              <option value="2">⭐⭐ Poor</option>
              <option value="1">⭐ Very Poor</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="group">
          <label
            htmlFor="feedback"
            className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors"
          >
            Your Feedback *
          </label>
          <div className="relative">
            <textarea
              id="feedback"
              name="feedback"
              value={formDetails.feedback}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                onFormUpdate("feedback", e.target.value)
              }
              placeholder="Share your thoughts, suggestions, or comments..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm hover:border-blue-300 resize-vertical"
              required
            />
            <div className="absolute top-3 right-3">
              <svg
                className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!formValid || loading}
          className={`group relative w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
            formValid && !loading
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          } overflow-hidden`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${!formValid || loading ? "hidden" : ""}`}
          ></div>
          <div className="relative flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Submit Feedback</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </>
            )}
          </div>
        </button>

        {status.message && (
          <div
            className={`p-4 rounded-xl border-l-4 shadow-lg backdrop-blur-sm transition-all duration-500 transform ${
              status.success
                ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-500"
                : "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-500"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  status.success ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <span className="text-white font-bold text-sm">
                  {status.success ? "✓" : "!"}
                </span>
              </div>
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
