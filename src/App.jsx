import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Header from './components/Header';
import TabDetails from './pages/TabDetails';
import { ToastContainer } from 'react-toastify';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase/firebase';
import ChatBox from './components/ChatBox';

function App() {
  const [user] = useAuthState(auth);
  return (
    <Router>
      <Header />
      <ToastContainer />
      {user && <ChatBox user={user} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tab/:tabId" element={<ProtectedRoute><TabDetails /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
