import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    leftNavStatus: false,
    JSONData: {},
    tagsURL: [
      { name: '首页', type: '', path: '/' }
    ],
    windowHeight:window.innerHeight
  },
  mutations: {
    changeLeftNav(state) {
      state.leftNavStatus = !state.leftNavStatus
    },
    initJSONData(state) {//从后台获取数据
      // Vue.prototype.$http.get('/v2/api-docs')
      //   .then(function (response) {
      //     state.JSONData = response.data;
      //   })
      //   .catch(function (err) {
      //     alert('/v2/api-docs接口无法获取数据')
      //   });
      $.ajax({
        async: false,
        url:'v2/api-docs',
        type : 'get',
        dataType : 'json',
        error : function(){
          
        },
        success : function(res){
          state.JSONData = res;
        }
      })
    },
    addTabs(state, newTab) {//添加标签
      state.tagsURL.push(newTab)
    },
    chengeHeight(state){
        state.windowHeight = window.innerHeight;
        console.log(state.windowHeight)
    }
  },
  getters: {
    getSwaggerVersion: state => {
      return state.JSONData.swagger;
    },
    getInfo: state => {
      return state.JSONData.info;
    },
    getHost: state => {
      return state.JSONData.host;
    },
    getTags: state => {
      return state.JSONData.tags;
    },
    getPaths: state => {
      return state.JSONData.paths;
    },
    getDefinitions: state => {
      return state.JSONData.definitions;
    },
    getFriendlyPaths: (state, getters) => {//获取友好的path对象，原生的path对象太复杂不方便取数
      let paths = getters.getPaths;
      if (!paths) return false;
      let friendlyPaths = [];
      console.log(friendlyPaths)
      //遍历第一层
      for (let key in paths) {
        let friendlyPath = {};
        friendlyPath.path = key;
        let tem = paths[key];
        //遍历第二层
        for (let key in tem) {
          friendlyPath.sendWay = key;
          let tem2 = tem[key];
          friendlyPath.tags = tem2.tags;
          friendlyPath.summary = tem2.summary;
          friendlyPath.description = tem2.description;
          friendlyPath.operationId = tem2.operationId;
          friendlyPath.consumes = tem2.consumes;
          friendlyPath.produces = tem2.produces;
          friendlyPath.parameters = tem2.parameters;
          friendlyPath.responses = tem2.responses;
        }
        friendlyPaths.push(friendlyPath);
      }
      return friendlyPaths;
    },
    getMenuTreeObj: (state, getters) => {//获取完整的、友好的菜单树，包括所有信息
      let tagsArry = getters.getTags;
      let pathArry = getters.getFriendlyPaths;
      if (!tagsArry) return false;
      if (!pathArry) return false;
      for (let i = 0; i < tagsArry.length; i++) {//遍历标签
        let name = tagsArry[i].name;
        let tag = tagsArry[i];
        tag.paths = [];
        for (let i = 0; i < pathArry.length; i++) { //遍历paths查找对应的详情数据
          if (pathArry[i].tags[0].indexOf(name) >= 0) {
            tag.paths.push(pathArry[i]);
          }
        }
      }
      return tagsArry;
    },
    statisticsHTTP: (state, getters) => {
      //统计各请求的个数
      let get = 0;
      let post = 0;
      let del = 0;
      let put = 0;
      let pathArry = getters.getFriendlyPaths;
      for (let i = 0; i < pathArry.length; i++) {
        if (pathArry[i].sendWay == 'get') {
          get += 1;
        }
        if (pathArry[i].sendWay == 'post') {
          post += 1;
        }
        if (pathArry[i].sendWay == 'delete') {
          del += 1;
        }
        if (pathArry[i].sendWay == 'put') {
          put += 1;
        }
      }

      let others = pathArry.length - get - post - del - put;
      return {
        'get': get,
        'post': post,
        'del': del,
        'put': put,
        'others': others
      }
    }
  }
});
