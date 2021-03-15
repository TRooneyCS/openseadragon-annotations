export default function cleanCanvas(Dispatcher) {
  Dispatcher.dispatch({
    type: 'ACTIVITY_UPDATE',
    inProgress: false,
  });
  Dispatcher.dispatch({
    type: 'ANNOTATIONS_RESET',
    annotations: [],
  });
  Dispatcher.dispatch({
    type: 'ANCHOR_NUMBER_UPDATE',
    selectedAnchorNumber: 0,
  });
}
