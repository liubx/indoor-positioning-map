/* global android */
/* eslint no-undef: "error" */
import { Component } from 'react';
import { fromEvent } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import PropTypes from 'prop-types';
import { transform } from 'ol/proj';
import { PROJECTION_3857, PROJECTION_4326 } from '../constant';

class OlEventLayer extends Component {
  componentDidMount() {
    fromEvent(this.context.map, 'singleclick')
      .pipe(
        tap((e) => this.props.onSingleClick(e)),
        map((e) => e.coordinate),
        tap((coordinate) => {
          console.log({
            coord3857: coordinate,
            coord4326: transform(coordinate, PROJECTION_3857, PROJECTION_4326),
            zoom: this.context.map.getView().getZoom(),
            maxZoom: this.context.map.getView().getMaxZoom(),
            minZoom: this.context.map.getView().getMinZoom(),
            resolution: this.context.map.getView().getResolution(),
            extent: this.context.map
              .getView()
              .calculateExtent(this.context.map.getSize())
          });
        })
      )
      .subscribe();

    fromEvent(this.context.map, 'dblclick')
      .pipe(
        tap((e) => this.props.onDoubleClick(e)),
        map((e) => e.coordinate),
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
