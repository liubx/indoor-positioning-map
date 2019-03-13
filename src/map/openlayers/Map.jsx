/* global window */
/* eslint no-undef: "error" */
import React, { Component } from 'react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultInteractions } from 'ol/interaction';
import View from 'ol/View';
import PropTypes from 'prop-types';
import { get as getProjection } from 'ol/proj.js';
import {
  OUTDOOR_MAX_ZOOM,
  OUTDOOR_MIN_ZOOM,
  OUTDOOR_MIN_RESOLUTION
} from './config';
import { TIANDITU_URL } from '../constant';

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
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `${TIANDITU_URL}/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
            projection: getProjection('EPSG:3857')
          }),
          minResolution: OUTDOOR_MIN_RESOLUTION
        }),
        new TileLayer({
          source: new XYZ({
            url: `${TIANDITU_URL}/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
            projection: getProjection('EPSG:3857')
          }),
          minResolution: OUTDOOR_MIN_RESOLUTION
        })
      ],
      view: new View({
        projection: getProjection('EPSG:3857'),
        zoom,
        maxZoom,
        minZoom
      })
    });

    this.map.getView().animate({
      center: [12957000, 4852000],
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
  zoom: OUTDOOR_MAX_ZOOM,
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
