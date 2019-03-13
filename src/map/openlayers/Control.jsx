/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';
import View from 'ol/View';
import {
  OUTDOOR_MAX_ZOOM,
  OUTDOOR_MIN_ZOOM,
  INDOOR_MAX_ZOOM,
  INDOOR_MIN_ZOOM
} from './config';

class OlControlLayer extends Component {
  componentDidMount() {
    window.rotate = () => {
      const rotation = this.context.map.getView().getRotation();
      this.context.map.getView().animate({
        rotation: rotation ? rotation - Math.PI / 2 : rotation + Math.PI / 2
      });
    };

    window.center = () => {
      if (
        this.props.position &&
        this.props.position.longitude &&
        this.props.position.latitude
      ) {
        this.context.map.getView().animate({
          center: [this.props.position.longitude, this.props.position.latitude],
          duration: 800
        });
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
        this.context.map
          .getView()
          .fit(
            [
              this.props.map.xmin,
              this.props.map.ymin,
              this.props.map.xmax,
              this.props.map.ymax
            ],
            this.context.map.getSize()
          );
      }
    };

    window.setIndoor = () => {
      this.context.map.setView(
        new View(
          Object.assign(this.context.map.getView().options_, {
            zoom: INDOOR_MIN_ZOOM,
            maxZoom: INDOOR_MAX_ZOOM,
            minZoom: INDOOR_MIN_ZOOM
          })
        )
      );
    };

    window.setOutdoor = () => {
      const center = this.context.map.getView().getCenter();
      this.context.map.setView(
        new View(
          Object.assign(this.context.map.getView().options_, {
            zoom: OUTDOOR_MAX_ZOOM,
            maxZoom: OUTDOOR_MAX_ZOOM,
            minZoom: OUTDOOR_MIN_ZOOM
          })
        )
      );
      this.context.map.getView().animate({
        center: center,
        duration: 0
      });
      console.log(this.context.map.getView().options_);
    };

    window.zoom = (zoom) => {
      this.context.map.getView().setZoom(zoom);
    };

    window.zoomIn = (range = 1) => {
      this.context.map
        .getView()
        .setZoom(this.context.map.getView().getZoom() + range);
    };

    window.zoomOut = (range = 1) => {
      this.context.map
        .getView()
        .setZoom(this.context.map.getView().getZoom() - range);
    };

    window.move = (longitude, latitude) => {
      this.context.map.getView().animate({
        center: [longitude, latitude],
        duration: 800
      });
    };
  }

  render() {
    return false;
  }
}

OlControlLayer.defaultProps = {
  position: null,
  map: null
};

OlControlLayer.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object
};

OlControlLayer.contextTypes = {
  map: PropTypes.object
};

export default OlControlLayer;
