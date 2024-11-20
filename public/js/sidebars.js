// const { createApp, ref } = Vue




// var detailVue = createApp({
//   data(){ 
//     return {
//       item: null,
//       structure: null,
//       page: 0,
//       id: null
//     }
//   },
//   methods: {
//     displayPage(page) {
//       canvas.changePage(this.id, page)
//     },
//     hasData(entry) {
//       return this.getContent(entry) !== ''
//     },
//     getContent(entry) {
//       if (entry.type === 'text') {
//         return this.item[entry.source]
//       }
//       if (entry.type === 'array') {
//         return this.item[entry.source].join(', ')
//       }
//       if (entry.type === 'keywords') {
//         return this.item[entry.source].join(', ')
//       }
//       if (entry.type === 'markdown') {
//         return marked(this.item[entry.source], { breaks: true })
//       }
//       if (entry.type === 'function') {
//         const column = this.item;
//         const func = entry.source
//         try {
//           return eval(func)
//         } catch (e) {
//           return 'Error'
//         }
//       }
//     }
//   }
// }).mount("#detail");


// window.detailVue = detailVue;

// var infoVue = createApp({
//   data(){
//     return {
//       info: "",
//     }
//   },
//   methods: {
//     marked: function (input) {
//       return marked(input);
//     }
//   }
// }).mount('#infobar');

// window.infoVue = infoVue;

