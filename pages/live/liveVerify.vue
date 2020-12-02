<template>
	<view class="container">
		<view class="" style="margin-top: 40upx;display: flex;justify-content: center;align-items: center;">
			<image src="../../static/liveVerify.png" style="width: 366upx;height: 366upx;" mode=""></image>
		</view>
		<view style="font-size: 32upx;color: rgb(51,51,51);text-align: center;margin-top: 40upx;">
			{{verifyResult==true?'通过审核！':'未通过审核！'}}
		</view>
		<view class="desc">
			{{verifyResult==true?'小二在此祝贺客官通过审核，祝您直播愉快！':'未通过审核！'}}
		</view>
		<view class="verfiy-item" style="margin-top: 60upx;">
			<view class="verfiy-item-img">
				<image style="width: 40upx;height: 40upx;" :src="verifyResult==true?'../../static/gou.png':'../../static/close.png'" mode=""></image>
			</view>
			<view class="verfiy-item-right">
				<view class="">
					{{verifyResult==true?'通过审核':'未通过审核'}}
				</view>
				<view class="" style="color: rgb(170,170,170);margin-top: 16upx;">
					{{verifyResult==true?'小二在此祝贺客官通过审核，祝您直播愉快！':'未通过审核！'}}
				</view>
			</view>
		</view>
		<view class="shuxian">
			
		</view>
		<view class="verfiy-item">
			<view class="verfiy-item-img">
				<image style="width: 40upx;height: 40upx;" src="../../static/gou.png" mode=""></image>
			</view>
			<view class="verfiy-item-right">
				<view class="">
					正在审核中
				</view>
				<view class="" style="color: rgb(170,170,170);margin-top: 16upx;">
					小二正在审核...
				</view>
			</view>
		</view>
		<view class="shuxian">
			
		</view>
		<view class="verfiy-item">
			<view class="verfiy-item-img">
				<image style="width: 40upx;height: 40upx;" src="../../static/gou.png" mode=""></image>
			</view>
			<view class="verfiy-item-right">
				<view class="">
					发出申请
				</view>
				<view class="" style="color: rgb(170,170,170);margin-top: 16upx;">
					审核时间：2020-07-03 18:12:49
				</view>
			</view>
		</view>
		<view class="submit" @click="navToLive" v-if="verifyResult">
			开始直播
		</view>
		<view class="submit" @click="navToApply" v-if="!verifyResult">
			重新申请
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				verifyResult:false,
				memberInfo:''
			}
		},
		async onLoad(){
			let memberInfo = await this.$api.getMemberInfo();
			this.memberInfo = memberInfo.data
			let options = {
				page:1,
				limit:10,
				telephone:this.memberInfo.phone
			}
			let res = await this.$http.getLiveVerify(options)
			if(res.code==200){
				console.log(res);
			}else{
				this.$api.msg(res.msg)
			}
		},
		methods: {
			navToApply(){
				uni.navigateTo({
					url:'/pages/live/applyLive'
				})
			},
			navToLive(){
				uni.navigateTo({
					url:'/pages/live/live'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container{
		font-size: 24upx;
	}
	.verfiy-item{
		display: flex;
		margin-left: 48upx;
		.verfiy-item-img{
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.verfiy-item-right{
			margin-left: 24upx;
		}
	}
	.desc{
		font-size: 24upx;
		color: rgb(170,170,170);
		line-height: 30upx;
		margin: 20upx 10upx 0;
		text-align: center;
	}
	.shuxian{
		margin-left: 68upx;
		height: 60upx;
		border-left: 2upx solid rgb(29,199,172);
	}
	.submit{
		width: 702upx;
		height: 88upx;
		border-radius: 88upx;
		background-color: rgb(29,199,172);
		font-size: 32upx;
		color: #fff;
		text-align: center;
		line-height: 88upx;
		margin: 30upx 30upx 0upx;
	}
</style>
