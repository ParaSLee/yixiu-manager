<template>
	<div class="header">
		<img :src="logo" class="header__logo" alt="" />
		<Nav/>
	</div>
</template>

<script>
import Nav from './nav'
import logo from '@/assets/logo.png'
export default {
  components: {
		Nav
	},
	data () {
		return {
			logo: logo
		}
	}
}
</script>

<style scoped>
.header {
	width: 1020px;
	margin: 0 auto;
	height: 64px;
}

.header .header__logo {
	width: 120px;
}
</style>
