import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ManagerDashboard() {
  const [employees, setEmployees] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [form, setForm] = useState({ strengths: "", improvements: "", sentiment: "" });
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    const managerId = localStorage.getItem("user_id");
    try {
      const [empRes, fbRes] = await Promise.all([
        api.get(`/users/my-employees?manager_id=${managerId}`),
        api.get(`/feedback/manager/${managerId}`)
      ]);
      setEmployees(empRes.data);
      setFeedbacks(fbRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchNotifications = async () => {
    const managerId = localStorage.getItem("user_id");
    try {
      const res = await api.get(`/feedback/notifications/${managerId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchNotifications();
  }, []);

  const getEmployeeFeedback = (employeeId) => {
    return feedbacks.filter(fb => fb.employee_id === employeeId);
  };

  const handleEdit = (fb) => {
    setEditingFeedback(fb.id);
    setForm({
      strengths: fb.strengths,
      improvements: fb.improvements,
      sentiment: fb.sentiment
    });
  };

  const handleUpdate = async () => {
    await api.put(`/feedback/${editingFeedback}`, form);
    setEditingFeedback(null);
    setForm({ strengths: "", improvements: "", sentiment: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      await api.delete(`/feedback/${id}`);
      fetchData();
    }
  };

  const markAsRead = async (id) => {
    await api.post(`/feedback/notifications/mark-read/${id}`);
    fetchNotifications();
  };

  return (
    <>
      {/* Main Dashboard Container */}
      <div className="form-container max-w-[1200px] mx-auto p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="form-title">👨‍💼 Manager Dashboard</h1>
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
                    <div key={notif.id} className="border-b py-1 text-sm">
                      {notif.message}
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-blue-500 text-xs ml-2"
                      >
                        Mark as read
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees assigned yet.</p>
        ) : (
          employees.map(emp => (
            <div
              key={emp.id}
              className="employee-card bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 p-4 rounded mb-4 shadow"
            >
              <div className="mb-2">
                <label className="font-semibold">👤 Employee Name:</label>
                <p className="text-lg text-blue-700">{emp.name}</p>
              </div>

              <div className="mb-2">
                <label className="font-semibold">📧 Email:</label>
                <p className="text-lg text-purple-700">{emp.email}</p>
              </div>

              <div className="flex gap-4 mb-4">
                <button
                  className="btn-primary"
                  onClick={() => navigate(`/feedback-form/${emp.id}`)}
                >
                  Give Feedback
                </button>
                <button
                  className="btn-secondary"
                  onClick={() =>
                    setExpandedEmployee(expandedEmployee === emp.id ? null : emp.id)
                  }
                >
                  {expandedEmployee === emp.id ? "Hide Feedback" : "View Feedback"}
                </button>
              </div>

              {expandedEmployee === emp.id && (
                <div className="feedback-section bg-white p-4 rounded shadow">
                  {getEmployeeFeedback(emp.id).length === 0 ? (
                    <p className="text-gray-500">No feedback submitted yet.</p>
                  ) : (
                    getEmployeeFeedback(emp.id).map(fb => (
                      <div key={fb.id} className="feedback-card mb-4 p-2 border rounded">
                        {editingFeedback === fb.id ? (
                          <div>
                            <label>✅ Strengths:</label>
                            <input
                              className="input-field"
                              value={form.strengths}
                              onChange={(e) =>
                                setForm({ ...form, strengths: e.target.value })
                              }
                            />
                            <label>⚠️ Improvements:</label>
                            <input
                              className="input-field"
                              value={form.improvements}
                              onChange={(e) =>
                                setForm({ ...form, improvements: e.target.value })
                              }
                            />
                            <label>💡 Sentiment:</label>
                            <input
                              className="input-field"
                              value={form.sentiment}
                              onChange={(e) =>
                                setForm({ ...form, sentiment: e.target.value })
                              }
                            />
                            <div className="flex gap-2 mt-2">
                              <button className="btn-primary" onClick={handleUpdate}>
                                Save
                              </button>
                              <button
                                className="btn-secondary"
                                onClick={() => setEditingFeedback(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p>
                              <b>✅ Strengths:</b> {fb.strengths}
                            </p>
                            <p>
                              <b>⚠️ Improvements:</b> {fb.improvements}
                            </p>
                            <p>
                              <b>💡 Sentiment:</b> {fb.sentiment}
                            </p>
                            <p>
                              <b>📝 Response:</b> {fb.response_text || "No response yet"}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <button className="btn-primary" onClick={() => handleEdit(fb)}>
                                Edit
                              </button>
                              <button
                                className="btn-danger"
                                onClick={() => handleDelete(fb.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Floating Buttons Fixed Outside Container */}
      <div className="fixed bottom-4 left-4 z-20">
        <button className="btn-secondary" onClick={() => navigate("/feedback/timeline")}>
          View Feedback Timeline
        </button>
      </div>

      <div className="fixed bottom-4 right-4 z-20">
        <button
          className="btn-danger"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}
