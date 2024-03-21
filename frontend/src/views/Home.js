import React from 'react';
import axios from 'axios';
import UserSidebar from './sections/UserSidebar';
import '../css/home.css';

function Home() {
  return (
    <div className='d-flex vh-100 h-bg'>
        <UserSidebar />
    </div>
  )
}

export default Home