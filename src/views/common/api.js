import ajaxLib from '../../lib/ajax';
const ajax = ajaxLib.ajax;
const url = 'https://m.yixiutech.com';
// const url = "https://yixiu.natappvip.cc";


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

//获取商家总数
export function getShopListAllNumber() {
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/shop/count`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

//通过商家ID获取商家详情
export function getShopData(shopId) {
  return new Promise((resolve, reject) => {
    ajax.get(`${url}/shop/${shopId}`).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}


//更改商户信息
export function changeState(data) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/shop/update`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}


//根据筛选条件获取订单列表
export function getOrderListData(data) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/order/service/filter`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

//根据筛选条件获取订单列表 全系统级别
export function getAllOrderListData(data) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/order/filter`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

// 管理员登录
export function managerlogin(data) {
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/user/login/sys`, data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    })
  })
}

// 根据筛选条件获取问题详情
export function getQuestionList(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/question/filter`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}

// 修改问题信息
export function updateQuestion(data){
  return new Promise((resolve, reject) => {
    ajax.post(`${url}/question/update`,data).then((res) => {
      resolve(res);
    }).then((err) => {
      reject(err);
    });
  });
}