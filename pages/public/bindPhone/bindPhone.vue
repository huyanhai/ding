<template>
	<view>
		<view class="input-box">

			<!-- <view class="input-item">
				<view class="input-label">姓名</view>
				<view class="input-body">
					<input placeholder="请输入姓名" v-model="submitObj.realName" class="input">
				</view>
			</view>

			<view class="input-item">
				<view class="input-label">身份证号码</view>
				<view class="input-body">
					<input placeholder="请输入身份证号码" v-model="submitObj.idCard" class="input" type="text">
				</view>
			</view> -->
			<view class="input-item" v-if="!phone">
				<view class="input-label">手机号</view>
				<view class="input-body">
					<input v-model="submitObj.phone" maxlength="11" type="number" style="margin-right: 160upx;" placeholder="请输入手机号"
					 class="input">
					<button :disabled="!isCanSendCode" class="btn-code" @click="sendCode">{{sendMsg}}</button>
				</view>
			</view>

			<view class="input-item" v-if="!phone">
				<view class="input-label">验证码</view>
				<view class="input-body">
					<input placeholder="请输入验证码" type="number" v-model="submitObj.validationCode" maxlength="6" class="input">
				</view>
			</view>

			<!-- <view class="input-item">
				<view class="input-label">邀请人手机号</view>
				<view class="input-body" style="font-size: 12px;">
					<input placeholder="请输入邀请人手机号" type="number" v-model="submitObj.inviterPhone" maxlength="11" class="input">
				</view>
			</view> -->

		</view>
		<button class="button" @click="submit">绑定</button>
	</view>
</template>

<script>
	let timer = '';
	import {
		checkPhone,
		checkPwd,
		checkCode
	} from "@/common/common.js"
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				submitObj: {
					validationCode: '',
					// detailAddress: "",
					phone: '',
					// realName: '',
					// inviterPhone: "",
					// idCard: ''
				},
				phone: null,
				sendMsg: "发送验证码",
				isCanSendCode: true,

			};
		},
		onLoad(e) {
			this.phone = e.phone;
		},
		methods: {
			...mapMutations(['setFlag']),
			setCodeInterval() {
				//设置验证码重新发送定时器
				let time = 60;
				clearInterval(timer);
				timer = setInterval(() => {
					time--;
					this.isCanSendCode = false;
					this.sendMsg = time + "s"
					if (time <= 0) {
						this.isCanSendCode = true;
						this.sendMsg = "重新获取";
						clearInterval(timer);
					}
				}, 1000)
			},
			clearCodeInterval() {
				clearInterval(timer);
				this.codemsg = "获取验证码";
			},
			sendCode() {
				//发送验证码
				if (!checkPhone(this.submitObj.phone)) {
					return
				}
				this.setCodeInterval();
				/*
				 * 发送验证码逻辑
				 */
				this.$http.getAuthCode({
					telephone: this.submitObj.phone
				})

			},
			async submit() {
				
				// if (!this.submitObj.realName) {
				// 	this.$api.msg('请先填写姓名');
				// 	return
				// }

				// if (!this.submitObj.idCard) {
				// 	this.$api.msg('请先填写身份证号码');
				// 	return
				// }
				
				if (this.phone == null || this.phone === "") {
					if (!checkPhone(this.submitObj.phone)) {
						return;
					};

					// if (!checkCode(this.submitObj.authCode)) {
					// 	return;
					// };
				}

				// if (!this.submitObj.inviterPhone) {
				// 	this.$api.msg('清先填写邀请人手机号');
				// 	return
				// }




				/*
				 * 注册逻辑
				 */

				let result = await this.$http.bindPhone(this.submitObj)
				if (result.code == 200) {
					// this.$api.login();
					this.$api.msg('绑定成功！');
					this.setFlag(1);
					uni.navigateBack({});
				} else {
					this.$api.msg(result.message);
				}

			}
		}
	}
</script>

<style scoped lang="scss">
	button::after {
		border: none;
	}

	.input-box {
		padding: 50upx;
		font-size: 30upx;

		.input-item {
			display: flex;
			background: white;
			border-bottom: 1upx solid #eeeeee;
			line-height: 100upx;
			height: 100upx;

			.input-label {
				width: 120px;
			}

			.input-body {
				position: relative;
				height: 100upx;
				width: calc(100% - 150upx);

				.input {
					line-height: 100upx;
					height: 100upx;
					position: relative;
					font-size: 28upx;
				}

				.eye {
					position: absolute;
					height: 50upx;
					width: 50upx;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
				}

				.btn-code {
					position: absolute;
					right: 0upx;
					top: 50%;
					transform: translateY(-50%);
					background: none;
					color: #205592;
					width: 160upx;
					font-size: 24upx;
					box-sizing: border-box;
					text-align: right;
					padding: 0;
					height: 100upx;
					line-height: 100upx;
				}
			}

		}

		.select {
			padding-top: 40upx;
			display: flex;
			justify-content: space-between;
			color: #003B67;
		}
	}

	.button {
		margin: 0 30upx;
		background: $base-color2;
		border-radius: 50upx;
		line-height: 80upx;
		height: 80upx;
		color: white;
		font-size: 32upx;
	}
</style>
