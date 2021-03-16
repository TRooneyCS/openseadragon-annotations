export default function move(x, y, Dispatcher, Store) {
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
    case 'SELECTANNOTATION':
      if (Store.isActivityInProgress()) {
        const selectedAnnotation = Store.getSelectedAnnotation();
        if(selectedAnnotation && selectedAnnotation[0] == "line") {
          const selectedAnchorNumber = Store.getSelectedAnchorNumber();
          if(selectedAnchorNumber) {
            Dispatcher.dispatch({
              type: 'EDIT',
              update: selectedAnchorNumber == 1? { x1: `${x}`, y1: `${y}` } : { x2: `${x}`, y2: `${y}` },
            });
            Dispatcher.dispatch({
              type: 'ANCHOR_UPDATE',
              update: { cx: `${x}`, cy: `${y}` },
            });
          } else {
            // Drag entire annotation by dx and dy
          }
        }
      }
      break;

    default:
      break;

  }
}
