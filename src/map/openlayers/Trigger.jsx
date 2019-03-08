/* global window XMLSerializer */
/* eslint no-undef: "error" */
import { Component } from 'react';
import { of, fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { tap, filter, map, flatMap } from 'rxjs/operators';
import GeoJSON from 'ol/format/GeoJSON';
import WFS from 'ol/format/WFS';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import PropTypes from 'prop-types';
import { BASE_MAP_URL } from '../constant';

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
    this.context.map.addLayer(layer);
    this.loadTrigger(this.props.map);
    fromEvent(this.context.map, 'singleclick')
      .pipe(
        filter((e) => !e.dragging),
        map((e) => this.context.map.getPixelFromCoordinate(e.coordinate)),
        map((pixel) =>
          this.context.map.forEachFeatureAtPixel(pixel, (feature) => feature)
        ),
        filter(
          (feature) =>
            feature !== undefined &&
            feature !== null &&
            feature.values_.name !== undefined
        ),
        tap((feature) => console.log(feature.values_.name))
      )
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

  loadTrigger(indoormap) {
    of(indoormap)
      .pipe(
        tap(() => this.source.clear()),
        filter(
          (indoormap) =>
            indoormap !== null &&
            indoormap !== undefined &&
            indoormap.triggerLayerId !== null &&
            indoormap.triggerLayerId !== undefined
        ),
        flatMap((indoormap) =>
          ajax({
            url: `${BASE_MAP_URL}/${
              indoormap.triggerLayerId.split(':')[0]
            }/wfs`,
            method: 'POST',
            body: new XMLSerializer().serializeToString(
              new WFS().writeGetFeature({
                srsName: 'EPSG:3857',
                featureTypes: [indoormap.triggerLayerId],
                outputFormat: 'application/json'
              })
            ),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        ),
        filter((e) => e.status === 200),
        map((e) => e.response),
        tap((json) => this.source.addFeatures(new GeoJSON().readFeatures(json)))
      )
      .subscribe();
  }

  checkPosition(position) {
    of(position)
      .pipe(
        map((position) => [position.longitude, position.latitude]),
        map((position) => this.context.map.getPixelFromCoordinate(position)),
        map((pixel) =>
          this.context.map.forEachFeatureAtPixel(pixel, (feature) => feature)
        ),
        filter((feature) => feature !== undefined && feature !== null),
        tap((feature) => console.log(feature.values_.name))
      )
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
