import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    manager_id: ""
  });
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users/managers").then(res => setManagers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanForm = {
      ...form,
      manager_id: form.manager_id === "" ? undefined : parseInt(form.manager_id)
    };

    try {
      await api.post("/auth/register", cleanForm);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            className="input-field"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            className="input-field"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Role</label>
          <select
            className="input-field"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value, manager_id: "" })}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        </div>

        {form.role === "employee" && (
          <div>
            <label>Select Manager</label>
            <select
              className="input-field"
              value={form.manager_id}
              onChange={(e) => setForm({ ...form, manager_id: e.target.value })}
            >
              <option value="">Select Manager</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>
        )}

        <button className="btn-primary" type="submit">Register</button>

        <div className="mt-4 text-center">
          <a href="/" className="link">
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}
