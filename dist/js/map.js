function MapLayer() {
    // var outerMargin = { //same as canvas
    //     top: 20,
    //     bottom: 50,
    //     left: 50,
    //     right: 50,
    // }
    var margin = {
        top: 0,
        bottom: 0,
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
    var fitExtent = [[0,0], [800, 600]]; // by default

    var projection; // preojection method
    var pathGenerator; // d3 geoPath method

    function map() { };

    function getDimension(_size){
        return Math.min(_size[0], _size[1]) * 0.8;
    }

    map.init = function (_mapData, _size) {
        // 设置stage的大小 和地图的大小
        mapData = _mapData;
        // console.log(mapData)
        let dim = getDimension(_size);
        var marginBottom = -_size[1] / 2.5;
        // console.log(marginBottom)
        var center = [_size[0] / 2 + margin.left, marginBottom]
        dx = (_size[0] / 2 + margin.left - _size[0]/2);
        // dx = 0
        dy =  _size[1]/2 + marginBottom;
        // dy = 0

        fitExtent = [[dx, dy], [dx + _size[0], dy + _size[1]]];
        // console.log(fitExtent)
        // projection = d3.geoMercator().fitExtent(fitExtent, _mapData);
        // pathGenerator = d3.geoPath(projection, mapPath);    
        // pathGenerator = d3.geoPath(projection, mapPath);  
    };

    // map._projection = function(x , y){
    //     let _x = x, _y = y;
    //     if(x <=1 && y <= 1){ // input relative position
    //         _x = fitExtent[0][0] + (fitExtent[1][0]- fitExtent[0][0]) * x;
    //         _y = fitExtent[0][1] + (fitExtent[1][1] - fitExtent[0][1]) * y;
    //     }
    //     // console.log(projection())
    //     return projection([_x, _y]);
    // };


    map.container = function(){
        // iterate data, for each city, draw line and city name
        // for (let i = 0; i < mapData.features.length; i++) {
        //     const d = mapData.features[i];
        //     addText(d.properties.name, projection(d.properties[textLocation]))
        //     addMapLine(d)
        // }

        stage.addChild(mapPath);
        // stage.addChild(mapTextContainer);
        
        return stage;
    }

    var addText = function(t, t_pos){
        let _t = new PIXI.Text(t, textSyle)
        _t.x = t_pos[0];
        _t.y = t_pos[1];
        _t.anchor.set(0.5);
        _t.resolution = 7;
        mapTextContainer.addChild(_t);
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