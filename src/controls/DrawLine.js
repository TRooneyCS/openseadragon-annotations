import Control from 'openseadragon-annotations/src/controls/Control';
import drawGroupHover from '../../img/draw_grouphover.png';
import drawHover from '../../img/draw_hover.png';
import drawPressed from '../../img/draw_pressed.png';
import drawRest from '../../img/draw_rest.png';

export default class DrawLine extends Control {
  constructor() {
    super({
      Tooltip: 'DrawLine',
      srcRest: drawRest,
      srcGroup: drawGroupHover,
      srcHover: drawHover,
      srcDown: drawPressed,
    });
  }
}
