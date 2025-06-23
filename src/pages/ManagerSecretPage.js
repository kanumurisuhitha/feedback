import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function ManagerSecretPage() {
  const [secret, setSecret] = useState("");
  const navigate = useNavigate();
  const manager_id = localStorage.getItem("user_id");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/set-manager-secret", {
        manager_id: parseInt(manager_id),
        manager_secret: secret
      });
      alert("Manager secret set successfully");
      navigate("/manager");
    } catch (err) {
      console.error(err);
      alert("Failed to set manager secret");
    }
  };

  return (
    <div className="form-container">
      <h1>Set Manager Secret</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Manager Secret Password</label>
          <input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} required className="input-field" />
        </div>
        <button type="submit" className="btn-primary">Set Secret</button>
      </form>
    </div>
  );
}
