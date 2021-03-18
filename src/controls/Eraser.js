import Control from './Control';
import eraserGroupHover from '../../img/eraser_grouphover.png';
import eraserHover from '../../img/eraser_hover.png';
import eraserPressed from '../../img/eraser_pressed.png';
import eraserRest from '../../img/eraser_rest.png';

export default class Eraser extends Control {
  constructor() {
    super({
      tooltip: 'Eraser',
      srcRest: eraserRest,
      srcGroup: eraserGroupHover,
      srcHover: eraserHover,
      srcDown: eraserPressed,
    });
  }
}
