import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [managerSecret, setManagerSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email,
        password,
        manager_secret: managerSecret || null, // send null if empty
      };

      const res = await api.post("/auth/login", payload);

      if (!res.data || !res.data.access_token || !res.data.role || !res.data.user_id) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user_id", res.data.user_id);

      if (res.data.role === "manager") {
        // 🔥 Check if manager secret is already set
        if (!res.data.manager_secret_set) {
          navigate("/manager-secret");
        } else {
          navigate("/manager");
        }
      } else if (res.data.role === "employee") {
        navigate("/employee");
      } else {
        alert("Unknown role received. Please contact admin.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + (err.response?.data?.detail || err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            className="input-field"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Manager Secret (for Employees only)</label>
          <input
            className="input-field"
            type="password"
            placeholder="Enter manager secret if you are employee"
            value={managerSecret}
            onChange={(e) => setManagerSecret(e.target.value)}
          />
        </div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-2">
          <a href="/register" className="link">Don't have an account? Register</a>
        </div>
      </form>
    </div>
  );
}
