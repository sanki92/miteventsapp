import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";
import SignUpScreen from "./components/SignUpScreen";
import LoginScreen from "./components/LoginScreen";
import VerifyEmail from "./pages/VerifyEmail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<LoginScreen />} />
  
        <Route path="/verify-email" element={<VerifyEmail/>} />
        <Route path="/" element={<Navigate to="/signup" replace />} />
        {/* <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
};
export default App;
