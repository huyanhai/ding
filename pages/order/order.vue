<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0"></empty>

					<!-- 订单列表 -->
					<view v-for="(item,index) in tabItem.orderList" :key="index" class="order-item" @click="orderInfo(item)">
						<view class="leader">
							<view class="leaderImg">
								<image src="../../static/shop.png" mode=""></image>
							</view>
							<view class="leaderInfo">
								<view class="i-top">
									<text class="leaderName ui-nowrap">{{item.storeName}}></text>
									<view class="state" style="color: #CD0000;">{{item.orderStatusName}}</view>
								</view>
							</view>
						</view>
						<scroll-view v-if="item.orderItem.length > 1" class="goods-box" scroll-x>
							<view v-for="(goodsItem, goodsIndex) in item.orderItem" :key="goodsIndex" class="goods-item">
								<image class="goods-img" :src="goodsItem.productPic" mode="aspectFill"></image>
							</view>
						</scroll-view>
						<view v-if="item.orderItem.length === 1" class="goods-box-single" v-for="(goodsItem, goodsIndex) in item.orderItem"
						 :key="goodsIndex">
							<image class="goods-img" :src="goodsItem.productPic" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{goodsItem.productName}}</text>
								<text class="attr-box">{{goodsItem.sp1 !== undefined ? goodsItem.sp1 : ''}} {{goodsItem.sp2 !== undefined ? goodsItem.sp2 : ''}}
									{{goodsItem.sp3 !== undefined ? goodsItem.sp3 : ''}}</text>
								<view class="price-left">
									<view class="gift" v-if="goodsItem.productType!=0">
										{{goodsItem.productType==1?'秒杀':(goodsItem.productType==2?'赠品':'礼包')}}
									</view>
									<text class="price" style="color: #000000;font-weight: bolder;font-size: 30upx;">{{goodsItem.productActualPrice||item.productPrice}}<text style="color: #999;font-size: 24upx;text-decoration: line-through;" v-if="goodsItem.productActualPrice!=goodsItem.productPrice">￥{{goodsItem.productPrice}}</text></text>
									<text style="color: #999;font-weight: bolder;font-size: 32upx;margin-left: 20px;">x{{goodsItem.productQuantity}}</text>
								</view>
							</view>
						</view>
						<view class="font9 ml20 mt10" v-if="item.isGift==1">
							<view v-if='item.receiveRemainingTime!=undefined'>
								<view class="" v-if="(item.receiveRemainingTime-curTimer)>0">
									<text style="color: #EBA542;">注：</text><text>好友未领取，{{formatDuring(item.receiveRemainingTime-curTimer)}}自动超时退单</text>
								</view>
								<view class="" v-if="(item.receiveRemainingTime-curTimer)<=0">
									<text style="color: #EBA542;">注：</text>订单处理中</text>
								</view>
							</view>
							<view v-if="item.receiverName!=undefined">
								<text style="color: #EBA542;">注：</text><text>好友已领取</text>
							</view>
						</view>
						<view class="font8 ml20 mt10" v-if=" item.isGift==1 && memberInfo.memberId != item.memberId">
							<text style="color: #EBA542;"></text><text>好友赠送订单</text>
						</view>
						<view class="font9 ml20 mt10" v-if="item.payRemainingTime!=undefined">
							<view style="color: #000;" v-if="(item.payRemainingTime-curTimer)>0"><text style="color: #F0AD4E;">注：</text>剩\t<text style="color: #F0AD4E;">{{formatDuring(item.payRemainingTime-curTimer)}}</text>\t订单自动关闭</view>
							<view style="color: #000;" v-if="(item.payRemainingTime-curTimer)<=0"><text style="color: #F0AD4E;">注：</text>订单处理中</view>
						</view>
						<view class="price-box">
									共
									<text class="num">{{item.productsNum}}</text>
									件商品 {{item.orderStatusName}}
									<text class="price">{{item.payAmount}}</text>
						</view>
						<view class="flexbetween">
							<view>
								<view style="color: #EBA542;" class="padding1 font10 mt5"><!-- {{item.orderStatusName}} --></view>
							</view>
							<view class="action-box">
								<!-- <view class="action-btn" @click.stop="orderBtn(item,'logistics')" >
									查看物流
								</view> -->
								<view v-if="buttonItem.type!='share'" class="action-btn" :class="[buttonItem.weight==1?'action-btns':'']" @click.stop="orderBtn(item,buttonItem.type)" v-for="buttonItem in item.buttons">
									{{buttonItem.name}}
								</view>
							</view>
						</view>
					</view>
					<!-- <view v-else v-for="item in tabItem.orderList" :key="item.id" class="order-item" @click="returnInfo(item)" v-if='tabItem.state==5'>
						<view class="goods-box-single">
							<image class="goods-img" :src="item.productPic" mode="aspectFill"></image>
							<view class="right">
								<text class="title clamp">{{item.productName}}</text>
								<view class="mtrpx15">
									<text class="price" style="color: #000000;font-weight: bolder;font-size: 16px;">{{item.productRealPrice}}</text>
									<text style="color: #999;font-weight: bolder;font-size: 12px;margin-left: 20px;margin-top: 20rpx;">x{{item.productCount}}</text>
								</view>
							</view>
						</view>
						<view class="flexbetween">
							<view  style="text-align: center;padding: 3px;color:#EBA542;width: 70px;margin-right:30px;margin-bottom: 30rpx;">
								{{item.statusName}}
							</view>
							<view @click.stop="returnInfo(item)" style="text-align: center;border: 1px solid #272A30;border-radius: 10rpx;padding: 5px;color: #272A30;width: 100px;margin-right:30px;margin-bottom: 30rpx;background-color: white;">
								查看详情
							</view>
						</view>
					</view> -->
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	import Json from '@/Json';
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				scrollLeft:0,
				memberInfo: {},
				pageSize: 10, //页数据
				pageNum: 1, //页面
				tabCurrentIndex: 0, //当前页面下标(初始为 0 )
				sumbitFlag: false, //提交标志，防止重复提交
				curItem:'',
				curTimer:0,
				timer:0,
				navList: [{
						state: 5,
						text: '全部',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 0,
						text: '待支付',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 1,
						text: '待发货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 2,
						text: '待收货',
						loadingType: 'more',
						orderList: []
					},
					{
						state: 3,
						text: '已完成',
						loadingType: 'more',
						orderList: []
					}

				],
			};
		},

		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.pageNum = 1;
			this.loadData();
		},

		async onLoad(options) {
			//识别当前tabItem下标
			switch (options.state) {
				case '5':
					this.tabCurrentIndex = 0;
					break;
				case '0':
					this.tabCurrentIndex = 1;
					break;
				case '1':
					this.tabCurrentIndex = 2;
					break;
				case '2':
					this.tabCurrentIndex = 3;
					break;
			}
			let memberInfo = await this.$api.getMemberInfo();
			this.memberInfo = memberInfo.data;
		},

		onShow() {
			this.timer = setInterval(()=>{
				this.curTimer+=1000;
			},1000)
			this.loadData('reLoad');
		},
		onHide(){
			clearInterval(this.timer)
		},
		onUnload(){
			clearInterval(this.timer)
		},
		//分享
		// onShareAppMessage() {
		// 	console.log(this.curItem)
		// 	return {
		// 		"title": '您的好友送给您一份礼物:,请速来领取!',
		// 		"path": "/pages/order/giftOrder?orderId=" + this.orderInfo.orderId,
		// 		"imageUrl": '../../static/sharePeople.png'
		// 	};
		// },
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
					case 'confirm':
						that.stockOut(item)
						break;
					case 'delete':
						that.deleteOrder(item);
						break;
					case 'logistics':
						that.logistics(item);
						break;
					default:
						break;
				}
			},
			logistics(item){
				uni.navigateTo({
					url:`/pages/order/logistics?orderId=${item.orderId}`
				});
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
									that.loadData('reLoad');
								} else {
									that.$api.msg(result.message)
								}
								uni.hideLoading();
							})
						}
					}
				});
			},
			returnInfo(item){
				console.log(item)
				uni.navigateTo({
					url:'/pages/order/orderRe/reResult?returnId='+item.id
				})
			},
			tipFriend(item) {
				// uni.showShareMenu()
				this.curItem = item
			},
			//获取订单列表
			async loadData(source) {
				let that = this;
				//获取当前Tab项信息
				let thisTabItem = this.navList[this.tabCurrentIndex];
				
				if (source === 'tabChange' && thisTabItem.loaded === true) {
					//tab切换只有第一次需要加载数据
					return;
				}
				if (source === 'reLoad') {
					//tab切换只有第一次需要加载数据
					this.pageNum = 1
				}
				if (thisTabItem.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				
				thisTabItem.loadingType = 'loading';
				setTimeout(async () => {
					let result = undefined
					let params = {
						"pageSize": this.pageSize,
						"pageNum": this.pageNum,
						"orderStatus": thisTabItem.state
					};
					console.log("params",params)
					result = await this.$http.getOrderList(params);
					console.log("result",result)
					if (result.code != 200) {
						return false;
					}
					let orderList = result.data || [];
					
					// orderList.map(item => {
					// 	item.orderItem = item.orderProductDetailList;
					// })
					
					if (this.pageNum === 1) { //下拉刷新
						thisTabItem.orderList = orderList;
						uni.stopPullDownRefresh();
					} else { //加载更多
						if(thisTabItem.state==0){
							thisTabItem.orderList.forEach(e=>{
								e.payRemainingTime -= this.curTimer;
							})
						}
						if(thisTabItem.state==4){
							thisTabItem.orderList.forEach(e=>{
								e.receiveRemainingTime -= this.curTimer;
							})
						}
						orderList.forEach(item => {
							thisTabItem.orderList.push(item);
						})
						
					}
					this.curTimer = 0;
					this.pageNum = this.pageNum + 1;
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(thisTabItem, 'loaded', true);
					if (result.data.length > 0) {
						//判断是否还有数据， 有改为 more， 没有改为noMore 
						thisTabItem.loadingType = 'more';
					} else {
						thisTabItem.loadingType = 'noMore';
					}
				}, 600);
			},

			//swiper 切换
			changeTab(e) {
				this.pageNum = 1;
				this.tabCurrentIndex = e.target.current;
				if(this.tabCurrentIndex==6){
					this.scrollLeft = 100
				}else if(this.tabCurrentIndex==0){
					this.scrollLeft = 0
				}
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//订单详情
			orderInfo(item) {
				// if()
				uni.navigateTo({
					url: `/pages/order/orderInfo?orderId=${item.orderId}`
				})
			},
			//删除订单
			deleteOrder(item, index) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定删除订单',
					success: function(res) {
						if (res.confirm) {
							that.delete(item, index)
						}
					}
				});
			},
			async delete(item, index) {
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
						this.navList[this.tabCurrentIndex].orderList.splice(index, 1);
						uni.hideLoading();
					}, 600)
				} else {
					this.$api.msg(result.message);
				}
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
						let {
							stateTip,
							stateTipColor
						} = this.orderStateExp(9);
						item = Object.assign(item, {
							state: 9,
							stateTip,
							stateTipColor
						})
				
						//取消订单后删除待付款中该项
						let list = this.navList[this.tabCurrentIndex].orderList;
						let index = list.findIndex(val => val.id === item.id);
						console.log(val => val.id === item.id, 'ID');
						index !== -1 && list.splice(index, 1);
						uni.hideLoading();
					}, 600)
				} else {
					this.$api.msg(result.message);
					uni.hideLoading();
				}
			},
			//取消订单
			cancelOrder(item) {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定取消订单',
					success: function(res) {
						if (res.confirm) {
							that.cancel(item)
						}
					}
				});
			},
			async cancel(item) {
				let options = {
					orderId: item.orderId
				};
				uni.showLoading({
					title: '请稍后'
				})
				let result = await this.$http.cancelOrder(options);
				if (result.code == 200) {
					console.log(result, '执行成功');
					setTimeout(() => {
						let {
							stateTip,
							stateTipColor
						} = this.orderStateExp(9);
						item = Object.assign(item, {
							state: 9,
							stateTip,
							stateTipColor
						})

						//取消订单后删除待付款中该项
						let list = this.navList[this.tabCurrentIndex].orderList;
						let index = list.findIndex(val => val.id === item.id);
						console.log(val => val.id === item.id, 'ID');
						index !== -1 && list.splice(index, 1);
						uni.hideLoading();
					}, 600)
				} else {
					this.$api.msg(result.message);
					uni.hideLoading();
				}
			},
			//订单状态文字和颜色
			orderStateExp(state) {
				let stateTip = '',
					stateTipColor = '#fa436a';
				switch (+state) {
					case 1:
						stateTip = '待付款';
						break;
					case 2:
						stateTip = '待收货';
						break;
					case 9:
						stateTip = '订单已关闭';
						stateTipColor = '#909399';
						break;
						//更多自定义
				}
				return {
					stateTip,
					stateTipColor
				};
			},
			//支付订单
			async pay(item) {
				uni.navigateTo({
					url: `/pages/money/pay?money=${item.payAmount}&orderId=${item.orderId}`
				})
			},
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}

	.swiper-box {
		height: calc(100% - 40px);
	}

	.list-scroll-content {
		height: 100%;
	}

	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;
	
		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 28upx;
			color: #666666;
			position: relative;
	
			&.current {
				color: #000;
				font-size: 35upx;
				font-weight: bold;
				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #CD0000;
				}
			}
		}
	}

	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding-left: 30upx;
		background: #fff;
		margin: 20upx 24upx 0 24upx;
		border-radius: 24upx;
		.leader{
			padding-top: 40upx;
			display: flex;
			.leaderImg {
				margin-right: 20upx;
				image {
					width: 32upx;
					height: 32upx;
				}
			}
			.leaderInfo {
				flex: 10;
				.i-top {
					display: flex;
					padding-right: 30upx;
					font-size: $font-base;
					color: $font-color-dark;
					.leaderName {
						flex: 5;
						font-size: 28upx;
						margin-top: 3upx;
						overflow: hidden;
						color: #333333;
					}
					.state {
						flex: 3;
						text-align: right;
						color: $base-color;
					}
				}
			}
		}

		/* 多条商品 */
		.goods-box {
			height: 180upx;
			padding: 20upx 0 0;
			white-space: nowrap;

			.goods-item {
				width: 140upx;
				height: 140upx;
				display: inline-block;
				margin-right: 24upx;

			}

			.goods-img {
				display: block;
				width: 180upx;
				height: 100%;
				// border: 1px solid #ddd;
				border-radius: 10rpx;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 40upx 20upx 0;
			.goods-img {
				display: block;
				width: 180upx;
				height: 180upx;
				// border: 1px solid #ddd;
				border-radius: 10rpx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 5rpx 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					font-weight: bolder;
					margin-top: 5rpx;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 20upx 0;
				}
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
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 0;
					}
				}
			}
		}

		.price-box {
			display: flex;
			justify-content: flex-end;
			align-items: baseline;
			padding: 20upx 30upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.num {
				margin: 0 8upx;
				color: $font-color-dark;
			}

			.price {
				font-size: $font-lg;
				color: $font-color-dark;

				&:before {
					content: '￥';
					font-size: $font-sm;
					margin: 0 2upx 0 8upx;
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 100upx;
			position: relative;

			view {
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
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
			color: #CD0000;
			border: 1px solid #CD0000;
		}
	}

</style>
