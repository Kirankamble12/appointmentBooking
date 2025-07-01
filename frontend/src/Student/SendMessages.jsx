import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane, FaTimes, FaUser, FaClock, FaEnvelope } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SendMessages = () => {
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacher, setTeacher] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);  // ✅ Store fetched teacher messages
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Load selected teacher details from localStorage
  useEffect(() => {
    const storedTeacher = JSON.parse(localStorage.getItem("selectedTeacher"));
    if (storedTeacher) {
      setTeacherEmail(storedTeacher.email);
      setTeacher(storedTeacher);
      fetchTeacherMessages(storedTeacher.email); // ✅ Fetch messages automatically
    } else {
      setError("No teacher selected!");
    }
  }, []);

  // ✅ Fetch messages from the teacher
  const fetchTeacherMessages = async (email) => {
    try {
      const studentEmail = JSON.parse(localStorage.getItem("studentData"))?.email;
      if (!studentEmail) {
        console.error("Student email is missing!");
        return;
      }

      const response = await fetch(`http://localhost:4000/api/student/${encodeURIComponent(studentEmail)}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages.filter(msg => msg.senderEmail === email));  // ✅ Only show teacher's messages
        console.log("Teacher Messages:", data.messages);
      } else {
        console.error("Error fetching messages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // ✅ Function to send message
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/student/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: JSON.parse(localStorage.getItem("studentData"))?.email,
          teacherEmail: teacherEmail,
          message: message,
        }),
      });

      const data = await response.json();
      console.log("Server Response:", data);
      setLoading(false);

      if (!response.ok) {
        toast.error(data.message || "Failed to send message!");
        return;
      }

      setMessage(""); // ✅ Clear input field on success
      toast.success("Message sent successfully!");
      fetchTeacherMessages(teacherEmail); // ✅ Refresh messages after sending
    } catch (err) {
      console.error("Error sending message:", err.message);
      setLoading(false);
      toast.error("Error sending message! Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md relative">
      <ToastContainer />

      {/* ✅ Close Button (Back to Dashboard) */}
      <button
        className="absolute top-3 right-3 text-gray-600 hover:text-red-600"
        onClick={() => navigate("/student-dashbord")}
      >
        <FaTimes className="text-2xl" />
      </button>

      <h2 className="text-2xl font-bold text-center text-violet-700">Send Message</h2>
      {error && <p className="text-red-600 text-center">{error}</p>}

      {teacher && (
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <h3 className="text-lg font-bold text-violet-700">{teacher.name}</h3>
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Department:</strong> {teacher.department}</p>
          <p><strong>Subject:</strong> {teacher.subject}</p>
        </div>
      )}

      {/* ✅ Display Messages from Teacher */}
      <div className="space-y-4 mt-6">
        <h3 className="text-xl font-bold text-center text-violet-600">Previous Messages</h3>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.timestamp} className="p-4 border border-violet-400 rounded-lg shadow-md hover:shadow-lg transition-all">
              <h3 className="text-lg font-bold flex items-center">
                <FaUser className="mr-2 text-green-700" /> {msg.senderEmail}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <FaClock className="inline text-violet-700 mr-2" /> {new Date(msg.timestamp).toLocaleString()}
              </p>
              <p className="text-base text-gray-700 flex items-center mt-2">
                <FaEnvelope className="inline text-violet-700 mr-2" /> {msg.message}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No previous messages from this teacher.</p>
        )}
      </div>

      {/* ✅ Message Input */}
      <textarea
        className="w-full p-3 border border-violet-400 rounded-lg mt-4 focus:ring-2 focus:ring-violet-600"
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      {/* ✅ Send Message Button */}
      <button
        onClick={handleSendMessage}
        className="bg-violet-700 text-white px-4 py-2 rounded-lg hover:bg-violet-800 flex items-center space-x-2 mt-4 w-full justify-center"
      >
        {loading ? "Sending..." : <>
          <FaPaperPlane />
          <span>Send Message</span>
        </>}
      </button>
    </div>
  );
};

export default SendMessages;
