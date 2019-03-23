/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { project, unproject } from './util';
import {
  OUTDOOR_MAX_ZOOM,
  OUTDOOR_MIN_ZOOM,
  OUTDOOR_DEFAULT_ZOOM,
  INDOOR_MAX_ZOOM,
  INDOOR_MIN_ZOOM,
  INDOOR_DEFAULT_ZOOM
} from './config';
import { PROJECTION_3857, PROJECTION_4326 } from '../constant';

class LlControlLayer extends Component {
  componentDidMount() {
    window.rotate = () => {};

    window.center = () => {
      if (
        this.props.position &&
        this.props.position.longitude &&
        this.props.position.latitude
      ) {
        this.context.map.panTo(
          unproject(
            this.props.position.longitude,
            this.props.position.latitude
          ),
          {
            duration: 0.8
          }
        );
      }
    };

    window.bounds = () => {
      if (
        this.props.map &&
        this.props.map.xmin &&
        this.props.map.ymin &&
        this.props.map.xmax &&
        this.props.map.ymax
      ) {
        this.context.map.flyToBounds([
          unproject(this.props.map.xmin, this.props.map.ymin),
          unproject(this.props.map.xmax, this.props.map.ymax)
        ]);
      }
    };

    window.setIndoor = () => {
      this.context.map.setMinZoom(INDOOR_MIN_ZOOM);
      this.context.map.setMaxZoom(INDOOR_MAX_ZOOM);
      this.context.map.setZoom(INDOOR_DEFAULT_ZOOM);
    };

    window.setOutdoor = () => {
      this.context.map.setMinZoom(OUTDOOR_MIN_ZOOM);
      this.context.map.setMaxZoom(OUTDOOR_MAX_ZOOM);
      this.context.map.setZoom(OUTDOOR_DEFAULT_ZOOM);
    };

    window.zoom = (zoom) => {
      this.context.map.setZoom(zoom);
    };

    window.zoomIn = () => {
      this.context.map.zoomIn(1);
    };

    window.zoomOut = () => {
      this.context.map.zoomOut(1);
    };

    window.move = (longitude, latitude, projection = PROJECTION_3857) => {
      if (projection === PROJECTION_4326) {
        const point = project(longitude, latitude);
        longitude = point.x;
        latitude = point.y;
        projection = PROJECTION_3857;
      }
      this.context.map.panTo(unproject(longitude, latitude), {
        duration: 0.8
      });
    };
  }

  render() {
    return false;
  }
}

LlControlLayer.defaultProps = {
  position: null,
  map: null
};

LlControlLayer.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object
};

LlControlLayer.contextTypes = {
  map: PropTypes.object
};

export default LlControlLayer;
