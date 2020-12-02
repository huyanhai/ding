<template>
	<view>
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
		onLoad(){
			
			let des=this.$store.state.temp.detailDesc;
			console.log(this.$store.state.temp)
			if(!des){
				this.$api.msg("数据错误!");
				uni.navigateBack({});
			}
			
			this.desc=des;
			
		},
		methods: {
			// async loadData(options) {
			// 	uni.showLoading({
			// 		title: '加载中'
			// 	})
			// 
			// 	let goodInfo = await this.$http.goodInfo(options);
			// 	uni.hideLoading();
			// 	if (goodInfo.code == 200)this.desc = this.goodInfo.detailMobileHtml;
			// 	 else this.$api.msg('数据异常!');
			// }
		}
	}
</script>

<style>

</style>
