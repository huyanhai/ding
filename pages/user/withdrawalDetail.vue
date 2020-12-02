<template>
	<view class="container">
		<view class="list-cell b-b m-t" v-if="withdrawal.withdrawType == 1">
			<text class="cell-tit">微信账号</text>
			<view class="cell-right">
				<text class="cell-tit">{{withdrawal.wechatAccount}}</text>
			</view>
		</view>
		<view class="list-cell b-b m-t" v-if="withdrawal.withdrawType == 1">
			<text class="cell-tit">微信昵称</text>
			<view class="cell-right">
				<text class="cell-tit">{{withdrawal.wechatNickname}}</text>
			</view>
		</view>
		<view class="list-cell b-b m-t" v-if="withdrawal.withdrawType == 2">
			<text class="cell-tit">户名</text>
			<view class="cell-right">
				<text class="cell-tit">{{withdrawal.accountName}}</text>
			</view>
		</view>
		<view class="list-cell b-b m-t" v-if="withdrawal.withdrawType == 2">
			<text class="cell-tit">银行</text>
			<view class="cell-right">
				<text class="cell-tit">{{withdrawal.bankName}}</text>
			</view>
		</view>
		<view class="list-cell b-b m-t" v-if="withdrawal.withdrawType == 2">
			<text class="cell-tit">卡号</text>
			<view class="cell-right">
				<text class="cell-tit">{{withdrawal.bankCardNum}}</text>
			</view>
		</view>
		<view class="list-cell b-b m-t">
			<text class="cell-tit">提现余额</text>
			<view class="cell-right">
				<text class="cell-tit">{{withdrawal.value}}</text>
			</view>
		</view>
		<view class="list-cell b-b m-t">
			<text class="cell-tit">实际提现</text>
			<view class="cell-right">
				<text class="cell-tit">{{withdrawal.actualValue}}</text>
			</view>
		</view>
		<view class="list-cell b-b m-t" @click="showGender" >
			<text class="cell-tit">状态</text>
			<view class="cell-right">
				<text class="cell-value">{{withdrawal.paymentStatusName}}</text>
				<!-- <text class="cell-more yticon icon-you"></text> -->
			</view>
		</view>
		<view v-if="withdrawal.failedReason" class="list-cell b-b m-t" @click="showGender" >
			<text class="cell-tit">备注</text>
			<view class="cell-right">
				<text class="cell-value">{{withdrawal.failedReason}}</text>
				<!-- <text class="cell-more yticon icon-you"></text> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				withdrawal:'',//提现详细数据
			};
		},
		onShow() {
		},
		onLoad(option) {
			if(!option.data){
				this.$api.msg("参数错误!");
				uni.navigateBack({});
			}
			this.withdrawal=JSON.parse(option.data);
		},
		methods:{
			
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.list-cell{
		display:flex;
		align-items:center;
		line-height:60upx;
		position:relative;
		background: #fff;
		padding: 20upx 30upx;
		justify-content: center;
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		.cell-right{
			font-size:24upx;
			color: $font-color-dark;
			display:flex;
			align-items:center;
			justify-content: flex-end;
			.headpic{
				width: 70upx;
				height: 70upx;
			}
			.cell-more{
				align-self: baseline;
				font-size: $font-base;
				margin-left:10upx;
				.cell-moreImg{
					width:12upx;
					height:22upx;
				}
			}
		}
		
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
	.bottom-container{
		width: 100%;
		font-size: $font-base;
		.bottom-content{
			margin-bottom: 15upx;
			padding: 0 20upx;
			background: #ffffff;
			.bottom-content-text{
				line-height: 86upx;
				border-bottom: 1px solid #EDEDED;
				display:flex;
				align-items:center;
				justify-content: center;
				&:last-child{
					border: none;
				}
				.photoIcon{
					width: 34upx;
					height: 27upx;
					margin-right: 13upx;
				}
			}
		}
		.bottom-btn{
			background: #ffffff;
		}
		
	}
</style>
