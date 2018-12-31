/* global window XMLSerializer */
/* eslint no-undef: "error" */
import { Component } from 'react';
import Rx from 'rxjs/Rx';
import GeoJSON from 'ol/format/GeoJSON';
import WFS from 'ol/format/WFS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import PropTypes from 'prop-types';
import { BASE_URL } from '../constant';

class OlTriggerLayer extends Component {
  componentDidMount() {
    this.source = new VectorSource();
    const layer = new VectorLayer({
      source: this.source,
      style: new Style({
        fill: new Stroke({
          color: 'transparent'
        })
      })
    });
    const { map } = this.context;
    map.addLayer(layer);
    this.loadTrigger(this.props.map);
    Rx.Observable.fromEvent(map, 'singleclick')
      .filter((e) => !e.dragging)
      .map((e) => map.getPixelFromCoordinate(e.coordinate))
      .map((pixel) => map.forEachFeatureAtPixel(pixel, (feature) => feature))
      .filter(
        (feature) =>
          feature !== undefined &&
          feature !== null &&
          feature.values_.name !== undefined
      )
      .do((feature) => console.log(feature.values_.name))
      .subscribe();
  }

  shouldComponentUpdate(newProps) {
    if (
      this.props.map === null ||
      this.props.map === undefined ||
      this.props.position === null ||
      this.props.position === undefined
    ) {
      return true;
    }
    if (newProps.map === null && newProps.position === null) {
      return false;
    }
    return (
      newProps.map !== this.props.map ||
      newProps.position !== this.props.position
    );
  }

  componentWillUpdate(newProps) {
    if (newProps.map !== this.props.map) {
      this.loadTrigger(newProps.map);
    }
    if (newProps.position !== this.props.position) {
      this.checkPosition(newProps.position);
    }
  }

  loadTrigger(map) {
    Rx.Observable.of(map)
      .do(() => this.source.clear())
      .filter(
        (map) =>
          map !== null &&
          map !== undefined &&
          map.triggerLayerId !== null &&
          map.triggerLayerId !== undefined
      )
      .flatMap((map) =>
        Rx.Observable.ajax({
          url: `${BASE_URL}:9010/geoserver/${
            map.triggerLayerId.split(':')[0]
          }/wfs`,
          method: 'POST',
          body: new XMLSerializer().serializeToString(
            new WFS().writeGetFeature({
              srsName: 'EPSG:3857',
              featureTypes: [map.triggerLayerId],
              outputFormat: 'application/json'
            })
          ),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
      .filter((e) => e.status === 200)
      .map((e) => e.response)
      .do((json) => this.source.addFeatures(new GeoJSON().readFeatures(json)))
      .subscribe();
  }

  checkPosition(position) {
    Rx.Observable.of(position)
      .map((position) => [position.longitude, position.latitude])
      .map((position) => this.context.map.getPixelFromCoordinate(position))
      .map((pixel) =>
        this.context.map.forEachFeatureAtPixel(pixel, (feature) => feature)
      )
      .filter((feature) => feature !== undefined && feature !== null)
      .do((feature) => console.log(feature.values_.name))
      .subscribe();
  }

  render() {
    return false;
  }
}

OlTriggerLayer.defaultProps = {
  position: null,
  map: null
};

OlTriggerLayer.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object
};

OlTriggerLayer.contextTypes = {
  map: PropTypes.object
};

export default OlTriggerLayer;
