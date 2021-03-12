import Store from '../store/Store';
import Dispatcher from '../dispatcher/Dispatcher';

const anchorFactory = {
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
        onPointerDown: SelectionTool.handleAnchorMouseDown.bind(this),
      },
    ];
  },
};

class AppSelectionTool {
	handleAnnotationMouseDown(e) {
		if (Store.getMode() == 'SELECTANNOTATION') {
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
	};

	handleAnchorMouseDown(e) {
		console.log("handleAnchorMouseDown", e);
		console.log("handleAnchorMouseDown annotationid", e.srcElement.attributes.annotationId.value);
		console.log("handleAnchorMouseDown anchornumber", e.srcElement.attributes.anchorNumber.value);
	}

}

const SelectionTool = new AppSelectionTool();
export default SelectionTool;