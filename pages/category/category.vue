<template>
	<scroll-view scroll-y="true" class="category">
		<view class="category_top" @click="goPage(productList[0])">
			<image class="ui-img" :src="productList[0].pic" mode=""></image>
		</view>
		<view class="product">
			<view class="list">
				<view class="col">
					<product :item.sync="item" v-for="(item,index) in productList" :key="item.id" v-if="index%2 == 0"/>
				</view>
				<view class="col">
					<template v-for="(item,index) in productList" >
						<product :item.sync="item"  :key="item.id" v-if="index===1" :more="'more'"/>
						<template v-else>
							<product :item.sync="item" :key="item.id" v-if="index%2 != 0"/>
						</template>
					</template>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import product from "../index/product-auto.vue"
	
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
			goPage(item){
				uni.navigateTo({
					url: `/pages/product/product?id=${item.id}&attr=${item.attr}`
				});
			},
			async getList(){
				 let {data} = await this.$http.getSpicyRoomProductList({
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
			height: 604rpx;
			overflow: hidden;
			.ui-img{
				width: 100%;
				height: 100%;
			}
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
				.col{
					display: flex;
					flex-direction: column;
					width: calc(50% - 15rpx);
					&:first-child{
						margin-right: 15rpx;
					}
					&:last-child{
						margin-left: 15rpx;
					}
				}
				product{
					break-inside:avoid;
					margin-bottom: 30rpx;
					display: inline-block;
					&:nth-child(2n+1){
						/* margin-right: 10rpx; */
					}
					&:nth-child(2n+2){
						/* margin-left: 10rpx; */
					}
				}
			}
		}
	}
</style>
