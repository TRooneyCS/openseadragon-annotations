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
    case 'DRAWLINE':
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
        // TODO
        // if there is an annotation selected
        // get the selected anchor
        // get the annotation id from the anchor
        // dispatch the update for the annotation
      }
      break;

    default:
      break;

  }
}
