import React, { Component, RefObject } from 'react';
import interact from 'interactjs';

interface SortableItem {
  id: string;
  path: string;
  tag: string;
  classList: string;
  style: string;
  media?: string;
  children: SortableItem[];
}

interface State {
  sortableItems: SortableItem[];
  sortableItemsCounter: number;
  hoveringIndex: number | null;
  hoveringItem: SortableItem | null;
  sortItemActionType: number;
}

const SortItemActionType = {
  PREV: -1,
  INSIDE: 0,
  NEXT: 1,
  NONE: 2,
};

const BLOCK_RERENDER_DELAY = 50;

class SortableContainer extends Component<{}, State> {
  private sortableContainerRef: RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);
    this.state = {
      sortableItems: [],
      sortableItemsCounter: 0,
      hoveringIndex: null,
      hoveringItem: null,
      sortItemActionType: SortItemActionType.NONE,
    };
    this.sortableContainerRef = React.createRef();
  }



initResizable = (_ref:string) =>{ // _ref : #id | .class

      interact(_ref)
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },
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
      }).on('resizemove', (event)=>{

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

            this.updateHandles(target);

      }).on('resizeend', (event)=>{

          var target = event.target;
          var items = [...this.state.sortableItems];

          var elementPath = target.getAttribute("path");

          var item = this.getItemByPath(items, elementPath);
         
          // Replace item
          var newStyle = target.style.cssText;
        
          var updatedStyleItems = this.updateItemStyleFromPath(items, item, newStyle);

          this.setState((prevState) => ({
            sortableItems: updatedStyleItems
          }));
      })


  }

  // DRAG N DROP ZONE ---------------------------------------------


handleFrameDragEnter = (e:any) =>{

    var container = this.sortableContainerRef.current; // re-check
    //@ts-ignore
    container.classList.add("slist")

    //@ts-ignore
    let items : any[] = container.querySelectorAll(".sortable-item");
    for (let it of items) {
       it.classList.add("hint");
    }

  }

handleFrameMouseDown = (e : any) => {
    e.preventDefault();

    var handleBox : any = document.querySelector(".handleBox");
    handleBox.style.display = 'none';
  };

handleFrameDragOver = (e : any) => {
    e.preventDefault();
  };

createItem = (_type:string, clonedElement:any) =>{

    var style = clonedElement.style;
    style.width = '100px'
    style.height = '100px'

    var elementId = `sortable-item-${this.state.sortableItemsCounter + 1}`;
    var newElement = {
        tag : clonedElement.nodeName.toLowerCase(),
        path :"#/"+elementId, // The element path
        id: elementId, 
        classList: 'sortable-item', 
        style: style.cssText,
        media : clonedElement.getAttribute("src") || null,
        children : []
      }
  
 
    this.setState((prevState) => ({
      sortableItemsCounter: prevState.sortableItemsCounter + 1,
    }));

    this.initResizable('#'+elementId)

    return newElement;

  } 

handleFrameDrop = (e : any) => {
    
    e.preventDefault();

    var _elementId = '';

    const data = e.dataTransfer.getData('text/plain');
    var clonedElementData = document.getElementById(data);
    if (clonedElementData && !clonedElementData.classList.contains("sortable-item")) // Not an existing item
    {
      const clonedElement : any = clonedElementData.cloneNode(true);
      clonedElement.setAttribute('draggable', 'false');
      clonedElement.classList.add('sortable-item');

      var newElement = this.createItem(clonedElement.nodeName.toLowerCase(), clonedElement);
      _elementId = newElement.id;

      this.setState((prevState) => ({
        sortableItems: [...prevState.sortableItems, newElement],
      }));


    }

    // Update selection 
    if(_elementId != '')
    {
      setTimeout(() => {
        
        var target = document.getElementById(_elementId);
        this.updateHandles(target);
        
      }, BLOCK_RERENDER_DELAY);
 
    }
    // sorting styling
    this.removeHintStyles();

  };


  // END DRAG N DROP ZONE ---------------------------------------------


handleSortItemMouseDown = (e:any, index:number) => {

    // e.preventDefault();
    e.stopPropagation();

    var element = e.target;   
    // console.log("selected") 
    this.updateHandles(element)
  };

