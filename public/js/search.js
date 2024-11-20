function Search(tags) {

	var openbutton = d3.select(".icons").select(".openbutton");
  var container = d3.select(".searchbar");
	var state = {
		open: false
	}
	
	function search() { }

	search.init = function(){
		openbutton
		  .on("click", function(){
		    state.open = !state.open
        container.classed("open", state.open)
		    d3.select(".header").classed("open", state.open)
        if(state.open){
          container.select("input").node().focus()
        } else {
          tags.search("")
          container.select("input").node().value = ""
        }
		  })

    var debounced = _.debounce(function(value) {
      tags.search(value.toUpperCase())
    },300)

    container.select("input")
      .on("keyup", function(s){
        var value = container.select("input").node().value
        console.log("value",value.toUpperCase())
        debounced(value)
      })
	}

  search.reset = function (value) {
    state.open = false
    container
      .classed("open", state.open)
      .select("input").node().value = ""
    d3.select(".header").classed("open", state.open)
    tags.search("")
  }

	return search;
}