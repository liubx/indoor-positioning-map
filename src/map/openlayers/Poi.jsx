/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import { of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import PropTypes from 'prop-types';
import { BASE_URL } from '../constant';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

class OlPoiLayer extends Component {
  componentDidMount() {
    this.layer = new ImageLayer();
    this.layer.setZIndex(0);
    this.context.map.addLayer(this.layer);
    this.loadPoi(this.props.map);
  }

  shouldComponentUpdate(newProps) {
    return (
      newProps.map === null ||
      ((this.props.map === null || this.props.map === undefined) &&
        newProps.map !== null) ||
      (newProps.map !== null && newProps.map !== this.props.map)
    );
  }

  componentWillUpdate(newProps) {
    this.loadPoi(newProps.map);
  }

  componentWillUnmount() {
    this.context.map.removeLayer(this.layer);
  }

  loadPoi(map) {
    of(map)
      .pipe(
        tap(() => this.layer.setSource(null)),
        filter(
          (map) =>
            map !== null &&
            map !== undefined &&
            map.poiLayerId !== null &&
            map.poiLayerId !== undefined
        ),
        tap((map) => {
          this.layer.setSource(
            new ImageWMS({
              url: `${BASE_URL}:9010/geoserver/${
                map.poiLayerId.split(':')[0]
              }/wms`,
              params: {
                FORMAT: 'image/png',
                VERSION: '1.1.1',
                STYLES: '',
                LAYERS: map.poiLayerId
              },
              serverType: 'geoserver'
            })
          );
        })
      )
      .subscribe();
  }

  render() {
    return false;
  }
}

OlPoiLayer.defaultProps = {
  map: null
};

OlPoiLayer.propTypes = {
  map: PropTypes.object
};

OlPoiLayer.contextTypes = {
  map: PropTypes.object
};

export default OlPoiLayer;
