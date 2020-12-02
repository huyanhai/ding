<template>
	<view>
		<view class="selectPos">
			<view class="title">
				当前位置
			</view>
			<view class="info" @click="getLocation()">
				<view class="left">
					{{addressName}}
				</view>
				<view class="right">
					修改<text class="cell-more yticon icon-you"></text>
				</view>
			</view>
		</view>
		<view class="leader-list">
			<view class="leader-item" v-for="(item,index) in leaderList" @click="setLeader(item)">
				<view class="leader-image">
					<image :src="item.icon" mode=""></image>
				</view>
				<view class="leader-info">
					<view class="top">
						<view class="leader-name ui-nowrap">
							{{item.storeName}}
						</view>
						<view class="leader-dis">
							距您{{item.distance}}KM
						</view>
					</view>
					<view class="position">
						{{item.region}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import amap from '../../common/amap-wx.js';
	export default {
		data() {
			return {
				leaderList:[],
				amapPlugin: null,  
				key: 'd52befc87beb8ce929d2eaa887e488ad',
				addressName: '',
				type:0
			}
		},
		onLoad(option) {
			if(option.type){
				this.type = option.type
			}
			let that = this;
			this.amapPlugin = new amap.AMapWX({  
				key: this.key  
			});
			uni.showLoading({
				title: '获取信息中'  
			});  
			this.amapPlugin.getRegeo({
				success: (data) => {  
					console.log(data)  
					this.addressName = data[0].name;
					that.$http.queryLeaderList({lat:data[0].latitude,lon:data[0].longitude,pageSize:10,pageNum:1}).then(res=>{
						that.leaderList = res.data.sotres
						console.log(res)
						that.leaderList.forEach(e=>{
							e.distance = parseFloat(e.distance)/1000
							console.log(e.distance)
						})
					})  
					uni.hideLoading();  
				},
				fail: (data)=>{
					console.log(data)
					uni.hideLoading(); 
				}
			});
		},
		methods: {
			getLocation(){
				let that = this
				uni.chooseLocation({
				    success: function (res) {
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
						that.addressName = res.name;
						that.$http.queryLeaderList({lat:res.latitude,lon:res.longitude,pageSize:10,pageNum:1}).then(data=>{
							that.leaderList = data.data.sotres
							console.log(data)
							that.leaderList.forEach(e=>{
								e.distance = parseFloat(e.distance)/1000
								console.log(e.distance)
							})
						})
				    }
				});
			},
			async setLeader(item){
				console.log(item)
				
				if(this.type==1){
					let res = await this.$http.setDefaultLeader(item.id);
					console.log(res.code)
					this.$api.msg(res.msg)
					if(res.code==200){
						uni.navigateBack({})
					}
				}else{
					let pages = getCurrentPages();  //获取所有页面栈实例列表
					let nowPage = pages[ pages.length - 1];  //当前页页面实例
					let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
					prevPage.setData({
						defaultLeader:item
					})
					// prevPage.$vm.defaultLeader = item;
					// uni.setStorageSync('leader',JSON.stringify(item))
					setTimeout(()=>{
						uni.navigateBack({});
					},500)
				}
			},
		}
	}
</script>

<style lang="scss">
	.selectPos {
		margin: 20upx;
		font-size: 35upx;
		height: 100upx;
		.title {
			color: #b9b9b9;
		}
		.info {
			display: flex;
			height: 50upx;
			.left {
				flex: 8;
				color: #000;
				font-size: 40upx;
			}
			.right {
				flex: 2;
				height: 50upx;
				text-align: right;
			}
		}
	}
	.leader-list {
		.leader-item {
			background: #fff;
			border-radius: 20upx;
			margin: 20upx;
			display: flex;
			height: 140upx;
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
					justify-content: space-between;
					.leader-name {
						flex: 4;
						font-size: 37upx;
						font-weight: 600;
					}
					.leader-dis {
						flex: 3;
						color: #A7D159;
						font-size: $font-base;
						text-align: right;
						margin-right: 20upx;
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
</style>
