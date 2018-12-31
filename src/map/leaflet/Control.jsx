/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { unproject } from './util';

class LlControlLayer extends Component {
  componentDidMount() {
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

    window.zoomIn = () => {
      this.context.map.zoomIn(1);
    };

    window.zoomOut = () => {
      this.context.map.zoomOut(1);
    };

    window.move = (longitude, latitude) => {
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
