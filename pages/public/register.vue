<template>
	<view class="container">
		<!-- <view class="left-bottom-sign"></view> -->
		<!-- <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view> -->
		<!-- <view class="right-top-sign"></view> -->
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="user-section" :style="'margin-top: '+height+'rpx'" @click="navBack" >
			<view class="back" >
				<image src="../../static/back_b.png" style="width: 48upx;height: 48upx;">
					
				</image>
			</view>
			<view class="text">
				授权登录
			</view>
		</view>
		<view class="middle">
			<view style="margin-top: 282upx;">
				<image src="../../static/logo.png" mode="" style="width: 240upx;height: 240upx;"></image>
			</view>
		</view>
		<view class="wrapper" style="padding-top: 70upx;">
			<!-- <view class="left-top-sign">login</view> -->
			<!-- <view class=" welcome" v-if="type==1">
				绑定手机
			</view> -->
			<view class="welcome">丁老表申请获得以下权限:</view>
			<view class="tips">
				获得你的公开信息（昵称、头像等）
			</view>
			<view class="input-content">
				<!-- <view class="input-item">
					<text class="tit">昵称</text>
					<input type="string" :value="nickname" placeholder="请输入昵称" maxlength="11" data-key="nickname" @input="inputChange" />
				</view> -->
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" :value="telephone" placeholder="请输入手机号码" maxlength="11" data-key="telephone" @input="inputChange" />
				</view>
				<!-- <view class="input-item">
					<text class="tit">密码</text>
					<input type="password" :value="password" placeholder="请输入密码" maxlength="24" data-key="password" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">确认密码</text>
					<input type="password" :value="confirmPassword" placeholder="请输入密码" maxlength="24" data-key="confirmPassword" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">邀请人(可选填)</text>
					<input type="number" :value="inviteCode" placeholder="请输入邀请人" maxlength="24" data-key="inviteCode" @input="inputChange" />
				</view> -->
				<view class="verfiy" v-if="telephone != ''">
					<view class="input-item">
						<text class="tit">验证码</text>
						<input type="number" :value="authCode" placeholder="请输入验证码" maxlength="11" data-key="authCode" @input="inputChange" />

					</view>
					<button class="mini-btn" type="warn" style="width:160upx;height: 110upx;line-height: 100upx;text-align: center;" @click="getAuthCode">{{inviteCodeText}}</button>
				</view>
			</view>
			<view style="display: flex;margin-top: 120upx;justify-content: space-between;width: 90%;margin-left: 5%;">
				<view class="confirm-btn" @click="goHome" style="border: 1upx #1DC7AC solid;color: #1DC7AC;">
					再去逛逛
				</view>
				<button class="confirm-btn" @getuserinfo="toRegister" open-type="getUserInfo" :disabled="logining" style="background-color: #1DC7AC;color: #fff;">授权登录</button>
			</view>
			<!-- <button class="confirm-btn" @click="toRegister" :disabled="logining" v-else>绑定</button> -->
		</view>
		<!-- <view class="register-section">
			已有账号?
			<text @click="toLogin">马上登录</text>
		</view> -->
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				nickname:'',
				telephone: '',
				password: '',
				authCode: '',
				inviteCode: '',
				logining: false,
				type: 1,
				inviteCodeText:'获取',
				inviteType:true,
				height:''
			}
		},
		onLoad(e) {
			this.type = e.type ? e.type : 0
			let _this = this;
			// 获取手机状态栏高度
			uni.getSystemInfo({
				success: function(data) {
					// 将其赋值给this
					console.log(data)
					_this.height = data.statusBarHeight+50;
				},
				fail:function(res){
					console.log(res)
				}
			})
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			goHome(){
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			async toRegister(e) {
				let that = this;
				this.logining = true;
				const {
					nickname,
					telephone,
					password,
					confirmPassword,
					authCode,
					inviteCode,
				} = this;
				var numreg = /^[1][3-9][\d]{9}$/;
				// if (nickname == '') {
				// 	this.$api.msg('昵称不能为空');
				// 	this.logining = false;
				// 	return false;
				// }
				if (telephone == '') {
					this.$api.msg('手机号码不能为空');
					this.logining = false;
					return false;
				}
				if (telephone != ''&&numreg.test(telephone) == false) {
					this.$api.msg('请输入正确手机的号码');
					this.logining = false;
					return false;
				}
				// if (password == '') {
				// 	this.$api.msg('密码不能为空');
				// 	this.logining = false;
				// 	return false;
				// }
				// if (password.length < 6) {
				// 	this.$api.msg('密码必须大于6位');
				// 	this.logining = false;
				// 	return false;
				// }
				// if (password != confirmPassword) {
				// 	this.$api.msg('两次输入密码不一致');
				// 	this.logining = false;
				// 	return false;
				// }
				if (telephone != ''&&authCode == '') {
					this.$api.msg('手机验证码不能为空');
					this.logining = false;
					return false;
				}
				uni.login({
					async success(res) {
						console.log(res)
						console.log(e)
						const sendData = {
							code:res.code,
							encryptedData:e.detail.encryptedData,
							iv:e.detail.iv
						};
						if(telephone!=''){
							sendData.phone = telephone;
							sendData.validationCode = authCode;
						}
						if (that.$store.state.shareMemberId)
						sendData.inviteCode = that.$store.state.shareMemberId;
						console.log("sendData", sendData)
						let result = await that.$http.wechatRegister(sendData)
						console.log("wechatRegister",result)
						if(result.code == 200){
							uni.setStorageSync('token', result.data.token);
							uni.setStorageSync('tokenHead', result.data.tokenHead);
							uni.navigateBack({
								
							})
						}else{
							that.logining = false;
							that.$api.msg(result.message)
							uni.showLoading({
								title:'登录中'
							})
							if(result.message=='该账号已注册'){
								uni.login({
									async success(res) {
										if (res.code) {
											let result = await that.$http.login({code:res.code});
											console.log("登录",result)
											if(result.code==200){
												console.log('登录成功')
												uni.setStorageSync('token', result.data.token);
												uni.setStorageSync('tokenHead', result.data.tokenHead);
												uni.navigateBack({
													
												})
											}else {
												console.log('登录失败！' + result.message)
											}
										} 
									}
								})
							}
						}
					}
				})
				
			},
			async getAuthCode() {
				const telephone = this.telephone;
				var numreg = /^[1][3-9][\d]{9}$/;
				if (numreg.test(telephone) == false) {
					this.$api.msg('请输入正确手机的号码');
					this.logining = false;
					return false;
				}
				let options = {
					telephone: telephone
				};
				if(this.inviteType==false){
					return;
				}
				this.inviteType = false;
				const result = await this.$http.getAuthCode(options);
				if (result.code === 200) {
					this.$api.msg(result.message);
					this.inviteCodeText = 60
					let timer = setInterval(()=>{
						if(this.inviteCodeText<=1){
							this.inviteType = true;
							this.inviteCodeText = '获取'
							clearInterval(timer);
							return;
						}
						this.inviteCodeText--;
					},1000)
				} else {
					this.$api.msg(result.message);
					this.inviteType = true;
				}
			}

		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}
	.user-section{
		display: flex;
		align-items: center;
		position: absolute;
		.back{
			width: 48upx;
			height: 48upx;
			margin-left: 30upx;
		}
		.text{
			font-size: 38upx;
			margin-left: 20upx;
			color: #000;
		}
	}
	.middle{
		width: 100%;
		height: 835upx;
		background-color: #f5f5f5;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid transparent;
	}
	.verfiy {
		display: flex;
	}

	.container {
		/* padding-top: 55px; */
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #f5f5f5;
	}

	.wrapper {
		position: fixed;
		bottom: 0;
		z-index: 90;
		background: #fff;
		padding-bottom: 60upx;
		border-radius: 50upx 50upx 0 0;
		width: 100%;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		/* position: relative;
		left: 50upx;
		top: -90upx; */
		text-align: center;
		font-size: 36upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}
	.tips{
		margin-top: 30upx;
		text-align: center;
		font-size: 25upx;
		color: #C0C0C0;
	}
	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 30upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 320upx;
		height: 95upx;
		line-height: 95upx;
		border-radius: 50px;
		margin: 0;
		margin-top: 50upx;
		color: #fff;
		font-size: 35upx;
		text-align: center;
		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style>
