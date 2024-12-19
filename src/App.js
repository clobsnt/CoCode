// import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Projects from './pages/Projects';
import Register from './pages/Register';
import CreateProject from './pages/CreateProject';
import EditorPage from './pages/EditorPage';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children: <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect to Login if not authenticated */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/projects'
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path='/create'
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route
          path='/editor/:id'
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

        {/* Login Page */}
        <Route path='/login' element={<Login />} />
        {/* Register Page */}
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
