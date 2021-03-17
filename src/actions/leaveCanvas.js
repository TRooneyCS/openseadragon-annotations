export default function leaveCanvas(Dispatcher, Store) {
  switch (Store.getMode()) {

    case 'DRAW':
    case 'LINE':
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
      Dispatcher.dispatch({
        type: 'EDIT_COMPLETED',
      });
      break;

    default:
      break;

  }
}
