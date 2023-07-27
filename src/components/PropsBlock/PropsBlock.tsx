import React, { useState } from 'react';
import {Row, Col, Input, Select, Radio, RadioChangeEvent} from 'antd';
import { RightSquareOutlined, DownSquareOutlined, LeftSquareOutlined, UpSquareOutlined, BorderVerticleOutlined } from '@ant-design/icons';



const PropsBlock = () => {


  const [alignement, setAlignement] = useState('upper-left');


  const handleChangeDisplay = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleChangePosition = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onChangeFlexDirection = (e: RadioChangeEvent) => {
    console.log(`radio checked:${e.target.value}`);
  };


  const alignementOptions = [
    { label: '', value: 'upper-left' },
    { label: '', value: 'upper-center' },
    { label: '', value: 'upper-right' },

    { label: '', value: 'center-left' },
    { label: '', value: 'center-center' },
    { label: '', value: 'center-right' },

    { label: '', value: 'lower-left' },
    { label: '', value: 'lower-center' },
    { label: '', value: 'lower-right' },
  ];


  const onAlignementChange = ({ target: { value } }: RadioChangeEvent) => {
    console.log('radio1 checked', value);
    setAlignement(value);
  };


  return (
    <div className='props-block'>
      <div style={{padding:10}}>
        <Row>
          <Col span={11} offset={1} style={{marginBottom:10}}>
            <label htmlFor="" style={{color:'white', fontWeight:'normal'}}>x</label>
            <Input defaultValue="0" prefix={<span>| |</span>} style={{marginTop:5}} styles={{input:{backgroundColor:'transparent', color:'#f2f2f2'}, prefix:{color:'gray', paddingInline:5} }} className='lekett-input' />
          </Col>
          <Col span={11} offset={1} style={{marginBottom:10}}>
            <label htmlFor="" style={{color:'white', fontWeight:'normal'}}>y</label>
            <Input defaultValue="0" prefix={<span>| |</span>} style={{marginTop:5}} styles={{input:{backgroundColor:'transparent', color:'#f2f2f2'}, prefix:{color:'gray', paddingInline:5} }} className='lekett-input' />
          </Col>

          <Col span={11} offset={1} style={{marginBottom:10}}>
            <label htmlFor="" style={{color:'white', fontWeight:'normal'}}>width</label>
            <Input defaultValue="0" prefix={<span>| |</span>} style={{marginTop:5}} styles={{input:{backgroundColor:'transparent', color:'#f2f2f2'}, prefix:{color:'gray', paddingInline:5} }} className='lekett-input' />
          </Col>
          <Col span={11} offset={1} style={{marginBottom:10}}>
            <label htmlFor="" style={{color:'white', fontWeight:'normal'}}>height</label>
            <Input defaultValue="0" prefix={<span>| |</span>} style={{marginTop:5}} styles={{input:{backgroundColor:'transparent', color:'#f2f2f2'}, prefix:{color:'gray', paddingInline:5} }} className='lekett-input' />
          </Col>

          <Col span={11} offset={1} style={{marginBottom:10}}>
            <label htmlFor="" style={{color:'white', fontWeight:'normal'}}>display</label>
            <Select
              defaultValue="flex"
              
              style={{ width: '100%', backgroundColor:'transparent', marginTop:5 }} 
              onChange={handleChangeDisplay}
              options={[
                { value: 'block', label: 'block' },
                { value: 'flex', label: 'flex' },
                { value: 'none', label: 'none' },
              ]}
            />
          </Col>


          <Col span={11} offset={1} style={{marginBottom:10}}>
            <label htmlFor="" style={{color:'white', fontWeight:'normal'}}>position</label>
            <Select
              defaultValue="relative"
              
              style={{ width: '100%', backgroundColor:'transparent', marginTop:5 }} 
              onChange={handleChangePosition}
              options={[
                { value: 'relative', label: 'relative' },
                { value: 'absolute', label: 'absolute' },
              ]}
            />
          </Col>


          <Col span={22} offset={1} style={{marginBottom:10}}>
            <label htmlFor="" style={{color:'white', fontWeight:'normal'}}>flex direction</label>
            <Radio.Group onChange={onChangeFlexDirection} defaultValue="h" style={{width:'100%', marginTop:5}}>
              <Radio.Button value="h"><RightSquareOutlined /></Radio.Button>
              <Radio.Button value="v"><DownSquareOutlined /></Radio.Button>
              <Radio.Button value="-h"><LeftSquareOutlined /></Radio.Button>
              <Radio.Button value="-v"><UpSquareOutlined /></Radio.Button>
            </Radio.Group>
          </Col>


          <Col span={22} offset={1} style={{marginBottom:10}}>
            <label htmlFor="" style={{color:'white', fontWeight:'normal'}}>alignement</label>
            <Radio.Group onChange={onAlignementChange} optionType='button' defaultValue="h" style={{width:'100%', marginTop:5, display:'grid', gridTemplateColumns:'1fr 1fr 1fr'}}>
              <Radio className='alignementRadio' value={1}><BorderVerticleOutlined /></Radio>
              <Radio className='alignementRadio' value={2}><BorderVerticleOutlined /></Radio>
              <Radio className='alignementRadio' value={3}><BorderVerticleOutlined /></Radio>
              <Radio className='alignementRadio' value={4}><BorderVerticleOutlined /></Radio>
              <Radio className='alignementRadio' value={5}><BorderVerticleOutlined /></Radio>
              <Radio className='alignementRadio' value={6}><BorderVerticleOutlined /></Radio>
              <Radio className='alignementRadio' value={7}><BorderVerticleOutlined /></Radio>
              <Radio className='alignementRadio' value={8}><BorderVerticleOutlined /></Radio>
              <Radio className='alignementRadio' value={9}><BorderVerticleOutlined /></Radio>
            </Radio.Group>

             
          </Col>


        </Row>


      </div>
    </div>
  );
};

export default PropsBlock;
