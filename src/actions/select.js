import Store from '../store/Store';
import Dispatcher from '../dispatcher/Dispatcher';
import selectMode from '../actions/selectMode';

const anchorFactory = {
  getAnchor(cx, cy, annotationId, anchorNumber) {
    return [
      'circle',
      {
        cx: `${cx}`,
        cy: `${cy}`,
        r: 1,
        annotationId: annotationId,
        anchorNumber: anchorNumber,
        cursor: 'pointer',
        stroke: 'white',
        'stroke-width': 0.8,
        'stroke-linecap': 'round',
        'fill': 'gray',
        'fill-opacity': 0.5,
        'vector-effect': 'non-scaling-stroke',
        onPointerDown: Select.handleAnchorMouseDown.bind(this),
      },
    ];
  },
};

class AppSelectionTool {
	handleAnnotationMouseDown(e) {
		e.stopImmediatePropagation();
    if(Store.getMode() === 'ERASER') {
      Select.eraseAnnotation(e);
    } else {
      Select.selectAnnotation(e);
    }
	};

  selectAnnotation(e) {
    selectMode('SELECTANNOTATION', Dispatcher, Store);
    const selectedId = e.target.attributes.id.value;
    Store.setSelectedId(selectedId);
    
    // if the annotation wasn't selected before, prevent drag
    if(!Store.getAnchorByAnnotationId(selectedId)) {
      Store.setCanMove(false);
    }

    const selected = Store.getAnnotationById(selectedId);
    Dispatcher.dispatch({
      type: 'ACTIVITY_UPDATE',
      inProgress: true,
    });
    Dispatcher.dispatch({
      type: 'SELECTED_COORDS_UPDATE',
      update: Store.getCoords(e),
    });
    
    Store.cleanAnchors();

    switch (selected[0]) {
      case 'line':
        Dispatcher.dispatch({
          type: 'ANNOTATIONS_CREATE',
          annotation: anchorFactory.getAnchor(selected[1].x1, selected[1].y1, selectedId, 1, Store),
        });
        Dispatcher.dispatch({
          type: 'ANNOTATIONS_CREATE',
          annotation: anchorFactory.getAnchor(selected[1].x2, selected[1].y2, selectedId, 2, Store),
        });
        break;
      // add rect, ellipse..
      default:
        break;
    }
  }

  eraseAnnotation(e) {
    Dispatcher.dispatch({
      type: 'ACTIVITY_UPDATE',
      inProgress: false,
    });
    Dispatcher.dispatch({
      type: 'ANNOTATIONS_DELETE',
      annotationId: e.target.attributes.id.value,
    });
  }

	handleAnchorMouseDown(e) {
		e.stopImmediatePropagation();

		if (Store.getMode() == 'SELECTANNOTATION') {
			Dispatcher.dispatch({
				type: 'ACTIVITY_UPDATE',
				inProgress: true,
			});
			Dispatcher.dispatch({
				type: 'ANCHOR_NUMBER_UPDATE',
				selectedAnchorNumber: e.target.attributes.anchorNumber.value,
			});

		}
	}

  handleAnnotationMouseUp(e) {
    if(Store.getMode() == 'SELECTANNOTATION') {
      Store.setCanMove(true);
    }
  }
}

const Select = new AppSelectionTool();
export default Select;
