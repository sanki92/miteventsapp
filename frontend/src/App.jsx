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
import Home from "./pages/Home";
import SignInAccessibleLayout from "./components/common/SignInAccessibleLayout";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Profile from "./pages/Profile";
import ProtectedRoute from "./services/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SignInAccessibleLayout>
                <Home />
              </SignInAccessibleLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SignInAccessibleLayout>
                <Events />
              </SignInAccessibleLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clubs"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SignInAccessibleLayout>
                <Clubs />
              </SignInAccessibleLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <SignInAccessibleLayout>
                <Profile />
              </SignInAccessibleLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/signup" replace />} />

        <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
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
