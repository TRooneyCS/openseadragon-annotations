export default function release(Dispatcher, Store) {
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
        type: 'ANCHOR_NUMBER_UPDATE',
        selectedAnchorNumber: 0,
      });
      break;
    default:
      break;

  }
}
