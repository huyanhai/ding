<template>
	<view class="index_follow">
		<view class="follow_bg"></view>
		<view class="ui-btn" @click="showLayer = true">赐卡给TA，一起爽辣</view>
		<view class="layer" v-if="showLayer">
			<view class="container">
				<view class="close" @click="showLayer = false"></view>
				<view class="top">
					<view class="left">
						<image class="img" src="" mode=""></image>
					</view>
					<view class="right">
						<view class="price">￥5.00</view>
						<view class="price_more">
							<text class="text">￥5.00</text>
							<view class="tag">限时优惠</view>
						</view>
					</view>
				</view>
				<view class="middle">
					<view class="left">
						数量
					</view>
					<view class="right">
						<view class="reduce">
							-
						</view>
						<view class="num">
							1
						</view>
						<view class="add">
							+
						</view>
					</view>
				</view>
				<view class="btn">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showLayer:false
			};
		},
		onShow(){
			this.getCard();
		},
		methods:{
			async getCard(){
				let {data} = await this.$http.allowList();
				console.log(data)
			}
		}
	}
</script>

<style lang="scss">
.index_follow{
	box-sizing: border-box;
	padding: 30rpx;
	background: #EBEBEB;
	height: 100vh;
	.follow_bg{
		height: 961rpx;
		background: red;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 37rpx;
	}
	.ui-btn{
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		right: 30rpx;
		height: 68rpx;
		background: #CD0000;
		border-radius: 68rpx;
		line-height: 68rpx;
		text-align: center;
		font-size: 30rpx;
		color: #FFFFFF;
	}
	.layer{
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		background: rgba($color: #000000, $alpha: 0.5);
		.container{
			width: 560rpx;
			height: 400rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			box-sizing: border-box;
			padding: 45rpx;
			position: relative;
			.close{
				position: absolute;
				width: 42rpx;
				height: 42rpx;
				background: url(../../static/close2.png) no-repeat;
				background-size: cover;
				top: -40rpx;
				right: -40rpx;
			}
			.top{
				display: flex;
				align-items: center;
				.left{
					width: 292rpx;
					height: 186rpx;
					background: red;
				}
				.right{
					margin-left: 30rpx;
					.price{
						font-size: 30rpx;
						color: #CD0000;
					}
					.price_more{
						display: flex;
						align-items: center;
						font-size: 24rpx;
						color: #3D3D3D;
						.tag{
							width: 60rpx;
							height: 20rpx;
							background: #3D3D3D;
							border-radius: 20rpx;
							font-size: 12rpx;
							color: #FFFFFF;
							text-align: center;
							line-height: 20rpx;
							margin-left: 10rpx;
						}
					}
				}
			}
			.middle{
				display: flex;
				justify-content: space-between;
				font-size: 14rpx;
				color: #3D3D3D;
				margin: 37rpx 0;
				.right{
					display: flex;
					.num{
						width: 80rpx;
						height: 25rpx;
						border-radius: 25rpx;
						font-size: 20rpx;
						color: #3D3D3D;
						background: #E4E4E4;
						text-align: center;
						margin: 0 10rpx;
					}
					.reduce,.add{
						text-align: center;
						width: 25rpx;
						height: 25rpx;
						border-radius: 25rpx;
						font-size: 20rpx;
						color: #3D3D3D;
						background: #E4E4E4;
					}
				}
			}
			.btn{
				height: 36rpx;
				border-radius: 36rpx;
				background: #CD0000;
				color: #FFFFFF;
				font-size: 18rpx;
				line-height: 36rpx;
				text-align: center;
			}
		}
	}
}
</style>
