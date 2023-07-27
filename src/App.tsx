import React, { useState, useRef } from 'react';
import './App.css'; // Create an App.css file and copy the CSS styles from the original code into it
import MainLayout from './views/MainLayout';
import { Layout } from 'antd';

const {Header} = Layout;

const App = () => {
  return (
    <div className="lekett">
      <Header className='header'>
        <div style={{display: 'flex', height: '100%', alignItems: 'center'}}>
          <img src={require('./assets/icons/logo.png')} style={{width:30, height:30}} />
          <span style={{color:'#fff', padding:5, fontFamily:'sans-serif'}}>lekett</span>
        </div>
     
      </Header>
      <MainLayout />
    </div>
  );
};

export default App;
