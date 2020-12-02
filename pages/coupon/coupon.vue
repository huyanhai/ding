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
				<scroll-view class="list-scroll-content" scroll-y>
					<!-- 优惠券面板 -->
					<view class="mask show" v-if='tabItem.couponList.length>0'>
						<view class="mask-content" @click.stop.prevent="stopPrevent">
							<!-- 优惠券页面，仿mt -->
							<view class="coupon-item" v-for="(item,index) in tabItem.couponList" :key="index">
								<view style="display: flex;background: #fff;border-radius: 12upx;">
									<view class="con">
										<view class="top">
											<view class="title">
												<text class="tag">{{item.coupon.useType==0?'全场通用':(item.coupon.useType==0?'指定分类':'指定商品')}}</text>
												<text style="margin-left: 15upx;">{{item.coupon.name}}</text>
											</view>
											<text class="time">{{/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.coupon.startTime)+'~'+/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.coupon.endTime)}}</text>
										</view>
										<view class="bottom">
											<text class="tips">详细信息</text>
											<image style="width: 40upx;height: 40upx;" :src="item.showDetail==true?'../../static/up.png':'../../static/down.png'" mode="" @click="showDetail(item)"></image>
										</view>
										
										<view class="circle t"></view>
										<view class="circle r"></view>
									</view>
									<view class="right" :class="item.useStatus==0?'enable':'dis-enable'">
										<text class="price">{{item.coupon.amount}}</text>
										<text style="color: #fff;">满{{item.coupon.minPoint}}元可用</text>
									</view>
								</view>
								<view class="detail" v-if="item.showDetail==true">
									{{item.coupon.note||'暂无'}}
								</view>
							</view>
						</view>
					</view>
					<view v-else class="textcenter" style="margin-top: 40%;">
						<image src="../../static/noColloection.png" style="width: 300rpx;height: 400rpx;"></image>
						<view class="textcenter font10 fontcolor16">
							您的优惠券已经用光啦~
						</view>
					</view>
					<!-- <uni-load-more :status="tabItem.loadingType"></uni-load-more> -->
				</scroll-view>
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				maskState: 1, //优惠券面板显示状态
				couponList:[],
				tabCurrentIndex: 0, //当前页面下标(初始为 0 )
				sumbitFlag: false, //提交标志，防止重复提交
				navList: [{
						state: 0,
						text: '待使用',
						// loadingType: 'more',
						couponList: [],
						loaded:false
					},
					{
						state: 1,
						text: '已使用',
						// loadingType: 'more',
						couponList: [],
						loaded:false
					},
					{
						state: 2,
						text: '已过期',
						// loadingType: 'more',
						couponList: [],
						loaded:false
					},
				
				],
			}
		},
		async onLoad() {
			// let _this = this
			// uni.getSystemInfo({
			// 	success: function(data) {
			// 		// 将其赋值给this
			// 		console.log(data)
			// 		_this.height = data.windowWidth /4
			// 	}
			// })
			this.loadCouponList()
		},
		methods: {
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			async loadCouponList(){
				// if (source === 'tabChange' && thisTabItem.loaded === true) {
				// 	return;
				// }
				//获取当前Tab项信息
				let thisTabItem = this.navList[this.tabCurrentIndex];
				let list = await this.$http.couponList(thisTabItem.state)
				let couponList = list.data;
				couponList.forEach(item=>{
					item.showDetail = false;
				})
				thisTabItem.couponList = couponList
				// for(let i = 0;i<thisTabItem.couponList.length;i++){
				// 	thisTabItem.couponList[i].showDetail = false
				// }
			},
			//swiper 切换
			changeTab(e) {
				this.pageNum = 1;
				this.tabCurrentIndex = e.target.current;
				this.loadCouponList('tabChange');
			},
			showDetail(item){
				console.log(item,item.showDetail)
				item.showDetail = !item.showDetail
				console.log(item,item.showDetail)
			},
			stopPrevent(){
				
			}
		}
	}
</script>

<style lang="scss">
	page,
	.content{
		background-color: #f5f5f5;
		height:100%
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
	/* 优惠券面板 */
	.mask {
		display: flex;
		align-items: flex-end;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
	
		.mask-content {
			width: 100%;
			height: 100vh;
			background: #F7F8FC;
			transform: translateY(100%);
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
		margin: 20upx 24upx;
		.con {
			border-radius: 12upx;
			flex: 7;
			display: flex;
			// align-items: center;
			flex-direction: column;
			position: relative;
			height: 200upx;
			padding: 0 30upx;
	
			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-right: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
	
		.top {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.bottom{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60upx;
		}
		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
			display: flex;
			align-items: center;
		}
		.tag{
			padding: 0 15upx;
			height: 28upx;
			line-height: 28upx;
			border-radius: 28upx;
			background-color: #EBA542;
			color: #fff;
			font-size: 22upx;
		}
		.time {
			font-size: 24upx;
			color: $font-color-light;
		}
	
		.right {
			border-radius: 0 12upx 12upx 0;
			flex: 3.5;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			height: 200upx;
			background-color: #EBA542;
		}
		.enable{
			background-color: #EBA542;
		}
		.dis-enable{
			background-color: #C0C4CC;
		}
		.price {
			font-size: 44upx;
			color: #fff;
			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips {
			font-size: 24upx;
			color: $font-color-light;
			// line-height: 60upx;
		}
		.detail{
			margin-top: 5upx;
			background: #fff;
			padding: 30upx;
			z-index: 11;
			border-radius: 12upx;
			font-size: 24upx;
		}
		.circle {
			position: absolute;
			left: auto;
			right: -8upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f5f5f5;
			border-radius: 100px;
	
			&.r {
				
			}
			&.t {
				bottom: 190upx;
			}
		}
	}
	
</style>
