//按需加载方式
// const App = () => ({
//   component: import ('./App')
// })
import App from './App'
import adduser from "../adduser/App"
import listmanage from "../listmanage/App"

export default [{
  path: '/home',
  component: App,
  redirect: '/home/adduser',
  meta: {
    keepAlive: true // 需要被缓存
  },
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
  	}
  ]
}]
