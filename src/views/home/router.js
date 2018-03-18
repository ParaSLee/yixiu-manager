//按需加载方式
// const App = () => ({
//   component: import ('./App')
// })
import App from './App'
import adduser from "../adduser/App"
import listmanage from "../listmanage/App"
import examine from "../examine/App"
import questionexamine from "../questionexamine/App"
import phonebrand from "../phonebrand/App"
import phonemodel from "../phonemodel/App"

export default [{
  path: '/home',
  component: App,
  redirect: '/home/adduser',
  // meta: {
  //   keepAlive: true // 需要被缓存
  // },
  children:[
  	{
      name: "adduser",
  		path: "adduser",
  		component: adduser
  	},
  	{
      name: "listmanage",
  		path: "listmanage",
  		component: listmanage
  	},
    {
      name: "examine",
      path: "examine",
      component: examine
    },
    {
      name: "questionexamine",
      path: "questionexamine",
      component: questionexamine
    },
    {
      name: "phonebrand",
      path: "phonebrand",
      component: phonebrand
    },
    {
      name: "phonemodel",
      path: "phonemodel",
      component: phonemodel
    }
  ]
}]
