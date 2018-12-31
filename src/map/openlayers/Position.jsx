import { Component } from 'react';
import Rx from 'rxjs/Rx';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import PropTypes from 'prop-types';
import { createPositionLabel } from './util';

class OlPositionLayer extends Component {
  componentDidMount() {
    this.source = new VectorSource();
    const layer = new VectorLayer({
      source: this.source
    });
    layer.setZIndex(2);
    this.context.map.addLayer(layer);
    this.loadPosition(this.props.position);
  }

  shouldComponentUpdate(newProps) {
    if (this.props.position === null || this.props.position === undefined) {
      return true;
    }
    return newProps.position !== this.props.position;
  }

  componentWillUpdate(newProps) {
    this.loadPosition(newProps.position);
  }

  loadPosition(position) {
    Rx.Observable.of(position)
      .do(() => this.source.clear())
      .filter((position) => position !== null && position !== undefined)
      .map((position) => createPositionLabel(position))
      .do((position) => this.source.addFeature(position))
      .subscribe();
  }

  render() {
    return false;
  }
}

OlPositionLayer.defaultProps = {
  position: null
};

OlPositionLayer.propTypes = {
  position: PropTypes.object
};

OlPositionLayer.contextTypes = {
  map: PropTypes.object
};

export default OlPositionLayer;
