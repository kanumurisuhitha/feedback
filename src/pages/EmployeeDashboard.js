import { useEffect, useState } from "react";
import api from "../api";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function EmployeeDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [replying, setReplying] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    fetchNotifications();
  }, []);

  const fetchFeedbacks = () => {
    const employeeId = localStorage.getItem("user_id");
    api.get(`/feedback/employee/${employeeId}`).then((res) => setFeedbacks(res.data));
  };

  const fetchNotifications = () => {
    const employeeId = localStorage.getItem("user_id");
    api.get(`/feedback/notifications/${employeeId}`).then((res) => setNotifications(res.data));
  };

  const markNotificationAsViewed = async (notifId) => {
    await api.post(`/feedback/notifications/mark-read/${notifId}`);
    fetchNotifications();
  };

  const submitReply = async (id) => {
    if (!replyText.trim()) {
      alert("Please enter a reply");
      return;
    }
    await api.post(`/feedback/reply/${id}`, { text: replyText });
    alert("Reply submitted successfully");
    setReplying(null);
    setReplyText("");
    fetchFeedbacks();
  };

  return (
    <div className="form-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="form-title">Your Feedback</h1>

        <div className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="relative text-2xl">
            🔔
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-8 bg-white border rounded shadow p-2 max-w-xs z-10">
              {notifications.length === 0 ? (
                <p className="text-gray-500">No new notifications</p>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className="border-b py-1 text-sm flex justify-between items-center">
                    <span>{notif.message}</span>
                    <button
                      className="text-blue-500 text-xs ml-2"
                      onClick={() => markNotificationAsViewed(notif.id)}
                    >
                      Mark as viewed
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500">No feedback received yet.</p>
      ) : (
        feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <div className="mb-2">
              <label className="font-semibold">Strengths:</label>
              <p className="text-green-700 flex items-center">
                <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                {fb.strengths}
              </p>
            </div>

            <div className="mb-2">
              <label className="font-semibold">Improvements:</label>
              <p className="text-yellow-700 flex items-center">
                <ThumbsDown className="w-4 h-4 mr-2 text-yellow-500" />
                {fb.improvements}
              </p>
            </div>

            <div className="mb-2">
              <label className="font-semibold">Sentiment:</label>
              <p><span className={`tag ${fb.sentiment.toLowerCase()}`}>{fb.sentiment}</span></p>
            </div>

            <div className="mb-2">
              <label className="font-semibold">Your Response:</label>
              <p className={`font-medium ${fb.response_text ? "text-blue-700" : "text-gray-400"}`}>
                {fb.response_text || "No response yet"}
              </p>
            </div>

            {fb.response_text ? null : (
              replying === fb.id ? (
                <div className="reply-box">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows="3"
                    className="input-field"
                    placeholder="Type your reply..."
                  />
                  <div className="flex mt-2">
                    <button className="btn-primary" onClick={() => submitReply(fb.id)}>Submit Reply</button>
                    <button className="btn-secondary ml-2" onClick={() => { setReplying(null); setReplyText(""); }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn-primary mt-2" onClick={() => setReplying(fb.id)}>Reply</button>
              )
            )}
          </div>
        ))
      )}
    </div>
  );
}
