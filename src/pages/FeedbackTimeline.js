import { useEffect, useState } from "react";
import api from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct import

export default function FeedbackTimeline() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/feedback")
      .then(res => {
        setFeedbacks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load feedback:", err);
        setError("Failed to load feedback data. Please check your backend API.");
        setLoading(false);
      });
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Feedback Timeline", 14, 15);

    const tableData = feedbacks.map(fb => [
      fb.id,
      fb.manager_id,
      fb.employee_id,
      fb.strengths,
      fb.improvements,
      fb.sentiment,
      fb.response_text || "No response",
      new Date(fb.created_at).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [["ID", "Manager", "Employee", "Strengths", "Improvements", "Sentiment", "Response", "Created"]],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 }
    });

    doc.save("feedback_timeline.pdf");
  };

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📊 Feedback Timeline</h1>
        <p className="text-center text-gray-500">Loading feedback data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">📊 Feedback Timeline</h1>
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📊 Feedback Timeline</h1>
        <button className="btn-primary" onClick={exportPDF}>Export PDF</button>
      </div>

      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500">No feedback available yet.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(fb => (
            <div key={fb.id} className="border p-4 rounded shadow bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
              <p><strong>Manager ID:</strong> {fb.manager_id}</p>
              <p><strong>Employee ID:</strong> {fb.employee_id}</p>
              <p><strong>Strengths:</strong> {fb.strengths}</p>
              <p><strong>Improvements:</strong> {fb.improvements}</p>
              <p><strong>Sentiment:</strong> {fb.sentiment}</p>
              <p><strong>Response:</strong> {fb.response_text || "No response"}</p>
              <p><strong>Created:</strong> {new Date(fb.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
