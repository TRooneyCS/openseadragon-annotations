import OpenSeadragon, { extend } from 'openseadragon';
import Dispatcher from '../dispatcher/Dispatcher';

const data = {
  mode: 'MOVE',
  zoom: 1,
  // width and heigth contain the original width and height of the
  // SVG container, in pixels, at zoom level 1. These will remain
  // constant over time as the image scales up and down
  width: 0,
  height: 0,
  activityInProgress: false,
  annotations: [],
  selectedId: 0,
  selectedAnchorNumber : 0,
  author: '',
  undoStack: [],
  redoStack: [],
  selectedCoords: [0, 0],
  boundingClientRect: null,
  canMove: false,
};

class AppStore extends OpenSeadragon.EventSource {
  getAll() {
    return data.annotations;
  }

  // multiplying the original width in pixels by the current
  // zoom level gives us the image width in pixels at the moment
  getWidth() {
    return data.width * data.zoom;
  }

  // idem for the heigth
  getHeight() {
    return data.height * data.zoom;
  }

  getLast() {
    return data.annotations[data.annotations.length - 1];
  }

  getMode() {
    return data.mode;
  }

  inMoveMode() {
    return this.getMode() === 'MOVE';
  }

  notInMoveMode() {
    return !this.inMoveMode();
  }

  getZoomLevel() {
    return data.zoom;
  }

  isActivityInProgress() {
    return data.activityInProgress;
  }

  getAnnotationByIndex(annotationIndex) {
    return data.annotations[annotationIndex];
  }

  getAnnotationById(id) {
    return data.annotations.find(annotation => annotation[1].id.toString() === id);
  }

  createId() {
    return Math.floor(Math.random() * 10000);
  }

  getSelectedId() {
    return data.selectedId;
  }

  setSelectedId(selectedId) {
    data.selectedId = selectedId;
  }

  getSelectedAnnotation() {
    if(data.selectedId != 0) {
      return this.getAnnotationById(data.selectedId);
    }
    return null;
  }

  /** Remove all anchors from annotations array */
  cleanAnchors() {
    data.annotations = data.annotations.filter(annotation => !annotation[1].anchorNumber);
  }

  setAuthor(author) {
    data.author = author;
  }

  getAuthor() {
    return data.author;
  }

  getSelectedAnchorNumber() {
    return data.selectedAnchorNumber;
  }

  getSelectedAnchor() {
    if(data.selectedAnchorNumber != 0) {
      return data.annotations.find(annotation => annotation[1].anchorNumber == data.selectedAnchorNumber);
    }
    return null;
  }

  getAnchorByAnnotationId(annotationId) {
    return data.annotations.find(annotation => annotation[1].annotationId == annotationId);
  }

  getAnchorByNumber(number) {
    if(data.selectedAnchorNumber != 0) {
      return data.annotations.find(annotation => annotation[1].anchorNumber == number);
    }
    return null; 
  }

  getSelectedCoords() {
    return data.selectedCoords;
  }

  setBoundingClientRect(rect) {
    data.boundingClientRect = rect;
  }

  getBoundingClientRect() {
    return data.boundingClientRect;
  }

  getCoords(e) {
    const rect = Store.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const x = 100 * offsetX / rect.width;
    const y = 100 * offsetY / rect.height;
    return [
      Math.round(x * 100) / 100,
      Math.round(y * 100) / 100,
    ];
  }

  completeEdit() {
    const selected = Store.getSelectedAnnotation();
    switch (selected[0]) {
      case 'line':
        Store.getSelectedAnnotation()[1].x1 = parseFloat(selected[1].x1) + parseFloat(selected[1].dx);
        Store.getSelectedAnnotation()[1].y1 = parseFloat(selected[1].y1) + parseFloat(selected[1].dy);
        Store.getSelectedAnnotation()[1].x2 = parseFloat(selected[1].x2) + parseFloat(selected[1].dx);
        Store.getSelectedAnnotation()[1].y2 = parseFloat(selected[1].y2) + parseFloat(selected[1].dy);
        extend(Store.getSelectedAnnotation()[1], {transform: 'translate(0 0)', dx: '0', dy: '0'});
        break;
      case 'rect':
        Store.getSelectedAnnotation()[1].x = parseFloat(selected[1].x) + parseFloat(selected[1].dx);
        Store.getSelectedAnnotation()[1].y = parseFloat(selected[1].y) + parseFloat(selected[1].dy);
        extend(Store.getSelectedAnnotation()[1], {transform: 'translate(0 0)', dx: '0', dy: '0'});
        break;
      default:
        break;    
    }
  }

  editAnchors(dx, dy) {
    const selected = Store.getSelectedAnnotation();
    var cx1, cx2, cx3, cx4, cy1, cy2, cy3, cy4;
    switch (selected[0]) {
      case 'line':
        cx1 = parseFloat(selected[1].x1) + dx;
        cy1 = parseFloat(selected[1].y1) + dy;
        cx2 = parseFloat(selected[1].x2) + dx;
        cy2 = parseFloat(selected[1].y2) + dy;
        Store.extendAnchor('1', cx1, cy1);
        Store.extendAnchor('2', cx2, cy2);
        break;
      case 'rect':
        cx1 = parseFloat(selected[1].x) + dx;
        cy1 = parseFloat(selected[1].y) + dy;
        cx2 = parseFloat(selected[1].x) + parseFloat(selected[1].width) + dx;
        cy2 = parseFloat(selected[1].y) + dy;
        cx3 = parseFloat(selected[1].x) + parseFloat(selected[1].width) + dx;
        cy3 = parseFloat(selected[1].y) + parseFloat(selected[1].height) + dy;
        cx4 = parseFloat(selected[1].x) + dx;
        cy4 = parseFloat(selected[1].y) + parseFloat(selected[1].height) + dy;
        Store.extendAnchor('1', cx1, cy1);
        Store.extendAnchor('2', cx2, cy2);
        Store.extendAnchor('3', cx3, cy3);
        Store.extendAnchor('4', cx4, cy4);
        break;
      default:
        break;
    }
  }

