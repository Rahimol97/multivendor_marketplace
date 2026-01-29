import React from 'react'
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className='min-h-screen bg-(--primary) text-(--text)'>
        <Outlet/>
    </div>
  );
}

export default AuthLayout