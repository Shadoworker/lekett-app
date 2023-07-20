import React from 'react';
import './MainLayout.css';
import SettingsBlock from '../components/PropsBlock/PropsBlock';
import FrameBlock from '../components/FrameBlock/FrameBlock';
import ItemsBlock from '../components/ItemsBlock/ItemsBlock';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <div className="sidebar">
        <ItemsBlock />
      </div>
      <div className="main-content">
        <FrameBlock />
        <SettingsBlock />
      </div>
    </div>
  );
};

export default MainLayout;
