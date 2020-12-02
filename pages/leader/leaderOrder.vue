<template>
	<view class="content">
		<view class="navbar" v-if="type==0">
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
								<image :src="item.receiverIcon" mode=""></image>
							</view>
							<view class="leaderInfo">
								<view class="i-top">
									<text class="leaderName ui-nowrap">{{item.receiverNickname}}</text>
									<text class="leaderID"></text>
									<!-- <text class="state">{{item.orderStatus==1?'待发货':(item.orderStatus==2?'待核销':(item.orderStatus==3?'已核销':'已取消'))}}</text> -->
									<text class="state">{{item.orderStatusName}}</text>
								</view>
								<view class="i-top">
									<text class="time">{{item.createTime}}</text>
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
						<view class="price-box">
									共
									<text class="num">{{item.productsNum}}</text>
									件商品 总价:
									<text class="price">{{item.payAmount}}</text>
						</view>
						<view class="receiver">
							<view class="i-top">
								<view class="receiverName">收货人：{{item.receiverName}}</view>
								<view class="receiverName">手机号：{{item.receiverPhone}}</view>
								<view class="receiverName" v-if="item.deliveryType==1">详细地址：{{item.receiverDetailAddress}}</view>
							</view>
						</view>
						<view class="action-box b-t">
							<view>
								<button class="action-btn recom" @click.stop="orderBtn(item,buttonItem.type)" v-for="buttonItem in item.buttons">{{buttonItem.name}}</button>
							</view>
						</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- <view class="notice-button" @click="sendNotice">
			到货通知
		</view> -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
	import empty from "@/components/empty";
	import Json from '@/Json';
	export default {
		components: {
			uniLoadMore,
			uniIcons,
			empty
		},
		data() {
			return {
				pageSize: 10, //页数据
				pageNum: 1, //页面
				tabCurrentIndex: 0, //当前页面下标(初始为 0 )
				navList: [],
				type:0,//进入方式，0-》点击按钮进入，1-》扫码进入
				orderUserId:0,
				ip:''
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
		

		onLoad(options) {
			this.ip = this.$ip
			//识别当前tabItem下标
			console.log(options)
			this.type = options.type
			if(this.type==1){
				this.orderUserId = options.userId
			}
		},
		
		onShow(){
			this.navList = [
				{
					state: 5,
					text: '全部',
					loadingType: 'more',
					orderList: []
				},
				{
					state: 2,
					text: '待核销',
					loadingType: 'more',
					orderList: []
				},
				{
					state: 3,
					text: '已核销',
					loadingType: 'more',
					orderList: []
				},
				{
					state: 3,
					text: '已取消',
					loadingType: 'more',
					orderList: []
				},
			]
			this.loadData('reLoad');
		},

		methods: {
			orderBtn(item,type){
				let that = this;
				switch (type) {
					case 'promptArrival':
						that.prompt(item);
						break;
					case 'confirm':
						that.stockOut(item)
						break;
					default:
						break;
				}
			},
			//获取订单列表
			async loadData(source) {
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
					let params;
					if(this.type==1){
						params = {
							"pageSize": this.pageSize,
							"pageNum": this.pageNum,
							"orderStatus": thisTabItem.state,
							"memberId":this.orderUserId
						};
						result = await this.$http.getLeaderOrderListByCode(params);
					}else{
						params = {
							"pageSize": this.pageSize,
							"pageNum": this.pageNum,
							"orderStatus": thisTabItem.state
						};
						result = await this.$http.getLeaderOrderList(params);
					}
					if (result.code != 200) {
						return false;
					}
					let orderList = result.data;
					if (this.pageNum === 1) { //下拉刷新
						thisTabItem.orderList = orderList;
						uni.stopPullDownRefresh();
					} else { //加载更多
						orderList.forEach(item => {
							thisTabItem.orderList.push(item);
						})
					}
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
			//选中状态处理
			checked(item) {
				console.log(item)
				if(item.checked!=undefined){
					item.checked = !item.checked;
				}
			},
			//swiper 切换
			changeTab(e) {
				this.pageNum = 1;
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//订单详情
			orderInfo(item) {
				uni.navigateTo({
					url: `/pages/leader/leaderOrderInfo?orderId=${item.orderId}`
				})
			},
			sendNotice(){
				let ids = ''
				this.navList[0].orderList.forEach(e=>{
					if(e.checked){
						console.log(e)
						ids+=e.orderId+','
					}
				})
				this.$http.sendNotice(ids).then(res=>{
					console.log(res)
				})
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
			async prompt(item){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定提示到货?',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							});
							that.$http.promptArrive({orderId:item.orderId}).then(result=>{
								if (result.code == 200) {
									that.$api.msg('提示成功')
								} else {
									that.$api.msg(result.message)
								}
								uni.hideLoading();
							})
						}
					}
				});
			},
			stockOut(item){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定核销订单?',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							});
							that.$http.orderStockOut({orderId:item.orderId}).then(result=>{
								if (result.code == 200) {
									that.$api.msg('核销成功')
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
			navToOrderInfo(id){
				uni.navigateTo({
					url: `/pages/order/orderInfo?&orderId=${id}`
				})
			}
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
					border-bottom: 2px solid #1DC7AC;
				}
			}
		}
	}
	.notice-button {
		height: 80upx;
		width: 400upx;
		position: fixed;
		bottom: 5%;
		left: 25%;
		background-color: #A7D159;
		text-align: center;
		line-height: 80upx;
		border-radius: 20upx;
		color: #fff;
	}
	.uni-swiper-item {
		height: auto;
	}

	.order-item {
		display: flex;
		flex-direction: column;
		padding: 20up 0 20upx 20upx;
		background: #fff;
		margin-top: 16upx;
		.leader{
			padding-top: 10upx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			.leaderImg {
				flex: 1.5;
				display: flex;
				justify-content: center;
				// align-items: center;
				image {
					width: 80upx;
					height: 80upx;
					border-radius: 100%;
				}
			}
			.leaderInfo {
				flex: 8.5;
				.i-top {
					display: flex;
					align-items: center;
					height: 50upx;
					padding-right: 30upx;
					font-size: $font-base;
					color: $font-color-dark;
				
					.time {
						flex: 1;
					}
					.leaderName {
						flex: 6;
						font-size: 32upx;
						font-weight: 600;
						overflow: hidden;
						color: #000;
					}
					.leaderID {
						flex: 2;
						color: #EFAB5D;
					}
					.state {
						flex: 3;
						text-align: right;
						color: $base-color;
					}
				}
			}
		}
		.receiver{
			margin: 20upx 0 10upx 20upx;
			.receiverName {
				flex: 2.5;
				font-size: 25upx;
				color: #000;
			}
		}
		.user-info {
			background-color: #F7F8FC;
			display: flex;
			justify-content: space-between;
			height: 200upx;
			margin: 20upx 40upx;
			border-radius: 30upx;
			.user-portrait {
				display: flex;
				justify-content: center;
				align-items: center;
				flex: 9;
				margin-left: 20upx;
				image {
					width: 120upx;
					height: 120upx;
					border-radius: 100%;
					margin-right: 20upx;
				}
			}
			.user-cell {
				flex: 1;
				display: flex;
				justify-content: flex-end;
				.cell-more {
					align-self: center;
					font-size: 30upx;
					color: $font-color-base;
					margin-left: $uni-spacing-row-sm;
				}
			}
		}
		.order-bottom {
			display: flex;
			font-size: $font-base;
			color: $font-color-light;
			.box {
				flex: 2;
				color: #ED755D;
				view {
					width: 90upx;
					height: 50upx;
					line-height: 40upx;
					text-align: center;
					border-radius: 10upx;
					border: 1upx solid #ED755D;
				}
			}
			.num {
				flex: 5;
				text-align: right;
				line-height: 50upx;
			}
			.price {
				flex: 3;
				text-align: center;
				.product-price {
					font-size: 35upx;
					font-weight: 600;
					color: #000;
				}
			}
		}
		/* 多条商品 */
		.goods-box {
			height: 180upx;
			padding: 20upx 20upx 0;
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
				border: 1px solid #ddd;
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
				border: 1px solid #ddd;
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
				justify-content: flex-end;
				align-items: center;
				position: relative;
			}
			.checkbox {
				margin-right: 40upx;
			}
		}

		.action-btn {
			width: 160upx;
			height: 60upx;
			margin: 0;
			margin-right: 24upx;
			padding: 0;
			text-align: center;
			line-height: 60upx;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			background: #fff;
			border-radius: 100px;
			z-index: 9999;

			&:after {
				border-radius: 100px;
			}

			&.recom {
				background: #fff9f9;
				color: $base-color;

				&:after {
					border-color: #f7bcc8;
				}
			}
		}
	}


	/* load-more */
	.uni-load-more {
		display: flex;
		flex-direction: row;
		height: 80upx;
		align-items: center;
		justify-content: center
	}

	.uni-load-more__text {
		font-size: 28upx;
		color: #999
	}

	.uni-load-more__img {
		height: 24px;
		width: 24px;
		margin-right: 10px
	}

	.uni-load-more__img>view {
		position: absolute
	}

	.uni-load-more__img>view view {
		width: 6px;
		height: 2px;
		border-top-left-radius: 1px;
		border-bottom-left-radius: 1px;
		background: #999;
		position: absolute;
		opacity: .2;
		transform-origin: 50%;
		animation: load 1.56s ease infinite
	}

	.uni-load-more__img>view view:nth-child(1) {
		transform: rotate(90deg);
		top: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(2) {
		transform: rotate(180deg);
		top: 11px;
		right: 0
	}

	.uni-load-more__img>view view:nth-child(3) {
		transform: rotate(270deg);
		bottom: 2px;
		left: 9px
	}

	.uni-load-more__img>view view:nth-child(4) {
		top: 11px;
		left: 0
	}

	.load1,
	.load2,
	.load3 {
		height: 24px;
		width: 24px
	}

	.load2 {
		transform: rotate(30deg)
	}

	.load3 {
		transform: rotate(60deg)
	}

	.load1 view:nth-child(1) {
		animation-delay: 0s
	}

	.load2 view:nth-child(1) {
		animation-delay: .13s
	}

	.load3 view:nth-child(1) {
		animation-delay: .26s
	}

	.load1 view:nth-child(2) {
		animation-delay: .39s
	}

	.load2 view:nth-child(2) {
		animation-delay: .52s
	}

	.load3 view:nth-child(2) {
		animation-delay: .65s
	}

	.load1 view:nth-child(3) {
		animation-delay: .78s
	}

	.load2 view:nth-child(3) {
		animation-delay: .91s
	}

	.load3 view:nth-child(3) {
		animation-delay: 1.04s
	}

	.load1 view:nth-child(4) {
		animation-delay: 1.17s
	}

	.load2 view:nth-child(4) {
		animation-delay: 1.3s
	}

	.load3 view:nth-child(4) {
		animation-delay: 1.43s
	}

	@-webkit-keyframes load {
		0% {
			opacity: 1
		}

		100% {
			opacity: .2
		}
	}
</style>

