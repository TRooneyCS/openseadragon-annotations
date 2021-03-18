import Control from 'openseadragon-annotations/src/controls/Control';
import selectGroupHover from '../../img/select_grouphover.png';
import selectHover from '../../img/select_hover.png';
import selectPressed from '../../img/select_pressed.png';
import selectRest from '../../img/select_rest.png';

export default class SelectAnnotation extends Control {
  constructor() {
    super({
      tooltip: 'SelectAnnotation',
      srcRest: selectRest,
      srcGroup: selectGroupHover,
      srcHover: selectHover,
      srcDown: selectPressed,
    });
  }
}
