export default function release(Dispatcher, Store) {
  switch (Store.getMode()) {

    case 'DRAW':
    case 'LINE':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: false,
      });
    case 'RECTANGLE':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: false,
      });
      Dispatcher.dispatch({
        type: 'RECTANGLE_UPDATE_COMPLETE',
      });
      break;
    case 'SELECTANNOTATION':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: false,
      });
      Dispatcher.dispatch({
        type: 'ANCHOR_NUMBER_UPDATE',
        selectedAnchorNumber: 0,
      });
      Dispatcher.dispatch({
        type: 'EDIT_COMPLETED',
      });
      Dispatcher.dispatch({
        type: 'RECTANGLE_UPDATE_COMPLETE',
      });
      break;
    default:
      break;

  }
}
