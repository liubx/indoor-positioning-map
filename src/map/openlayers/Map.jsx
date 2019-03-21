/* global window */
/* eslint no-undef: "error" */
import React, { Component } from 'react';
import Map from 'ol/Map';
import { defaults as defaultInteractions } from 'ol/interaction';
import View from 'ol/View';
import PropTypes from 'prop-types';
import { get as getProjection } from 'ol/proj.js';
import {
  DEFAULT_CENTER,
  DEFAULT_PROJECTION,
  OUTDOOR_DEFAULT_ZOOM,
  OUTDOOR_MAX_ZOOM,
  OUTDOOR_MIN_ZOOM
} from './config';

class OlMapLayer extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      loaded: false
    };
  }

  getChildContext() {
    return { map: this.map };
  }

  componentDidMount() {
    const { zoom, minZoom, maxZoom } = this.props;
    this.map = new Map({
      interactions: defaultInteractions({
        doubleClickZoom: false,
        pinchRotate: false,
        pinchZoom: true,
        mouseWheelZoom: true,
        zoomDelta: false,
        altShiftDragRotate: false,
        keyboard: false,
        shiftDragZoom: false,
        constrainResolution: false
      }),
      target: this.ref,
      controls: [],
      view: new View({
        projection: getProjection(DEFAULT_PROJECTION),
        zoom,
        maxZoom,
        minZoom
      })
    });
    this.map.getView().animate({
      center: DEFAULT_CENTER,
      duration: 0
    });
    this.setState({
      loaded: true
    });
  }

  render() {
    let children = null;
    if (this.props.children !== undefined && this.state.loaded) {
      children =
        this.props.children instanceof Array
          ? this.props.children
              .filter((child) => child !== null)
              .map((child) => React.cloneElement(child))
          : React.cloneElement(this.props.children);
    }
    return (
      <div
        ref={(el) => (this.ref = el)}
        style={{ width: window.innerWidth, height: window.innerHeight }}
      >
        {children}
      </div>
    );
  }
}

OlMapLayer.defaultProps = {
  children: null,
  zoom: OUTDOOR_DEFAULT_ZOOM,
  maxZoom: OUTDOOR_MAX_ZOOM,
  minZoom: OUTDOOR_MIN_ZOOM
};

OlMapLayer.propTypes = {
  children: PropTypes.node,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number
};

OlMapLayer.childContextTypes = {
  map: PropTypes.object
};

export default OlMapLayer;
