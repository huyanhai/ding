<template>
	<scroll-view scroll-y="true" class="hot_page">
		<view class="list" v-if="pageData.newProductList.length > 0">
			<product :item.sync="item" v-for="item in pageData.newProductList" :key="item.id"/>
		</view>
		<view class="null" v-else>暂无产品</view>
	</scroll-view>
</template>

<script>
	import product from "./product.vue"
	
	export default {
		data() {
			return {
				pageData:{}
			};
		},
		components:{
			product
		},
		onShow(){
			this.getPageSet();
		},
		methods:{
			async getPageSet(){
				uni.showToast({
					icon:"loading"
				})
				let {data} = await this.$http.header();
				if(data){
					this.pageData = data;
				}
			},
		}
	}
</script>

<style lang="scss">
	.hot_page{
		height: 100vh;
		width: 100%;
		.null{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			color: #000000;
		}
		.list{
			margin: 0 30rpx;
			display: flex;
			flex-wrap: wrap;
			product{
				width: calc(50% - 10rpx);
				margin-top: 20rpx;
				&:nth-child(2n+1){
					margin-right: 10rpx;
				}
				&:nth-child(2n+2){
					margin-left: 10rpx;
				}
			}
		}
	}

</style>
