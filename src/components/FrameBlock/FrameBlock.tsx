import React from 'react';
import _SortableContainer from '../SortableContainer/_SortableContainer';
import SortableContainer from '../SortableContainer/SortableContainer';

const FrameBlock = () => {
  return (
    <div className="frame-container">
      <div className="phone-frame">
        <div className="frame-content">

           <SortableContainer />

        </div>
      </div>
    </div>
  );
};

export default FrameBlock;
