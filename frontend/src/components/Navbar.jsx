import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { authUser, setAuthUser } = useAuthContext();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: "GET",
        credentials: "include", 
    });
      const data = await response.json();
      localStorage.removeItem('user');
      setAuthUser(null);
      toast.success(data.message);
    } catch (err) {
      toast.error('Failed to logout');
    }
  }

  return (
    <>
      <div className="navbar bg-base-100 fixed w-full z-10">
        <div className="flex-1">
          <Link to="/home" className="btn btn-ghost text-xl ">RoomChat</Link>
        </div>
        <div className="flex-none">
          {authUser ? (
            <>
              <div className='text-xl font-semibold'>Welcome! {authUser.username}</div>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="User profile"
                      src={authUser.avatar}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/register" className="btn btn-ghost">Register</Link>
              <Link to="/login" className="btn btn-ghost">Login</Link>
            </div>
          )}
        </div>
        
      </div>
    </>
  );
}
