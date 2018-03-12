let filters = {
  init(val) {
    return 'filter init'
  },
  arr2name(val) {
    if (val.length > 0) {
      let res = []
      val.forEach(item => {
        res.push(item.name)
      })
      return res.join('、')
    } else {
      return '无'
    }
  },
  arr2id(val) {
    if (val.length > 0) {
      let res = []
      val.forEach(item => {
        res.push(item._id)
      })
      return res
    } else {
      return val
    }
  },
  unix2time(val) {
    return val
    // return moment.unix(val).format('YYYY-MM-DD HH:mm')
  },
  unix2hhmm(val) {
    return val
    // return moment.unix(val).format('HH:mm')
  },
  //按照指定格式输出时间
  datestr(time,y) {
    function change(x,y){
      var z ={y:x.getFullYear(),M:x.getMonth()+1,d:x.getDate(),h:x.getHours(),m:x.getMinutes(),s:x.getSeconds()};
      return y.replace(/(y+|M+|d+|h+|m+|s+)/g,function(v) {return ((v.length>1?"0":"")+eval('z.'+v.slice(-1))).slice(-(v.length>2?v.length:2))});
    }

    let newTime = new Date();  
    newTime.setTime(time * 1000);

    newTime = change(newTime,y)

    return newTime;
  },
  idstr(id){
    //将商户id隐藏
    id = id.replace(id.substr(5, 13), "*****")
    return id;
  }
}

import { getShopListAllNumber } from "../views/common/api"

export default {
  install(Vue) {
    for (var key in filters) {
      Vue.filter(key, filters[key])
    }
    Vue.prototype.unix2hhmm = filters.unix2hhmm
    Vue.prototype.arr2name = filters.arr2name
    Vue.prototype.arr2id = filters.arr2id
    Vue.prototype.datestr = filters.datestr
    Vue.prototype.idstr = filters.idstr
  }
}
