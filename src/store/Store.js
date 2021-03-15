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
    return data.annotations.find(annotation => annotation[1].id == id);
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
      break;

    case 'ACTIVITY_UPDATE':
      data.activityInProgress = action.inProgress;
      break;

    case 'ANNOTATIONS_CREATE':
      data.annotations.push(action.annotation);
      break;

    case 'ANNOTATIONS_UPDATE_LAST':
      // extend is from jQuery. Updates properties from one object to another.
      extend(Store.getLast()[1], action.update);
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
      extend(Store.getSelectedAnnotation()[1], action.update);
      break;

    case 'ANCHOR_NUMBER_UPDATE':
      data.selectedAnchorNumber = action.selectedAnchorNumber;
      break;

    case 'ANCHOR_UPDATE':
      extend(Store.getSelectedAnchor()[1], action.update);
      break;

    default:
      break;
  }
  Store.raiseEvent('CHANGE_EVENT');
});

export default Store;
