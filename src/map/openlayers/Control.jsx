/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';

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

    window.zoomIn = () => {
      this.context.map
        .getView()
        .setZoom(this.context.map.getView().getZoom() + 1);
    };

    window.zoomOut = () => {
      this.context.map
        .getView()
        .setZoom(this.context.map.getView().getZoom() - 1);
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
