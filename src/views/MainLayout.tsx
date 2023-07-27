import React from 'react';
import './MainLayout.css';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
 
import FrameBlock from '../components/FrameBlock/FrameBlock';
import ItemsBlock from '../components/ItemsBlock/ItemsBlock';
import PropsBlock from '../components/PropsBlock/PropsBlock';

const { Header, Content, Footer } = Layout;


const MainLayout = () => {

   const {
    token: { colorBgContainer },
  } = theme.useToken();


  return (
    <div className="main-layout">
      <div className="sidebar">
        <ItemsBlock />
      </div>
      <div className="main-content">
        <FrameBlock />
        <PropsBlock />
      </div>
    </div>
  );
};

export default MainLayout;
