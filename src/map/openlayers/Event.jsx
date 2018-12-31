/* global android */
/* eslint no-undef: "error" */
import { Component } from 'react';
import Rx from 'rxjs/Rx';
import PropTypes from 'prop-types';

class OlEventLayer extends Component {
  componentDidMount() {
    Rx.Observable.fromEvent(this.context.map, 'singleclick')
      .do((e) => this.props.onSingleClick(e))
      .map((e) => e.coordinate)
      .do((coordinate) => console.log(coordinate))
      .subscribe();

    Rx.Observable.fromEvent(this.context.map, 'dblclick')
      .do((e) => this.props.onDoubleClick(e))
      .map((e) => e.coordinate)
      .do((coordinate) => console.log(coordinate))
      .do((coordinate) => {
        if (
          typeof android !== 'undefined' &&
          typeof android.showPosition !== 'undefined'
        ) {
          android.showPosition(coordinate[0], coordinate[1]);
        }
      })
      .subscribe();
  }

  render() {
    return false;
  }
}

OlEventLayer.defaultProps = {
  onSingleClick: () => false,
  onDoubleClick: () => false
};

OlEventLayer.propTypes = {
  onSingleClick: PropTypes.func,
  onDoubleClick: PropTypes.func
};

OlEventLayer.contextTypes = {
  map: PropTypes.object
};

export default OlEventLayer;
