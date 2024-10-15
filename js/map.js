function MapLayer() {

    var disabled = false;
    var container = new PIXI.Container();

    function map() { };

    map.setDisabled = function (value) {
        disabled = d;
        // container.style("display", disabled ? "none" : "block");
    }

    // const path = d3.geoPath(null, context);

    map.init = function (_mapData) {
        // 设置地图的缩放比例和偏移
        const scale = 1; // 调整比例以适应屏幕
        // const offsetX = app.screen.width / 2;
        const offsetX = 600;
        // const offsetY = app.screen.height / 2;
        const offsetY = 300;

        // 解析GeoJSON中的几何数据
        _mapData.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const type = feature.geometry.type;
            let graphics = new PIXI.Graphics();
            // 处理多边形和线
            if (type === 'Polygon' || type === 'MultiPolygon') {
                this.drawPolygon(graphics, coordinates, scale, offsetX, offsetY);
                container.addChild(graphics);
            }
        });
        return container;
    };

    map.drawPolygon = function (graphics, coordinates, scale, offsetX, offsetY) {
        coordinates.forEach(polygon => {
            polygon.forEach((ring, index) => {
                ring.forEach((point, idx) => {
                    const x = point[0] * scale + offsetX;
                    const y = -point[1] * scale + offsetY;
                    if (idx === 0) {
                        graphics.moveTo(x, y);
                    } else {
                        graphics.lineTo(x, y);
                    }
                });
                graphics.closePath();
            });

            // 设置绘制样式
            graphics.lineStyle(1, 0x000000);
            graphics.beginFill(0x66CCFF, 0.5);
            graphics.endFill();
        });
        return graphics;
    }

    return map;
}