import Store from '../store/Store';

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

    default:
      break;

  }
}
