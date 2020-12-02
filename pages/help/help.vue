<template>
	<view v-html="data" class="padding1">
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:""
			}
		},
		async onLoad() {
			let data = await this.$http.getHelp()
			this.data = data.data
		},
		methods: {
			
		}
	}
</script>

<style>
	page{
		background-color: white;
	}
</style>
