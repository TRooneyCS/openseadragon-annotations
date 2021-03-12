export default function release(Dispatcher, Store) {
  switch (Store.getMode()) {

    case 'DRAW':
    case 'LINE':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: false,
      });
      break;
    default:
      break;

  }
}
