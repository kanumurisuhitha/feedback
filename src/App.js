import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import FeedbackForm from "./pages/FeedbackForm";
import FeedbackTimeline from "./pages/FeedbackTimeline";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerSecretPage from "./pages/ManagerSecretPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/manager-secret" element={<ManagerSecretPage />} /> {/* 🔥 added route */}

        {/* Protected routes */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Feedback form with dynamic employeeId */}
        <Route
          path="/feedback-form/:employeeId"
          element={
            <ProtectedRoute>
              <FeedbackForm />
            </ProtectedRoute>
          }
        />
    
        <Route
          path="/feedback/timeline"
          element={
            <ProtectedRoute>
              <FeedbackTimeline />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
