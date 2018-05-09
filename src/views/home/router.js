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
import service from "../service/App"
import serviceClassification from "../serviceClassification/App"
import statistics from "../statistics/App"
import videoClass from "../videoClass/App"
import addVideoClass from "../addVideoClass/App"
import videoCourse from "../videoCourse/App"
import videosManage from "../videosManage/App"
import addVideos from "../addVideos/App"
import useStatistics from "../useStatistics/App"
import useSignin from "../useSignin/App"
import useRegister from "../useRegister/App"
import useForget from "../useForget/App"

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
    },
    {
      name: "service",
      path: "service",
      component: service
    },
    {
      name: "serviceClassification",
      path: "serviceClassification",
      component: serviceClassification
    },
    {
      name: "statistics",
      path: "statistics",
      component: statistics
    },
    {
      name: "videoClass",
      path: "videoClass",
      component: videoClass
    },
    {
      name: "addVideoClass",
      path: "addVideoClass",
      component: addVideoClass
    },
    {
      name: "videoCourse",
      path: "videoCourse",
      component: videoCourse
    },
    {
      name: "videosManage",
      path: "videosManage",
      component: videosManage
    },
    {
      name: "addVideos",
      path: "addVideos",
      component: addVideos
    },
    {
      name: "useRegister",
      path: 'useRegister',
      component: useRegister,
    },
  ]
},
{
  name: "useSignin",
  path: '/useSignin',
  component: useSignin,
},
{
  name: "useForget",
  path: '/useForget',
  component: useForget,
},
{
  name: "useStatistics",
  path: '/useStatistics',
  component: useStatistics,
  // redirect: '/useStatistics',
  // meta: {
  //   keepAlive: true // 需要被缓存
  // },
}]
