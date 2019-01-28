# indoor-positioning-map

> React component to show custom indoor map with openlayers or leaflet

[![NPM](https://img.shields.io/npm/v/indoor-positioning-map.svg)](https://www.npmjs.com/package/indoor-positioning-map) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save indoor-positioning-map
```

## Usage

```jsx
import React, { Component } from 'react'

import InddorMap from 'indoor-positioning-map'

class Example extends Component {
  render () {
    return (
      <InddorMap />
    )
  }
}
```


---

显示室内地图并定位到指定坐标

    window.loadMap(
        {
          id: xxx,
          address: xxx,
          latitude: xxx,
          longitude: xxx,
          floor: xxx,
          polygonLayerId: xxx,
          poiLayerId: xxx,
          routeLayerId: xxx,
          xmin: xxx,
          ymin: xxx,
          xmax: xxx,
          ymax: xxx
        }
    );

address：地图所在位置

latitude, longitude: 显示的地图中心坐标

floor: 显示的地图所在楼层

polygonLayerId: 室内地图对应图层id,

poiLayerId: POI对应图层id,

routeLayerId: 导航路径对应图层id,

xmin/ymin/xmax/ymax：地图范围边界

Example:

    window.loadMap(
        {
          floor: 1,
          id: 1,
          address: "北京市海淀xxx产业园",
          latitude: 3660825.8273595027,
          longitude: 13539962.969968095,
          polygonLayerId: "idc_center:idc_center_1_polygon",
          poiLayerId: "idc_center:idc_center_1_poi",
          routeLayerId: "idc_center:idc_center_1_route",
          xmin: 13539924,
          ymin: 3660807.25,
          xmax: 13540008,
          ymax: 3660845
        }
    );
    
---

显示定位点

    window.loadPosition(
        {
          floor: xxx,
          latitude: xxx,
          longitude: xxx,
          direction: xxx
        },
        follow
    );

floor: 位置所在楼层

latitude: 位置的经度

longitude: 位置的纬度

direction: 位置的方向

follow: 中心点是否跟随位置移动

Example:

    window.loadPosition(
        {
          floor: 1,
          latitude: 3660890,
          longitude: 13539971,
          direction: 90
        }，
        false
    );
    

    
---

在地图上标记多个蓝牙节点

    window.loadNodes([
        {
          floor: xxx,
          latitude: xxx,
          longitude: xxx
        }
    ]);

输入为数组，可以同时显示多个目标
latitude, longitude: 要显示目标的坐标

floor: 所在楼层

Example:

    window.loadNodes([
        {
          floor: 1,
          latitude: 12969332.19871,
          longitude: 4838049.98712
        }
    ]);


    
---

在地图上标记多个定位灯

    window.loadLamps([
        {
            floor:xxx,
            latitude: xxx,
            longitude: xxx
        }
    ]);
    
输入为数组，可以同时显示多个目标
latitude, longitude: 要显示目标的坐标

floor: 所在楼层

Example:

    window.loadLamps([
        {
            floor:1,
            latitude: 12969332.23871,
            longitude: 4838049.78712
        }
    ]);

    
---

在地图上标记多个护士

    window.loadNurses([
        {
          tag: {
             floor:xxx,
             latitude: xxx,
             longitude: xxx
          }
        }
    ]);
    
输入为数组，可以同时显示多个目标
latitude, longitude: 要显示目标的坐标

floor: 所在楼层

Example:

    window.loadNurses([
        {
          tag: {
             floor:1,
             latitude: 12969332.20871,
             longitude: 4838049.68712
          }
        }
    ]);

    
---

在地图上标记多个老人

    window.loadSeniors([
        {
          tag: {
             floor:xxx,
             latitude: xxx, 
             longitude: xxx
          }
        }
    ]);
    
输入为数组，可以同时显示多个目标
latitude, longitude: 要显示目标的坐标

floor: 所在楼层

Example:

    window.loadSeniors([
        {
          tag: {
             floor:1,
             latitude: 12969332.21871, 
             longitude: 4838049.68712
          }
        }
    ]);
---
在地图上标记多个运维人员

    window.loadSupporters([
        {
          floor:xxx,
          latitude: xxx, 
          longitude: xxx
        }
    ]);
    
输入为数组，可以同时显示多个目标
latitude, longitude: 要显示目标的坐标

floor: 所在楼层

Example:

    window.loadSupporters([
        {
            floor:1,
            latitude: 12969332.23871,
            longitude: 4838049.78712
        }
    ]);
---
在地图上标记多个用户

    window.loadUsers([
        {
          floor:xxx,
          latitude: xxx, 
          longitude: xxx
        }
    ]);
    
输入为数组，可以同时显示多个目标
latitude, longitude: 要显示目标的坐标

floor: 所在楼层

Example:

    window.loadUsers([
        {
            floor:1,
            latitude: 12969332.23871,
            longitude: 4838049.78712
        }
    ]);
---

地图导航

    window.loadRoutes(
        {
          source_floor: xxx,
          source_longitude: xxx,
          source_latitude: xxx,
          target_floor: xxx,
          target_longitude: xxx,
          target_latitude: xxx
        }
    );

source_floor: 起点所在楼层

source_longitude: 起点的经度

source_latitude: 起点的纬度

source_floor: 终点所在楼层

source_longitude: 终点的经度

source_latitude: 终点的纬度

Example:

    window.loadRoutes(
        {
          source_floor: 1,
          source_longitude: 13539937.198286774,
          source_latitude: 3660896.772479681,
          target_floor: 1,
          target_longitude: 13539952.147962471,
          target_latitude: 3660897.033446588
        }
    );

    
---

地图热图

    window.loadHeatmap(
        {
          layerId: xxx,
          start_time: xxx,
          end_time: xxx
        }
    );

layerId: 热图的对应id

start_time: 起始时间

end_time: 结束时间

Example:

    window.loadHeatmap(
        {
          layerId: 'idc_center:position_history_cluster',
          start_time: '2018-07-01',
          end_time: '2018-07-08'
        }
    );

    
---

地图操作

使用 Openlayers 地图库
    
    window.loadOpenlayers()

使用 Leaflet 地图库
    
    window.loadLeaflet()

旋转(横竖切换)
    
    window.rotate()

视图移动到当前位置
    
    window.center()

根据室内地图的bounds移动缩放视图

    window.bounds()
    
放大/缩小地图
    
    window.zoomIn()
    window.zoomOut()

显示/隐藏兴趣点

    window.togglePoi()
    
---

Test Case

    window.loadMap(
            {
              floor: 1,
              id: 1,
              address: "北京市海淀区xx产业园",
              latitude: 3660825.8273595027,
              longitude: 13539962.969968095,
              polygonLayerId: "idc_center:idc_center_1_polygon",
              poiLayerId: "idc_center:idc_center_1_poi",
              routeLayerId: "idc_center:idc_center_1_route",
              xmin: 13539924,
              ymin: 3660807.25,
              xmax: 13540008,
              ymax: 3660845
            }
        );
        
    window.loadLamps([
        { 
          floor: 1,
          longitude: 13539967.07087664, 
          latitude: 3660836.9370935624 
        }
    ]);
    
    window.loadNurses([
      {
        tag: {
          floor: 2,
          longitude: 13539985.684608502,
          latitude: 3660824.5976846027
        }
      }
    ]);
    
    window.loadPosition(
        {
          floor: 1,
          longitude: 13539998.834277373,
          latitude: 3660829.33177226,
          direction: 90
        }
    );
    
    window.loadRoutes(
        {
          source_floor: 1,
          source_longitude: 13539985.684608502,
          source_latitude: 3660824.5976846027,
          target_floor: 2,
          target_longitude: 13539998.6583919,
          target_latitude: 3660842.417996282
        }
    );


## License

MIT © [liubx](https://github.com/liubx)
