import App from './App'

export default [{
  path: '/index',
  component: App,
  meta: {
    keepAlive: true // 需要被缓存
  },
}]