updateHandles = (element:any) =>{

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

handleSortItemDragStart = (e:any, index : number, item:any) => {
    e.stopPropagation();
    e.dataTransfer.setData('text/plain', e.target.id);
    var element = e.target;
    var container : any = this.sortableContainerRef.current; // re-check
    container.classList.add("slist")
    
    this.setState((prevState) => ({
      hoveringIndex: index,
    }));

    this.setState((prevState) => ({
      hoveringItem: item,
    }));

    let items = container.querySelectorAll(".sortable-item"), current = element;
    for (let it of items) {
      if (it != current) { it.classList.add("hint"); }
    }

  };

handleSortItemDragOver = (e:any, id:string) => {
    e.preventDefault();
    this.handleSortItemActionType(e, id);
  };

handleSortItemActionType = (e:any, id:string) => {
  
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
        
            this.setState((prevState) => ({
              sortItemActionType: SortItemActionType.PREV,
            }));
         

          hoveredElement.classList.remove("hovered-bottom");
      } 
      else if (mouseY > thirdSection) 
      {
        if(!hoveredElement.classList.contains("hovered-bottom"))
            hoveredElement.classList.add("hovered-bottom");
 
          this.setState((prevState) => ({
            sortItemActionType: SortItemActionType.NEXT,
          }));

          hoveredElement.classList.remove("hovered-top");

      } else 
      {
        hoveredElement.classList.remove("hovered-top");
        hoveredElement.classList.remove("hovered-bottom");

        this.setState((prevState) => ({
          sortItemActionType: SortItemActionType.INSIDE,
        }));

      }
    // }
    // else
    // {
    //   setSortItemActionType(SortItemActionType.NONE);
    // }

  }

  handleSortItemDragEnter = (e : any) => {
    e.preventDefault();
    var element = e.target;
    // console.log(element.getAttribute("id"))
    element.classList.add("active");
  };


  handleSortItemDragLeave = (e : any) => {
    e.preventDefault();
    var element = e.target;

    element.classList.remove("active"); 
    element.classList.remove("hovered-top");
    element.classList.remove("hovered-bottom");
    
  
  };


  handleSortItemDrop = (e:any, index : number, item:any) => {
    e.stopPropagation();
    e.preventDefault();
  
    var _elementId = '';

    var newSortableItems = [...this.state.sortableItems];

    if (this.state.hoveringIndex != null && this.state.hoveringItem != item) // No already added item
    { 

      // Get SortItemActionType
      switch(this.state.sortItemActionType)
      {
        case SortItemActionType.PREV: // before the target
          var itemsListAfterRemove = this.removeItemFromPath(this.state.sortableItems, this.state.hoveringItem);
          var itemsListAfterPlacing = this.placeItemFromItemPath(itemsListAfterRemove, item, this.state.hoveringItem, this.state.sortItemActionType);
 
          this.setState((prevState) => ({
            sortableItems: itemsListAfterPlacing
          }));
    

        break; 

        case SortItemActionType.NEXT: // after the target
          var itemsListAfterRemove = this.removeItemFromPath(this.state.sortableItems, this.state.hoveringItem);
          var itemsListAfterPlacing = this.placeItemFromItemPath(itemsListAfterRemove, item, this.state.hoveringItem, this.state.sortItemActionType);
 
          this.setState((prevState) => ({
            sortableItems: itemsListAfterPlacing
          }));
    

        break; 

        case SortItemActionType.INSIDE: // INSIDE : as child
          var itemsListAfterRemove = this.removeItemFromPath(this.state.sortableItems, this.state.hoveringItem);
          var itemsListAfterPlacing = this.placeItemFromItemPath(itemsListAfterRemove, item, this.state.hoveringItem, this.state.sortItemActionType);
         
          this.setState((prevState) => ({
            sortableItems: itemsListAfterPlacing
          }));
    

        break; 

        default:

          this.swapElements(newSortableItems, this.state.hoveringIndex, index);
        
          this.setState((prevState) => ({
            sortableItems: newSortableItems
          }));
    
  
        break;
      }

      _elementId = this.state.hoveringItem?.id || '';

 
      this.setState((prevState) => ({
        hoveringIndex: null, hoveringItem : null
      }));
 


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

        var newElement = this.createItem(clonedElement.nodeName.toLowerCase(), clonedElement);
        _elementId = newElement.id;

        var itemsListAfterPlacing = this.placeItemFromItemPath(newSortableItems, item, newElement, this.state.sortItemActionType);
 
        this.setState((prevState) => ({
          sortableItems: itemsListAfterPlacing
        }));
  
      }
    }

    // Update selection
    if(_elementId != '')
    {
      setTimeout(() => {
        
        var target = document.getElementById(_elementId);
        this.updateHandles(target);

      }, BLOCK_RERENDER_DELAY);
 
    }

    // sorting styling
    this.removeHintStyles();


  };

  // END SORT ZONE -------------------------------------------

  // RESIZE ZONE ---------------------------------------------

  // END RESIZE ZONE ------------------------------------

  // UTILITIES --------------------------------------------

  removeHintStyles = () =>{

    var container:any = this.sortableContainerRef.current; // re-check
    let items = container.querySelectorAll(".sortable-item");
    for (let it of items) {
      it.classList.remove("hint")
      it.classList.remove("active")
    }
  }

  swapElements = (_array:any[], index1:number, index2:number) => {
    _array[index1] = _array.splice(index2, 1, _array[index1])[0];
  };

  convertCSSToReactStyles = (cssString:string) => {
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

  setStyle = (cssText:string) => {

    var style = this.convertCSSToReactStyles(cssText)
    return style;
  }


  updateItemStyleFromPath = (_arr:any[], item:any, style:string) =>{ 

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
 removeItemFromPath = (_arr:any[], item:any) =>{ 

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

  getParentPath = (itemPath:string) =>{

    const lastSlashIndex = itemPath.lastIndexOf('/');

    // Extract the substring before the last slash
    const path = itemPath.slice(0, lastSlashIndex);

    return path;
  }

  getItemByPath = (_arr:any[], itemPath:string) =>{

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

  placeItemFromItemPath = (_arr:any[], item:any, _sourceItem:any, _type = SortItemActionType.PREV) =>{ 

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
        var targetParentPath = this.getParentPath(item.path);

        if(_type != SortItemActionType.INSIDE)
        {
          this.placeItemAbowOrBelow(targetParent, targetParentPath, _sourceItem, targetIndex, _type);
        }
        else
        {
          targetParentPath = item.path;
          targetIndex = item.children.length;

          this.placeItemInside(item.children, targetParentPath, _sourceItem, targetIndex, _type);
        }

      }
  
    }

    return _sortableItems;

  }

  placeItemAbowOrBelow = (_arr:any[], _targetPath : any, _source:any, _targetIndex:any, _type = SortItemActionType.PREV ) =>{


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



  placeItemInside = (_arr:any[], _targetPath : any, _source:any, _targetIndex:any, _type = SortItemActionType.INSIDE ) =>{

    var initialArray = [..._arr];

    var movedElement = _source; // The movedElement is initially removed from its parent with the removeItemFromPath

    // Set new path
    movedElement.path = _targetPath+"/"+movedElement.id;

    // Find the updated index of the target element
    // var newTargetIndex = _arr.indexOf(initialArray[_targetIndex]);
  
    _arr.push(movedElement);

    return _arr;

  }
  isTypeElement = (_tag:string, _tags : string[]) =>{
    var tags = _tags;
    return tags.includes(_tag);
  }

  isTextElement = (_tag:string) =>{
    return this.isTypeElement(_tag, ["p"])    
  }

  isBlockElement = (_tag:string) =>{

    return this.isTypeElement(_tag, ["div","p"])    
  }

  isMediaElement = (_tag:string) =>{
    return this.isTypeElement(_tag, ["img"])    
  }

  // END UTILITIES --------------------------------------------


  sortableRendererBlock = (item : any, index : number) =>{

  
      return (
        // <div className='lekett-element-container lekett-block-container'>

          <item.tag
              id={item.id}
              path={item.path}
              key={index}
              className={item.classList}
              style={this.setStyle(item.style)}
              draggable="true"
              contentEditable={this.isTextElement(item.tag)}
              onMouseDown={(e: any) => this.handleSortItemMouseDown(e, index)}
              onDragStart={(e: any) => this.handleSortItemDragStart(e, index, item)}
              onDragOver={(e: any) => this.handleSortItemDragOver(e, item.id)}
              onDragEnter={this.handleSortItemDragEnter}
              onDragLeave={this.handleSortItemDragLeave}
              onDrop={(e: any) => this.handleSortItemDrop(e, index, item)}

            >

              {this.isTextElement(item.tag) &&
              'Text content'}

              {item.children.map((_item : any, _index : number) => {
              
                if(this.isBlockElement(_item.tag))
                  return (this.sortableRendererBlock(_item, _index))
  
                if(this.isMediaElement(_item.tag))
                  return (this.sortableRendererMedia(_item, _index))
    
              })}


            </item.tag>

            // <div key={'handler_'+index} className="resizable-handler" onMouseDown={(e) => handleResizeMouseDown(e, item)} ></div>

          // </div>
      )

  }


  sortableRendererMedia = (item : any, index : number) =>{

    return (
          <item.tag
              id={item.id}
              path={item.path}
              key={index}
              src={item.media}
              className={item.classList}
              style={this.setStyle(item.style)}
              draggable="true"
              contentEditable={this.isTextElement(item.tag)}
              onMouseDown={(e: any) => this.handleSortItemMouseDown(e, index)}
              onDragStart={(e: any) => this.handleSortItemDragStart(e, index, item)}
              onDragOver={(e: any) => this.handleSortItemDragOver(e, item.id)}
              onDragEnter={this.handleSortItemDragEnter}
              onDragLeave={this.handleSortItemDragLeave}
              onDrop={(e: any) => this.handleSortItemDrop(e, index, item)}

            />
      
    )

}

  // Your other methods and event handlers go here...

  render() {
    const {
      sortableItems,
      sortableItemsCounter,
      hoveringIndex,
      hoveringItem,
      sortItemActionType,
    } = this.state;

    return (
      <div className="block">
        <div
          className="sortable-container"
          ref={this.sortableContainerRef}
          id="sortable-container"
          onMouseDown={this.handleFrameMouseDown}
          onDragOver={this.handleFrameDragOver}
          onDrop={this.handleFrameDrop}
          onDragEnter={this.handleFrameDragEnter}
        >
           
          {sortableItems.map((item, index) => { 
          if(this.isBlockElement(item.tag))
            return (this.sortableRendererBlock(item, index))

          if(this.isMediaElement(item.tag))
            return (this.sortableRendererMedia(item, index))

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
  }
}

export default SortableContainer;
