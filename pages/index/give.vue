<template>
	<view class="index_follow">
		<view class="follow_bg"></view>
		<view class="ui-btn" @click="showLayer = true">赐卡给TA，一起爽辣</view>
		<view class="layer" v-if="showLayer">
			<view class="container">
				<!-- <view class="close" @click="showLayer = false"></view> -->
				<view class="top">
					<view class="left">
						<image class="img" :src="cardData.url" mode=""></image>
					</view>
					<view class="right">
						<view class="price">￥{{cardData.cardPrice || 0.00}}</view>
						<view class="price_more">
							<text class="text">￥{{cardData.specialPrice || 0.00}}</text>
							<view class="tag">限时优惠</view>
						</view>
					</view>
				</view>
				<view class="middle">
					<view class="left">
						数量
					</view>
					<view class="right">
						<view class="reduce" @click="reduce">
							-
						</view>
						<view class="num">
							{{num}}
						</view>
						<view class="add" @click="add">
							+
						</view>
					</view>
				</view>
				<view class="btn" @click="pay">
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
				showLayer:false,
				num:1,
				cardNum: 100,
				cardData:{}
			};
		},
		onShow(){
			this.getCard();
		},
		methods:{
			hideLayer(){
				this.num = 1;
				this.showLayer = false;
			},
			async getCard(){
				let cardInfo = await this.$http.allowList();
				let cardNum = await this.$http.getCardList();
				
				if(cardInfo.data.length>0){
					this.cardData = cardInfo.data[0];
				}
				if(cardNum.data.length>0){
					thiss.cardNum = cardInfo.data[0].card_number
				}
			},
			reduce(){
				if(this.num > 1){
					this.num --;
				}
			},
			add(){
				if(this.num < this.cardNum){
					this.num ++;
				}
			},
			async pay(){
				let _this = this;
				uni.showLoading()
				let {data} = await this.$http.wxPrePayCard({
					  "cardPrice": this.cardData.cardPrice,
					  "pay_type": 2,
					  "quantity": this.num,
					  // "type": 0
				});
				if(data){
					uni.hideLoading()
					uni.requestPayment({
						appId: data.appid,
						timeStamp: data.timeStamp,
						nonceStr: data.nonceStr,
						package: data.package,
						signType: data.signType,
						paySign: data.paySign,
						success: function(res) {
							_this.hideLayer();
							uni.reLaunch({
								url:"../user/user"
							})
						},
						fail: function(err) {
							uni.showToast({
								icon:"none",
								title:"支付失败"
							})
							_this.hideLayer();
						},
					});
				}
			}
		}
	}
</script>

<style lang="scss">
.index_follow{
	box-sizing: border-box;
	padding: 30rpx 30rpx 60rpx 30rpx;
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
		bottom: 60rpx;
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
		align-items: flex-end;
		justify-content: flex-end;
		position: fixed;
		background: rgba($color: #000000, $alpha: 0.5);
		.container{
			width: 100%;
			min-height: 400rpx;
			background: #FFFFFF;
			// border-radius: 25rpx;
			box-sizing: border-box;
			padding: 60rpx;
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
					.img{
						width: 100%;
						height: 100%;
					}
				}
				.right{
					margin-left: 30rpx;
					.price{
						font-size: 40rpx;
						color: #CD0000;
					}
					.price_more{
						display: flex;
						align-items: center;
						font-size: 30rpx;
						color: #3D3D3D;
						.tag{
							height: 30rpx;
							background: #3D3D3D;
							border-radius: 30rpx;
							font-size: 20rpx;
							color: #FFFFFF;
							text-align: center;
							line-height: 30rpx;
							margin-left: 10rpx;
							padding: 0 10rpx;
						}
					}
				}
			}
			.middle{
				display: flex;
				justify-content: space-between;
				font-size: 30rpx;
				color: #3D3D3D;
				margin: 50rpx 0;
				.right{
					display: flex;
					.num{
						width: 80rpx;
						height: 40rpx;
						border-radius: 40rpx;
						font-size: 30rpx;
						color: #3D3D3D;
						background: #E4E4E4;
						text-align: center;
						margin: 0 20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.reduce,.add{
						text-align: center;
						width: 40rpx;
						height: 40rpx;
						border-radius: 40rpx;
						font-size: 30rpx;
						color: #3D3D3D;
						background: #E4E4E4;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
			.btn{
				height: 80rpx;
				border-radius: 80rpx;
				line-height: 80rpx;
				background: #CD0000;
				color: #FFFFFF;
				font-size: 30rpx;
				text-align: center;
				margin-bottom: 60rpx;
			}
		}
	}
}
</style>
