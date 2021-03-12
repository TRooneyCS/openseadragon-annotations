export default function leaveCanvas(Dispatcher, Store) {
  switch (Store.getMode()) {

    case 'DRAW':
    case 'LINE':
    case 'SELECTANNOTATION':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: false,
      });
      break;

    default:
      break;

  }
}
