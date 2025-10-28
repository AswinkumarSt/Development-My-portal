import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Login from './components/Login/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- Add this import

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
