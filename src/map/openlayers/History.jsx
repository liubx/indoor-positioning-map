/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import Rx from 'rxjs/Rx';
import PropTypes from 'prop-types';
import { BASE_URL } from '../constant';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

class OlHistoryLayer extends Component {
  componentDidMount() {
    this.layer = new TileLayer();
    this.layer.setZIndex(0);
    this.context.map.addLayer(this.layer);
    this.loadHistory(this.props.history);
  }

  shouldComponentUpdate(newProps) {
    return (
      this.props.history === null ||
      this.props.history === undefined ||
      newProps.history !== this.props.history
    );
  }

  componentWillUpdate(newProps) {
    this.loadHistory(newProps.history);
  }

  loadHistory(history) {
    if (history === null || history === undefined) {
      this.layer.setSource(null);
      return;
    }
    Rx.Observable.of(history)
      .filter(
        (history) =>
          history !== null &&
          history !== undefined &&
          history.layerId !== null &&
          history.layerId !== undefined &&
          history.start_time !== null &&
          history.start_time !== undefined &&
          history.end_time !== null &&
          history.end_time !== undefined &&
          history.floor !== null &&
          history.floor !== undefined
      )
      .do((history) => {
        this.layer.setSource(
          new TileWMS({
            url: `${BASE_URL}:9010/geoserver/${
              history.layerId.split(':')[0]
            }/wms`,
            params: {
              FORMAT: 'image/png',
              VERSION: '1.1.1',
              STYLES: '',
              LAYERS: history.layerId,
              VIEWPARAMS: `distance:0.1;${
                history.floor ? 'floor:' + history.floor + ';' : ''
              }${
                history.start_time ? 'start:' + history.start_time + ';' : ''
              }${history.end_time ? 'end:' + history.end_time + ';' : ''}${
                history.userId ? 'user:' + history.userId + ';' : ''
              }`
            },
            serverType: 'geoserver',
            singleTile: true,
            ratio: 1
          })
        );
      })
      .subscribe();
  }

  render() {
    return false;
  }
}

OlHistoryLayer.defaultProps = {
  history: null
};

OlHistoryLayer.propTypes = {
  history: PropTypes.object
};

OlHistoryLayer.contextTypes = {
  map: PropTypes.object
};

export default OlHistoryLayer;
