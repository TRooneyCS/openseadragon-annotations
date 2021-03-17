export default function undoRedo(mode, Dispatcher) {
  Dispatcher.dispatch({
    type: 'ACTIVITY_UPDATE',
    inProgress: false,
  });
  Dispatcher.dispatch({
    type: 'ANNOTATIONS_UNDO_REDO',
    mode: mode,
  });
}
