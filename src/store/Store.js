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
  style: {
    color: 'red',
    width: 3,
    fill: 'none'
  },
  activityInProgress: false,
  annotations: [],
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

  // idem for the height
  getHeight() {
    return data.height * data.zoom;
  }

  getLast() {
    return data.annotations[data.annotations.length - 1];
  }

  getMode() {
    return data.mode;
  }

  getStyle() {
    return data.style;
  }

  setColor(color) {
    data.style.color = color;
  }

  setFill(fill) {
    data.style.fill = fill;
  }

  setWidth(width) {
    data.style.width = width;
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
}

const Store = new AppStore();

Dispatcher.register((action) => {
  switch (action.type) {
    case 'MODE_UPDATE':
      data.mode = action.mode;
      break;

    case 'ACTIVITY_UPDATE':
      data.activityInProgress = action.inProgress;
      break;

    case 'ANNOTATIONS_CREATE':
      data.annotations.push(action.annotation);
      break;

    case 'ANNOTATIONS_UPDATE_LAST':
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

    default:
      break;
  }
  Store.raiseEvent('CHANGE_EVENT');
});

export default Store;
