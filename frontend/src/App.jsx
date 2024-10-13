import React from 'react';
import Room from './pages/Room'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import { useAuthContext } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const {authUser} = useAuthContext();
  return (
    <div className='overflow-hidden'>
    <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Room /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!authUser ? <Register /> : <Navigate to="/" />} />
      </Routes> 
    <ToastContainer />
    </div>
  );
}

export default App;
