<template>
	<view class="container">
		<!-- <picker mode="selector" :range="typeArray" range-key="value" @change="changeType"> -->
		<view class="row font" style="margin-top: 0;justify-content: space-between;">
			<view>提现方式 :</view>
			<view class="cash-type-container">
				<view class="cash-type-container-msg">{{pickerShowText}}</view>
				<!-- <image src="../../static/more.png" mode=""></image> -->
			</view>
		</view>
		<!-- </picker> -->
		<view v-if="submitObj.withdrawType==1">
			<view class="row font" style="margin-top: 0;justify-content: space-between;">
				<view>微信账号 :</view>
				<input v-model="submitObj.wechatAccount" class="form-input" type="text" value="" placeholder="请输入微信账号" />
			</view>
			<view class="row font" style="margin-top: 0;justify-content: space-between;">
				<view>微信昵称 :</view>
				<input v-model="submitObj.wechatNickname" class="form-input" type="text" value="" placeholder="请输入微信昵称" />
			</view>
		</view>
		<view v-else>
			<view class="row" v-if="bank.bankCardNum">
				<view>
					<image src="../../static/unionPay.png" mode=" aspectFit" style="height: 60upx; width: 70upx;margin: 10upx 20upx 0 0;"></image>
				</view>
				<view style="width: 100%;height: 75upx;" @click="tobankList()">
					<view class="font">{{bank.bankCardNum}}</view>
					<view class="font">{{bank.accountName}} | {{bank.bankName}}</view>
				</view>
				<view style="height: 75upx;">
					<text class="cell-more yticon icon-you"></text>
				</view>
			</view>
		</view>


		<view class="row font" style="margin-top: 20upx;border-bottom: 3upx solid #f5f5f5;">
			<view>手续费:8% {{"(提现余额必须是100的整数倍)"}}</view>
		</view>
		<view class="row" style="height: 200upx;border-bottom: 3upx solid #f5f5f5;margin-top: 0;">
			<view>
				<view class="tit" style="width: 100%;">提现余额</view>
				<view style="margin-top:30upx;display:flex;">
					<view style="width: 25%;text-align: center;font-size: 60upx;margin-top: -20upx;">¥</view>
					<input class="input" type="number" v-model="submitObj.value" :disabled="disabled" style="font-size: 50upx;margin-top: -15upx;width: 300px;" />
				</view>
			</view>
		</view>
		<view class="row font" style="margin-top: 0;justify-content: space-between;">
			<view>可提现余额:¥{{memberInfo.balance}}</view>
			<view style="color: #fa436a;" @click="all()">全部提现</view>
		</view>
		<view style="display: flex;justify-content: space-between;">
			<text class="withdrawalDetail" style="text-align: left;">可提现额度:{{availableWithdraw}}</text>
			<text class="withdrawalDetail" @click="toDetail">提现明细</text>
		</view>
		<button class="add-btn" @click="confirm">确认提现</button>

		<view style="text-align: center;padding: 0 25upx; margin-top: -30upx;color: black;font-size: 30upx;" v-if="disable">余额不足无法提现</view>
		<!-- <view class="font" style="text-align: right;padding: 0 25upx; margin-top: -30upx;color: #fa436a;" @click="rule()">提现规则</view> -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				pickerShowText: "银行卡提现",
				submitObj: {
					"alipayAccount": "",
					"bankAccountId": 0,
					"realName": "",
					"value": 0,
					"wechatAccount": "",
					"wechatNickname": "",
					"withdrawType": 2,
					"availableWithdraw":0
				},
				// typeArray: [{
				// 	id: 2,
				// 	value: "银行卡提现"
				// }, {
				// 	id: 1,
				// 	value: "微信提现"
				// }],
				// bankCardNum: '', //用户卡号
				// accountName: '', //用户姓名
				// bankName: '', //所属银行
				// openBankAddress: '', //开户地址
				bank: '', //体现银行
				money: '',
				disable: false,
				
			};
		},
		onShow() {

		},
		async onLoad() {
			let member = await this.$api.getMemberInfo();
			this.availableWithdraw = member.data.availableWithdraw
			this.loadData();
		},
		computed: {
			...mapState(['memberInfo']),
		},
		methods: {
			// changeType(e) {
			// 	this.submitObj.wechatAccount=""
			// 	this.submitObj.wechatNickname=""
			// 	let index = e.detail.value

			// 	this.submitObj.withdrawType = this.typeArray[index].id
			// 	this.pickerShowText = this.typeArray[index].value
			// 	if (index == 0) {
			// 		this.loadData()
			// 	}

			// },
			toCard() {
				uni.navigateTo({
					url: 'card'
				})
			},
			//跳转到详情页面
			toDetail() {
				uni.navigateTo({
					url: "/pages/user/withdrawalList"
				})
			},
			async loadData() {
				let result = await this.$http.getDefaultBank();
				if (result.code == 200) {
					let data = result.data;
					if (data) {
						this.bank = data;
					} else {
						this.$api.msg('请先完善银行卡信息');
						setTimeout(function() {
							uni.redirectTo({
								url: 'bankList'
							})
						}, 1000);
					}
				} else
					this.$api.msg(result.message);
					
				if (this.memberInfo.balance < 100) this.disable = true;
			},
			//提交
			async confirm() {
				// if (!this.bank.bankCardNum) {
				// 	this.$api.msg('请输入银行卡号');
				// 	return;
				// }
				// if (!this.accountName) {
				// 	this.$api.msg('请输入银行卡持有人姓名');
				// 	return;
				// }
				// if (!this.bankName) {
				// 	this.$api.msg('请输入所属银行');
				// 	return;
				// }
				// if (!this.openBankAddress) {
				// 	this.$api.msg('请输入银行开户地址');
				// 	return;
				// }


				if (this.memberInfo.balance == 0) {
					this.$api.msg("没有可用提现余额!");
					return;
				}

				let ban = this.bank;
				let money = this.submitObj.value
				if (money < 100) {

					this.$api.msg("最少提现100余额！");
					return;
				}
				if (money > this.memberInfo.balance) {
					this.$api.msg("最大可提现余额为" + this.memberInfo.balance);
					return;
				}

				if (money % 100 != 0) {
					this.$api.msg("提现余额必须是100的整数倍");
					this.submitObj.value = this.submitObj.value - this.submitObj.value % 100;
					return;
				}
				// if (this.money < 100) {
				// 	this.$api.msg("最少提现100余额！");
				// 	return;
				// }
				// if (this.money > this.memberInfo.balance) {
				// 	this.$api.msg("最大提现余额为" + this.memberInfo.balance);
				// 	return;
				// }

				// if (this.money % 100 != 0) {
				// 	this.$api.msg("提现余额必须是100的整数倍");
				// 	this.money = this.money - this.money % 100;
				// 	return;
				// }
				// let data = {
				// 	bankAccountId: ban.id,
				// 	value: this.money
				// };
				this.submitObj.bankAccountId = this.bank.id
				let data = this.submitObj
				let result = await this.$http.withdrawApply(data);
				if (result.code === 200) {
					this.$api.msg('已提交，等待审核打款!');
					this.$api.getMemberInfo();
				} else {
					this.$api.msg(result.message);
				}
				this.money = 0;
			},

			//全部提现
			all() {
				// this.money = this.memberInfo.balance;
				let value = this.memberInfo.balance;
				if (value < 100) {
					this.$api.msg("最少提现100余额！");
				}else if (value % 100 != 0) {
					this.submitObj.value = value - value % 100;
				}else{
					this.submitObj.value = value;
				}
			},
			tobankList() {
				uni.navigateTo({
					url: "/pages/user/bankList?source=1"
				})
			}
		}
	};
</script>

<style lang="scss">
	.form-input {
		color: black;
		text-align: right;
	}

	.cash-type-container {
		display: flex;
		align-items: center;
		color: black;

		image {
			width: 20rpx;
			height: 20rpx;
		}

		&-msg {
			margin-right: 4px;
		}
	}

	page {
		background: #f5f5f5;
		height: 100%;
	}

	.b-b {
		color: red;
	}

	.row {
		display: flex;
		margin-top: 20upx;
		position: relative;
		padding: 40upx 30upx;
		background: #fff;
		border-bottom: 20upx solid #f5f5f5;
		border-top: 3upx solid #f5f5f5;

		.tit {
			flex-shrink: 0;
			font-size: 30upx;
			color: $font-color-dark;
			width: 25%;
		}

		.store-tit {
			flex-shrink: 0;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(0.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 100upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color2;
		border-radius: 100upx;
		// box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	.font {
		color: $font-color-light;
		font-size: $font-base;
	}

	.withdrawalDetail {
		height: 30upx;
		padding: 20upx 20upx 0 20upx;
		color: gray;
		display: inline-block;
		width: 100%;
		font-size: 29upx;
		text-align: right;
	}
</style>
