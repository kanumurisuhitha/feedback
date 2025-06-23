import { useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function FeedbackForm() {
  const { employeeId } = useParams();
  const [form, setForm] = useState({
    strengths: "",
    improvements: "",
    sentiment: ""
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const managerId = localStorage.getItem("user_id");

    try {
      await api.post("/feedback", {
        ...form,
        employee_id: employeeId,
        manager_id: managerId
      });
      alert("Feedback submitted");
      navigate("/manager");
    } catch {
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Submit Feedback</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Strengths</label>
          <textarea
            className="input-field"
            placeholder="Enter strengths"
            value={form.strengths}
            onChange={(e) => setForm({ ...form, strengths: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Improvements</label>
          <textarea
            className="input-field"
            placeholder="Enter areas for improvement"
            value={form.improvements}
            onChange={(e) => setForm({ ...form, improvements: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Sentiment</label>
          <input
            className="input-field"
            type="text"
            placeholder="Positive / Negative / Neutral"
            value={form.sentiment}
            onChange={(e) => setForm({ ...form, sentiment: e.target.value })}
            required
          />
        </div>

        <button className="btn-primary" type="submit">Submit Feedback</button>

        <div className="mt-4 text-center">
          <a href="/manager" className="link">Go Back to Dashboard</a>
        </div>
      </form>
    </div>
  );
}

