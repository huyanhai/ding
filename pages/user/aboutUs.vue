<template>
	<view style="padding: 30upx;font-size: 30upx;">
		<rich-text :nodes="desc"></rich-text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				desc:''
			}
		},
		async onLoad() {
			let res = await this.$http.getAboutUs()
			if(res.code==200){
				this.desc = res.data
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
