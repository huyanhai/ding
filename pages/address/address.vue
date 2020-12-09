<template>
	<view class="content b-t">
		<view v-if="addressList.length>0">
			<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
				<view class="wrapper">
					<view class="address-box">
						<!-- <text v-if="item.defaultStatus" class="tag">默认</text> -->
						<text class="name fontB">{{item.name}}</text>
						<text class="mobile fontB">{{item.phoneNumber}}</text>
					</view>
					<view class="u-box">
						<text class="address">{{item.province}}{{item.city}}{{item.region}}{{item.detailAddress}}</text>
					</view>
					<hr style='background-color: white;border: 1px solid #eee;'>
					<view class="mt10 flexbetween">
						<view class="font10 flexstart">
							<view>
								<image v-if='item.defaultStatus==0' src="/static/noselect.svg" style="width:30rpx;height: 30rpx;margin-right: 10rpx;margin-top: 5rpx;"
								 @click.stop="changeDefault(item)"></image>
								<image v-else src="/static/selected.svg" style="width:30rpx;height: 30rpx;margin-right: 10rpx;margin-top: 5rpx;"></image>
							</view>
							<view>
								设置默认地址
							</view>
						</view>
						<view class="flexend" style="align-items: center;">
							<view @click.stop="addAddress('edit', item)">
								<image src="/static/edit.svg" style="width:30rpx;height: 30rpx;margin-right: 10rpx;"></image>
								<text class="font10">编辑</text>
							</view>
							<view class="ml40" @click.stop="del(item.id)">
								<image src="/static/delete.svg" style="width:30rpx;height: 30rpx;margin-right: 10rpx;"></image>
								<text class="font10">删除</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="padding1">
				<view class="add-btn" @click="addAddress('add')">添加新地址</view>
			</view>
		</view>

		<view v-if='addressList.length==0'>
			<view class="textcenter">
				<image src="/static/noAddress.png" mode="" style="width: 120px;height: 120px;margin-top: 35%;"></image>
				<view class="font10 fontcolor16 mtrpx30">您还没有设置收货地址</view>
				<view class="mtrpx50">
					<span class="addAddress" @click="addAddress('add')">添加地址</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: 0,
				addressList: [],
				oldActive: 0
			}
		},
		onShow() {
			this.loadData();
		},
		onLoad(options) {
			if (options.source) {
				this.source = options.source;
			}
		},
		methods: {
			async changeDefault(item) {
				item.defaultStatus = 1
				let result = await this.$http.memberAddressUpdate(item);
				if (result.code === 200) {
					if (this.oldActive != 0) {
						for (let i of this.addressList) {
							if (i.id == this.oldActive) {
								i.defaultStatus = 0
							}
						}
					}
					for (let i of this.addressList) {
						if (i.id == item.id) {
							i.defaultStatus = 1
						}
					}
					this.oldActive = item.id
				} else {
					this.$api.msg(result.message);
				}
			},
			async loadData() {
				let addressList = await this.$http.getUserAddress();
				this.addressList = addressList.data;
				for (let item of addressList.data) {
					if (item.defaultStatus == 1) {
						this.oldActive = item.id
					}
				}
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item) {
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				//this.addressList.unshift(data);

				//console.log(data, type);
			},
			//删除
			async del(id) {
				console.log('删除操作' + id);
				uni.showModal({
					content: '确定要删除么?',
					success: async (e) => {
						if (e.confirm) {
							let options = {
								id: id
							};
							let result = await this.$http.memberAddressDel(options);
							console.log(result);
							if (result.code == 200) {
								this.$api.msg(result.message);
								this.loadData();
							} else {
								this.$api.msg(result.message);
							}

						}
					}
				});
			}
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #F7F8FC;
	}

	.content {
		position: relative;
	}

	.list {
		/* display: flex; */
		/* align-items: center; */
		padding: 20upx 30upx;
		;
		background: #fff;
		position: relative;
		margin-bottom: 10rpx;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		justify-content: space-between;

		.tag {
			font-size: 24upx;
			color: $base-color;
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
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin: 16upx 0;

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

	.icon-jianhao {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		margin-left: 10%;
		margin-top: 20px;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80%;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: black;
		border-radius: 10upx;
		/* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		 */
	}

	.addAddress {
		background-color: transparent;
		border: 1px solid #EBA542;
		color: #EBA542;
		padding: 8px;
		border-radius: 16rpx;
		font-size: 16px;
	}
</style>
