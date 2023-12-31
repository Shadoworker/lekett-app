import { element } from 'prop-types';
import React, { useState, useRef, useEffect, DOMElement } from 'react';

import interact from 'interactjs';

const SortItemActionType = {

  PREV : -1,
  INSIDE : 0,
  NEXT : 1,
  NONE : 2 

}

const _SortableContainer = () => {
  const [sortableItems, setSortableItems] = useState<any[]>([]);
  const [sortableItemsCounter, setSortableItemsCounter] = useState(0);
  const [hoveringIndex, setHoveringIndex] = useState<any>(null);
  const [hoveringItem, setHoveringItem] = useState(null);
  const [sortItemActionType, setSortItemActionType] = useState(SortItemActionType.NONE);

  const sortableContainerRef = useRef(null);

 
  useEffect(() => {
    
 
    // let arr = [
    //   {id:"1", path:"#/1", children : []},
    //   {id:"2", path:"#/2", 
    //     children : 
    //     [
    //       {id:"3", path:"#/2/3", children : [
    //         {id:"5", path:"#/2/3/5", children : []}
    //       ]},
    //     ]
    //   },
    // ];

    // var _arr = [...arr];
    // console.log(getItemByPath(_arr, '#/2/3'))

    // removeItemFromPath(arr, {id:"5", path:"#/2/3/5", children : []})

    // placeItemFromItemPath(arr, 
    //   {id:"2", path:"#/2", 
    //     children : 
    //     [
    //       {id:"3", path:"#/2/3", children : [
    //         {id:"5", path:"#/2/3/5", children : []}
    //       ]},
    //     ]
    //   }, 
        
    //   {id:"5", path:"#/2/3/5", children : []},
    //   false 
        
    //     )


    
  }, []);



  const initResizable = (_ref:string) =>{ // _ref : #id | .class

      interact(_ref)
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },
    
        // listeners: {
        //   move : function(event) {
        //     var target = event.target
        //     var x = (parseFloat(target.getAttribute('data-x')) || 0)
        //     var y = (parseFloat(target.getAttribute('data-y')) || 0)
    
        //     // update the element's style
        //     target.style.width = event.rect.width + 'px'
        //     target.style.height = event.rect.height + 'px'
    
        //     // translate when resizing from top or left edges
        //     x += event.deltaRect.left
        //     y += event.deltaRect.top
    
        //     target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
    
        //     target.setAttribute('data-x', x)
        //     target.setAttribute('data-y', y)
        //     // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)

        //     updateHandles(target);
        //   },
        //   onend : function(event) {

        //       console.log("---")
        //       var element = event.target
        //       var items = [...sortableItems];

        //       var item = getItemByPath(items, element.getAttribute('path'));
        //       // Replace item
        //       var newStyle = element.style.cssText;
              
        //       var updatedStyleItems = updateItemStyleFromPath(items, item, newStyle);
        //       setSortableItems(updatedStyleItems);
        //   }
        // },
        modifiers: [
          // keep the edges inside the parent
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),
    
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 10, height: 10 }
          })
        ],
    
        inertia: true
      }).on('resizemove', function(event){

            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)
    
            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'
    
            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top
    
            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
    
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)

            updateHandles(target);

      }).on('resizeend', function(event){

          var target = event.target;
          var items = [...sortableItems];

          var elementPath = target.getAttribute("path");

          var item = getItemByPath(items, elementPath);
          console.log(elementPath)
          console.log(item)
          // Replace item
          var newStyle = target.style.cssText;
          
          // var updatedStyleItems = updateItemStyleFromPath(items, item, newStyle);
          // setSortableItems(updatedStyleItems);
      })


  }

  // DRAG N DROP ZONE ---------------------------------------------


  const handleFrameDragEnter = (e:any) =>{

    var container = sortableContainerRef.current; // re-check
    //@ts-ignore
    container.classList.add("slist")

    //@ts-ignore
    let items = container.querySelectorAll(".sortable-item");
    for (let it of items) {
       it.classList.add("hint");
    }

  }

  const handleFrameMouseDown = (e : any) => {
    e.preventDefault();

    var handleBox : any = document.querySelector(".handleBox");
    handleBox.style.display = 'none';
  };

  const handleFrameDragOver = (e : any) => {
    e.preventDefault();
  };

  const createItem = (_type:string, clonedElement:any) =>{

    var style = clonedElement.style;
    style.width = '100px'
    style.height = '100px'

    var elementId = `sortable-item-${sortableItemsCounter + 1}`;
    var newElement = {
        tag : clonedElement.nodeName.toLowerCase(),
        path :"#/"+elementId, // The element path
        id: elementId, 
        classList: 'sortable-item', 
        style: style.cssText,
        media : clonedElement.getAttribute("src") || null,
        children : []
      }
    

    setSortableItemsCounter((prev) => prev + 1);

    initResizable('#'+elementId)

    return newElement;

  } 

  const handleFrameDrop = (e : any) => {
      
    e.preventDefault();

    const data = e.dataTransfer.getData('text/plain');
    var clonedElementData = document.getElementById(data);
    if (clonedElementData && !clonedElementData.classList.contains("sortable-item")) // Not an existing item
    {
      const clonedElement : any = clonedElementData.cloneNode(true);
      clonedElement.setAttribute('draggable', 'false');
      clonedElement.classList.add('sortable-item');

      var newElement = createItem(clonedElement.nodeName.toLowerCase(), clonedElement);

      setSortableItems((prevItems) => [...prevItems, newElement]);

    }

    
    // sorting styling
    removeHintStyles();

  };


  // END DRAG N DROP ZONE ---------------------------------------------


  const handleSortItemMouseDown = (e:any, index:number) => {

    // e.preventDefault();
    e.stopPropagation();

    var element = e.target;   
    // console.log("selected") 
    updateHandles(element)
  };

  const updateHandles = (element:any) =>{

      var parentRect = element.parentElement.getBoundingClientRect();
      var rect = element.getBoundingClientRect();
      
      var position = {
          top: rect.top - parentRect.top,
          left: rect.left - parentRect.left
      };

      var width = parseFloat(element.style.width);
      var height = parseFloat(element.style.height);
      var transform = element.style.transform;
      
      var handleBox : any = document.querySelector(".handleBox");

      handleBox.style.display = 'block';
      handleBox.style.position = 'absolute';
      handleBox.style.top = position.top+'px';
      handleBox.style.left = position.left+'px';
      handleBox.style.width = width+'px';
      handleBox.style.height = height+'px';
      // handleBox.style.transform = transform;

      var c = 3;
      let handlesLocs = [
        [0-c, 0-c],
        [(width / 2)-c, 0-c],
        [width-c, 0-c],
        [0-c, (height / 2)-c],
        [width-c, (height / 2)-c],
        [0-c, height-c],
        [(width / 2)-c, height-c],
        [width-c, height-c]
      ];

      for (let i = 0; i < handleBox.children.length; i++) {

        const handle = handleBox.children[i];
        handle.style.left = handlesLocs[i][0]+'px';
        handle.style.top = handlesLocs[i][1]+'px';

      }


  }
  // SORT ZONE ---------------------------------------

  const handleSortItemDragStart = (e:any, index : number, item:any) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', e.target.id);
    var element = e.target;
    var container : any = sortableContainerRef.current; // re-check
    container.classList.add("slist")
    setHoveringIndex(index);
    setHoveringItem(item);

    let items = container.querySelectorAll(".sortable-item"), current = element;
    for (let it of items) {
      if (it != current) { it.classList.add("hint"); }
    }

  };

  const handleSortItemDragOver = (e:any, id:string) => {
    e.preventDefault();
    handleSortItemActionType(e, id);
  };

  const handleSortItemActionType = (e:any, id:string) => {
    
    const hoveredElement = e.target;
    const hoveredElementBCR = hoveredElement.getBoundingClientRect();
    
    const mouseY = e.clientY;
  
    // Calculate the center and the third section of the div
    const partial = (hoveredElementBCR.height / 4);
    const center = hoveredElementBCR.top + partial;
    const thirdSection = hoveredElementBCR.top + (partial * 3);

    // if(hoveringItem && hoveringItem.id != id) // Dont consider the same element
    // {
      if (mouseY < center) 
      {
        if(!hoveredElement.classList.contains("hovered-top"))
            hoveredElement.classList.add("hovered-top");
          
          setSortItemActionType(SortItemActionType.PREV);

          hoveredElement.classList.remove("hovered-bottom");
      } 
      else if (mouseY > thirdSection) 
      {
        if(!hoveredElement.classList.contains("hovered-bottom"))
            hoveredElement.classList.add("hovered-bottom");

          setSortItemActionType(SortItemActionType.NEXT);

          hoveredElement.classList.remove("hovered-top");

      } else 
      {
        hoveredElement.classList.remove("hovered-top");
        hoveredElement.classList.remove("hovered-bottom");

        setSortItemActionType(SortItemActionType.INSIDE);

      }
    // }
    // else
    // {
    //   setSortItemActionType(SortItemActionType.NONE);
    // }

  }

  const handleSortItemDragEnter = (e : any) => {
    e.preventDefault();
    var element = e.target;
    // console.log(element.getAttribute("id"))
    element.classList.add("active");
  };
  

  const handleSortItemDragLeave = (e : any) => {
    e.preventDefault();
    var element = e.target;

    element.classList.remove("active"); 
    element.classList.remove("hovered-top");
    element.classList.remove("hovered-bottom");
      
    
  };


  const handleSortItemDrop = (e:any, index : number, item:any) => {
    e.stopPropagation();
    e.preventDefault();
    
    var newSortableItems = [...sortableItems];

    if (hoveringIndex != null && hoveringItem != item) // No already added item
    { 

      // Get SortItemActionType
      switch(sortItemActionType)
      {
        case SortItemActionType.PREV: // before the target
          var itemsListAfterRemove = removeItemFromPath(sortableItems, hoveringItem);
          var itemsListAfterPlacing = placeItemFromItemPath(itemsListAfterRemove, item, hoveringItem, sortItemActionType);

          setSortableItems(itemsListAfterPlacing);

        break; 

        case SortItemActionType.NEXT: // after the target
          var itemsListAfterRemove = removeItemFromPath(sortableItems, hoveringItem);
          var itemsListAfterPlacing = placeItemFromItemPath(itemsListAfterRemove, item, hoveringItem, sortItemActionType);

          setSortableItems(itemsListAfterPlacing);

        break; 

        case SortItemActionType.INSIDE: // INSIDE : as child
          var itemsListAfterRemove = removeItemFromPath(sortableItems, hoveringItem);
          var itemsListAfterPlacing = placeItemFromItemPath(itemsListAfterRemove, item, hoveringItem, sortItemActionType);
          
          setSortableItems(itemsListAfterPlacing);

        break; 

        default:

          swapElements(newSortableItems, hoveringIndex, index);
          setSortableItems(newSortableItems);
    
        break;
      }

      setHoveringIndex(null);
      setHoveringItem(null);


    }
    else // New dropped item
    {

      const data = e.dataTransfer.getData('text/plain');
      var clonedElementData = document.getElementById(data);
      if (clonedElementData && !clonedElementData.classList.contains("sortable-item")) 
      {
        const clonedElement : any = clonedElementData.cloneNode(true);
        clonedElement.setAttribute('draggable', 'false');
        clonedElement.classList.add('sortable-item');
  
        var newElement = createItem(clonedElement.nodeName.toLowerCase(), clonedElement);

        var itemsListAfterPlacing = placeItemFromItemPath(newSortableItems, item, newElement, sortItemActionType);
  
        setSortableItems(itemsListAfterPlacing);
  
      }
    }

    
    // sorting styling
    removeHintStyles();


  };

  // END SORT ZONE -------------------------------------------

  // RESIZE ZONE ---------------------------------------------
  const handleResizeMouseDown = (e:any, item:any) => {
    e.stopPropagation();
    e.preventDefault();
    var elementParent = e.target.parentNode;
    var element = e.target.parentNode.firstChild;

    var elementPaddingX = parseFloat(window.getComputedStyle(element, null).getPropertyValue("padding-left")) +
                          parseFloat(window.getComputedStyle(element, null).getPropertyValue("padding-right"));

    var elementPaddingY = parseFloat(window.getComputedStyle(element, null).getPropertyValue("padding-top")) +
                          parseFloat(window.getComputedStyle(element, null).getPropertyValue("padding-bottom"));

    const initResize = (e : any) => {
      e.stopPropagation();
      e.preventDefault();
      window.addEventListener('mousemove', Resize, false);
      window.addEventListener('mouseup', stopResize, false);
    }

    const Resize = (e : any) => {
      e.stopPropagation();
      e.preventDefault();
      
      var newWidth = (e.clientX - elementParent.getBoundingClientRect().left - 0);
      var newHeight = (e.clientY - elementParent.getBoundingClientRect().top - 0);

      elementParent.style.width = (newWidth) + 'px';
      elementParent.style.height = (newHeight) + 'px';
      
      element.style.width = (newWidth - elementPaddingX) + 'px';
      element.style.height = (newHeight - elementPaddingY) + 'px';

    }

    const stopResize = (e : any) => {
      e.stopPropagation();
      e.preventDefault();

      window.removeEventListener('mousemove', Resize, false);
      window.removeEventListener('mouseup', stopResize, false);

      // Replace item
      var items = [...sortableItems];
      var newStyle = element.style.cssText;
       
      var updatedStyleItems = updateItemStyleFromPath(items, item, newStyle);
      setSortableItems(updatedStyleItems);
    

    }

    initResize(e);

  };

  // END RESIZE ZONE ------------------------------------

  // UTILITIES --------------------------------------------

  const removeHintStyles = () =>{

    var container:any = sortableContainerRef.current; // re-check
    let items = container.querySelectorAll(".sortable-item");
    for (let it of items) {
      it.classList.remove("hint")
      it.classList.remove("active")
    }
  }

  const swapElements = (_array:any[], index1:number, index2:number) => {
    _array[index1] = _array.splice(index2, 1, _array[index1])[0];
  };

  const convertCSSToReactStyles = (cssString:string) => {
    const styleObject : any = {};

    // Split the CSS string by semicolon to get individual styles
    const styles = cssString.split(';');

    // Process each style
    styles.forEach((style) => {
      if (style.trim() !== '') {
        // Split the style by colon to get property and value
        const [property, value] = style.split(':');
        const propertyName = property.trim();
        const propertyValue = value.trim();

        // Convert property name to camelCase
        const camelCaseName = propertyName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

        // Add the property to the styleObject
        styleObject[camelCaseName] = propertyValue;
      }
    });

    return styleObject;
  };

  const setStyle = (cssText:string) => {

    var style = convertCSSToReactStyles(cssText)
    return style;
  }


  const updateItemStyleFromPath = (_arr:any[], item:any, style:string) =>{ 

    var path = item.path;
    var nodes = path.split("/");
    
    var _sortableItems = [..._arr];
    var currentParent = _sortableItems;
    var nextParent = currentParent;
   
    for (let i = 1; i < nodes.length; i++) // dont consider the root (#/)
    { 
      const node = nodes[i];
      var item = currentParent.find(e=>e.id == node);

      if(i == nodes.length-1) // Then remove that item from its parent
      {
         currentParent[currentParent.indexOf(item)].style = style;
      }
      else
      {
        nextParent = item.children;
      }
      
      // set new parent
      currentParent = nextParent;
    
    }

    // console.log(_sortableItems);
    return _sortableItems;

  }

  // @ Remove an item from its current path in order to move it elsewhere
  const removeItemFromPath = (_arr:any[], item:any) =>{ 

    var path = item.path;
    var nodes = path.split("/");
    
    var _sortableItems = [..._arr];
    var currentParent = _sortableItems;
    var nextParent = currentParent;
   
    for (let i = 1; i < nodes.length; i++) // dont consider the root (#/)
    { 
      const node = nodes[i];
      var item = currentParent.find(e=>e.id == node);

      if(i == nodes.length-1) // Then remove that item from its parent
      {
         currentParent.splice(currentParent.indexOf(item), 1);
      }
      else
      {
        nextParent = item.children;
      }
      
      // set new parent
      currentParent = nextParent;
    
    }

    // console.log(_sortableItems);
    return _sortableItems;

  }

  const getParentPath = (itemPath:string) =>{

    const lastSlashIndex = itemPath.lastIndexOf('/');

    // Extract the substring before the last slash
    const path = itemPath.slice(0, lastSlashIndex);

    return path;
  }

  const getItemByPath = (_arr:any[], itemPath:string) =>{

    var path = itemPath;
    var nodes = path.split("/");

    var _sortableItems = [..._arr];
    var currentRoot = _sortableItems;
    for (let i = 1; i < nodes.length; i++) // dont consider the root (#/)
    { 
      const node = nodes[i];
      
      console.log(currentRoot)

      var item = currentRoot.find(e=>e.id == node);
      
      if(i == (nodes.length-1))
      {
        currentRoot = item || null;
        break;
      }
      // set new root
      currentRoot = item.children;

    }
    

    return currentRoot;

  }

  const placeItemFromItemPath = (_arr:any[], item:any, _sourceItem:any, _type = SortItemActionType.PREV) =>{ 

    var path = item.path;
    var nodes = path.split("/");
    
    var _sortableItems = [..._arr];
    var currentParent = _sortableItems;
    var targetParent = currentParent;
    for (let i = 1; i < nodes.length; i++) // dont consider the root (#/)
    { 
      const node = nodes[i];
      var item = currentParent.find(e=>e.id == node);
      
      targetParent = currentParent;
      var nextParent = item ? item.children : currentParent;
      // set new parent
      currentParent = nextParent;

      if(i == nodes.length-1) // Set item positionning
      {

        var targetIndex = targetParent.indexOf(item);
        var targetParentPath = getParentPath(item.path);

        if(_type != SortItemActionType.INSIDE)
        {
          placeItemAbowOrBelow(targetParent, targetParentPath, _sourceItem, targetIndex, _type);
        }
        else
        {
          targetParentPath = item.path;
          targetIndex = item.children.length;

          placeItemInside(item.children, targetParentPath, _sourceItem, targetIndex, _type);
        }

      }
    
    }
 
    return _sortableItems;

  }

  const placeItemAbowOrBelow = (_arr:any[], _targetPath : any, _source:any, _targetIndex:any, _type = SortItemActionType.PREV ) =>{


    var _sourceIndex = _arr.indexOf(_source);

    if (
      (_sourceIndex != -1 && _sourceIndex < 0) ||
      (_sourceIndex != -1 && _sourceIndex >= _arr.length) ||
      _targetIndex < 0 ||
      _targetIndex >= _arr.length ||
      _sourceIndex === _targetIndex
    ) {
      console.error('Invalid source or target index.');
      return _arr;
    }

    var initialArray = [..._arr];

    var movedElement = _source; // The movedElement is initially removed from its parent with the removeItemFromPath

    // Set new path
    movedElement.path = _targetPath+"/"+movedElement.id;

    // Find the updated index of the target element
    var newTargetIndex = _arr.indexOf(initialArray[_targetIndex]);
  
    if(_type == SortItemActionType.NEXT) 
      newTargetIndex = newTargetIndex + 1;

    _arr.splice(newTargetIndex, 0, movedElement);

    return _arr;

  }


  
  const placeItemInside = (_arr:any[], _targetPath : any, _source:any, _targetIndex:any, _type = SortItemActionType.INSIDE ) =>{

    var initialArray = [..._arr];

    var movedElement = _source; // The movedElement is initially removed from its parent with the removeItemFromPath

    // Set new path
    movedElement.path = _targetPath+"/"+movedElement.id;

    // Find the updated index of the target element
    // var newTargetIndex = _arr.indexOf(initialArray[_targetIndex]);
    
    _arr.push(movedElement);

    return _arr;

  }
  const isTypeElement = (_tag:string, _tags : string[]) =>{
    var tags = _tags;
    return tags.includes(_tag);
  }

  const isTextElement = (_tag:string) =>{
    return isTypeElement(_tag, ["p"])    
  }

  const isBlockElement = (_tag:string) =>{

    return isTypeElement(_tag, ["div","p"])    
  }

  const isMediaElement = (_tag:string) =>{
    return isTypeElement(_tag, ["img"])    
  }

  // END UTILITIES --------------------------------------------


  const sortableRendererBlock = (item : any, index : number) =>{

    
      return (
        // <div className='lekett-element-container lekett-block-container'>

          <item.tag
              id={item.id}
              path={item.path}
              key={index}
              className={item.classList}
              style={setStyle(item.style)}
              draggable="true"
              contentEditable={isTextElement(item.tag)}
              onMouseDown={(e: any) => handleSortItemMouseDown(e, index)}
              onDragStart={(e: any) => handleSortItemDragStart(e, index, item)}
              onDragOver={(e: any) => handleSortItemDragOver(e, item.id)}
              onDragEnter={handleSortItemDragEnter}
              onDragLeave={handleSortItemDragLeave}
              onDrop={(e: any) => handleSortItemDrop(e, index, item)}

            >

              {isTextElement(item.tag) &&
              'Text content'}

              {item.children.map((_item : any, _index : number) => {
                
                if(isBlockElement(_item.tag))
                  return (sortableRendererBlock(_item, _index))
    
                if(isMediaElement(_item.tag))
                  return (sortableRendererMedia(_item, _index))
      
              })}


            </item.tag>

            // <div key={'handler_'+index} className="resizable-handler" onMouseDown={(e) => handleResizeMouseDown(e, item)} ></div>

          // </div>
      )

  }

  
  const sortableRendererMedia = (item : any, index : number) =>{

    return (
          <item.tag
              id={item.id}
              path={item.path}
              key={index}
              src={item.media}
              className={item.classList}
              style={setStyle(item.style)}
              draggable="true"
              contentEditable={isTextElement(item.tag)}
              onMouseDown={(e: any) => handleSortItemMouseDown(e, index)}
              onDragStart={(e: any) => handleSortItemDragStart(e, index, item)}
              onDragOver={(e: any) => handleSortItemDragOver(e, item.id)}
              onDragEnter={handleSortItemDragEnter}
              onDragLeave={handleSortItemDragLeave}
              onDrop={(e: any) => handleSortItemDrop(e, index, item)}

            />
       
    )

}
  return (
    <div className="block">
      <div className="sortable-container" ref={sortableContainerRef} id="sortable-container"
        onMouseDown={handleFrameMouseDown}
        onDragOver={handleFrameDragOver}
        onDrop={handleFrameDrop}
        onDragEnter={handleFrameDragEnter}
        
        >
        {sortableItems.map((item, index) => { 
          if(isBlockElement(item.tag))
            return (sortableRendererBlock(item, index))

          if(isMediaElement(item.tag))
            return (sortableRendererMedia(item, index))

        })}

        <div className='handleBox' style={{display:'none'}}>
          <div className='handleRect hr-top-left'></div>
          <div className='handleRect hr-top-middle'></div>
          <div className='handleRect hr-top-right'></div>

          <div className='handleRect hr-left'></div>
          <div className='handleRect hr-right'></div>

          <div className='handleRect hr-bottom-left'></div>
          <div className='handleRect hr-bottom-middle'></div>
          <div className='handleRect hr-bottom-right'></div>
        </div>

      </div>
    </div>
  );
};

export default _SortableContainer;