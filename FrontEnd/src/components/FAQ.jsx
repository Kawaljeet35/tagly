import Navbar from "./Navbar";
import { useEffect, useState } from "react";

export default function FAQ({ handleLogout }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = await response.json();

        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const faqs = [
    {
      question: "How do I change my password?",
      answer: "You can change your password from Account Settings.",
    },
    {
      question: "How do I change my name, bio, or location?",
      answer:
        "Open your profile, go to the About section, and use the Edit option next to the field.",
    },
    {
      question: "How do I remove a friend?",
      answer: "Open the friend's profile and select Unfriend.",
    },
    {
      question: "How do I send a message to someone?",
      answer:
        "Open their profile and select Message, or use the Messages icon in the navigation bar.",
    },
    {
      question: "How do I delete my account?",
      answer: "Open Account Settings and select Delete Account.",
    },
    {
      question: "How do I report a problem or send a suggestion?",
      answer: "Use Give Feedback from the account menu.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-slate-800">
      <Navbar
        handleLogout={handleLogout}
        profilePictureUrl={currentUser?.profilePictureUrl}
      />

      <div className="pt-[68px] pb-5 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">
              FAQ
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Frequently asked questions about using Tagly.
            </p>

            <div className="space-y-5">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-200">
                    {faq.question}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
