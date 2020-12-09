<template>
	<view >
		<!-- <view class="searchView">
			<view class="search">
				<image style="width: 15px;height: 15px;" src='../../../../static/searchAdd.png'></image>
				<input class="serchInput" placeholder="地址" />
			</view>
		</view> -->
		<scroll-view scroll-y="true" style="height:80vh" @scrolltolower="loadProductData">
			<view  v-for="(item,index) in addressList">
				<view class="yt-list-cell b-b" @click="onSelectAddress(item)">
					<view class="leftView">
						<text class="leftText userFont">{{item.name}}</text>
						<text class="userFont">{{item.phoneNumber}}</text>
					</view>
					<view class="leftView">
						<text class="leftText textAddress addressFont">地址</text>
						<text class="addressRight addressFont">{{item.city+item.province+item.region+item.detailAddress}}</text>
					</view>
					<view class="editAddress" @click.stop="toAddAddress(item.id)">
						<image style="width: 22px;height: 19px;" src='../../../../static/editAddress.png'/>
					</view>
				</view>
			</view>
		</scroll-view>
		<button class="btn" @click="toAddAddress">新增地址</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import amap from '../../../../common/amap-wx.js';
	export default {
		data() {
			return {
				addressList:[]
			}
		},
		async onShow() {
			try{
				let res = await this.$http.getAddressList();
				if(res && res.code==200 &&  res.data){
					this.addressList = res.data;
				}else{
					this.$api.msg(res.message);
				}
			}catch(e){
				console.log(e)
			}
			
		},
		methods: {
			toAddAddress(id){
				uni.navigateTo({
					url:"/pages/order/orderRe/selectAddress/addAddress?id="+id,
					
				})
			},
			onSelectAddress(address){
				this.$store.commit("setAddress",  address);
				uni.navigateBack({})
			}
		},
		
	}
</script>

<style lang="scss">
	.searchView{
		display: flex;
		align-items: center;
		height: 102upx;
		background: $page-color-base;
	}
	.search{
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx 10rpx 24rpx;
		background-color: #FFFFFF;
		border-radius: 15px;
		border: none;
		width: 100%;
		margin-left: 2%;
		margin-right: 2%;
		height: 30px;
		line-height: 20px;
		font-size: 12px;
		color: #fff;
	}
	.serchInput{
		margin-left: 10px;
		color: #000000;
	}
	.leftView {
		margin-right: 100upx;
	}
	.btn{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 2%;
		margin-right: 2%;
		height: 88upx;
		color: #FFFFFF;
		background: #CD0000;
	}
	.leftText{
		margin-right: 10upx;
	}
	.textAddress{
		background-color: #CD0000;
		color: #FFFFFF;
	}
	.userFont{
		font-size: 35upx;
	}
	.addressRight{
		color: #999999;
	}
	.addressFont{
		font-size: 32upx;
	}
	.yt-list-cell {
		display: flex;
		flex-direction: column;
		margin: 50upx 0 0 40upx;
		padding-bottom:36upx ;
		line-height: 50upx;
		position: relative;
	}
	.editAddress {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 0upx;
		right: 0upx;
		height: 125upx;
		width: 125upx;
	}
</style>
