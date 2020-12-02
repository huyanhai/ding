<template>
	<view>
		<view v-if="orderInfo" class="orderStatus">
			<!-- <view class="g-header" v-if="orderInfo.storeName">
				<image class="logo" :src="orderInfo.orderProductDetailList.productPic"></image>
				<view class="container" style="line-height: 50upx;">
					<view class="name">{{orderInfo.storeName}}</view>
					<view class="region">{{orderInfo.storeRegion}}</view>
				</view>
			</view> -->
			<view class="padding1">
				<view class="sn">订单编号：<text style="color: #000;font-weight: bold;">{{orderInfo.orderSn}}</text></view>
				<view class="sn mt10">创建时间：<text style="color: #000;font-weight: bold;">{{orderInfo.createTime}}</text></view>
				<view class="flexbetween">
					<view class="sn mt10 font8">订单状态：<text style='color: #EBA542;font-weight: bold;'>{{orderInfo.orderStatusName}}</text></view>
					<view class="addressInfo mt10" v-if="orderInfo.isGift==1&&(orderInfo.receiverName||orderInfo.receiveRemainingTime)" style="border:1px solid #272A30;border-radius: 10rpx;padding: 2px;font-size: 23upx;">{{orderInfo.receiverName?'已领取':'好友未领取，'+formatDuring(orderInfo.receiveRemainingTime-curTimer)+'后将自动退单'}}</view>
					<view class="addressInfo mt10" v-if='orderInfo.payRemainingTime!=undefined' style="border:1px solid #272A30;border-radius: 10rpx;padding: 5px;font-size: 23upx;">剩\t<text style="color: #F0AD4E;">{{formatDuring(orderInfo.payRemainingTime-curTimer)}}</text>\t订单自动关闭</view>
				</view>
			</view>
		</view>

		<view class="goods-section">
			

			<!-- 商品列表 -->
			<view class="g-item" v-for="(item, index) in goodsData" :key="item.productId">
				<image :src="item.productPic"></image>
				<view class="right">
					<text class="title clamp fontB" style="margin-top: 15upx;">{{item.productName}}</text>
					<view class="price-box">
						<view class="price-left mtrpx10">
							<view class="gift" v-if="item.productType!=0">
								{{item.productType==1?'秒杀':(item.productType==2?'赠品':'礼包')}}
							</view>
							<text class="price fontB font14" style="color: #000;font-size: 30upx;">￥{{item.productActualPrice||item.productPrice}}<text style="color: #999;font-size: 24upx;text-decoration: line-through;" v-if="item.productActualPrice!=item.productPrice">￥{{item.productPrice}}</text></text>
						</view>
						<text class="number" style="font-size: 32upx;">x {{item.productQuantity}}</text>
					</view>
					<view style="margin-top: 12upx;" class="spec">{{item.sp1?item.sp1:''}} {{item.sp2?item.sp2:''}} {{item.sp3?item.sp3:''}}</view>
					<view class="flexend">
						<view style="z-index: 1;" class="action-btn afterSales" v-if="buttonItem.type!='share'" @click.stop="orderBtn(item,buttonItem.type+'Item')" v-for="buttonItem in item.buttons">
							{{buttonItem.name}}
						</view>
						<view v-if="item.statusName=='已退款'" class="action-btn mt10" style="height: 60rpx;line-height: 60rpx;color: #888;border: 1px solid #888;background-color: white;">
							<text>{{item.statusName}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 地址 -->
		<!-- <view>
			<view class="address-section">
				<view class="order-content">
					<image src="../../static/location.svg" style="width: 15px;height: 20px;margin: 0 10px;"></image>
					<view class="cen">
						<view class="top">
							<text class="name">{{orderInfo.receiverName}}</text>
							<text class="mobile">{{orderInfo.receiverPhone}}</text>
							<text v-if="orderInfo.orderStatus > 1 && orderInfo.orderStatus != 4" class="logistics" @click="logistics">查看物流</text>
						</view>
						<text class="address">{{orderInfo.receiverProvince}} {{orderInfo.receiverCity}} {{orderInfo.receiverRegion}}
							{{orderInfo.receiverDetailAddress}}</text>
					</view>
				</view>
			</view>
			地址
			<view v-else-if='orderInfo.isGift==1 && orderInfo.memberId != memberInfo.memberId'>
				<navigator url="/pages/address/address?source=1" class="address-section">
					<view v-if="addressData" class="order-content">
						<image src="../../static/location.svg" mode="" style="width: 15px;height: 20px;margin: 0 10px;"></image>
						<view class="cen">
							<view class="top">
								<text class="name">{{addressData.name}}</text>
								<text class="mobile">{{addressData.phoneNumber}}</text>
							</view>
							<text class="address fontB">地址:{{addressData.province}} {{addressData.region}} {{addressData.city}}
								{{addressData.detailAddress}}</text>
						</view>
						<text class="yticon icon-you"></text>
					</view>
					<view v-else class="order-content">
						<image src="../../static/location.png" mode="" style="width: 15px;height: 20px;margin: 0 10px;"></image>
						<view class="cen">
							<text class="selectAddress">请选择地址</text>
						</view>
						<text class="yticon icon-you"></text>
					</view>
				</navigator>
			</view>
		</view> -->
		<!-- 金额明细 -->
		<view class="yt-list" v-if="orderInfo">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">付款金额</text>
				<text class="cell-tip">￥{{orderInfo.payAmount}}</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip">￥{{orderInfo.totalAmount}}</text>
			</view> -->
			<view class="yt-list-cell b-b" v-if="orderInfo.couponAmount!=undefined&&orderInfo.couponAmount!=0">
				<text class="cell-tit clamp">优惠券优惠</text>
				<text class="cell-tip">￥{{orderInfo.couponAmount}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.flashAmount!=undefined&&orderInfo.flashAmount!=0">
				<text class="cell-tit clamp">秒杀优惠</text>
				<text class="cell-tip">￥{{orderInfo.flashAmount}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.giftsAmount!=undefined&&orderInfo.giftsAmount!=0">
				<text class="cell-tit clamp">赠品优惠</text>
				<text class="cell-tip">￥{{orderInfo.giftsAmount}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.freightAmount!=undefined&&orderInfo.freightAmount!=0">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">￥{{orderInfo.freightAmount}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.deliveryType==0||orderInfo.deliveryType==1">
				<text class="cell-tit clamp">收货方式</text>
				<text class="cell-tip">{{orderInfo.deliveryType==0 ?'自提':'快递'}}</text>
			</view>
			
			<view class="yt-list-cell b-b" v-if="orderInfo.receiverName">
				<text class="cell-tit clamp">收货人</text>
				<text class="cell-tip">{{orderInfo.receiverName}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.receiverPhone">
				<text class="cell-tit clamp">手机号</text>
				<text class="cell-tip">{{orderInfo.receiverPhone}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.deliveryType==1">
				<text class="cell-tit clamp">收货地址</text>
				<text class="cell-tip">{{orderInfo.receiverDetailAddress}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.giftGivingNickname && orderInfo.isGift==1">
				<text class="cell-tit clamp">赠送人昵称</text>
				<text class="cell-tip">{{orderInfo.giftGivingNickname}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.giftGivingIcon && orderInfo.isGift==1">
				<text class="cell-tit clamp">赠送人头像</text>
				<image :src="orderInfo.giftGivingIcon" mode="" style="width: 100rpx;height: 100rpx;"></image>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.giftReceiveNickname && orderInfo.isGift==1">
				<text class="cell-tit clamp">领取人昵称</text>
				<text class="cell-tip">{{orderInfo.giftReceiveNickname}}</text>
			</view>
			<view class="yt-list-cell b-b" v-if="orderInfo.giftReceiveIcon && orderInfo.isGift==1">
				<text class="cell-tit clamp">领取人头像</text>
				<image :src="orderInfo.giftReceiveIcon" mode="" style="width: 100rpx;height: 100rpx;"></image>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">备注</text>
				<view v-if="orderInfo.note" class="cell-tip">
					<text>{{orderInfo.note}}</text>
				</view>
				<view v-else class="cell-tip">
					<text>暂无</text>
				</view>
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer">
			<view class="price-content-right flexcenter">
				<button v-if="orderInfo.orderStatus==3" class="action-btn" type="default" open-type="contact">
					联系客服
				</button>
				<view v-if="buttonItem.type!='share'" class="action-btn" :class="[buttonItem.weight==1?'action-btns':'']" @click.stop="orderBtn(orderInfo,buttonItem.type)" v-for="buttonItem in orderInfo.buttons">
					{{buttonItem.name}}
				</view>
				<!-- <button v-if="buttonItem.type=='share'" class="action-btn" open-type="share" @click="tipFriend" v-for="buttonItem in orderInfo.buttons">分享好友</button> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressData: '', //地址信息
				orderInfo: '', //订单信息
				goodsData: '', //订单商品信息\
				orderId: '', //订单id
				sumbitFlag: false, //提交标志，防止重复提交,
				timer: 0,
				leftTime: 0,
				memberInfo: '',
				curTimer:0,
				orderProductDetailList:null
			}
		},
		async onLoad(option) {
			let that = this
			if (!option.orderId) {
				this.$api.msg("参数错误!");
				uni.navigateBack({});
				return;
			}
			this.orderId = option.orderId;
			setTimeout(function(){
				that.getOrderInfo();
			},800)
		},
		onShow() {
			this.timer = setInterval(()=>{
				this.curTimer+=1000;
				if(this.orderInfo.payRemainingTime!=undefined&&(this.orderInfo.payRemainingTime-this.curTimer)<=0){
					clearInterval(this.timer)
					setTimeout(()=>{
						this.getOrderInfo();
					},2000)
				}
				if(this.orderInfo.receiveRemainingTime!=undefined&&(this.orderInfo.receiveRemainingTime-this.curTimer)<=0){
					clearInterval(this.timer)
					setTimeout(()=>{
						this.getOrderInfo();
					},2000)
				}
			},1000)
			this.getOrderInfo();
		},
		onHide(){
			clearInterval(this.timer)
		},
		onUnload(){
			clearInterval(this.timer)
		},
		//分享
		onShareAppMessage() {
			return {
				"title": '您的好友送给您一份礼物:' + this.orderInfo.orderItem[0].productName + ',请速来领取!',
				"path": "/pages/order/giftOrder?orderId=" + this.orderInfo.orderId + "&_q=" + this.memberInfo.inviteCode,
				"imageUrl": 'http://bbcfqn.zuizhezhi.com/FuvMsET9Fm1MHP0JTV-1IAPvoN0W'
			};
		},
		methods: {
			orderBtn(item,type){
				let that = this;
				switch (type) {
					case 'pay':
						that.pay(item);
						break;
					case 'cancel':
						that.refundOrder(item);
						break;
					case 'cancelItem':
						that.refundOrderItem(item);
						break;	
					case 'confirm':
						that.stockOut(item)
						break;
					case 'delete':
						that.deleteOrder(item);
						break;
					default:
						break;
				}
			},
			formatDuring(mss) {
			    var hours = parseInt(mss/ (1000 * 60 * 60));
			    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
			    var seconds = parseInt((mss % (1000 * 60)) / 1000);
				if(hours<10){
					hours = '0'+hours
				}
				if(minutes<10){
					minutes = '0'+minutes
				}
				if(seconds<10){
					seconds = '0'+seconds
				}
			    return minutes + "分" + seconds + "秒";
			},
			stockOut(item){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确认收货?',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							});
							that.$http.orderStockOut({orderId:item.orderId}).then(result=>{
								if (result.code == 200) {
									that.$api.msg('收货成功')
									that.getOrderInfo();
								} else {
									that.$api.msg(result.message)
								}
								uni.hideLoading();
							})
						}
					}
				});
			},
			//删除订单
			deleteOrder(item) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定删除订单',
					success: function(res) {
						if (res.confirm) {
							that.delete(item)
						}
					}
				});
			},
			async delete(item) {
				uni.showLoading({
					title: '请稍后'
				})
				let options = {
					orderId: item.orderId
				};
				let result = await this.$http.deleteOrder(options);
				if (result.code) {
					setTimeout(() => {
						//请求网络,删除数据
						uni.hideLoading();
						uni.navigateBack({
							
						})
					}, 600)
				} else {
					this.$api.msg(result.message);
				}
			},
			cancelBuy(){
				uni.navigateTo({
					url:'orderRe/ReRequest?orderId='+ this.orderId + '&type=0'
				})
			},
			refuse() { //退款
				console.log(1)
			},
			//再次购买
			async reOrder(){
				uni.showLoading({
					title: "提交中"
				})
				let result = await this.$http.remindOrder({orderId:this.orderId});
				uni.hideLoading();
				if (result.code == 200) {
					this.getOrderInfo();
				} else {
					this.$api.msg(result.message);
				}
				this.$api.getMemberInfo();
			},
			async call(){
				uni.showLoading({
					title: "查询电话中"
				})
				let result = await this.$http.queryPhoneNumber();
				uni.hideLoading();
				if (result.code == 200) {
					uni.makePhoneCall({
					    phoneNumber: result.data
					});
				} else {
					this.$api.msg(result.message);
				}
				
			},
			//好友提交信息
			async submitInfo() {
				let that = this;
				if (this.addressData.id == undefined) {
					this.$api.msg('请选择收货地址!');
					return false;
				}
				let data = {
					memberReceiveAddressId: this.addressData.id,
					orderSn: this.orderInfo.orderSn
				}
				let result = await this.$http.receiveGift(data);
				if (result.code == 200) {
					this.$api.msg(result.message)
					setTimeout(function() {
						// that.getOrderInfo();
						uni.reLaunch({
							url: '../index/index'
						})
					}, 800)
				} else {
					this.$api.msg(result.message)
				}
			},
			//申请售后
			afterSales(id) {
				console.log(id)
				uni.navigateTo({
					url:'orderRe/orderRe?orderId='+this.orderId + '&productId=' + id
				})
			},
			//获取订单详情
			async getOrderInfo() {
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				let option = {
					orderId: this.orderId
				};
				let result = await this.$http.getOrderInfo(option);
				console.log('result',result)
				uni.hideLoading();
				if (result.code == 200) {
					if (result.data) {
						that.orderInfo = result.data;
						that.goodsData = that.orderInfo.orderItem;
						
					}
				}
			},
			//支付订单
			async pay() {
				uni.navigateTo({
					url: `/pages/money/pay?money=${this.orderInfo.payAmount}&orderId=${this.orderInfo.orderId}`
				})
			},
			//复制内容到剪贴板
			paste() {
				let that = this
				uni.setClipboardData({
					data: this.orderInfo.orderSn,
					success: function() {
						console.log(`复制:${that.orderInfo.orderSn}成功`);
					},
					fail: function() {
						console.log(`复制:${that.orderInfo.orderSn}失败`);
					}
				});
			},
			refundOrder(item){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定退款',
					success: function(res) {
						if (res.confirm) {
							that.refund(item)
						}
					}
				});
			},
			async refund(item){
				let options = {
					orderId: item.orderId
				};
				uni.showLoading({
					title: '请稍后'
				})
				let result = await this.$http.refundOrder(options);
				console.log(result, '返回结果');
				if (result.code == 200) {
					console.log(result, '执行成功');
					setTimeout(() => {
						this.getOrderInfo();
						uni.hideLoading();
					}, 600)
				} else {
					this.$api.msg(result.message);
					uni.hideLoading();
				}
			},
			refundOrderItem(item){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定退款',
					success: function(res) {
						if (res.confirm) {
							that.refundItem(item)
						}
					}
				});
			},
			async refundItem(item){
				console.log(item)
				let options = {
					orderItemId: item.orderItemId
				};
				uni.showLoading({
					title: '请稍后'
				})
				let result = await this.$http.refundOrderItem(options);
				console.log(result, '返回结果');
				if (result.code == 200) {
					console.log(result, '执行成功');
					this.getOrderInfo();
					uni.hideLoading();
				} else {
					this.$api.msg(result.message);
					uni.hideLoading();
				}
			},
			//取消订单
			async cancelOrder(item) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定取消订单',
					success: function(res) {
						if (res.confirm) {
							that.cancle(item)
						}
					}
				});
			},
			async cancelSingleOrder(){
				
			},
			async reminder(){
				console.log()
				let result = await this.$http.rushOrder({orderId:this.orderInfo.orderId})
				console.log(result)
				this.$api.msg(result.data);
			},
			async cancle(item) {
				let options = {
					orderId: item.orderId
				};
				uni.showLoading({
					title: '请稍后'
				})
				let result = await this.$http.cancelOrder(options);
				uni.hideLoading();
				if (result.code == 200) {
					this.$api.msg(result.message);
					this.getOrderInfo();
				} else {
					this.$api.msg(result.message);
				}
			},
			//提醒好友
			tipFriend() {
				uni.showShareMenu()
			},
			//确认收货
			getItem() {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '确认收货吗？',
					success: function(res) {
						if (res.confirm) {
							that.postGet(that);
						}
					}
				});
			},
			async postGet(t) {
				let _this = t;
				let result = await _this.$http.orderReceive({
					orderId: _this.orderInfo.orderId
				})
				if (result.code == 200) {
					this.$api.msg('确认收货成功');
					this.getOrderInfo();
				} else {
					this.$api.msg(result.message);
				}
			},
			//查看物流
			logistics() {
				uni.navigateTo({
					url: `/pages/order/logistics?orderId=${this.orderInfo.orderId}`
				})
			},
			setTimes(data) {
				var s;
				var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = (data % (1000 * 60)) / 1000;
				s = (hours < 10 ? ('0' + hours) : hours) + '时' + (minutes < 10 ? ('0' + minutes) : minutes) + '分' + (seconds < 10 ?
					('0' + seconds) : seconds) + '秒';
				return s;
				// return hours + '时' + minutes + '分' + seconds + '秒'
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: #000;
		}

		.selectAddress {
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.orderStatus {
		background: #fff;
		padding: 15upx 24upx 15upx 24upx;

		view {
			.sn {
				font-size: 30upx;
				color: #999;
			}

			.copy {
				padding: 5upx 20upx 5upx 20upx;
				color: $base-color;
				background: #fff9f9;
				font-size: 30upx;
				margin-left: 10upx;
				border: 1px solid #f7bcc8;
			}
		}

		.status {
			font-size: 30upx;
			color: $base-color;
		}

	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;
		margin-top: 16upx;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			flex-wrap: wrap;
			color: $font-color-dark;
			font-weight: bolder;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.logistics {
		padding: 5upx 20upx 5upx 20upx;
		color: #fff;
		background: #272A30;
		float: right;
		font-size: 30upx;
		margin-left: 10upx;
		border-radius: 10upx;
		margin-right: 30upx;
		border: 1px solid #272A30;
	}
	.g-header {
		display: flex;
		align-items: center;
		height: 120upx;
		padding: 0 30upx;
		position: relative;
		.region{
			color: rgb(29,199,172);
			font-size: 25upx;
			margin-left: 24upx;
		}
		.logo {
			display: block;
			width: 120upx;
			height: 120upx;
			border-radius: 120px;
		}
		
		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}
	}
		
	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding: 10px 0;

		

		.g-item {
			display: flex;
			margin: 20upx 50upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 180upx;
				height: 180upx;
				border-radius: 10upx;
				border: 1px solid #ccc;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
				// margin-left: 30px;
			}

			.price-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32upx;
				color: #000000;
				padding-top: 10upx;
				.price-left{
					display: flex;
					align-items: center;
				}
				.gift{
					width: 54upx;
					height: 30upx;
					line-height: 30upx;
					font-size: 20upx;
					border-radius: 6upx;
					margin-right: 10upx;
					text-align: center;
					color: #fff;
					background: linear-gradient(to right, rgb(242,142,38), rgb(253,100,79));
				}
				.price {
				}

				.number {
					font-size: 32upx;
					color: #000000;
					margin-top: 10rpx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-dark;
			margin-right: 10upx;
			font-weight: bolder;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;
			font-weight: bolder;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 120upx;
		justify-content: flex-end;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		// box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content-left {
			padding-left: 30upx;
		}

		.price-content-right {
			position: absolute;
			right: 30upx;
		}

		.price-tip {
			color: $font-base;
			margin-left: 8upx;
			font-weight: bolder;
		}

		.price {
			font-size: 38upx;
			color: $font-base;
			font-weight: bolder;
		}

		.pay {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 220upx;
			height: 70%;
			color: white;
			font-size: 32upx;
			background-color: black;
			border: 1px solid #000;
			margin-right: 30rpx;
			border-radius: 5px;
		}
	}

	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;

		.mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.mask-content {
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}

	.action-btn {
		display: block;
		width: 160upx;
		height: 60upx;
		margin-right: 24upx;
		line-height: 60upx;
		font-size: $font-sm + 2upx;
		color: #999999;
		border-radius: 15px;
		z-index: 9999;
		border: 1px solid #E4E7ED;
		text-align: center;

		&.afterSales {
			margin-top: 25rpx;
			height: 60rpx;
			line-height: 60rpx;
			background-color: white;
			color: black;
			width: 170rpx;
			margin-right: 0px;
		}

		&:after {
			border-radius: 5px;
		}

		&.recom {
			color: #fff;

			&:after {
				border-color: $border-color;
			}
		}
	}
	.action-btns {
		color: #efa023;
		border: 1px solid #efcf00;
	}
</style>
