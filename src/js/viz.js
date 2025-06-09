// utils.welcome();

import { Canvas } from './canvas';
import { Tags } from './tags';
var data;
var tags;
var canvas;
var search;
var ping;
var map;
var timeline;

var configFile = "/data/config.json"

const params = new URLSearchParams(window.location.search);
const grid = params.get('grid');
if(grid==='true'){
    configFile = "/data/config_no.json"
}

if (import.meta.env.MODE === 'production') {
  // configFile = "/viewer" + configFile;
}

// if (Modernizr.webgl && !utils.isMobile()) {
//   init();
// }


export function init() {
  canvas = Canvas();
  tags = Tags(canvas);
  search = Search(tags);
  // map = MapLayer();

  ping = utils.ping();

  var baseUrl = utils.getDataBaseUrl();
  var makeUrl = utils.makeUrl;

  // console.log(baseUrl);

  d3.json(baseUrl.config || configFile).then(async (config) => {

    config.baseUrl = baseUrl;
    utils.initConfig(config);

    let _timeline = await LoaderByPromise(makeUrl(baseUrl.path, config.loader.timeline));
    let _mapData = await LoaderByPromise(makeUrl(baseUrl.path, config.loader.map));
    let _abstractMapData = await d3.csv(makeUrl(baseUrl.path, config.loader.abstract_map));
    const res = await LoaderByPromise(makeUrl(baseUrl.path, config.loader.items));
    data = res;
    data = utils.transformData(data);

    utils.clean(data, config.delimiter);
    tags.init(data, config);
    search.init();
    canvas.init(data, _timeline, _abstractMapData, config);

    if (config.loader.layouts) {
      initLayouts(config);
    } else {
      canvas.setMode("time");
    }

    
    LoaderSprites()
      .progress(function (textures) {
        Object.keys(textures).forEach(function (id) {
          data
            .filter(function (d) {
              return d.id == id;
            })
            .forEach(function (d) {
              d.sprite.texture = textures[id];
            });
        });
        // Option: VIKUS图像改的
        // const nT = Object.values(textures);
        // data.forEach(function (d, i) {
        //       let randomIndex = Math.floor(Math.random() * nT.length);
        //       d.sprite.texture = nT[randomIndex];
        //     });
        // Option: 单张图像_thumbUrl 获取
        // data.find(img => img.id == id).sprite.texture = textures;
        canvas.wakeup();
      })
      //.finished() recalculate sizes
      .load(makeUrl(baseUrl.path, config.loader.textures.medium.url));

    if(Object.keys(globalStore.urlSearchParams).length > 0) {
      canvas.emitClickImage(globalStore.urlSearchParams.id, globalStore.urlSearchParams.title)
    }else{
      canvas.resetZoom()
    }
  });


  d3.select(window)
    .on("resize", function () {
      if (canvas !== undefined && tags !== undefined) {
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function () {
          canvas.resize();
          tags.resize();
        }, 250);
      }
    })
    .on("keydown", function (e) {
      if (e.keyCode != 27) return;
      search.reset();
      tags.reset();
      canvas.split();
    });

  
  d3.select(".navi .button").on("click", function (event) {
    var that = this;
    var mode = d3.select(this).attr("data");
    canvas.setMode(mode);

    d3.selectAll(".navi .button").classed("active", function () {
      return that === this;
    });
  });



  function initLayouts(config) {
    d3.select(".navi").classed("hide", false);

    // console.log(config.loader.layouts);

    config.loader.layouts.forEach((d, i) => {
        
      d.title = d.title.toLowerCase();
      if (d.title === "time") {
        canvas.setMode(d.title);
      } 
      else if (d.title === "similarity"){
        d3.csv(utils.makeUrl(baseUrl.path, d.url)).then(tsne => {
          canvas.addTsneData(d.title, tsne, d.scale);
          if (i == 0) canvas.setMode(d.title);
        });
      } else if(d.title === "location") {
        d3.csv(utils.makeUrl(baseUrl.path, d.url)).then( (mapedLocation)  => {

          canvas.addLocationData(d.title, mapedLocation, d.scale);
          canvas.addBoundingBoxData("bbox", d.scale);

          if (i == 0) canvas.setMode(d.title);
        });
      }
    });

    if (config.loader.layouts.length == 1) {
      d3.select(".navi").classed("hide", true);
    }

    var s = d3.select(".navi").selectAll(".button").data(config.loader.layouts);
    s.enter()
      .append("div")
      .classed("button", true)
      .classed("space", (d) => d.space)
      .text((d) => d.label)
      .on("click", function (e, d) {
        canvas.setMode(d.title);
        d3.selectAll(".navi .button").classed(
          "active",
          (d) => d.title == canvas.getMode()
        );
      });

    d3.selectAll(".navi .button").classed(
      "active",
      (d) => d.title == config.loader.layouts[0].title
    );
  }
}

export { canvas };





d3.select(".browserInfo").classed("show", utils.isMobile());
