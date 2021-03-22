import Control from './Control';
import rectangleGroupHover from '../../img/rectangle_grouphover.png';
import rectangleHover from '../../img/rectangle_hover.png';
import rectanglePressed from '../../img/rectangle_pressed.png';
import rectangleRest from '../../img/rectangle_rest.png';

export default class Rectangle extends Control {
  constructor() {
    super({
      tooltip: 'rectangle',
      srcRest: rectangleRest,
      srcGroup: rectangleGroupHover,
      srcHover: rectangleHover,
      srcDown: rectanglePressed,
    });
  }
}
