import React, { useRef } from 'react';
import './ItemsBlock.css';
import { useState } from 'react';
import { useEffect } from 'react';
import DraggableContainer from '../DraggableContainer/DraggableContainer';

const ItemsBlock = () => {

 
    //   const draggableContainer = document.querySelector(".draggable-container");
    //   const draggableItems = draggableContainer.querySelectorAll(".draggable-item");

    useEffect(()=>{


    }, [])


    return (

        <div className='items-block'>
          
            <DraggableContainer />

        </div>
        
   
    );
};

export default ItemsBlock;
