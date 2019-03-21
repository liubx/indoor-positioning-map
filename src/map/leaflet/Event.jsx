/* global android */
/* eslint no-undef: "error" */
import { Component } from 'react';
import { fromEvent } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import PropTypes from 'prop-types';
import { project } from './util';

class LlEventLayer extends Component {
  componentDidMount() {
    fromEvent(this.context.map, 'click')
      .pipe(
        map((e) => e.latlng),
        tap((latlng) => {
          const point = project(latlng.lng, latlng.lat);
          console.log({
            coord3857: [point.x, point.y],
            coord4326: [latlng.lng, latlng.lat],
            zoom: this.context.map.getZoom(),
            maxZoom: this.context.map.getMaxZoom(),
            minZoom: this.context.map.getMinZoom(),
            extent: this.context.map.getBounds()
          });
        })
      )
      .subscribe();

    fromEvent(this.context.map, 'dblclick')
      .pipe(
        map((e) => e.latlng),
        map((latlng) => project(latlng.lng, latlng.lat)),
        map((data) => [data.x, data.y]),
        tap((coordinate) => console.log(coordinate)),
        tap((coordinate) => {
          if (
            typeof android !== 'undefined' &&
            typeof android.showPosition !== 'undefined'
          ) {
            android.showPosition(coordinate[0], coordinate[1]);
          }
        })
      )
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
