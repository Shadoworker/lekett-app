import React, { useState, useRef } from 'react';

const DraggableContainer = () => {
    const [draggedElement, setDraggedElement] = useState(null);
    const dragPreviewRef = useRef(null);
  
    const handleItemDragStart = (event:any) => {
      setDraggedElement(event.target.cloneNode(true));
      event.dataTransfer.setData('text/plain', event.target.id);
      // dragPreviewRef.current.appendChild(draggedElement);
    };
  
    const handleItemDragEnd = () => {
      // dragPreviewRef.current.removeChild(draggedElement);
    };
  
    return (
      <div className="block">
        <h6>Items</h6>
        <div className="draggable-container">
          <div id="draggable-item-1" className="draggable-item" draggable="true" onDragStart={handleItemDragStart} onDragEnd={handleItemDragEnd}>
          </div>
          <p id="draggable-item-2" className="draggable-item draggable2" draggable="true" onDragStart={handleItemDragStart} onDragEnd={handleItemDragEnd}>
            Text content
          </p>
          <img id="draggable-item-3" className="draggable-item" src={require('./../../assets/images/img_placeholder.jpg')} style={{width:'100%', height:140, padding:0,}} draggable="true" onDragStart={handleItemDragStart} onDragEnd={handleItemDragEnd} />
          {/* Add more draggable items here */}
        </div>
        <div className="drag-preview" ref={dragPreviewRef}></div>
      </div>
    );
  };

  export default DraggableContainer;