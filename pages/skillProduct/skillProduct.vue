<template>
	<view class="content">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				<view class="" style="font-size: 36upx;font-weight: bold;">
					{{item.startTime.split(':')[0]+':'+item.startTime.split(':')[1]}}
				</view>
				<view class="" style="font-size: 24upx;margin-top: 6upx;">
					{{item.type==0?'已过期':(item.type==1?'疯抢中':'未开抢')}}
				</view>
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList[tabCurrentIndex].productList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.plist.length === 0"></empty>
					<view class="time">
						距离结束时间:<text style="color: #ff4461;font-size: 40upx;margin-left: 10upx;">{{endTimeString}}</text>
					</view>
					<!-- 订单列表 -->
					<view class="p-list">
						<view  class="p-item" v-for="item in tabItem.plist.productList" :key="item.id" @click="navToDetailPage(item)">
							<view class="p-img">
								<image :src="item.pic"></image>
							</view>
							<view class="none-tip" v-if="item.flashPromotionCount<=0">
								抢光了
							</view>
							<view class="p-content">
								<view class="p-name">
									{{item.name}}
								</view>
								<!-- <view class="p-desc">
									{{item.description}}
								</view> -->
								<view class="p-sale">
									秒杀价
								</view>
								<view class="p-price">
									<view class="price">
										￥{{item.flashPromotionPrice}}
									</view>
									<view class="dis-price">
										￥{{item.price}}
									</view>
								</view>
							</view>
							<view class="p-button">
								<view class="btn" :class="item.flashPromotionCount>0?'btn-normal':'btn-gray'">
									{{item.flashPromotionCount>0?'立即秒杀':'抢光了'}}
								</view>
							</view>
						</view>
					</view>
					
					<!-- <uni-load-more :status="tabItem.loadingType"></uni-load-more> -->
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
	import wfalls from 'components/wfalls-flow/wfalls-flow3'
	import empty from "@/components/empty";
	import Json from '@/Json';
	export default {
		components: {
			uniLoadMore,
			uniIcons,
			empty,
			wfalls
		},
		data() {
			return {
				pageSize: 10, //页数据
				pageNum: 1, //页面
				tabCurrentIndex: 0, //当前页面下标(初始为 0 )
				navList: [],
				type:0,//进入方式，0-》点击按钮进入，1-》扫码进入
				orderUserId:0,
				ip:'',
				plist:'',
				endTime:'2020-06-24T10:25:50.000Z',
				endTimeString:'00:00:00'
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
					state: 0,
					text: '9点场',
					loadingType: 'more',
					plist: []
				},
				// {
				// 	state: 1,
				// 	text: '12点场',
				// 	loadingType: 'more',
				// 	plist: []
				// },
				// {
				// 	state: 2,
				// 	text: '15点场',
				// 	loadingType: 'more',
				// 	plist: []
				// },
				// {
				// 	state: 3,
				// 	text: '18点场',
				// 	loadingType: 'more',
				// 	plist: []
				// },
			]
			// this.loadData('reLoad');
			this.loadFlashData()
		},

		methods: {
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
			    return  hours + ":" + minutes + ":" + seconds;
			},
			async loadFlashData(){
				let res = this.$http.getFlashList();
				if(res.code==200){
					this.navList = res.data
				}
			},
			//获取秒杀列表
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
					params = {
						"pageSize": this.pageSize,
						"pageNum": this.pageNum,
						"orderStatus": thisTabItem.state
					};
					result = await this.$http.getFlashList();
					if (result.code != 200) {
						return false;
					}
					let plist;
					let flashList = result.data;
					flashList.forEach(item=>{
						console.log(item)
						if(item.type==1){
							plist = item
						}
					})
					// let plist = result.data;
					if (this.pageNum === 1) { //下拉刷新
						thisTabItem.plist = plist
						setInterval(()=>{
							let nowTime = new Date().getTime();
							let day = new Date().getDate();
							let month = new Date().getMonth()+1;
							let year = new Date().getFullYear();
							let endTime_ = Date.parse(year+'-'+month+'-'+day+' '+thisTabItem.plist.endTime);
							let time = endTime_ - nowTime
							this.endTimeString = this.formatDuring(time)
						},1000)
						uni.stopPullDownRefresh();
					} else { //加载更多
						// plist.forEach(item => {
						// 	thisTabItem.plist.push(item);
						// })
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
			//swiper 切换
			changeTab(e) {
				this.pageNum = 1;
				this.tabCurrentIndex = e.target.current;
				// this.loadData('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			//详情页
			navToDetailPage(item) {
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				});
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
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}
	.time{
		margin-left: 20upx;
		height: 100upx;
		line-height: 100upx;
		font-size: 30upx;
	}
	.p-list{
		padding: 20upx 0;
		background-color: #fff;
		.p-item {
			margin-top: 1upx;
			margin: 20upx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
			height: 200upx;
			position: relative;
			.p-img {
				width: 35%;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 200upx;
					height: 200upx;
					border-radius: 10upx;
				}
			}
			.none-tip{
				position: absolute;
				width: 120upx;
				height: 120upx;
				border-radius: 100%;
				top: 40upx;
				left: 60upx;
				color: #fff;
				text-align: center;
				line-height: 120upx;
				font-size: 30upx;
				background-color: rgba($color: #000000, $alpha: 0.5);
			}
			.p-content {
				width: 40%;
				.p-name {
					color: #000;
					height: 60upx;
					line-height: 60upx;
					font-size: 32upx;
					font-weight: bold;
					overflow: hidden;
				}
				.p-desc{
					height: 60upx;
					line-height: 60upx;
				}
				.p-sale{
					height: 60upx;
					line-height: 60upx;
					color: #ec672c;
					height: 30upx;
					line-height: 30upx;
					font-size: 24upx;
					overflow: hidden;
				}
				.p-sku {
					font-size: 28upx;
				}
				.p-price {
					display: flex;
					flex-direction: row;
					line-height: 60upx;
					.price{
						color: #ec672c;
						height: 60upx;
						font-size: 35upx;
						font-weight: bold;
					}
					.dis-price{
						margin-left: 16upx;
						color: #999999;
						height: 60upx;
						font-size: 28upx;
						text-decoration: line-through;
					}
				}
			}
			.p-button {
				width: 30%;
				.btn{
					width: 180upx;
					height: 60upx;
					line-height: 60upx;
					text-align: center;
					border-radius: 60upx;
					color: #fff;
				}
				.btn-normal{
					background-color: #1dc7ac;
				}
				.btn-gray{
					background-color: #999;
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
			margin-left: 20upx;
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
			height: 160upx;
			padding: 10upx 0;
			white-space: nowrap;

			.goods-item {
				width: 120upx;
				height: 120upx;
				display: inline-block;
				margin-right: 24upx;
			}

			.goods-img {
				display: block;
				width: 100%;
				height: 100%;
			}
		}

		/* 单条商品 */
		.goods-box-single {
			display: flex;
			padding: 20upx 0;

			.goods-img {
				display: block;
				width: 120upx;
				height: 120upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-size: $font-base + 2upx;
					color: $font-color-dark;
					line-height: 1;
				}

				.attr-box {
					font-size: $font-sm + 2upx;
					color: $font-color-light;
					padding: 10upx 12upx;
				}

				.price {
					font-size: $font-base + 2upx;
					color: $font-color-dark;

					&:before {
						content: '￥';
						font-size: $font-sm;
						margin: 0 2upx 0 8upx;
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

