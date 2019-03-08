/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import { of } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import PropTypes from 'prop-types';
import { BASE_MAP_URL } from '../constant';
import ImageWMS from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';

class OlHeatmapLayer extends Component {
  componentDidMount() {
    this.layer = new ImageLayer();
    this.layer2 = new ImageLayer();
    this.layer.setZIndex(0);
    this.context.map.addLayer(this.layer);
    this.context.map.addLayer(this.layer2);
    this.loadHeatmap(this.props.heatmap);
  }

  shouldComponentUpdate(newProps) {
    return (
      this.props.heatmap === null ||
      this.props.heatmap === undefined ||
      newProps.heatmap !== this.props.heatmap
    );
  }

  componentWillUpdate(newProps) {
    this.loadHeatmap(newProps.heatmap);
  }

  loadHeatmap(heatmap) {
    if (heatmap === null || heatmap === undefined) {
      this.layer.setSource(null);
      return;
    }
    of(heatmap)
      .pipe(
        filter(
          (heatmap) =>
            heatmap !== null &&
            heatmap !== undefined &&
            heatmap.layerId !== null &&
            heatmap.layerId !== undefined &&
            heatmap.start_time !== null &&
            heatmap.start_time !== undefined &&
            heatmap.end_time !== null &&
            heatmap.end_time !== undefined &&
            heatmap.floor !== null &&
            heatmap.floor !== undefined
        ),
        tap((heatmap) => {
          this.layer.setSource(
            new ImageWMS({
              url: `${BASE_MAP_URL}/${heatmap.layerId.split(':')[0]}/wms`,
              params: {
                FORMAT: 'image/png',
                VERSION: '1.1.1',
                STYLES: '',
                LAYERS: heatmap.layerId,
                VIEWPARAMS: `distance:0.1;${
                  heatmap.floor ? 'floor:' + heatmap.floor + ';' : ''
                }${
                  heatmap.start_time ? 'start:' + heatmap.start_time + ';' : ''
                }${heatmap.end_time ? 'end:' + heatmap.end_time + ';' : ''}${
                  heatmap.userId ? 'user:' + heatmap.userId + ';' : ''
                }`
              },
              serverType: 'geoserver',
              singleTile: true,
              ratio: 1
            })
          );

          // this.layer2.setSource(
          //   new ImageWMS({
          //     url: `${BASE_URL}/geoserver/${
          //       heatmap.layerId.split(':')[0]
          //     }/wms`,
          //     params: {
          //       FORMAT: 'image/png',
          //       VERSION: '1.1.1',
          //       STYLES: 'point',
          //       LAYERS: heatmap.layerId,
          //       VIEWPARAMS: `start:${heatmap.start_time};end:${heatmap.end_time};`
          //     },
          //     serverType: 'geoserver',
          //     singleTile: true,
          //     ratio: 1
          //   })
          // );
        })
      )
      .subscribe();
  }

  render() {
    return false;
  }
}

OlHeatmapLayer.defaultProps = {
  heatmap: null
};

OlHeatmapLayer.propTypes = {
  heatmap: PropTypes.object
};

OlHeatmapLayer.contextTypes = {
  map: PropTypes.object
};

export default OlHeatmapLayer;
