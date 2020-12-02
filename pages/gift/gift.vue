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
					<!-- 优惠券面板 -->
					<view class="detail-news">
						 <view class="detail-news-title">
							 <span>礼包列表</span>
						 </view>
					</view>
					<view v-if="tabItem.giftList.length>0" class="gift-item" v-for="(item,index) in tabItem.giftList" :style="picList[index%4]">
						<view class="gift-name">
							{{item.name}}
						</view>
						<view class="gift-center">
							<view class="btn" @click="shareFriend(item)"  v-if="!item.receiveNickname&&!item.giveNickname">
								送给朋友
							</view>
							<view class="portrait" v-if="item.receiveIcon||item.giveIcon">
								<image :src="item.receiveIcon||item.giveIcon" mode=""></image>
							</view>
							<view class="nickname" v-if="item.receiveNickname||item.giveNickname">
								{{item.receiveNickname||item.giveNickname}}
							</view>
							<view class="time">
								{{/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.createTime)}}获得
							</view>
						</view>
						<view class="gift-btn">
							<view class="" @click="navMealList(item)" :style="'color:'+colorList[index%4]" v-if="!item.receiveNickname">
								{{item.status==0?'立即开启':'已经开启'}}
							</view>
							<view class="" @click="navMealList(item)" :style="'color:'+colorList[index%4]" v-if="item.receiveNickname">
								已经赠送
							</view>
						</view>
					</view>
					<!-- <view class="mask show">
						<view class="mask-content">
							
						</view>
					</view> -->
					<view v-else class="textcenter" style="margin-top: 40%;">
						<image src="../../static/noColloection.png" style="width: 300rpx;height: 400rpx;"></image>
						<view class="textcenter font10 fontcolor16">
							您的礼包已经用光啦~
						</view>
					</view>
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="gift-mask" v-if="shareGiftShow" @click.stop.prevent="touchmoveStop">
			<view class="share-gift">
				<view class="gift-text">
					您可以把礼包赠送给好友
				</view>
				<view class="gift-share-btn">
					<button open-type="share">
					</button>
				</view>
			</view>
			<image style="width: 80upx;height: 80upx;margin-top: 20upx;" @click="hideMask" src="../../static/close.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore,
		},
		data() {
			return {
				pageSize: 10, //页数据
				pageNum: 1, //页面
				maskState: 1, //优惠券面板显示状态
				couponList:[],
				tabCurrentIndex: 0, //当前页面下标(初始为 0 )
				sumbitFlag: false, //提交标志，防止重复提交
				colorList:['#7382dc','#ff6766','#ef7013','#059058'],
				curGiftId:0,
				shareGiftShow:false,
				memberInfo:'',
				picList:[
					'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmYAAACxCAYAAABuiHE0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE5QjdBQUU4QjkxQzExRUFBM0Y4RDAyQUNCNUU0QzgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE5QjdBQUU5QjkxQzExRUFBM0Y4RDAyQUNCNUU0QzgxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTlCN0FBRTZCOTFDMTFFQUEzRjhEMDJBQ0I1RTRDODEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTlCN0FBRTdCOTFDMTFFQUEzRjhEMDJBQ0I1RTRDODEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz43fHCWAAANgUlEQVR42uzdbWxe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);',
					'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmYAAACxCAYAAABuiHE0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE5MzMxRTM5QjkxQzExRUFCQzQzOEYwRDA5MjEyRkYzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE5MzMxRTNBQjkxQzExRUFCQzQzOEYwRDA5MjEyRkYzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTkzMzFFMzdCOTFDMTFFQUJDNDM4RjBEMDkyMTJGRjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTkzMzFFMzhCOTFDMTFFQUJDNDM4RjBEMDkyMTJGRjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JcSYqAAANwElEQVR42uzda4xc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);',
					'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmYAAACxCAYAAABuiHE0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE4QjQ4MEVCQjkxQzExRUFBQjE1OTU0MzhFODNGQjRGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE4QjQ4MEVDQjkxQzExRUFBQjE1OTU0MzhFODNGQjRGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QThCNDgwRTlCOTFDMTFFQUFCMTU5NTQzOEU4M0ZCNEYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QThCNDgwRUFCOTFDMTFFQUFCMTU5NTQzOEU4M0ZCNEYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5Qj3xHAAANfklEQVR42uzde4xc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);',
					'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmYAAACxCAYAAABuiHE0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE4MTY2MzNEQjkxQzExRUE4RkY2QjFFQTk2ODk4NkI5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE4MTY2MzNFQjkxQzExRUE4RkY2QjFFQTk2ODk4NkI5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTgxNjYzM0JCOTFDMTFFQThGRjZCMUVBOTY4OTg2QjkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTgxNjYzM0NCOTFDMTFFQThGRjZCMUVBOTY4OTg2QjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7Bac22AAANnElEQVR42uzde2xe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);'
				],
				navList: [{
						state: 0,
						text: '全部',
						loadingType: 'more',
						giftList: [],
						loaded:false
					},
					{
						state: 1,
						text: '已开启',
						loadingType: 'more',
						giftList: [],
						loaded:false
					},
					{
						state: 2,
						text: '未开启',
						loadingType: 'more',
						giftList: [],
						loaded:false
					},
					{
						state: 3,
						text: '已赠送',
						loadingType: 'more',
						giftList: [],
						loaded:false
					},
					{
						state: 4,
						text: '已领取',
						loadingType: 'more',
						giftList: [],
						loaded:false
					},
				],
			}
		},
		async onLoad() {
			let memberInfo = await this.$api.getMemberInfo();
			this.memberInfo = memberInfo.data
		},
		async onShow(){
			this.loadData('reLoad')
		},
		//分享
		onShareAppMessage() {
			return {
				"title": "我赠送了一个礼包给你",
				"path": "/pages/index/index?giftId="+this.curGiftId+"&_q=" + this.memberInfo.inviteCode+"&portrait=" + this.memberInfo.headPicture + "&nickname=" + this.memberInfo.nickname,
				"imageUrl": "/static/libaoShare.png"
			};
		},
		methods: {
			touchmoveStop(){
				console.log('阻止滚动')
			},
			shareFriend(item){
				if(item.status==1){
					this.$api.msg('已经开启的礼包无法赠送');
					return;
				}
				if(item.receiveNickname!=undefined){
					this.$api.msg('已经赠送的礼包无法赠送');
					return;
				}
				this.curGiftId = item.id;
				this.shareGiftShow = true;
			},
			hideMask(){
				this.shareGiftShow = false;
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			navMealList(item){
				if(item.status==1){
					return;
				}
				if(item.receiveNickname!=undefined){
					return;
				}
				uni.navigateTo({
					url:'/pages/mealList/mealList?giftId='+item.id
				})
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
					params = {
						"pageSize": this.pageSize,
						"pageNum": this.pageNum,
						"giftStatus": thisTabItem.state,
					};
					result = await this.$http.getGiftList(params);
					if (result.code != 200) {
						return false;
					}
					let giftList = result.data;
					if (this.pageNum === 1) { //下拉刷新
						thisTabItem.giftList = giftList;
						uni.stopPullDownRefresh();
					} else { //加载更多
						giftList.forEach(item => {
							thisTabItem.giftList.push(item);
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
			//swiper 切换
			changeTab(e) {
				this.pageNum = 1;
				this.tabCurrentIndex = e.target.current;
				this.loadData('tabChange');
			},
		}
	}
</script>

<style lang="scss">
	page,
	.content{
		background-color: #F7F8FC;
		height:100%
	}
	.swiper-box {
		height: calc(100% - 40px);
	}
	.detail-news-title{
	    font-size: 16px;
	    font-weight: normal;
	    text-align: center;
	    padding-top: 14upx;
	    position: relative;
		color: #ee4863;
	}
	.detail-news-title::before{
	    content: "";
	    display: block;
	    width: 60vw;
	    height: 1px;
	    background: #ee4863;
	    position: absolute;
	    left: 50%;
	    margin-left: -30vw;
	    top: 18px;
	}
	.detail-news-title span{
	    padding: 0 10px;
	    background: #fff;
	    position: relative;
	    z-index: 2;
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
	.tab-content{
		width: 100%;
		height: 100vh;
		background: #ee4863;
		z-index: 9995;
		padding-top: 50upx;
		.list-scroll-content {
			width: 95%;
			margin-left: 2.5%;
			padding-top: 40upx;
			height: 1000upx;
			overflow-y: scroll;
			background-image: url(../../static/libaoBg.png);
			background-repeat:no-repeat;
			background-size:100% 100%;
		}
	}
	
	.gift-item{
		margin-top: 30upx;
		margin-left: 30upx;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 650upx;
		height: 190upx;
		background-repeat:no-repeat;
		background-size:100% 100%;
		color: #fff;
		font-size: 28upx;
		.gift-name{
			flex: 2;
			text-align: center;
			font-size: 40upx;
		}
		.gift-center{
			flex: 1.8;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			text-align: center;
			.btn{
				width: 180upx;
				height: 60upx;
				margin-left: 30upx;
				line-height: 60upx;
				border-radius: 60upx;
				border: 1upx solid #fff;
			}
			.portrait{
				image{
					border-radius: 8upx;
					width: 60upx;
					height: 60upx;
				}
			}
			.time{
				margin-top: 20upx;
			}
		}
		.gift-btn{
			flex: 1.2;
			view{
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 40upx;
				color: #000;
				width: 140upx;
				height: 140upx;
				border-radius: 100%;
				background-color: #fff;
			}
		}
	}
	.gift-mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		flex-direction: column;
		width: 100%;
		height: 100vh;
		justify-content: center;
		align-items: center;
		z-index: 998;
		background-color: rgba($color: #000000, $alpha: 0.5);
		.share-gift{
			width: 600upx;
			height: 654upx;
			background-image: url(../../static/share-gift.png);
			background-repeat:no-repeat;
			background-size:100% 100%;
			.gift-text{
				text-align: center;
				font-size: 35upx;
				margin-top: 180upx;
			}
			.gift-share-btn{
				button{
					width: 100%;
					height: 100%;
					border: none;
					background-color: transparent;
					padding: 0;
				}
				button::after{
					border: none;
				}
				margin-top: 310upx;
				margin-left: 90upx;
				width: 440upx;
				height: 80upx;
			}
		}
		
	}
	
</style>
