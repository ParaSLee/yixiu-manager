import ajaxLib from '../../lib/ajax';
const ajax = ajaxLib.ajax;
const url = 'https://m.yixiutech.com';
// const url = "https://yixiu.natappvip.cc";

//获取商家列表
export function getShopList() {
  return new Promise((resolve, reject) => {
    ajax.get(url + '/shop').then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

//获取商家详情
export function getShopData(shopId) {
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/shop/${shopId}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

//  获取手机品牌
export function getPhoneBrand(shopid) {
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/phone/manufacturer/shop/${shopid}`).then((res) => {
      // ajax.get(`${url}/phone/manufacturer`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

// 根据店铺id和品牌id获取店铺支持的手机型号
export function getPhoneModel(req) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/phone/model/shop`, req).then((res) => {
      // ajax.get(`${url}/phone/model/${req.manufacturer}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

// 获取热门手机维修服务分类
export function getPhoneProblem(data) {
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/category/shop/${data}`).then((res) => {
      // ajax.get(`${url}/category/phoneRepair`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

// 根据商铺id和分类id以及手机型号 获取 某个商铺的某个分类下支持的某些手机型号 的具体维修服务
export function getChildrenProblem(data) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/service/shop`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

//根据筛选条件获取商家列表
export function getShopListSort(data) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/shop/filter`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}


//  确认下单
export function sureOrder(data) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/order/service`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}