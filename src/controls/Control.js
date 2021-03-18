import { extend, Button } from 'openseadragon';
import selectMode from '../actions/selectMode';
import Store from '../store/Store';
import Dispatcher from '../dispatcher/Dispatcher';

export default class Control {
  constructor(options) {
    this.mode = options.tooltip.toUpperCase();
    this.btn = new Button(extend({
      onClick: this.onClick,
    }, options));
    if (Store.getMode() === this.mode) {
      this.activate();
    }
    Store.addHandler('CHANGE_EVENT', () => {
      if (Store.getMode() === this.mode) {
        this.activate();
      } else {
        this.deactivate();
      }
    });
  }

  activate() {
    this.btn.imgDown.style.visibility = 'visible';
  }

  deactivate() {
    this.btn.imgDown.style.visibility = 'hidden';
  }

  onClick(e) {
    if (e.eventSource.tooltip) {
      selectMode(e.eventSource.tooltip.toUpperCase(), Dispatcher, Store);
    }
  }
}
