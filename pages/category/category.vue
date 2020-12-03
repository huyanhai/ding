<template>
	<scroll-view scroll-y="true" class="category">
		<view class="category_top">
			<!-- <image class="ui-img" mode=""></image>
			<view class="tips">不可错过的爽辣新品值得欢辣一试！</view>
			<view class="info">
				<view class="name">重庆牛油火锅底料</view>
				<view class="hyj_item">
					会员价¥14.0元
				</view>
				<view class="zongjia"> ¥18.90元</view>
			</view> -->
		</view>
		<view class="product">
			<view class="list">
				<product :item.sync="item" v-for="item in productList" :key="item.id"/>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import product from "../index/product.vue"
	
	export default {
		data(){
			return {
				pageSize:10,
				pageNum:1,
				productList:[]
			}
		},
		components:{
			product
		},
		created() {
			this.getList();
		},
		methods:{
			async getList(){
				 let {data} = await this.$http.getProductList({
					"sortType":0,
					"pageSize": this.pageSize,
					"pageNum": this.pageNum,
				});
				if(data){
					this.productList = data;
				}
			}
		}
	}
</script>

<style lang='scss'>
	.category{
		height: 100vh;
		background: #EBEBEB;
		
		.category_top{
			margin: 30rpx;
			border-radius: 20rpx;
			background: red;
			height: 604rpx;
			/* .ui-img{
				height: 400rpx;
				background: red;
			}
			.tips{
				font-size: 40rpx;
			}
			.info{
				font-size: 30rpx;
				color: #000000;
				line-height: 40rpx;
				margin-top: 20rpx;
			} */
		}
		.product{
			padding-bottom: 50rpx;
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
	}
</style>
