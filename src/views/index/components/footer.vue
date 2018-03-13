<template>
  <div class="footer">
		<div class="content">
			<div class="tag">
				<div class="tag__item" v-for="(item, index) in tags" :key="index">
					 <sicon :name="item.icon" scale="3" class="checkI"></sicon> <span>{{ item.title }}</span>
				</div>
			</div>
			<div class="clause">
				<div class="clause__item" v-for="(item, index) in clause" :key="index">
					<h2>{{ item.name }}</h2>
					<ul>
						<li v-for="(items, index) in item.data" :key="index">{{ items }}</li>
					</ul>
				</div>
				<div class="clause__msg">
					<span>023-81313577</span>
					<p>公司地址 : 重庆市渝中区大坪百盛1号楼412</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data () {
		return {
			tags: [
				{ title: '行业领先者', icon: 'good' },
				{ title: '价格公开透明', icon: 'money' },
				{ title: '维修质量保障', icon: 'phone' },
				{ title: '极速优质服务', icon: 'dian' }
			],
			clause: [
				{ name: '翼修', data: ['关于我们', '加入我们', '意见反馈'] },
				{ name: '服务中心', data: ['服务流程', '常见问题', '用户协议'] },
				{ name: '友情链接', data: ['小程序'] }
			]
		}
	}
}
</script>

<style scoped>
.footer {
	color: #fff;
	width: 1920px;
}

.content {
	width: 1020px;
	margin: 0 auto;
	height: 300px;
	background: #2d2d2d;
}

.tag {
	width: 100%;
	border-bottom: 1px solid gray;
}

.tag .tag__item {
	width: 255px;
	height: 100px;
	display: inline-block;
	text-align: center;
	line-height: 100px;
	font-size: 20px;
}

.tag__item span {
	margin-top: -10px;
	margin-left: 10px;
}

.clause {
	overflow: hidden;
}

.clause .clause__item {
	width: 240px;
	padding: 20px;
	float: left;
}

.clause__item h2 {
	font-size: 20px;
	padding: 10px 0;
}

.clause .clause__msg {
	float: right;
	width: 300px;
	text-align: center;
}

.clause__msg span {
	display: inline-block;
	padding: 20px;
	border: 2px solid #fff;
	margin-top: 20px;
}

.clause__msg p {
	padding: 20px 0;
}

</style>
