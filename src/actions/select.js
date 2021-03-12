import Store from '../store/Store';
import Dispatcher from '../dispatcher/Dispatcher';

const anchorFactory = {
  getAnchor(cx, cy, annotationId, anchorNumber) {
    return [
      'circle',
      {
        cx: `${cx}`,
        cy: `${cy}`,
        r: .5,
        anchorNumber: anchorNumber,
        cursor: 'pointer',
        stroke: 'white',
        'stroke-width': 0.5,
        'stroke-linecap': 'round',
        'fill': 'gray',
        'fill-opacity': 0.5,
        // 'vector-effect': 'non-scaling-stroke',
        onPointerDown: Select.handleAnchorMouseDown.bind(this),
      },
    ];
  },
};

class AppSelectionTool {
	handleAnnotationMouseDown(e) {
		if (Store.getMode() === 'SELECTANNOTATION') {
			const selectedId = e.target.attributes.id.value;
			Store.setLastSelected(selectedId);

			const selected = Store.getAnnotationById(selectedId);
			Dispatcher.dispatch({
				type: 'ACTIVITY_UPDATE',
				inProgress: true,
			});
			Store.cleanAnchors();

			switch (selected[0]) {
				case 'line':
					Dispatcher.dispatch({
						type: 'ANNOTATIONS_CREATE',
						annotation: anchorFactory.getAnchor(selected[1].x1, selected[1].y1, selectedId, 1),
					});
					Dispatcher.dispatch({
						type: 'ANNOTATIONS_CREATE',
						annotation: anchorFactory.getAnchor(selected[1].x2, selected[1].y2, selectedId, 2),
					});
					break;
				// add rect, ellipse..
				default:
					break;
			}
		}
		if (Store.getMode() === 'ERASER') {
      Dispatcher.dispatch({
        type: 'ACTIVITY_UPDATE',
        inProgress: false,
      });
      Dispatcher.dispatch({
        type: 'ANNOTATIONS_DELETE',
        annotationId: e.target.attributes.id.value,
      });
    }
	}

	handleAnchorMouseDown(e) {
		console.log("handleAnchorMouseDown", e);
		console.log("handleAnchorMouseDown anchorNumber", e.target.attributes.anchorNumber.value);
	}

}

const Select = new AppSelectionTool();
export default Select;
