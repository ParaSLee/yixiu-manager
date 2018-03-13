<template>
  <slider :pages="pages" :sliderinit="sliderinit">
    
  </slider>
</template>

<script>
import slider from 'vue-concise-slider'
export default {
	components: {
		slider
	},
  data () {
		return {
			pages:[
				{
					title: '',
					style:{
						background:'url(src/img/testimg-1.jpg)'
					}
				},
				{
					title: '',
					style:{
					background:'url(src/img/testimg-2.jpg)'
					}
				},
				{
					title: 'slide3',
					style:{
						background:'#4bbfc3',
					},
				}
			],
			sliderinit: {
				currentPage: 0,//当前页码
				thresholdDistance: 500,//滑动判定距离
				thresholdTime: 100,//滑动判定时间
				autoplay:3000,//自动滚动[ms]
				loop:true,//循环滚动
				direction:'horizontal',//方向设置，垂直滚动
				infinite:1,//无限滚动前后遍历数
				slidesToScroll:1,//每次滑动项数
			}
		}
  }
}
</script>

<style scoped>

</style>
