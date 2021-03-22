import Select from '../actions/select';

const shapesFactory = {
  getPath(x, y) {
    return [
      'path',
      {
        fill: 'none',
        d: `M${x} ${y}`,
        stroke: 'red',
        'stroke-width': 3,
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
        transform: 'translate(0 0)',
        dx: 0,
        dy: 0,
        cursor: 'pointer',
        stroke: 'red',
        'stroke-width': 0.5,
        'stroke-linecap': 'round',
        // 'vector-effect': 'non-scaling-stroke',
        onPointerDown: Select.handleAnnotationMouseDown.bind(this),
        onPointerUp: Select.handleAnnotationMouseUp.bind(this),
      },
    ];
  },
  getRect(x, y, width, height, id, author) {
    return [
      'rect',
      {
        x: `${x}`,
        y: `${y}`,
        xi: `${x}`,
        yi: `${y}`,
        width: `${width}`,
        height: `${height}`,
        id: id,
        author: author,
        transform: 'translate(0 0)',
        dx: 0,
        dy: 0,
        cursor: 'pointer',
        stroke: 'red',
        'fill': 'none',
        'stroke-width': 0.5,
        'stroke-linecap': 'round',
        // 'vector-effect': 'non-scaling-stroke',
        onPointerDown: Select.handleAnnotationMouseDown.bind(this),
        onPointerUp: Select.handleAnnotationMouseUp.bind(this),
      },
    ];
  },
};

export default function press(x, y, Dispatcher, Store) {
  switch (Store.getMode()) {
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
    case 'RECTANGLE':
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: true,
      });
      Dispatcher.dispatch({
        type: 'ANNOTATIONS_CREATE',
        annotation: shapesFactory.getRect(x, y, 0, 0, Store.createId(), Store.getAuthor()),
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
