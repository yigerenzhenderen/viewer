// christopher pietsch
// cpietsch@gmail.com
// 2015-2018
import fetch from "./fetch";

const basicTextStyle = new PIXI.TextStyle({
  // fontFamily: 'Lato',        // 字体
  fontSize: 48,               // 初始文字大小
  fill: '#E5E5E5',            // 文字颜色 (白色)
  fontWeight: 'bold',
  stroke: '#000000',          // 文字描边颜色
  wordWrap: true,             // 自动换行
  wordWrapWidth: 440,         // 换行宽度
  align: 'center',            // 多行文本对齐方式（在wordWrapWidth内）
  resolution: window.devicePixelRatio || 1, // 另一种设置分辨率的方式，确保与渲染器一致
});


const textAnchorRight = [
  "益阳",
  "湘潭",
  "衡阳",
  "长沙",
  "郴州"
]

export function Canvas() {
  var margin = {
    top: 20,
    right: 50,
    bottom: 50,
    left: 50,
  };
  var minHeight = 400;
  var width = window.innerWidth - margin.left - margin.right;
  var widthOuter = window.innerWidth;
  var height = window.innerHeight < minHeight ? minHeight : window.innerHeight;


  var map = new MapLayer();

  var scale1 = 1;
  var scale2 = 1;
  var scale3 = 1;
  var allData = [];

  var translate = [0, 0];
  var scale = 1;
  var timeDomain = [];
  var loadImagesCue = [];


  var zoomCenter = [width / 2, height / 2];

  var x = d3.scaleBand()
    .range([margin.left, width + margin.left]);

  var Quadtree = d3.quadtree()
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    });

  var quadtree;

  var maxZoomLevel = utils.isMobile() ? 5000 : 2500;

  var zoom = d3.zoom()
    .scaleExtent([1, maxZoomLevel])
    .extent([[0, 0], [width, height]])
    .on("start", zoomstart)
    .on("zoom", (event) => zoomed(event.transform, event.sourceEvent))
    .on("end", zoomend);

  var canvas;
  var config;
  var container;
  var overlay;
  var entries;
  var years;
  var data;
  var mapBboxData;
  var rangeBand = 0;
  var rangeBandImage = 0;
  var imageSize = 256;
  var imageSize2 = 1024;
  var imageSize3 = 4000;
  var collumns = 4;
  var renderer, stage;

  var svgscale, voronoi;

  var selectedImageDistance = 0;
  var selectedImage = null;

  var drag = false;
  var sleep = false;

  var stagePadding = 40;
  var imgPadding;

  var bottomPadding = 70;
  var extent = [0, 0];
  var bottomZooming = false;

  var touchstart = 0;
  var vizContainer;
  var spriteClick = false;

  var state = {
    lastZoomed: 0,
    zoomingToImage: false,
    mode: "time",// time, similarity, location
    init: false,
  };

  var zoomedToImage = false;
  var zoomedToImageScale = 117;
  var zoomBarrier = 2;

  var startTranslate = [0, 0];
  var startScale = 0;
  var cursorCutoff = 1;
  var zooming = false;
  var timeline, timelineData;
  var root, imageStage, stage, stage1, stage2, stage3, stage4, stage5, mapContainer;
  var timelineHover = false;
  var tsneIndex = {};
  var tsneScale = {}
  var center;

  function canvas() { }

  canvas.rangeBand = function () {
    return rangeBand;
  };
  canvas.width = function () {
    return width;
  };
  canvas.height = function () {
    return height;
  };
  canvas.rangeBandImage = function () {
    return rangeBandImage;
  };
  canvas.zoom = zoom;
  canvas.selectedImage = function () {
    return selectedImage;
  };
  canvas.x = x;

  canvas.resize = function () {
    if (!state.init) return;
    width = window.innerWidth - margin.left - margin.right;
    height = window.innerHeight < minHeight ? minHeight : window.innerHeight;
    widthOuter = window.innerWidth;
    renderer.resize(width + margin.left + margin.right, height);
    canvas.makeScales();
    canvas.project();
  };

  canvas.makeScales = function () {
    x.range([margin.left, width + margin.left]).padding(0.1);
    rangeBand = x.bandwidth();
    rangeBandImage = x.bandwidth() / collumns;

    imgPadding = rangeBand / collumns / 2;

    scale1 = imageSize / (x.bandwidth() / collumns);
    scale2 = imageSize2 / (x.bandwidth() / collumns);
    scale3 = imageSize3 / (x.bandwidth() / collumns);

    stage3.scale.x = 1 / scale1;
    stage3.scale.y = 1 / scale1;
    stage3.y = height;

    stage4.scale.x = 1 / scale2;
    stage4.scale.y = 1 / scale2;
    stage4.y = height;

    stage5.scale.x = 1 / scale3;
    stage5.scale.y = 1 / scale3;
    stage5.y = height;

    timeline.rescale(scale1);

    cursorCutoff = (1 / scale1) * imageSize * 0.48;
    zoomedToImageScale =
      (0.8 / (x.bandwidth() / collumns / width)) *
      (state.mode == "time" ? 1 : 0.5);
  };

  canvas.init = function (_data, _timeline, _abstract_map, _config) {
    data = _data;
    config = _config;
    mapBboxData = _abstract_map;
    // map.init(_map, [width, height])
    container = d3.select(".page")
      .select(".viz")
      .style("width", `${width}px`)
      .style("height", `${height}px`);

    detailStore.structure = config.detail.structure;

    collumns = config.projection.columns;
    imageSize = config.loader.textures.medium.size;
    imageSize2 = config.loader.textures.detail.size;

    if (config.loader.textures.big) {
      imageSize3 = config.loader.textures.big.size;
    }

    PIXI.settings.SCALE_MODE = 1;
    PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(
      PIXI.settings.SPRITE_MAX_TEXTURES,
      16
    );
    var renderOptions = {
      resolution: window.devicePixelRatio || 1,
      antialiasing: true,
      width: width + margin.left + margin.right,
      height: height,
      autoDensity: true,
      antialias: true
    };
    renderer = new PIXI.Renderer(renderOptions);
    renderer.backgroundColor = parseInt(
      config.style.canvasBackground.substring(1),
      16
    );
    window.renderer = renderer;
    globalThis.__PIXI_RENDERER__ = renderer;
    var renderElem = d3.select(container.node().appendChild(renderer.view));


    root = new PIXI.Container();
    imageStage = new PIXI.Container(); // 图片stage
    stage3 = new PIXI.Container(); // sprites
    stage4 = new PIXI.Container(); // middleImage
    stage5 = new PIXI.Container(); // largeImage
    mapContainer = stage3

    imageStage.addChild(stage3);
    imageStage.addChild(stage4);
    imageStage.addChild(stage5);
    // imageStage.addChild(mapContainer);

    root.addChild(imageStage);
    // root.addChild(mapContainer);

    globalThis.__PIXI_STAGE__ = root;
    _timeline.forEach(function (d) {
      d.type = "timeline";
    });

    // old var canvasDomain = d3.groups(_data.concat(_timeline), d => d.year).sort((a, b) => a[0] - b[0]).map(d => d[0])
    var canvasDomain = _timeline.sort((a, b) => a.orderNum - b.orderNum).map(d => d.year)
    timeDomain = canvasDomain.map(function (d) {
      return {
        key: d,
        values: _timeline.filter(function (e) {
          return d == e.year;
        }),
      };
    });

    timeline = Timeline(canvas);
    timeline.init(timeDomain);
    x.domain(canvasDomain); //设置时间轴定义域为time domain, (x为d3.scaleBand)


    // add preview pics stage3: 所有的preview pics
    data.forEach(function (d, i) {
      var sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      sprite.anchor.x = 0.5;
      sprite.anchor.y = 0.5;

      sprite.scale.x = d.scaleFactor;
      sprite.scale.y = d.scaleFactor;

      sprite._data = d;
      d.sprite = sprite;
      stage3.addChild(sprite);
    });

    // add map bounding boxes
    mapBboxData.forEach(function (d, i) {
      // const scaleFactor = 0.9
      var boundingBox = new PIXI.Graphics();
      // console.log(d)
      boundingBox.lineStyle(1, 0x000000, 1); // Set border width, color, and alpha
      boundingBox.drawRect(0, 0, d.width, d.height); // Draw rectangle outline
      boundingBox.position.set(d.x - d.width / 2, d.y - d.height / 2)
      boundingBox.endFill(); // No fill
      boundingBox.alpha = 0;
      boundingBox.visible = false;

      boundingBox._data = d;
      d.boundingBox = boundingBox;
      mapContainer.addChild(boundingBox);

      boundingBox.alpha1 = 0; // 设置默认透明度并保存 用于transition
      const provinceName = new PIXI.Text(d.name, basicTextStyle);
      if (textAnchorRight.includes(d.name)) {
        provinceName.anchor.set(1, 1);
      } else {
        provinceName.anchor.set(0, 1);
      }
      provinceName.visible = false;
      d.text = provinceName
      mapContainer.addChild(provinceName)
    });

    vizContainer = d3.select(".viz");

    vizContainer.call(zoom);

    vizContainer
      .on("mousemove", mousemove)
      .on("dblclick.zoom", null)
      .on("touchstart", function (event, d) {
        mousemove(event, d);
        touchstart = new Date() * 1;
      })
      .on("touchend", function (d) {
        var touchtime = new Date() * 1 - touchstart;
        if (touchtime > 250) return;
        if (selectedImageDistance > 15) return;
        if (selectedImage && !selectedImage.id) return;
        if (selectedImage && !selectedImage.active) return;
        if (drag) return;
        detailStore.imageId = selectedImage.id;
        zoomToImage(selectedImage, 1400 / Math.sqrt(Math.sqrt(scale)));
      })
      .on("click", function () {
        if (spriteClick) {
          spriteClick = false;
          return;
        }
        if (selectedImage && !selectedImage.id) {
          return
        };
        if (drag) return;
        if (selectedImageDistance > cursorCutoff) return;
        if (selectedImage && !selectedImage.active) return;
        if (timelineHover) return;
        if (Math.abs(zoomedToImageScale - scale) < 0.1) {
          canvas.resetZoom();
        } else {
          detailStore.imageId = selectedImage.id;
          zoomToImage(selectedImage, 1400 / Math.sqrt(Math.sqrt(scale)));
        }
      });

    // canvas.makeScales();
    // canvas.project();
    animate();
    state.init = true;
  };

  canvas.addTsneData = function (name, d, scale) {
    tsneIndex[name] = {};
    tsneScale[name] = scale;
    var clean = d.map(function (d) {
      return {
        id: d.id,
        x: parseFloat(d.x),
        y: parseFloat(d.y),
      };
    });
    var xExtent = d3.extent(clean, function (d) {
      return d.x;
    });
    var yExtent = d3.extent(clean, function (d) {
      return d.y;
    });

    var x = d3.scaleLinear().range([0, 1]).domain(xExtent);
    var y = d3.scaleLinear().range([0, 1]).domain(yExtent);

    d.forEach(function (d) {
      tsneIndex[name][d.id] = [x(d.x), y(d.y)];
    });
  };


  // 归一化城市bbox和城市内图像的坐标
  // 理论上城市bbox的范围要大于location.csv的范围，因此需要使用bbox计算比例尺，并用该比例尺计算location归一化结果
  // 这个函数接收所有城市bbox, 返回包围这些rects的最小bbox，该bbox的宽和高作为比例尺的xExtent和yExtent
  function _getOuterBbox(rects) {
    if (!rects.length) return null;

    // 计算第一个矩形的边界初始化最小最大值
    let minX = rects[0].x - rects[0].w / 2;
    let minY = rects[0].y - rects[0].h / 2;
    let maxX = rects[0].x + rects[0].w / 2;
    let maxY = rects[0].y + rects[0].h / 2;

    rects.forEach(rect => {
      let left = rect.x - rect.w / 2;
      let top = rect.y - rect.h / 2;
      let right = rect.x + rect.w / 2;
      let bottom = rect.y + rect.h / 2;

      if (left < minX) minX = left;
      if (top < minY) minY = top;
      if (right > maxX) maxX = right;
      if (bottom > maxY) maxY = bottom;
    });

    return {
      minX: minX,
      minY: minY,
      maxX: maxX,
      maxY: maxY
    }
  }

  canvas.addLocationData = function (name, location, scale) {
    tsneIndex[name] = {};
    tsneScale[name] = scale;
    tsneIndex["bbox"] = {};
    tsneScale["bbox"] = scale;
    // 缩略图未归一化坐标 (x,y为图像中心)
    var cleanLocation = location.map(function (d) {
      return {
        id: d.id,
        x: parseFloat(d.x),
        y: parseFloat(d.y),
      };
    });
    // 城市bbox未归一化坐标 (x,y为矩形中心)
    var cleanCityBbox = mapBboxData.map(function (d) {
      return {
        id: d.name,
        x: parseFloat(d.x),
        y: parseFloat(d.y),
        w: parseFloat(d.width),
        h: parseFloat(d.height),
      };
    });

    const { minX: minX, minY: minY, maxX: maxX, maxY: maxY } = _getOuterBbox(cleanCityBbox)
    // console.log({ minX: minX, minY: minY, maxX: maxX, maxY: maxY })

    var x = d3.scaleLinear().range([0, 1]).domain([minX, maxX]);
    var y = d3.scaleLinear().range([0, 1]).domain([minY, maxY]);

    // tsneIndex.location保存缩略图投影位置
    cleanLocation.forEach(function (d) {
      tsneIndex[name][d.id] = [x(d.x), y(d.y)];
    });
    // tsneIndex.bbox保存城市bbox投影坐标
    cleanCityBbox.forEach(function (d) {
      // console.log([x(d.x), y(d.y), x(d.x + d.w / 2) - x(d.x - d.w / 2), y(d.y + d.h / 2) - y(d.y - d.h / 2)])
      tsneIndex["bbox"][d.id] = [x(d.x - d.w / 2), y(d.y - d.w / 2), x(d.x + d.w / 2) - x(d.x - d.w / 2), y(d.y + d.h / 2) - y(d.y - d.h / 2)];
      // tsneIndex["bbox"][d.id] = [x(d.x), y(d.y), x(d.w), y(d.h)];
    });

  };

  function mousemove(event, d) {
    if (timelineHover) return;
    var mouse = d3.pointer(event, vizContainer.node());
    var p = toScreenPoint(mouse);

    var found = quadtree.find(p[0] - imgPadding, p[1] - imgPadding, cursorCutoff)
    selectedImageDistance = found !== undefined ? 0 : 1000;


    if (found && !zoomedToImage) {
      center = [
        (found.x + imgPadding) * scale + translate[0],
        (height + found.y + imgPadding) * scale + translate[1],
      ];
      zoomCenter = center;
      selectedImage = found;
      detailStore.imageId = selectedImage.id;
    }

    container.style("cursor", function () {
      return selectedImageDistance < cursorCutoff && selectedImage.active
        ? "pointer"
        : "default";
    });
  }

  function stackLayout(data, invert) {
    var years = d3.groups(data, d => d.year)

    years.forEach(function (year) {
      var startX = x(year[0]);
      var total = year[1].length;
      year[1].sort(function (a, b) {
        return b.keywords.length - a.keywords.length;
      });

      year[1].forEach(function (d, i) {
        var row = Math.floor(i / collumns) + 2;
        d.ii = i;

        d.x = startX + (i % collumns) * (rangeBand / collumns);
        d.y = (invert ? 1 : -1) * (row * (rangeBand / collumns));

        d.x1 = d.x * scale1 + imageSize / 2;
        d.y1 = d.y * scale1 + imageSize / 2;

        if (d.sprite.position.x == 0) {
          d.sprite.position.x = d.x1;
          d.sprite.position.y = d.y1;
        }

        if (d.sprite2) {
          d.sprite2.position.x = d.x * scale2 + imageSize2 / 2;
          d.sprite2.position.y = d.y * scale2 + imageSize2 / 2;
        }

        d.order = (invert ? 1 : 1) * (total - i);
      });
    });
  }

  canvas.distance = function (a, b) {
    return Math.sqrt(
      (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])
    );
  };

  function toScreenPoint(p) {
    var p2 = [0, 0];
    p2[0] = p[0] / scale - translate[0] / scale;
    p2[1] = p[1] / scale - height - translate[1] / scale;

    return p2;
  }

  var speed = 0.05;

  function imageAnimation() {
    var sleep = true;

    data.forEach(function (d, i) {
      var diff;
      diff = d.x1 - d.sprite.position.x;
      if (Math.abs(diff) > 0.1) {
        d.sprite.position.x += diff * speed;
        sleep = false;
      }

      diff = d.y1 - d.sprite.position.y;
      if (Math.abs(diff) > 0.1) {
        d.sprite.position.y += diff * speed;
        sleep = false;
      }

      diff = d.alpha - d.sprite.alpha;
      if (Math.abs(diff) > 0.01) {
        d.sprite.alpha += diff * 0.2;
        sleep = false;
      }

      d.sprite.visible = d.sprite.alpha > 0.1;

      if (d.sprite2) {
        diff = d.alpha2 - d.sprite2.alpha;
        if (Math.abs(diff) > 0.01) {
          d.sprite2.alpha += diff * 0.2;
          sleep = false;
        }

        d.sprite2.visible = d.sprite2.alpha > 0.1;
        //else d.sprite2.visible = d.visible;
      }
    });
    // if(state.mode === 'location'){
    mapBboxData.forEach(function(d,i){
      const alpha_diff = d.alpha1 - d.boundingBox.alpha;
      if (Math.abs(alpha_diff) > 0.01) {
        d.boundingBox.alpha += alpha_diff * speed;
        sleep = false;
      }
      d.boundingBox.visible = d.boundingBox.alpha > 0.99;
      d.text.visible = d.boundingBox.alpha > 0.99;
    })
    // }
    return sleep;
  }



  canvas.wakeup = function () {
    sleep = false;
  };

  canvas.setMode = function (mode) {
    state.mode = mode;
    timeline.setDisabled(mode !== "time"); // 不为timeline情况下就不显示时间轴
    canvas.makeScales();
    canvas.project();
  };

  canvas.getMode = function () {
    return state.mode;
  };

  function animate(time) {
    requestAnimationFrame(animate);
    loadImages();
    if (sleep) return;
    sleep = imageAnimation();
    renderer.render(root);
  }

  // function zoomToYear(d) {
  //   var xYear = x(d.year);
  //   var scale = 1 / ((rangeBand * 4) / width);
  //   var padding = rangeBand * 1.5;
  //   var translateNow = [-scale * (xYear - padding), -scale * (height + d.y)];

  //   vizContainer
  //     .call(zoom.translate(translate).event)
  //     .transition()
  //     .duration(2000)
  //     .call(zoom.scale(scale).translate(translateNow).event);
  // }

  function zoomToImage(d, duration) {
    state.zoomingToImage = true;
    loadMiddleImage(d);

    // console.log(root.getGlobalPosition(), thisSprite.getGlobalPosition());
    // d3.select(".tagcloud").classed("hide", true);
    // d3.select(".button").classed("hide", true);

    var padding = rangeBandImage / 2;
    var scale = 1 / (rangeBandImage / (width * 0.8));
    var translateNow = [
      -scale * (d.x - padding) - (width * 0.8) / 2 + margin.left,
      -scale * (height + d.y + padding) - margin.top + height / 2,
    ];

    zoomedToImageScale = scale;

    setTimeout(function () {
      hideTheRest(d);
    }, duration / 2);

    if (translateNow[0] == translate[0] && translateNow[1] == translate[1]) {
      return
    }

    vizContainer
      .transition()
      .duration(duration)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]))
      .call(zoom.transform, d3.zoomIdentity.translate(translateNow[0], translateNow[1]).scale(scale))
      .on("end", function () {
        zoomedToImage = true;
        selectedImage = d;
        hideTheRest(d);
        showDetail(d);
        loadBigImage(d, "click");
        changeMani(d.sprite)

        state.zoomingToImage = false;
      });
  }


  function changeMani(sprite) {
    const pos = sprite.getGlobalPosition();
    const box = sprite.getBounds();
    detailStore.x = pos.x - box.width / 2;
    detailStore.y = pos.y + box.height / 2;
  }

  function showDetail(d) {
    var detailContainer = d3.select(".sidebar");

    detailContainer.select(".outer").node().scrollTop = 0;


    detailStore.hide = false;

    detailStore.sneak = utils.isMobile()
    // detailContainer.classed("hide", false).classed("sneak", utils.isMobile());

    // needs to be done better
    var detailData = {};
    for (let field in selectedImage) {
      if (field[0] === "_") detailData[field] = selectedImage[field];
    }
    detailData["_id"] = selectedImage.id;
    detailData["_keywords"] = selectedImage.keywords;
    detailData["_year"] = selectedImage.year;
    detailData["_imagenum"] = selectedImage.imagenum || 1;

    detailStore.item = detailData; //item是显示右侧信息的
    detailStore.id = d.id;
    detailStore.page = d.page;
  }

  canvas.changePage = function (id, page) {
    console.log("changePage", id, page, selectedImage);
    selectedImage.page = page;
    // detailVue.page = page;
    detailStore.page = page;
    clearBigImages();
    loadBigImage(selectedImage);
  };

  function hideTheRest(d) {
    data.forEach(function (d2) {
      if (d2.id !== d.id) {
        d2.alpha = 0;
        d2.alpha2 = 0;
      }
    });
  }

  function showAllImages() {
    data.forEach(function (d) {
      d.alpha = d.active ? 1 : 0.2;
      d.alpha2 = d.visible ? 1 : 0;
    });
  }

  function zoomed(transform, sourceEvent) {

    translate[0] = transform.x;
    translate[1] = transform.y;
    scale = transform.k;

    if (!startTranslate) startTranslate = translate;
    drag = startTranslate && translate !== startTranslate;
    // check borders
    var x1 = (-1 * translate[0]) / scale;
    var x2 = x1 + widthOuter / scale;

    if (sourceEvent != null) {
      if (x1 < 0) {
        translate[0] = 0;
      } else if (x2 > widthOuter) {
        translate[0] = (widthOuter * scale - widthOuter) * -1;
      }

      // vizContainer.call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]), zoomCenter)
      // zoom.transform(vizContainer, d3.zoomIdentity.translate(translate[0], translate[1]))
      x1 = (-1 * translate[0]) / scale;
      x2 = x1 + width / scale;

    }

    if (
      zoomedToImageScale != 0 &&
      scale > zoomedToImageScale * 0.9 &&
      !zoomedToImage &&
      selectedImage &&
      selectedImage.type == "image"
    ) {
      zoomedToImage = true;
      zoomCenter = []
      zoomedToImageScale = scale;
      hideTheRest(selectedImage);
      showDetail(selectedImage);
      // detailStore.maniShow = true;
    }

    if (zoomedToImage && zoomedToImageScale * 0.8 > scale) {
      // console.log("clear")
      zoomedToImage = false;
      state.lastZoomed = 0;
      showAllImages();
      clearBigImages();
      // detailStore.maniShow = false; // 隐藏mani icon
      // detailStore.editing = false; // 结束修改
      detailStore.finishEdit();
      changeMani(selectedImage.sprite)
      // d3.select(".sidebar").classed("hide", true);
      detailStore.hide = true; // 隐藏右侧detail
    }

    timeline.update(x1, x2, scale, translate, scale1);

    // toggle zoom overlays
    if (scale > zoomBarrier) {
      d3.select(".header").classed("hide", true);
      d3.select(".searchbar").classed("hide", true);
      d3.select(".infobar").classed("sneak", true);
    } else {
      d3.select(".header").classed("hide", false);
      d3.select(".searchbar").classed("hide", false);
    }

    root.scale.x = scale;
    root.scale.y = scale;
    root.x = translate[0];
    root.y = translate[1];
    sleep = false;
    if (selectedImage) changeMani(selectedImage.sprite)

  }

  function zoomstart(event) {
    zooming = true;
    startTranslate = false;
    drag = false;
    startScale = scale;
  }

  function zoomend(event) {
    drag = startTranslate && translate !== startTranslate;
    zooming = false;
    filterVisible();

    if (
      zoomedToImage &&
      selectedImage &&
      !selectedImage.big &&
      state.lastZoomed != selectedImage.id &&
      !state.zoomingToImage
    ) {
      loadBigImage(selectedImage, "zoom");
    }
  }

  canvas.highlight = function () {
    data.forEach(function (d, i) {
      d.alpha = d.highlight ? 1 : 0.2;
    });
    canvas.wakeup();
  };


  canvas.project = function () {
    sleep = false;
    var scaleFactor = state.mode == "time" ? 0.9 : tsneScale[state.mode] || 0.5;
    // if (state.mode == "location") scaleFactor = 1
    data.forEach(function (d) {
      d.scaleFactor = scaleFactor;
      d.sprite.scale.x = d.scaleFactor;
      d.sprite.scale.y = d.scaleFactor;
      if (d.sprite2) {
        d.sprite2.scale.x = d.scaleFactor;
        d.sprite2.scale.y = d.scaleFactor;
      }
    });

    if (state.mode == "time") {
      canvas.split();
      cursorCutoff = (1 / scale1) * imageSize * 0.48;
    } else if (state.mode == "similarity") {
      canvas.projectTSNE();
      cursorCutoff = (1 / scale1) * imageSize * 1;
    } else if (state.mode == "location") {
      canvas.projectLocation();
      cursorCutoff = (1 / scale1) * imageSize * 1;
    }

    canvas.resetZoom();

    zoomedToImageScale =
      (0.8 / (x.bandwidth() / collumns / width)) *
      (state.mode == "time" ? 1 : 0.5);
  };

  canvas.projectLocation = function () {
    var marginBottom = -height / 2.5;

    var inactive = data.filter(function (d) {
      return !d.active;
    });
    var inactiveSize = inactive.length;

    var active = data.filter(function (d) {
      return d.active;
    });

    var dimension = Math.min(width, height) * 0.8;

    inactive.forEach(function (d, i) {
      var r = dimension / 1.55 + Math.random() * 40;
      var a = -Math.PI / 2 + (i / inactiveSize) * 2 * Math.PI;
      d.x = r * Math.cos(a) + width / 2 + margin.left;
      d.y = r * Math.sin(a) + marginBottom;
    });

    active.forEach(function (d) {
      var tsneEntry = tsneIndex[state.mode][d.id];
      if (tsneEntry) {
        d.x = tsneEntry[0] * dimension + width / 2 + margin.left - dimension / 2;
        d.y = tsneEntry[1] * dimension + marginBottom - dimension / 2;
      } else {
        // console.log("not found", d)
        d.alpha = 0;
      }
    });

    data.forEach(function (d) {
      d.x1 = d.x * scale1 + imageSize / 2;
      d.y1 = d.y * scale1 + imageSize / 2;
      if (d.sprite.position.x == 0) {
        d.sprite.position.x = d.x1;
        d.sprite.position.y = d.y1;
      }

      if (d.sprite2) {
        d.sprite2.position.x = d.x * scale2 + imageSize2 / 2;
        d.sprite2.position.y = d.y * scale2 + imageSize2 / 2;
      }

      // console.log(d.sprite.position, d.sprite.position2)
    });

    mapBboxData.forEach(function (d) {
      var tsneEntry = tsneIndex["bbox"][d.name];
      if (tsneEntry) {
        d.x = tsneEntry[0] * dimension + width / 2 + margin.left - dimension / 2;
        d.y = tsneEntry[1] * dimension + marginBottom - dimension / 2;
        d.width = tsneEntry[2] * dimension;
        d.height = tsneEntry[3] * dimension;
      } else {
        d.alpha = 0;
      }
    });

    mapBboxData.forEach(function (d) {
      d.x1 = d.x * scale1 + imageSize / 2;
      d.y1 = d.y * scale1 + imageSize / 2;
      d.w1 = d.width * scale1;
      d.h1 = d.height * scale1;

      d.boundingBox.width = d.w1;
      d.boundingBox.height = d.h1;
      d.boundingBox.position.set(d.x1, d.y1);
      d.alpha1 = 1;

      if (textAnchorRight.includes(d.name)) {
        d.text.position.set(d.x1 + d.w1, d.y1);
      } else {
        d.text.position.set(d.x1, d.y1);
      }
      d.text.style = {
        fontSize: imageSize * 2,
      }
      // d.boundingBox.drawRect(d.x1, d.y1, d.w1, d.h1);
      // console.log(d.boundingBox.scale)
      // if (d.boundingBox.position.x == 0) {
      //   d.boundingBox.position.set(d.x1, d.y1)
      // }
    });

    quadtree = Quadtree.addAll(data);
    //chart.resetZoom();
  };

  canvas.projectTSNE = function () {
    var marginBottom = -height / 2.5;
    // var marginBottom = 0;

    var inactive = data.filter(function (d) {
      return !d.active;
    });
    var inactiveSize = inactive.length;

    var active = data.filter(function (d) {
      return d.active;
    });

    var dimension = Math.min(width, height) * 0.8;

    inactive.forEach(function (d, i) {
      var r = dimension / 1.8 + Math.random() * 40;
      var a = -Math.PI / 2 + (i / inactiveSize) * 2 * Math.PI;

      d.x = r * Math.cos(a) + width / 2 + margin.left;
      d.y = r * Math.sin(a) + marginBottom;
    });

    active.forEach(function (d) {
      var factor = height / 2;
      var tsneEntry = tsneIndex[state.mode][d.id];
      if (tsneEntry) {
        d.x = tsneEntry[0] * dimension + width / 2 + margin.left - dimension / 2;;
        d.y = tsneEntry[1] * dimension + marginBottom - dimension / 2;;
      } else {
        // console.log("not found", d)
        d.alpha = 0;
      }
      // var tsneEntry = tsne.find(function (t) {
      //     return t.id == d.id
      // })
    });
    // console.log(scale1)
    // scale1 = 1
    // scale2 = 1
    data.forEach(function (d) {
      // console.log(d.x, d.y)
      d.x1 = d.x * scale1 + imageSize / 2;
      d.y1 = d.y * scale1 + imageSize / 2;

      if (d.sprite.position.x == 0) {
        d.sprite.position.x = d.x1;
        d.sprite.position.y = d.y1;
      }

      if (d.sprite2) {
        d.sprite2.position.x = d.x * scale2 + imageSize2 / 2;
        d.sprite2.position.y = d.y * scale2 + imageSize2 / 2;
      }
    });

    quadtree = Quadtree.addAll(data);
    //chart.resetZoom();
  };

  canvas.resetZoom = function () {
    var duration = 1400;

    extent = d3.extent(data, function (d) {
      return d.y;
    });


    var y = -extent[1] - bottomPadding;
    y = extent[1] / -3 - bottomPadding;
    // this needs a major cleanup
    y = Math.max(y, -bottomPadding);


    vizContainer
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale))
      .transition()
      .duration(duration)
      .call(zoom.transform, d3.zoomIdentity.translate(0, y).scale(1))

  };

  canvas.split = function () {
    var active = data.filter(function (d) {
      return d.active;
    });
    stackLayout(active, false);
    var inactive = data.filter(function (d) {
      return !d.active;
    });
    stackLayout(inactive, true);
    mapBboxData.forEach((d,i)=>{
      d.alpha1 = 0;
    })
    quadtree = Quadtree.addAll(data);
  };

  function filterVisible() {
    var zoomScale = scale;
    if (zoomedToImage) return;

    data.forEach(function (d, i) {
      var p = d.sprite.position;
      var x = p.x / scale1 + translate[0] / zoomScale;
      var y = p.y / scale1 + translate[1] / zoomScale;
      var padding = 5;

      if (
        x > -padding &&
        x < width / zoomScale + padding &&
        y + height < height / zoomScale + padding &&
        y > height * -1 - padding
      ) {
        d.visible = true;
      } else {
        d.visible = false;
      }
    });

    var visible = data.filter(function (d) {
      return d.visible;
    });

    if (visible.length < 40) {
      data.forEach(function (d) {
        if (d.visible && d.loaded && d.active) d.alpha2 = 1;
        else if (d.visible && !d.loaded && d.active) loadImagesCue.push(d);
        else d.alpha2 = 0;
      });
    } else {
      data.forEach(function (d) {
        d.alpha2 = 0;
      });
    }
  }

  function loadMiddleImage(d) {
    if (d.loaded) {
      d.alpha2 = 1;
      return;
    }
    var url = "";
    if (config.loader.textures.detail.csv) {
      url = d[config.loader.textures.detail.csv];
    } else {
      url = d._middleUrl;
      // url = "https://vikusviewer.fh-potsdam.de/fw4/vis/data/1024jpg/89100.jpg";
      // 相同图像的load
      // url = config.loader.textures.detail.url + d.id.split("_")[0] + ".jpg";
    }

    var texture = new PIXI.Texture.from(url);
    var sprite = new PIXI.Sprite(texture);

    var update = function () {
      sleep = false;
    };

    sprite.on("added", update);
    texture.once("update", update);

    sprite.scale.x = d.scaleFactor;
    sprite.scale.y = d.scaleFactor;

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position.x = d.x * scale2 + imageSize2 / 2;
    sprite.position.y = d.y * scale2 + imageSize2 / 2;

    sprite._data = d;
    stage4.addChild(sprite);
    d.sprite2 = sprite;
    d.alpha2 = d.highlight;
    d.loaded = true;
    sleep = false;
  }

  function loadBigImage(d) {
    if (!config.loader.textures.big) {
      loadMiddleImage(d);
      return;
    }
    state.lastZoomed = d.id;
    var page = d.page ? "_" + d.page : "";
    var url = "";
    if (config.loader.textures.big.csv) {
      url = d[config.loader.textures.big.csv];
    } else {
      // console.log(d._largeUrl)
      url = d._largeUrl; // 每个图给定url的方式
      // url = "https://vikusviewer.fh-potsdam.de/fw4/vis/data/1024jpg/89100.jpg"; // 每个图给定url的方式
      // url = config.loader.textures.big.url + d.id + page + ".jpg"; // 统一链接 + 图像id的方式
      // url = config.loader.textures.big.url + d.id.split("_")[0] + page + ".jpg"; // 本地的方式
    }

    var texture = new PIXI.Texture.from(url);
    var sprite = new PIXI.Sprite(texture);
    var res = config.loader.textures.big.size;
    var updateSize = function (t) {
      var size = Math.max(texture.width, texture.height);
      sprite.scale.x = sprite.scale.y = (imageSize3 / size) * d.scaleFactor;
      sleep = false;
      if (t.valid) {
        d.alpha = 0;
        d.alpha2 = 0;
      }
    };

    sprite.on("added", updateSize);
    texture.once("update", updateSize);

    // console.log("Loading big image", d, d.imagenum)
    if (d.imagenum) {
      sprite.on("mousemove", function (s) {
        var pos = s.data.getLocalPosition(s.currentTarget);
        s.currentTarget.cursor = pos.x > 0 ? "e-resize" : "w-resize";
      });

      sprite.on("click", function (s) {
        if (drag) return;

        s.stopPropagation();
        spriteClick = true;
        var pos = s.data.getLocalPosition(s.currentTarget);
        var dir = pos.x > 0 ? 1 : -1;
        var page = d.page + dir;
        var nextPage = page;
        if (page > d.imagenum - 1) nextPage = 0;
        if (page < 0) nextPage = d.imagenum - 1;

        canvas.changePage(d.id, nextPage);
      });
      sprite.interactive = true;
    }

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position.x = d.x * scale3 + imageSize3 / 2;
    sprite.position.y = d.y * scale3 + imageSize3 / 2;
    sprite._data = d;
    d.big = true;
    stage5.addChild(sprite);
    // console.log(sprite)
    sleep = false;
  }

  function clearBigImages() {
    while (stage5.children[0]) {
      stage5.children[0]._data.big = false;
      stage5.removeChild(stage5.children[0]);
      sleep = false;
    }
  }

  function loadImages() {
    if (zooming) return;
    if (zoomedToImage) return;

    if (loadImagesCue.length) {
      var d = loadImagesCue.pop();
      if (!d.loaded) {
        loadMiddleImage(d);
      }
    }
  }

  canvas.emitClickImage = function (imgId = null, title = null) {
    if (imgId) {
      imgId = +imgId
      selectedImage = data.find(img => img.id === imgId)
    }
    else if (title) {
      selectedImage = data.find(img => img._title === title);
    }
    detailStore.imageId = selectedImage.id;
    zoomToImage(selectedImage, 1400 / Math.sqrt(Math.sqrt(scale)));
  }

  return canvas;
}
