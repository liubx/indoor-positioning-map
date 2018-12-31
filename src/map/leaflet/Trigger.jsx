/* global window XMLSerializer */
/* eslint no-undef: "error" */
import { Component } from 'react';
import Rx from 'rxjs/Rx';
import PropTypes from 'prop-types';
import { BASE_URL } from '../constant';
import * as L from 'leaflet';
import 'proj4leaflet';
import 'leaflet-wfst';
import * as leafletPip from '@mapbox/leaflet-pip';
import { unproject } from './util';

class LlTriggerLayer extends Component {
  componentDidMount() {
    this.layer = L.featureGroup().addTo(this.context.map);
    this.loadTrigger(this.props.map);
    Rx.Observable.fromEvent(this.layer, 'click')
      .do((feature) => console.log(feature.layer.feature.properties.name))
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
      .do(() => this.layer.clearLayers())
      .filter(
        (map) =>
          map !== null &&
          map !== undefined &&
          map.triggerLayerId !== null &&
          map.triggerLayerId !== undefined
      )
      .map((map) => {
        let query = L.XmlUtil.createElementNS('GetFeature', {
          service: 'WFS',
          version: '1.1.0',
          outputFormat: 'application/json'
        });
        query.appendChild(
          L.XmlUtil.createElementNS('Query', {
            typeName: map.triggerLayerId,
            srsName: 'EPSG:3857'
          })
        );
        return query;
      })
      .flatMap((query) =>
        Rx.Observable.ajax({
          url: `${BASE_URL}:9010/geoserver/${
            map.triggerLayerId.split(':')[0]
          }/wfs`,
          method: 'POST',
          body: L.XmlUtil.serializeXmlDocumentString(query),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
      .filter((e) => e.status === 200)
      .map((e) => e.response)
      .do((json) =>
        L.Proj.geoJson(json, {
          style: {
            color: 'transparent'
          }
        }).addTo(this.layer)
      )
      .subscribe();
  }

  checkPosition(position) {
    Rx.Observable.of(position)
      .filter(
        () =>
          this.layer.getLayers() !== undefined &&
          this.layer !== null &&
          this.layer.getLayers().length > 0
      )
      .map((position) =>
        leafletPip.pointInLayer(
          unproject(position.longitude, position.latitude),
          this.layer.getLayers()[0]
        )
      )
      .flatMap((data) => data)
      .do((feature) => console.log(feature.feature.properties.name))
      .subscribe();
  }

  render() {
    return false;
  }
}

LlTriggerLayer.defaultProps = {
  position: null,
  map: null
};

LlTriggerLayer.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object
};

LlTriggerLayer.contextTypes = {
  map: PropTypes.object
};

export default LlTriggerLayer;
