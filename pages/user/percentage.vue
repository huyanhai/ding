<template>
	<view style="height: 100vh;">
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{current: tabCurrentIndex === index}"
			 @click="tabClick(index)">
				{{item.text}}
			</view>
		</view>
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadDetail">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.content.length === 0"></empty>
		
					<view class="detail-section" v-for="item in tabItem.content">
						<view class="detail-right">
							<view class="detail-remark">{{item.title}}</view>
							<view class="detail-change">
								{{item.amount}}
							</view>
							<view class="change-date">{{item.createTime}}</view>
						</view>
						<view class="detail-btn">
							<view class="btn" v-if="item.status==1" @click="withdrawApply(item)">
								处理
							</view>
							<view class="detail-timer" v-if="item.status==1">
								<text style="color: #FF5F33;">{{item.autoEndTime}}</text>后失效
							</view>
							<view class="" v-if="item.status!=1">
								{{item.status==0?'未处理':(item.status==2?'处理中':(item.status==3?'处理成功':'已失效'))}}
							</view>
						</view>
					</view>
					
					<uni-load-more :status="tabItem.loadingType"></uni-load-more>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				content:null,
				navList: [],
				pageSize: 10, //页数据
				pageNum: 1, //页面
				tabCurrentIndex: 0, //当前页面下标(初始为 0 )
			};
		},
		onLoad() {
			this.navList = [
				{
					state: 0,
					text: '全部',
					loadingType: 'more',
					content: []
				},
				{
					state: 1,
					text: '未处理',
					loadingType: 'more',
					content: []
				},
				{
					state: 2,
					text: '待处理',
					loadingType: 'more',
					content: []
				},
				{
					state: 3,
					text: '已处理',
					loadingType: 'more',
					content: []
				},
				{
					state: 4,
					text: '已失效',
					loadingType: 'more',
					content: []
				},
			]
			this.loadDetail('reLoad')
		},
		methods:{
			withdrawApply(item){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定提现?',
					success: function(res) {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中'
							});
							that.$http.withdrawApply({memberDistributionId:item.id}).then(result=>{
								that.loadDetail('reLoad');
								// if (result.code == 200) {
								// 	that.$api.msg('提现成功')
								// } else {
								// 	that.$api.msg(result.message)
								// }
								uni.hideLoading();
							})
						}
					}
				});
			},
			//swiper 切换
			changeTab(e) {
				this.pageNum = 1;
				this.tabCurrentIndex = e.target.current;
				this.loadDetail('tabChange');
			},
			//顶部tab点击
			tabClick(index) {
				this.tabCurrentIndex = index;
			},
			loadDetail(source){
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
						"status": thisTabItem.state
					};
					result = await this.$http.queryMemberDistribution(params);
					if (result.code != 200) {
						return false;
					}
					let content = result.data;
					if (this.pageNum === 1) { //下拉刷新
						thisTabItem.content = content;
						uni.stopPullDownRefresh();
					} else { //加载更多
						content.forEach(item => {
							thisTabItem.content.push(item);
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
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #f5f5f5;
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
	.detail-section{
		display: flex;
		justify-content: space-around;
		height: 208upx;
		background-color: #fff;
		margin: 20upx 20upx 10upx;
		padding: 32upx 24upx;
		border-radius: 20upx;
		.detail-right{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 45%;
			.detail-change {
				// margin-top: 16upx;
				font-weight: 600;
				font-size: 32upx;
			}
			.detail-remark{
				font-size: 24upx;
			}
			.change-date{
				// margin-top: 32upx;
				font-size: 24upx;
				color: rgb(170,170,170);
			}
		}
		.detail-btn{
			width: 55%;
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			flex-direction: column;
			.btn{
				width: 106upx;
				height: 56upx;
				background-color: #1DC7AC;
				text-align: center;
				line-height: 60upx;
				border-radius: 56upx;
				font-size: 24upx;
				color: #fff;
			}
			.detail-timer{
				margin-top: 32upx;
				font-size: 22upx;
			}
		}
	}
</style>
