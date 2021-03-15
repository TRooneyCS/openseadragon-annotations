export default function leaveCanvas(Dispatcher, Store) {
  switch (Store.getMode()) {

    case 'DRAW':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: false,
      });
      break;
    case 'DRAWLINE':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: false,
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
      break;
    
    default:
      break;

  }
}
