export default function move(x, y, Dispatcher, Store, e) {
  switch (Store.getMode()) {

    case 'DRAW':
      if (Store.isActivityInProgress()) {
        const last = Store.getLast();
        if (last && last[0] === 'path') {
          const d = last[1].d;
          Dispatcher.dispatch({
            type: 'ANNOTATIONS_UPDATE_LAST',
            update: { d: `${d} L${x} ${y}` },
          });
        }
      }
      break;
    case 'LINE':
      if (Store.isActivityInProgress()) {
        const last = Store.getLast();
        if (last && last[0] === 'line') {
          Dispatcher.dispatch({
            type: 'ANNOTATIONS_UPDATE_LAST',
            update: { x2: `${x}`, y2: `${y}` },
          });
        }
      }
      break;
    case 'RECTANGLE':
      if (Store.isActivityInProgress()) {
        const last = Store.getLast();
        if (last && last[0] === 'rect') {
          const distX = x - parseFloat(last[1].xi);
          const distY = y - parseFloat(last[1].yi);
          const newWidth = Math.abs(distX);
          const newHeight = Math.abs(distY);
          const newX = distX < 0 ? x : parseFloat(last[1].xi);
          const newY = distY < 0 ? y : parseFloat(last[1].yi);

          Dispatcher.dispatch({
            type: 'ANNOTATIONS_UPDATE_LAST',
            update: { x: `${newX}`, y: `${newY}`, width: `${newWidth}`, height: `${newHeight}` },
          });
        }
      }
      break;
    case 'SELECTANNOTATION':
      if (Store.isActivityInProgress()) {
        const selectedAnnotation = Store.getSelectedAnnotation();
        if(selectedAnnotation) {
          const selectedAnchorNumber = Store.getSelectedAnchorNumber();
          if(selectedAnchorNumber) {
            switch (selectedAnnotation[0]) {
              case 'line':
                moveLine(x, y, selectedAnchorNumber, Dispatcher);
                break;
              case 'rect':
                moveRect(x, y, selectedAnchorNumber, Store, Dispatcher);
                break;
            }
          } else {
            // Drag entire annotation by dx and dy
            if(Store.getCanMove()) {
              const dx = Store.getCoords(e)[0] - Store.getSelectedCoords()[0];
              const dy = Store.getCoords(e)[1] - Store.getSelectedCoords()[1];
              Dispatcher.dispatch({
                type: 'EDIT',
                update: { transform: `translate(${dx} ${dy})`, dx: `${dx}`, dy: `${dy}`}
              });
              Dispatcher.dispatch({
                type: 'ANCHORS_EDIT',
                update: {dx: dx, dy: dy},
              });
            }
          }
        }
      }
      break;

    default:
      break;

  }
}

function moveLine(x, y, selectedAnchorNumber, Dispatcher) {
  Dispatcher.dispatch({
    type: 'EDIT',
    update: selectedAnchorNumber == 1? { x1: `${x}`, y1: `${y}` } : { x2: `${x}`, y2: `${y}` },
  });
  Dispatcher.dispatch({
    type: 'SELECTED_ANCHOR_UPDATE',
    update: { cx: `${x}`, cy: `${y}` },
  });
}

function moveRect(x, y, selectedAnchorNumber, Store, Dispatcher) {
  const pivotAnchor = parseFloat(selectedAnchorNumber) < 3 ? 
    Store.getAnchorByNumber(parseFloat(selectedAnchorNumber) + 2) :
    Store.getAnchorByNumber(parseFloat(selectedAnchorNumber) - 2);
  
  const distX = parseFloat(pivotAnchor[1].cx) - x;
  const distY = parseFloat(pivotAnchor[1].cy) - y;
  const newWidth = Math.abs(distX);
  const newHeight = Math.abs(distY);
  const newX = distX > 0 ? x : parseFloat(pivotAnchor[1].cx);
  const newY = distY > 0 ? y : parseFloat(pivotAnchor[1].cy);

  Dispatcher.dispatch({
    type: 'EDIT',
    update: { x: `${newX}`, y: `${newY}`, width: `${newWidth}`, height: `${newHeight}` }
  });
  Dispatcher.dispatch({
    type: 'SELECTED_ANCHOR_UPDATE',
    update: { 
      a1: {cx: `${newX}`, cy: `${newY}`},
      a2: {cx: `${newX + newWidth}`, cy: `${newY}`},
      a3: {cx: `${newX + newWidth}`, cy: `${newY + newHeight}`},
      a4: {cx: `${newX}`, cy: `${newY + newHeight}`},
      },
  });
}
