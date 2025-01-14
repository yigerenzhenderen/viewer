// christopher pietsch
// cpietsch@gmail.com
// 2015-2018
import _ from 'lodash';

export function Tags(canvas) {
  var margin = {top: 10, right: 20, bottom: 20, left: 10},
      width = window.innerWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  var container;
  var keywordsScale = d3.scaleLinear();
  var keywordsOpacityScale = d3.scaleLinear();
  var keywords = [];
  var wordBackground;
  var keywordsNestGlobal;
  var sortKeywords = "alphabetical";
  // var sortKeywords = "count";

  // var filterWords = ["Potsdam"];
  var filterWords = [];
  var data, filteredData;
  var activeWord;

  var x = d3.scaleOrdinal()
    .range([0, width]);

  var sliceScale = d3.scaleLinear().domain([1200,5000]).range([50, 200])

  var lock = false;
  var state = { init: false, search: '' };

  function tags(){ }

  tags.state = state

  tags.init = function(_data, config, tagList) {
    data = _data;
    const tagCouldWidth = width + margin.left + margin.right;

    container = d3.select(".page").select(".tagcloud")
      .style("width", tagCouldWidth)
      .style("height", height + margin.top + margin.bottom)
      .style("color", config.style.fontColor)
      .append("div")
      .on("scroll", function(e){
        // console.log(e.target.scrollLeft,  e.target.scrollWidth - tagCouldWidth)
        globalStore.tagScrollToLeft = e.target.scrollLeft === 0;
        globalStore.tagScrollToRight = e.target.scrollLeft === (e.target.scrollWidth - tagCouldWidth);
      })

      //.attr("transform", "translate("+ margin.left +","+ margin.top +")")
    if (config.sortKeywords != undefined) {
      sortKeywords = config.sortKeywords;
    }

    tags.update();
  }

  tags.resize = function(){
    if(!state.init) return;
    
    width = window.innerWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    container
      .style("width", width + margin.left + margin.right)
      .style("height", height + margin.top + margin.bottom)

    x.range([0, width]);

    tags.update();
  }

  tags.filter = function(filterWords,highlight){
    data.forEach(function(d) {
      var search = state.search !== "" ? d.search.indexOf(state.search) > -1 : true;
      var matches = filterWords.filter(function(word){
        return d.keywords.indexOf(word) > -1;
      });
      // console.log(search, matches)
      if(highlight) d.highlight = (matches.length == filterWords.length && search);
      else d.active = (matches.length == filterWords.length && search);
    });

    // var anzahl = data.filter(function(d){ return d.active; }).length;
    // c("anzahl", anzahl)
  }

  tags.update = function() {

    tags.filter(filterWords);

    var keywords = [];
    // var topographisch = [];
    data.forEach(function(d) {
      if(d.active){
        d.keywords.forEach(function(keyword) {
          keywords.push({ keyword: keyword, data: d });
        })
      }
    });
    // console.log(keywords, 'keywords')


  keywordsNestGlobal =  d3.groups(keywords,d => d.keyword)
                          .map(ele => { return {key: ele[0], values: ele[1].map(_=>_.data)} })
                          .sort((a,b) =>  b.values.length - a.values.length)

  var sliceNum = parseInt(sliceScale(width));

  // c("num",sliceNum)
  // console.log("keywordsNestGlobal", keywordsNestGlobal, sliceNum)
   var keywordsNest = keywordsNestGlobal
      // .slice(0,sliceNum);
    // console.log(keywordsNest)
    if (sortKeywords == "alphabetical") {
      keywordsNest = keywordsNest.sort(function(a,b){
        return d3.ascending(a.key[0], b.key[0]);
      });
    } else if (sortKeywords == "alfabetical-reverse") {
      keywordsNest = keywordsNest.sort(function(a,b){
        return d3.descending(a.key[0], b.key[0]);
      });
    } else if (sortKeywords == "count") {
      keywordsNest = keywordsNest.sort(function(a,b){
        return d3.descending(a.values.length, b.values.length);
      });
    } else if (sortKeywords == "count-reverse") {
      keywordsNest = keywordsNest.sort(function(a,b){
        return d3.ascending(a.values.length, b.values.length);
      });
    } else if (Array.isArray(sortKeywords)) {
      keywordsNest = keywordsNest.sort(function(a,b){
        var indexA = sortKeywords.indexOf(a.key);
        var indexB = sortKeywords.indexOf(b.key);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    // c("keywordsNest", keywordsNest);

    var keywordsExtent = d3.extent(keywordsNestGlobal, function (d) {
      return d.values.length;
    });

    
    keywordsScale
      .domain(keywordsExtent)
      .range([10,20]);

    if(keywordsExtent[0]==keywordsExtent[1]) keywordsScale.range([15,15])


    keywordsOpacityScale
      .domain(keywordsExtent)
      .range([0.2,1]);

    layout(keywordsNestGlobal);
    // console.log("keywordsNestGlobal", keywordsNestGlobal)
    tags.draw(keywordsNestGlobal);
   
  }

  function layout(_data){
    var p = 1.8;
    var offsetLeft = 40 / 1.414;
    var offsetHeight = -8;
    var x0 = 0;

    // keywordsScale 得到font-size 本项目字体line-height约为font-size的1.16倍
    _data.forEach(function(d){
      d.x = x0 + keywordsScale(d.values.length) * p - offsetLeft
      d.y = offsetHeight
      x0 += (keywordsScale(d.values.length) * p);
    })
  };

  function getTranslateForList(data){
    var w = _.last(data).x + 100; // _ 是loadsh.js
    // return width/2 - w/2; // 居中
    // return width - w; //靠右 
    // return w - width //靠左
  }

  tags.draw = function(words) {
    // c(words)   
    var select = container
      .selectAll(".tag")
        .data(words, function(d){ return d.key; })

    select
      .classed("active", function(d){ return filterWords.indexOf(d.key) > -1; })
      // .transition()
      // .duration(1000)
      .style("transform", function(d,i){return `translate( ${d.x}px, ${d.y}px) rotate(45deg)`; })
      .style("font-size", function(d) { return keywordsScale(d.values.length) + "px"; })
      .style("opacity", 1)
      // .filter(function(d){ return filterWords.indexOf(d.key) > -1; })
      //   .style("color", config.style.fontColorActive)
      //   .style("background", config.style.fontBackground)
        // .selectAll(".close div")
        //   .style("background-color", config.style.fontColorActive)
      //.text(function(d) { return d.key; })

    // select.select("div")
    //   .text(function(d) { return d.key; })
      // .style("opacity", function(d){ return keywordsOpacityScale(d.values.length); })

    var e = select.enter().append("div")
        .classed("tag", true)
        .on("mouseenter", tags.mouseenter)
        .on("mouseleave", tags.mouseleave)
        .on("click", tags.mouseclick)
        .style("transform", function(d,i){ return `translate(${d.x}px, ${d.y}px) rotate(45deg)`; })
        .style("font-size", function(d) { return keywordsScale(d.values.length) + "px"; })
        .style("opacity", 0);

    e.append("span")
        .text(function(d) { return d.key; })
    
    e.append("div")
      .classed("close", true)
      // .attr("data-attr", config.style.fontColorActive)
    // e.append("div")
    //   .text(function(d) { return d.key; })
      // .style("transform", function(d,i){ return "rotate(90deg)"; })
      // .attr("dx", 25)
      // .attr("dy", 5)
      // .style("opacity", function(d){ return keywordsOpacityScale(d.values.length); })


    e.transition()
      .delay(400)
      .duration(0)
      .style("transform", function(d,i){return `translate( ${d.x}px, ${d.y}px) rotate(45deg)`; })
      .style("font-size", function(d) { return keywordsScale(d.values.length) + "px"; })
      .style("opacity", 1)

    select.exit()
      // .transition()
      // .duration(500)
      .style("opacity", 0)
      // .transition()
      // .duration(500)
      .remove();

    if(words.length === 0) return

    // var w = getTranslateForList(words);

    container
      // .style("transform", function(d,i){ return "translate(" + w + "px,0px)"; })
      .style("width", "100%")
      .style("height", "100%")
      .style("overflow", "scroll")
      .style("position", "relative")
      .style("margin-right", "200px")
      .style("margin-left", "auto");


  }

  tags.reset = function(){
    filterWords = []
    tags.update();
    tags.highlightWords(filterWords);
    // canvas.highlight();
    // canvas.project()
  }

  tags.mouseclick = function (e, d) {
    lock = true;
    console.log(filterWords, d)
    if(filterWords.indexOf(d.key)>-1){
      _.remove(filterWords,function(d2){ return d2 == d.key; });
    } else {
      filterWords.push(d.key);
    }
    // c(filterWords);

    tags.update();
    tags.highlightWords(filterWords);

    setTimeout(function(){
      canvas.project(d);
    },300);

    lock = false
  }

  tags.mouseleave = function (e, d) {
    if(lock) return;

    container
      .selectAll(".tag")
      .style("opacity", 1)

    data.forEach(function(d){ d.highlight = d.active; })

    canvas.highlight();
  }

  tags.mouseenter = function (e, d1) {
    if(lock) return;
  
    var tempFilterWords = _.clone(filterWords);
    tempFilterWords.push(d1.key)
    tags.highlightWords(tempFilterWords);
  }

  tags.filterWords = function(words){
    
    tags.filter(words,1);

    container
      .selectAll(".tag")
      .style("opacity", function(d){
        return d.values.some(function(d){ return d.active; }) ? 1 : 0.2;
      })

    canvas.highlight();
  }

  tags.highlightWords = function(words){
    
    tags.filter(words, 1);

    container
      .selectAll(".tag")
      .style("opacity", function(d){
        return d.values.some(function(d){ return d.highlight; }) ? 1 : 0.2;
      })

      canvas.highlight();
  }

  tags.search = function(query){
    // console.log(query)
    state.search = query
    
    tags.filter(filterWords, true);
    tags.update();
    canvas.highlight();
    canvas.project()
  }

  return tags;

}