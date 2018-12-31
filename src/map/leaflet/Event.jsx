/* global android */
/* eslint no-undef: "error" */
import { Component } from 'react';
import Rx from 'rxjs/Rx';
import PropTypes from 'prop-types';
import { project } from './util';

class LlEventLayer extends Component {
  componentDidMount() {
    Rx.Observable.fromEvent(this.context.map, 'click')
      .map((e) => e.latlng)
      .map((latlng) => project(latlng.lng, latlng.lat))
      .map((data) => [data.x, data.y])
      .do((coordinate) => console.log(coordinate))
      .subscribe();

    Rx.Observable.fromEvent(this.context.map, 'dblclick')
      .map((e) => e.latlng)
      .map((latlng) => project(latlng.lng, latlng.lat))
      .map((data) => [data.x, data.y])
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

LlEventLayer.contextTypes = {
  map: PropTypes.object
};

export default LlEventLayer;
