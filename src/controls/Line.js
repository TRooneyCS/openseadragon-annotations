import Control from './Control';
import lineGroupHover from '../../img/line_grouphover.png';
import lineHover from '../../img/line_hover.png';
import linePressed from '../../img/line_pressed.png';
import lineRest from '../../img/line_rest.png';

export default class Line extends Control {
  constructor() {
    super({
      tooltip: 'Line',
      srcRest: lineRest,
      srcGroup: lineGroupHover,
      srcHover: lineHover,
      srcDown: linePressed,
    });
  }
}
