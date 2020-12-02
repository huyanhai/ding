<template>
	<view>
		<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
			<view class="leaderList">
				<view class="leader-item" v-for="item in leaderList">
					<view class="img">
						<image :src="item.icon" style="width: 100%;height: 100%;border-radius: 6upx;" mode=""></image>
					</view>
					<view class="right">
						<view class="top">
							<text class="block">团员昵称：</text><text class="gray">{{item.nickname}}</text>
						</view>
						<view class="middle">
							<view class="middle-left">
								<text class="block">团员人数：</text><text class="gray">{{item.teamNumber}}</text>
							</view>
							<view class="middle-right">
								<text class="block">总销售额：</text><text class="orange">{{item.totalAmount}}</text><text class="gray">元</text>
							</view>
						</view>
						<view class="bottom">
							<text class="block">注册时间：</text><text class="gray">{{item.createTime}}</text>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</scroll-view>
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
				loadindType:'more',
				leaderList:[],
				pageSize:10,
				pageNum:1
			};
		},
		onShow(){
			this.loadData('reLoad')
		},
		methods:{
			//获取订单列表
			async loadData(source) {
				//获取当前Tab项信息
				if (source === 'reLoad') {
					//tab切换只有第一次需要加载数据
					this.pageNum = 1
				}
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
			
				this.loadingType = 'loading';
				setTimeout(async () => {
			
					let result = undefined
					let params;
					params = {
						"pageSize": this.pageSize,
						"pageNum": this.pageNum,
					};
					result = await this.$http.getLeaderList(params);
					if (result.code != 200) {
						return false;
					}
					let leaderList = result.data;
					if (this.pageNum === 1) { //下拉刷新
						this.leaderList = leaderList;
						uni.stopPullDownRefresh();
					} else { //加载更多
						leaderList.forEach(item => {
							this.leaderList.push(item);
						})
					}
					this.pageNum = this.pageNum + 1;
					if (result.data.length > 0) {
						//判断是否还有数据， 有改为 more， 没有改为noMore 
						this.loadingType = 'more';
					} else {
						this.loadingType = 'noMore';
					}
				}, 600);
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f5f5f5;
	}
	.leaderList{
		margin: 24upx;
		.leader-item{
			margin-top: 24upx;
			background-color: #FFFFFF;
			border-radius: 12upx;
			width: 702upx;
			height: 194upx;
			display: flex;
			align-items: center;
			font-size: 24upx;
			padding: 24upx;
			.img{
				width: 130upx;
				height: 130upx;
			}
			.right{
				margin-left: 30upx;
				flex: 6;
				.top{
					
				}
				.middle{
					display: flex;
					justify-content: space-between;
					margin-top: 20upx;
				}
				.bottom{
					margin-top: 20upx;
				}
			}
			.block{
				color: #000;
			}
			.gray{
				color: rgb(170,170,170);
			}
			.orange{
				color: rgb(241,148,15);
			}
		}
	}
</style>
