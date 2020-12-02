<template>
	<scroll-view scroll-y="true" class="index_new">
		<view class="hd_ad">
			
		</view>
		<view class="more_links">
			<view class="item" @click="goPage('vip')">
				<image class="img" src="../../static/icon-small.png" mode=""></image>
				<text class="text">成为会员</text>
			</view>
			<view class="item" @click="goPage('give')">
				<image class="img" src="../../static/icon-buycard.png" mode=""></image>
				<text class="text">购卡转赠</text>
			</view>
			<view class="item" @click="goPage('follow')">
				<image class="img" src="../../static/icon-zoom.png" mode=""></image>
				<text class="text">欢辣乐园</text>
			</view>
		</view>
		<view class="more">
			<view class="item"></view>
			<view class="item"></view>
		</view>
		<view class="product">
			<view class="tabs">
				<scroll-view scroll-x="true" class="scroll">
					<view class="scroll_box">
						<template v-for="(item,index) in tabs">
							<view class="item" :class="{'active':activeTabs === item.value}" @click="changeTabs(item.value)">{{item.name}}</view>
						</template>
					</view>
				</scroll-view>
			</view>
			<view class="list">
				<product :item.sync="item" v-for="item in productList" :key="item.id"/>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import product from "./product.vue"
	export default {
		data() {
			return {
				activeTabs:"all",
				tabs:[
					{
						name:"全部",
						value:"all"
					},
					{
						name:"全部",
						value:"1"
					},
					{
						name:"全部",
						value:"2"
					},
					{
						name:"全部",
						value:"3"
					},
					{
						name:"全部",
						value:"4"
					}
				],
				pageSize:10,
				pageNum:1,
				productList:[]
			};
		},
		components:{
			product
		},
		created() {
			this.getList();
		},
		methods:{
			changeTabs(item){
				this.activeTabs = items;
			},
			goPage(path){
				uni.navigateTo({
					url:`./${path}`
				})
			},
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

<style lang="scss">
.index_new{
	background: #EBEBEB;
	.hd_ad{
		height: 533rpx;
		background: red;
		img{
			width: 100%;
			height: 100%;
		}
	}
	.more_links{
		height: 180rpx;
		border-radius: 10rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		margin: -30rpx 30rpx 30rpx 30rpx;
		.item{
			display: flex;
			flex-direction: column;
			width: calc(100%/3);
			align-items: center;
			box-sizing: border-box;
			border-right: 2rpx solid #EBEBEB;
			&:last-child{
				border-right: none;
			}
			.img{
				width: 54rpx;
				height: 54rpx;
			}
			.text{
				font-size: 30rpx;
				color: #000000;
			}
		}
	}
	.more{
		margin: 0 30rpx 20rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.item{
			width: calc(50% - 10rpx);
			height: 196rpx;
			border-radius: 20rpx;
			background: red;
			&:nth-child(2n+1){
				margin-right: 10rpx;
			}
			&:nth-child(2n+2){
				margin-left: 10rpx;
			}
		}
	}
	.product{
		padding-bottom: 50rpx;
		.tabs{
			height: 80rpx;
			line-height: 80rpx;
			background: #FFFFFF;
			box-sizing: border-box;
			padding: 0 30rpx;
			.scroll{
				width: 100%;
				.scroll_box{
					display: flex;
					align-items: center;
					.item{
						font-size: 30rpx;
						margin-right: 30rpx;
						flex: 0 0 auto;
						&.active{
							color: #B20000;
						}
					}
				}
			}
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
}
</style>
