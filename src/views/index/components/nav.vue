<template>
  <ul class="nav">
    <li><router-link to="/index">首页</router-link></li>
		<li><router-link to="/phoneRepair">手机维修</router-link></li>
		<li><router-link to="/nicePhone">精品手机</router-link></li>
		<li><router-link to="/household">家电维修</router-link></li>
		<li><router-link to="/parts">手机配件</router-link></li>
		<li><router-link to="/equipment">企业设备维护</router-link></li>
		<li><router-link to="/carRepair">汽车维修</router-link></li>
		<li><router-link to="/phoneRecovery">手机回收</router-link></li>
  </ul>
</template>

<script>
export default {
  
}
</script>

<style scoped>
.nav {
	float: right;
}

.nav li {
	float: left;
}

.nav a {
	padding: 20px;
	line-height: 64px;
	font-size: 16px;
	color: gray;
}

.nav a:hover {
	color: #fff;
	background: #94d3f4;
}
</style>

