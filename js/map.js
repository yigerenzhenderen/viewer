function MapLayer() {
    var margin = {
        top: 0.15,
        bottom: 0.05,
        left: 0,
        right: 0,
    }
    var disabled = false;
    var stage = new PIXI.Container();
    var mapPath = new PIXI.Graphics();
    var mapStyle = {
        lineWidth: 1,
        lineColor: 0x2D3B43,
    }
    var mapData;

    // text settings
    var mapTextContainer = new PIXI.Container();
    var textSyle = {
        fontSize: 14,
        lineHeight: 30,
        letterSpacing: 0,
        fill: 0x2D3B43,
        align: "center",
    }
    var textLocation = "centroid" // center || "centroid"

    // map node setting
    var mapNodeContainer = new PIXI.Container();

    // projection settings
    var projectMethod = ""
    var fitExtent = [[0,0], [1000, 800]]; // by default

    var projection; // preojection method
    var pathGenerator; // d3 geoPath method

    function map() { };

    map.init = function (_mapData, _size) {
        // 设置stage的大小 和地图的大小
        mapData = _mapData;
        fitExtent = [
                [_size[0] * margin.left, _size[1] * margin.top], 
                [_size[0] * (1 - margin.right), _size[1] * (1 - margin.bottom)]
        ];
        projection = d3.geoMercator().fitExtent(fitExtent, _mapData);
        pathGenerator = d3.geoPath(projection, mapPath);    
    };

    map.container = function(){
        // iterate data, for each city, draw line and city name
        for (let i = 0; i < mapData.features.length; i++) {
            const d = mapData.features[i];
            addText(d.properties.name, projection(d.properties[textLocation]))
            addMapLine(d)
        }

        stage.addChild(mapPath);
        stage.addChild(mapTextContainer);
        
        return stage;
    }

    var addText = function(t, t_pos){
        let _ = new PIXI.Text(t, textSyle)
        _.x = t_pos[0];
        _.y = t_pos[1];
        _.anchor.set(0.5);
        _.resolution = 7;
        mapTextContainer.addChild(_);
    }

    var addMapLine = (_d) => {
        mapPath.lineStyle(mapStyle.lineWidth,  mapStyle.lineColor, 1);
        mapPath.resolution = 4;
        mapPath.antialias = true;
        mapPath.autoDensity = true,
        pathGenerator(_d)
    }

    map.setDisabled = function (bool, outerStage) {
        disabled = bool;
        outerStage.removeChildren(stage)
    }

    return map;
}