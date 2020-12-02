<template>
	<view class="content">
		<view style="text-align: center;" v-if=isHave>
			<view style="padding-top: 35%;"></view>
			<image src="../../static/emptyCart.png" style="width:200px;height: 200px;margin: auto;"></image>
		</view>
		<view class="list" v-for="(item, index) in group" :key="index" v-else>
<!-- 			<view v-if="item.teamNum!=0" @click="navTo(item.memberId)" class="mix-list-cell b-b" hover-class="cell-hover"
			 :hover-stay-time="50">
				<text class="cell-tit">{{item.username}}/{{item.teamLevelName}}</text>
				<text class="cell-tip">团队业绩:{{item.teamConsume}}</text>
				<text class="cell-tip">团队人数:{{item.teamNum}}</text>
			</view> -->
			
			<view class="mix-list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" style="font-size: 10px;">
				<view class="title">
					<text class="cell-tit">{{item.teamLevelName}}:{{item.username}}</text>
				</view>
				<view class="content">
					<text class="cell-tip">团队业绩:{{item.teamConsume}}</text>
					<text class="cell-tip" style="margin-left: 20rpx;">团队人数:{{item.teamNum}}</text>
				</view>
			</view>
			<view>
				
			</view>
			<!-- <list-cell :title='item.username' @eventClick="navTo(item.memberId)" :phone="item.teamNum.toString()" v-if="item.teamNum!=0"></list-cell>
			<lis t-cell :title='item.username' :phone="item.teamNum.toString()" navigateType="none" v-else></list-cell>-->
		</view>
		<uni-load-more :status="loadingType" v-if="isShow"></uni-load-more>
	</view>
</template>

<script>
	import listCell from '@/components/mix-list-cell';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			listCell,
			uniLoadMore
		},
		data() {
			return {
				pageNum: 1, //页数
				loadingType: 'loading', //加载更多状态
				isHave: false,
				isShow: false,
				group: [],
				group2:[],
			}
		},
		computed: {
			...mapState(['memberInfo']),
		},
		onLoad() {
			this.loadData();
		},
		onReachBottom() {
			this.loadData();
		},
		methods: {
			async loadData() {
				let id=this.memberInfo.memberId;
				//获取用户团队
				let group = await this.$http.getGroup(id, this.pageNum);
				if (group.code == 200) {
					if (group.data.length != 0) {
						this.group = this.group.concat(group.data);
						if (this.group.length >= 10) {
							this.isShow = true;
							this.loadingType = 'more'
						}
						this.pageNum += 1;
					} else {
						if (this.pageNum == 1) {
							this.isHave = true;
						} else {
							this.isShow = true;
							this.loadingType = 'nomore';
						}
					}
				} else {
					this.$api.msg(group.mssage)
				}
				console.log(this.isShow + "=" + this.isHave);
			},
			navTo(memberId) {
				uni.navigateTo({
					url: 'group?memberId=' + memberId
				})
			}
		},
	}
</script>

<style lang='scss'>
	page {
		padding-bottom: 120upx;
	}

	.list {
		padding: 20upx 30upx;
		background: #fff;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		justify-content: space-between;
		margin: 0 5upx;

		.tag {
			font-size: 24upx;
			color: $base-color2;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;

		}

		.money {
			font-size: 40upx;
			font-weight: 700
		}
	}

	.u-box {
		margin: 0 5upx;
		display: flex;
		justify-content: space-between;
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 100upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color2;
		border-radius: 100upx;
		/* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4); */
	}

	.mix-list-cell {
		align-items: baseline;
		padding: 20upx $page-row-spacing;
		line-height: 60upx;
		position: relative;
		justify-content: space-between;


		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			align-self: center;
			width: 56upx;
			max-height: 60upx;
			font-size: 38upx;
		}

		.cell-more {
			align-self: center;
			font-size: 30upx;
			color: $font-color-base;
			margin-left: $uni-spacing-row-sm;
		}

		.cell-tit {
			font-size: 10px;
			color: $font-color-dark;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 10px;
			color: $font-color-light;
		}
	}
</style>
