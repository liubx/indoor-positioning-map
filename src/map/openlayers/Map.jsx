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
            url:
              'http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8',
            projection: getProjection('EPSG:3857')
          }),
          minResolution: 0.44173422609826357
        }),
        new TileLayer({
          source: new XYZ({
            url:
              'http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8',
            projection: getProjection('EPSG:3857')
          }),
          minResolution: 0.44173422609826357
        })
      ],
      view: new View({
        projection: getProjection('EPSG:3857'),
        center: [12956543.5516902131, 4853897.893277171],
        zoom,
        maxZoom,
        minZoom
      })
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
    return <div ref={(el) => (this.ref = el)}>{children}</div>;
  }
}

OlMapLayer.defaultProps = {
  children: null,
  zoom: 21,
  maxZoom: 24,
  minZoom: 18
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
