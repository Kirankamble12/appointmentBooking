import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { FaUser, FaClock, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ViewMessages = () => {
  const { teacherEmail } = useParams();
  console.log("Retrieved Teacher Email:", teacherEmail);

  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");

  // ✅ Fetch Messages from Backend
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/teacher/teacher/${encodeURIComponent(teacherEmail)}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages.map(msg => ({
          ...msg,
          showReplyBox: msg.senderEmail !== teacherEmail && !msg.replied // ✅ Show reply box for new messages
        })));
        console.log("Updated Messages List:", data.messages);
      } else {
        console.error("Error fetching messages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [teacherEmail]);

  useEffect(() => {
    if (!teacherEmail) {
      console.error("Teacher email is missing!");
      return;
    }
    fetchMessages();
  }, [teacherEmail, fetchMessages]);

  // ✅ Handle Reply Submission
  const handleMessageSubmit = async (studentEmail) => {
    if (!messageContent.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }

    try {
      console.log("Sending Message to API: http://localhost:4000/api/teacher/reply");

      const response = await fetch("http://localhost:4000/api/teacher/reply", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherEmail,
          studentEmail,
          message: messageContent,  
          timestamp: new Date().toISOString()  
        }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (data.success) {
        toast.success("Message sent successfully!");
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.senderEmail === studentEmail ? { ...msg, showReplyBox: false } : msg
          )
        );

        setMessageContent("");
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message! Please try again.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-8 bg-white shadow-2xl shadow-violet-500 rounded-2xl overflow-y-auto max-h-screen">
      <ToastContainer />

      <h2 className="text-3xl font-bold text-center text-violet-700">My Messages</h2>
      <div className="w-24 h-1 mx-auto my-3 bg-violet-700 rounded-full"></div>

      {/* Message List */}
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`p-4 border rounded-lg shadow-md transition-all ${msg.senderEmail === teacherEmail ? "bg-gray-200" : "bg-white"} flex flex-col`}>
              <h3 className="text-lg font-bold flex items-center">
                <FaUser className={`mr-2 ${msg.senderEmail === teacherEmail ? "text-green-700" : "text-violet-700"}`} /> 
                {msg.senderEmail}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <FaClock className="inline text-violet-700 mr-2" /> {new Date(msg.timestamp).toLocaleString()}
              </p>
              <p className="text-base text-gray-700 flex items-center mt-2">
                <FaEnvelope className="inline text-violet-700 mr-2" /> {msg.message}
              </p>

              {/* ✅ Show text box automatically for new messages */}
              {msg.showReplyBox && (
                <div className="mt-3">
                  <textarea
                    placeholder="Send a message..."
                    className="w-full p-2 border border-violet-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                  />
                  <button 
                    className="mt-2 bg-green-700 text-white p-2 rounded-lg hover:bg-green-800 flex items-center space-x-2 transition-all"
                    onClick={() => handleMessageSubmit(msg.senderEmail)}
                  >
                    <FaPaperPlane />
                    <span>Send Message</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
      </div>
    </div>
  );
};

export default ViewMessages;
