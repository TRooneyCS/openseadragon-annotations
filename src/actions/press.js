import Store from '../store/Store';
import Dispatcher from '../dispatcher/Dispatcher';

function handleAnnotationMouseDown(e) {
  if(Store.getMode() == 'SELECTANNOTATION') {
    // get annotationIndex
    const selectedId = e.srcElement.attributes.id.value;
    console.log("handleAnnotationMouseDown selectedId", selectedId);
    // store selected id
    Store.setLastSelected(selectedId);

    const selected = Store.getAnnotationById(selectedId);
    console.log("selected", selected);
    Dispatcher.dispatch({
      type: 'ACTIVITY_UPDATE',
      inProgress: true,
    });
    Store.cleanAnchors();

    switch (selected[0]) {
      case 'line':
        Dispatcher.dispatch({
          type: 'ANNOTATIONS_CREATE',
          annotation: shapesFactory.getAnchor(selected[1].x1, selected[1].y1, selectedId, 1, Store),
        });
        Dispatcher.dispatch({
          type: 'ANNOTATIONS_CREATE',
          annotation: shapesFactory.getAnchor(selected[1].x2, selected[1].y2, selectedId, 2, Store),
        });
        break;
      // add rect, ellipse..
      default:
        break;
    }
  }
};

function handleAnchorMouseDown(e) {
  console.log("handleAnchorMouseDown", e);
  console.log("handleAnchorMouseDown annotationid", e.srcElement.attributes.annotationId.value);
  console.log("handleAnchorMouseDown anchornumber", e.srcElement.attributes.anchorNumber.value);
}

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
        cursor: 'pointer',
        stroke: 'red',
        'stroke-width': 0.5,
        'stroke-linecap': 'round',
        // 'vector-effect': 'non-scaling-stroke',
        onPointerDown: handleAnnotationMouseDown.bind(this),
      },
    ];
  },
  getAnchor(cx, cy, annotationId, anchorNumber, Store) {
    return [
      'circle',
      {
        cx: `${cx}`,
        cy: `${cy}`,
        r: 1.5,
        annotationId: annotationId,
        anchorNumber: anchorNumber,
        cursor: 'pointer',
        stroke: 'white',
        'stroke-width': 0.5,
        'stroke-linecap': 'round',
        'fill': 'gray',
        'fill-opacity': 0.5,
        // 'vector-effect': 'non-scaling-stroke',
        onPointerDown: handleAnchorMouseDown.bind(this),
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
    case 'DRAWLINE':
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
      // Dispatcher.dispatch({
      //   type: 'ACTIVITY_UPDATE',
      //   inProgress: true,
      // });
      // // TODO crear los anchors

      // Dispatcher.dispatch({
      //   type: 'ANNOTATIONS_CREATE',
      //   annotation: shapesFactory.getAnchor(cx, cy, r, anochorToId, anchorNumber, Store),
      // });
      console.log("press mode:SELECTANNOTATION");

      break;

    default:
      break;

  }
}
