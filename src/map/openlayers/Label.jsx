import { Component } from 'react';
import Rx from 'rxjs/Rx';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import PropTypes from 'prop-types';

class OlLabelLayer extends Component {
  componentDidMount() {
    this.source = new VectorSource();
    const layer = new VectorLayer({
      source: this.source
    });
    layer.setZIndex(1);
    this.context.map.addLayer(layer);
    this.loadData(this.props.data);
  }

  shouldComponentUpdate(newProps) {
    if (this.props.data === null || this.props.data === undefined) {
      return true;
    }
    if (newProps.data === null) {
      return false;
    }
    if (newProps.data.length !== this.props.data.length) {
      return true;
    }
    return !newProps.data.every((v, i) => v === this.props.data[i]);
  }

  componentWillUpdate(newProps) {
    this.loadData(newProps.data);
  }

  loadData(data) {
    Rx.Observable.of(data)
      .do(() => this.source.clear())
      .filter((data) => data !== null && data !== undefined)
      .flatMap((data) => data)
      .map((data) => this.props.createLabel(data))
      .filter((data) => data !== null)
      .toArray()
      .do((feature) => this.source.addFeatures(feature))
      .subscribe();
  }

  render() {
    return false;
  }
}

OlLabelLayer.defaultProps = {
  data: null
};

OlLabelLayer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  createLabel: PropTypes.func.isRequired
};

OlLabelLayer.contextTypes = {
  map: PropTypes.object
};

export default OlLabelLayer;