  extendAnchor(anchorNumber, cx, cy) {
    extend(data.annotations.find(annotation => annotation[1].anchorNumber == anchorNumber)[1], {cx: `${cx}`, cy: `${cy}`});
  }

  setCanMove(canMove) {
    data.canMove = canMove;
  }

  getCanMove() {
    return data.canMove;
  }

  changeAnnotationCursor(cursor) {
    data.annotations.forEach(element => element[1].cursor = `${cursor}`);
  }
}

const Store = new AppStore();

Dispatcher.register((action) => {
  switch (action.type) {
    case 'MODE_UPDATE':
      data.mode = action.mode;
      if (action.mode != 'SELECTANNOTATION') {
        data.selectedId = 0;
        Store.cleanAnchors();
      }
      switch (action.mode) {
        case 'SELECTANNOTATION':
          Store.changeAnnotationCursor('move');
          break;
        case 'MOVE':
          Store.changeAnnotationCursor('pointer');
          break;
        case 'ERASER':
          Store.changeAnnotationCursor('pointer');
          break;
  
        default:
          break;
      }
      break;

    case 'ACTIVITY_UPDATE':
      data.activityInProgress = action.inProgress;
      break;

    case 'ANNOTATIONS_CREATE':
      data.annotations.push(action.annotation);
      if (action.annotation[1].id) data.undoStack.push(['create', action.annotation[1].id.toString()]);
      data.redoStack = [];
      break;

    case 'ANNOTATIONS_UPDATE_LAST':
      extend(Store.getLast()[1], action.update);
      break;

    case 'ANNOTATIONS_DELETE':
      const annotation = deleteAnnotation(action.annotationId);
      if (annotation) {
        data.undoStack.push(['delete', annotation]);
        data.redoStack = [];
      }
      break;

    case 'ANNOTATIONS_UNDO_REDO':
      undoRedo(action.mode);
      break;

    case 'ANNOTATIONS_RESET':
      data.annotations = action.annotations;
      break;

    case 'ZOOM_UPDATE':
      data.zoom = action.zoom;
      break;

    case 'INITIALIZE':
      extend(data, action.options);
      break;

    case 'EDIT':
      if (getLastUndoId() !== Store.getSelectedId()) {
        const selected = Store.getSelectedAnnotation();
        data.undoStack.push(['edit', [selected[0], Object.assign({}, selected[1])]]);
      }
      extend(Store.getSelectedAnnotation()[1], action.update);
      break;

    case 'EDIT_COMPLETED':
      Store.completeEdit();
      break;

    case 'ANCHOR_NUMBER_UPDATE':
      data.selectedAnchorNumber = action.selectedAnchorNumber;
      break;

    case 'SELECTED_ANCHOR_UPDATE':
      switch (Store.getSelectedAnnotation()[0]) {
        case 'line':
          extend(Store.getSelectedAnchor()[1], action.update);
          break;
        case 'rect':
          extend(Store.getAnchorByNumber(1)[1], action.update.a1);
          extend(Store.getAnchorByNumber(2)[1], action.update.a2);
          extend(Store.getAnchorByNumber(3)[1], action.update.a3);
          extend(Store.getAnchorByNumber(4)[1], action.update.a4);
          break;
        default:
          break;
      }
      break;

    case 'ANCHORS_EDIT':
      Store.editAnchors(action.update.dx, action.update.dy);
      break;

    case 'SELECTED_COORDS_UPDATE':
      data.selectedCoords = action.update;
      break;

    case 'RECTANGLE_UPDATE_COMPLETE':
      if(Store.getLast()[0] === 'rect') {
        Store.getLast()[1].xi = Store.getLast()[1].x;
        Store.getLast()[1].yi = Store.getLast()[1].y;
      }
      if(Store.getSelectedAnnotation() && Store.getSelectedAnnotation()[0] === 'rect') {
        Store.getSelectedAnnotation()[1].xi = Store.getSelectedAnnotation()[1].x;
        Store.getSelectedAnnotation()[1].yi = Store.getSelectedAnnotation()[1].y;
      }
      break;
    default:
      break;
  }
  Store.raiseEvent('CHANGE_EVENT');
});

export default Store;

function deleteAnnotation(id) {
  const annotation = Store.getAnnotationById(id);
  const index = data.annotations.indexOf(annotation);
  data.annotations.splice(index, 1);
  return annotation;
}

function undoRedo(mode) {
  const action = mode < 1 ? data.undoStack.pop() : data.redoStack.pop();
  const writeStack = mode < 1 ? data.redoStack : data.undoStack;

  if (!action) return;
  switch (action[0]) {
    case 'create':
      const deletedAnnotation = deleteAnnotation(action[1]);
      writeStack.push(['delete', deletedAnnotation]);
      break;
    case 'delete':
      data.annotations.push(action[1]);
      writeStack.push(['create', action[1][1].id.toString()]);
      break;
    case 'edit':
      Store.cleanAnchors();
      const editedAnnotation = Store.getAnnotationById(action[1][1].id.toString());
      writeStack.push(['edit', [editedAnnotation[0], Object.assign({}, editedAnnotation[1])]]);
      extend(editedAnnotation[1], action[1][1]);
  }
}

function getLastUndoId() {
  if (data.undoStack.length === 0) return -1;
  const id = data.undoStack[data.undoStack.length-1][1][1].id;
  return id ? id.toString() : -1;
}
