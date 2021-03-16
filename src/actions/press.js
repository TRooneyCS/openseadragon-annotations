import Store from '../store/Store';
import Select from '../actions/select';

const shapesFactory = {
  getPath(x, y) {
    return [
      'path',
      {
        fill: Store.getStyle().fill || 'none',
        d: `M${x} ${y}`,
        stroke: Store.getStyle().color || 'red',
        'stroke-width': Store.getStyle().width || 3,
        'stroke-linejoin': 'round',
        'stroke-linecap': 'round',
        'vector-effect': 'non-scaling-stroke',
      },
    ];
  },
  getLine(x, y, id, author) {
    return [
      'line',
      {
        x1: `${x}`,
        y1: `${y}`,
        x2: `${x}`,
        y2: `${y}`,
        id: id,
        author: author,
        cursor: 'pointer',
        stroke: 'red',
        'stroke-width': 0.5,
        'stroke-linecap': 'round',
        // 'vector-effect': 'non-scaling-stroke',
        onPointerDown: Select.handleAnnotationMouseDown.bind(this),
      },
    ];
  },
};

export default function press(x, y, Dispatcher, store) {
  switch (store.getMode()) {
    case 'DRAW':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: true,
      });
      Dispatcher.dispatch({
        type: 'ANNOTATIONS_CREATE',
        annotation: shapesFactory.getPath(x, y),
      });
      break;
    case 'LINE':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: true,
      });
      Dispatcher.dispatch({
        type: 'ANNOTATIONS_CREATE',
        annotation: shapesFactory.getLine(x, y, Store.createId(), Store.getAuthor()),
      });
      break;
    case 'SELECTANNOTATION':
      Dispatcher.dispatch({
        type: 'MODE_UPDATE',
        mode: 'MOVE',
      });
      break;

    default:
      break;

  }
}
