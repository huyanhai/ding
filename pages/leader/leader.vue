<template>
	<view>
		<view class="default-leader" v-if="defaultLeader">
			<view class="header-leader">
				默认团长
			</view>
			<view class="leader-item">
				<view class="leader-image">
					<image :src="defaultLeader.headerIcon" mode=""></image>
				</view>
				<view class="leader-info">
					<view class="top">
						<view class="leader-name">
							{{defaultLeader.nickName}}
						</view>
					</view>
					<view class="position">
						自提点：{{defaultLeader.pickUpPointAddress}}
					</view>
				</view>
			</view>
		</view>
		<view class="mid">
			<view class="mid-left">
				历史访问团长
			</view>
			<view class="mid-right" @click="navToToggleLeader()">
				更多团长<text class="cell-more yticon icon-you"></text>
			</view>
		</view>
		<view class="leader-list">
			<view class="leader-item" v-for="(item,index) in historyLeader" @click="setDefaultLeader(item)">
				<view class="leader-image">
					<image :src="item.headerIcon" mode=""></image>
				</view>
				<view class="leader-info">
					<view class="top">
						<view class="leader-name">
							{{item.teamName}}
						</view>
					</view>
					<view class="position">
						自提点：{{item.pickUpPointAddress}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultLeader:false,
				historyLeader:[]
			};
		},
		onLoad() {
		},
		onShow() {
			console.log(1)
			this.loadLeader()
		},
		methods:{
			loadLeader(){
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				this.$http.defaultLeader(userInfo.userId).then(res=>{
					console.log(res)
					if(res.code==0){
						this.defaultLeader = res.data
					}else {
						this.$api.msg(res.message)
					}
				})
				this.$http.historyteam(userInfo.userId).then(res=>{
					if(res.code==0){
						this.historyLeader = res.data
					}else {
						this.$api.msg(res.message)
					}
				})
			},
			navToToggleLeader() {
				uni.navigateTo({
					url: "/pages/leader/toggleLeader"
				})
			},
			async setDefaultLeader(item){
				console.log(item)
				let that = this;
				uni.showModal({
					title:"提示",
					content:"选择他为默认团长？~",
					success(res){
						if(res.confirm){
							let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
							let option = {
								defaultTeam :item.teamId,
								userId :userInfo.userId
							}
							that.$http.setDefaultLeader(option).then(res=>{
								that.$api.msg(res.msg)
								if(res.code==0){
									that.$http.getMemberInfo(uni.getStorageSync('openid')).then(e=>{
										console.log(e.data)
										uni.setStorageSync('userInfo',JSON.stringify(e.data))
									})
									uni.navigateBack({})
								}
							});
							
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}
	.leader-list,.default-leader {
		background-color: #fff;
		margin: 20upx;
		.header-leader {
			border-radius: 10upx 0 10upx 0;
			width: 150upx;
			height: 60upx;
			font-size: 28upx;
			line-height: 60upx;
			text-align: center;
			color: #fff;
			background: linear-gradient(to right,#f8cd5a,#ff7018);
		}
		.leader-item {
			background-color: #fff;
			margin: 20upx;
			padding: 10upx;
			display: flex;
			// height: 140upx;
			border-radius: 10upx;
			.leader-image {
				flex: 3;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 110upx;
					height: 110upx;
					border-radius: 100%;
				}
			}
			.leader-info {
				flex: 8;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.top {
					display: flex;
					height: 70upx;
					line-height: 70upx;
					.leader-name {
						flex: 2;
						font-size: 37upx;
						font-weight: 600;
					}
					.leader-dis {
						flex: 5;
						color: #A7D159;
						font-size: $font-sm;
						text-align: right;
						margin-right: 10upx;
					}
					.leader-btn {
						flex: 3;
						view {
							width: 140upx;
							height: 70upx;
							font-size: $font-base;
							flex: 3;
							color: #fff;
							background-color: #A7D159;
							border-radius: 20upx;
							text-align: center;
						}
					}
				}
				.position {
					color: #B9B9B9;
					font-size: $font-base;
				}
			}
		}
	}
	.leader-list{
		background-color: #f5f5f5;
	}
	.mid {
		margin: 0 20upx;
		display: flex;
		.mid-left {
			color: #b9b9b9;
			flex: 6;
		}
		.mid-right {
			color: #000;
			flex: 4;
			text-align: right;
		}
	}
</style>
