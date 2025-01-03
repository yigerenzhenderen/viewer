// christopher pietsch
// cpietsch@gmail.com
// tweet me @chrispiecom
// 2015-2016

// need to refactor & clean this

function Loader(url) { // only available in before d3.v5.js
  var progress = 0,
    loaded = 0,
    total = 0;
    fileType = url.endsWith("csv") ? 'csv' : 'json';

  var container, indicator;

  var loader = {};
  var finished = function () { };

  loader.finished = function (value) {
    if (!arguments.length) return finished;
    finished = value;
    return loader;
  };
  loader.progress = function () {
    total = d3.event.total == 0 ? 80333701 : d3.event.total;
    loaded = d3.event.loaded;
    progress = parseInt((loaded / total) * 100);
    indicator.style("height", progress + "%");
  };
  
  loader.load = function () {
    container = d3.select(".detailLoader");
    container.selectAll("div").remove();

    container.append("div").classed("label", true).text("loading");

    indicator = container.append("div").classed("indicator", true);
    
    if (fileType == "csv"){
      d3.csv(url)
      .on("progress", loader.progress)
      .on("load", function (data) {
        finished(data);
        container.selectAll("div"); //.remove();
      })
      .on("error", function (err) {
        console.warn("error loading", url)
        finished([])
      })
      .get();
    }else if (fileType == "json"){
      d3.json(url)
      .on("progress", loader.progress)
      .on("load", function (data) {
        finished(data);
        container.selectAll("div"); //.remove();
      })
      .on("error", function (err) {
        console.warn("error loading", url)
        finished([])
      })
      .get();
    }
  };

  if (url) loader.load(url);
  else finished([]);

  return loader;
}

async function LoaderByPromise(url){
  var fileType = url.endsWith("csv") ? 'csv' : 'json';
  if (fileType == "csv") return await d3.csv(url);
  else if (fileType == "json") return await d3.json(url);
}



function LoaderSprites() {
  var progress = 0,
    loaded = 0,
    total = 0;

  var container, indicator;

  container = d3.select(".detailLoader");
  container.selectAll("div").remove();

  container.append("div").classed("label", true).text("loading");

  indicator = container.append("div").classed("indicator", true);

  var loader = {};
  var progress = function () { };

  var pixiloader = new PIXI.Loader();


  pixiloader.use(pixiPackerParser(PIXI)).on("progress", function (p, r) {
    indicator.style("height", p.progress + "%");
    if (!r.textures) return;
    progress(r.textures);
  });

  // Option: 单张url获取
  // pixiloader.on("progress", function (p, r) {
  //   indicator.style("height", p.progress + "%");
  //   if (!r.texture) return;
  //   progress(r.name, r.texture);
  // });

  loader.progress = function (_func) {
    if (!arguments.length) return progress;
    progress = _func;
    return loader;
  };

  // 原始
  loader.load = function (url) {
    pixiloader.add(url).load(function (r) {
      container.selectAll("div").remove();
    });
  };

  // 单张url获取
  // loader.load = function (urls) {
  //   urls.forEach((d)=>{
  //     pixiloader.add(String(d.id), d.url);
  //   })
  //   pixiloader.load(function (r) {
  //     container.selectAll("div").remove();
  //   });
  // };

  return loader;
}

function LoaderSingleImage() {
  var progress = 0,
    loaded = 0,
    total = 0;

  var container, indicator;

  container = d3.select(".detailLoader");
  container.selectAll("div").remove();

  container.append("div").classed("label", true).text("loading");

  indicator = container.append("div").classed("indicator", true);

  var loader = {};
  var finished = function () { };

  var pixiloader = new PIXI.loaders.Loader();
  pixiloader.on("progress", function (p, r) {
    indicator.style("height", p.progress + "%");
  });

  loader.load = function (url) {
    pixiloader.add(url).load(function (r, s) {
      container.selectAll("div").remove();
      finished(s[url].texture);
    });
    return loader;
  };

  loader.finished = function (value) {
    if (!arguments.length) return finished;
    finished = value;
    return loader;
  };

  return loader;
}

function LoaderBlob(url) {
  var progress = 0,
    loaded = 0,
    total = 0;

  var container, indicator;

  var loader = {};
  var finished = function () { };

  loader.finished = function (value) {
    if (!arguments.length) return finished;
    finished = value;
    return loader;
  };

  loader.progress = function () {
    total = d3.event.total == 0 ? 80333701 : d3.event.total;
    loaded = d3.event.loaded;
    progress = parseInt((loaded / total) * 100);

    indicator.style("height", progress + "%");

  };

  loader.load = function () {
    container = d3.select(".sideLoader");
    container.selectAll("div").remove();

    container.append("div").classed("label", true).text("loading hires");

    indicator = container.append("div").classed("indicator", true);

    d3.xhr(url)
      .responseType("blob")
      .on("progress", loader.progress)
      .on("load", function (req) {
        var blobUrl = window.URL.createObjectURL(req.response);
        finished(blobUrl);
        console.log('finished loading!!!!')
        container.selectAll("div").remove();
      })
      .get();
  };

  loader.load(url);

  return loader;
}

function LoaderMultiple(url) {
  var progress = 0,
    loaded = 0,
    total = 0;

  var size = 9;
  var urls = d3.range(size + 1).map(function (d) {
    return url + d + ".gz.csv";
  });
  var index = 0;
  var itemsLoaded = 0;
  var totalProgress = 0;

  var container, indicator, label;

  var loader = {};
  var finished = function () { };

  loader.finished = function (value) {
    if (!arguments.length) return finished;
    finished = value;
    return loader;
  };

  loader.progress = function () {
    total = d3.event.total == 0 ? 8497147 : d3.event.total;
    loaded = d3.event.loaded;
    progress = parseInt((loaded / total) * 100);
    totalProgress = itemsLoaded + parseInt(progress * 1.2);

    label.text("loading " + totalProgress + " sketches");
    indicator.style("height", totalProgress / 15 + "%");
  };

  loader.load = function (url) {

    d3.csv(url)
      .on("progress", loader.progress)
      .on("load", function (data) {

        finished(data);

        itemsLoaded += data.length;

        if (index < size) {
          index++;
          loader.load(urls[index]);
        } else {
          container.remove();
        }
      })
      .get();
  };

  loader.init = function () {
    container = d3.select(".detailLoader");
    container.selectAll("div").remove();

    label = container.append("div").classed("label", true).text("loading");
    indicator = container.append("div").classed("indicator", true);

    loader.load(urls[index]);
  };

  loader.init();

  return loader;
}
