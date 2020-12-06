<template>
	<scroll-view scroll-y="true" class="index_new">
		<view class="hd_ad">
			<image class="img" :src="(pageData).advertiseList[0].pic"></image>
		</view>
		<view class="more_links">
			<view class="item" @click="goPage('vip')">
				<image class="img" src="../../static/icon-small.png" mode=""></image>
				<text class="text">成为会员</text>
			</view>
			<view class="item" @click="goPage('give')">
				<image class="img" src="../../static/icon-buycard.png" mode=""></image>
				<text class="text">购卡转赠</text>
			</view>
			<view class="item" @click="goPage('follow')">
				<image class="img" src="../../static/icon-zoom.png" mode=""></image>
				<text class="text">欢辣乐园</text>
			</view>
		</view>
		<view class="more">
			<view class="item" @click="goPage('hot')">
				<image class="img" src="" mode=""></image>
			</view>
			<view class="item" @click="goPage('new')">
				<image class="img" src="" mode=""></image>
			</view>
		</view>
		<view class="product">
			<view class="tabs">
				<scroll-view scroll-x="true" class="scroll">
					<view class="scroll_box">
						<template v-for="(item,index) in tabs">
							<view class="item" :class="{'active':activeTabs === item.id}" @click="changeTabs(item.id)">{{item.name}}</view>
						</template>
					</view>
				</scroll-view>
			</view>
			<view class="list">
				<product :item.sync="item" v-for="item in productList" :key="item.id"/>
			</view>
		</view>
		<view class="layer" v-if="showLayer">
			<view class="container">
				<view class="title">丁老表申请获得以下权限</view>
				<view class="text">获得你的公开信息（昵称、头像等）</view>
				<view class="input">
					<text class="name">手机号码</text>
					<input type="text" v-model="telephone" maxlength="11" placeholder="请输入手机号" class="ui-input"/>
				</view>
				<view class="input msg" v-if="telephone">
					<text class="name">验证码</text>
					<input type="text" v-model="authCode" maxlength="6" placeholder="请输入验证码" class="ui-input"/>
					<view class="msg_btn" @click="getAuthCode()">{{inviteCodeText}}</view>
				</view>
				<view class="btn">
					<view class="cancel" @click="showLayer = false">再逛逛</view>
					<button class="confirm-btn" @getuserinfo="toRegister" open-type="getUserInfo" :disabled="logining">授权登录</button>
				</view>
			</view>
		</view>
		<view class="layer1" v-if="showLayer1">
			<view class="container">
				<view class="close" @click="showLayer1 = false"></view>
				<view>
					恭喜您已成为丁老表爽辣食界尊贵会员并拥有30张免费会员卡转赠权益
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import product from "./product.vue"
	export default {
		data() {
			return {
				activeTabs:0,
				tabs:[
					{
						name:"全部",
						id:0
					},
				],
				pageSize:100,
				pageNum:1,
				productList:[],
				pageData:{},
				showLayer:false,
				showLayer1:false,
				inviteCodeText: "获取验证码",
				inviteType:true,
				telephone:"",
				authCode:"",
				logining:false,
				activationCode:null
			};
		},
		components:{
			product
		},
		created() {
			this.getCate();
			this.getPageSet();
		},
		onLoad(option){
			if (option['scene']) {
				this.$store.commit("setShareMember", option['scene']);
			}
			if (option['_q']) {
				if(option['activationCode']){
					this.activationCode = option['activationCode'];
					this.showLayer = true;
				}
				this.$store.commit("setShareMember", option['_q']);
			}
		},
		methods:{
			changeTabs(item){
				this.activeTabs = item;
				this.getList();
			},
			goPage(path){
				uni.navigateTo({
					url:`./${path}`
				})
			},
			async getList(){
				uni.showToast({
					icon:"loading"
				})
				 let {data} = await this.$http.getProductList({
					"sortType":this.activeTabs,
					"pageSize": this.pageSize,
					"pageNum": this.pageNum,
				});
				if(data){
					uni.hideLoading();
					this.productList = data;
				}
			},
			async getCate(){
				uni.showToast({
					icon:"loading"
				})
				let {data} = await this.$http.productCateList();
				if(data){
					uni.hideLoading();
					for(let item of data){
						this.tabs.push(item)
					}
				}
			},
			async getPageSet(){
				uni.showToast({
					icon:"loading"
				})
				let {data} = await this.$http.header();
				this.productList = data.allProductList;
				this.pageData = data;
			},
			toLogin(){
				let _this = this;
				uni.login({
					async success(res) {
						if (res.code) {
							let result = await _this.$http.login({code:res.code,activationCode:_this.activationCode});
							console.log("登录",result)
							if(result.code==200){
								console.log('登录成功')
								uni.setStorageSync('token', result.data.token);
								uni.setStorageSync('tokenHead', result.data.tokenHead);
								uni.navigateBack({})
							}else {
								console.log('登录失败！' + result.message)
							}
						} 
					}
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
				if (telephone != ''&&authCode == '') {
					this.$api.msg('手机验证码不能为空');
					this.logining = false;
					return false;
				}
				uni.login({
					async success(res) {
						const sendData = {
							code:res.code,
							encryptedData:e.detail.encryptedData,
							iv:e.detail.iv
						};
						if(telephone!=''){
							sendData.phone = telephone;
							sendData.validationCode = authCode;
							sendData.activationCode = that.activationCode;
						}
						if (that.$store.state.shareMemberId)
						sendData.inviteCode = that.$store.state.shareMemberId;
						let result = await that.$http.wechatRegister(sendData)
						if(result.code == 200){
							if(that.activationCode){
								that.showLayer1 = true;
							}
							uni.setStorageSync('token', result.data.token);
							uni.setStorageSync('tokenHead', result.data.tokenHead);
							uni.navigateBack();
							
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
											let result = await that.$http.login({code:res.code,activationCode:that.activationCode});
											console.log("登录",result)
											if(result.code==200){
												console.log('登录成功')
												uni.setStorageSync('token', result.data.token);
												uni.setStorageSync('tokenHead', result.data.tokenHead);
												uni.navigateBack({
													
												})
												that.showLayer = false;
												uni.hideLoading();
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
		}
	}
</script>

<style lang="scss">
.index_new{
	background: #EBEBEB;
	.hd_ad{
		height: 533rpx;
		.img{
			width: 100%;
			height: 100%;
		}
	}
	.more_links{
		height: 180rpx;
		border-radius: 10rpx;
		background: #FFFFFF;
		display: flex;
		align-items: center;
		margin: -30rpx 30rpx 30rpx 30rpx;
		position: relative;
		z-index: 10;
		.item{
			display: flex;
			flex-direction: column;
			width: calc(100%/3);
			align-items: center;
			box-sizing: border-box;
			border-right: 2rpx solid #EBEBEB;
			&:last-child{
				border-right: none;
			}
			.img{
				width: 54rpx;
				height: 54rpx;
			}
			.text{
				font-size: 30rpx;
				color: #000000;
			}
		}
	}
	.more{
		margin: 0 30rpx 20rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.item{
			width: calc(50% - 10rpx);
			height: 196rpx;
			border-radius: 20rpx;
			overflow: hidden;
			background: red;
			&:nth-child(2n+1){
				margin-right: 10rpx;
			}
			&:nth-child(2n+2){
				margin-left: 10rpx;
			}
			.img{
				width: 100%;
				height: 100%;
			}
		}
	}
	.product{
		padding-bottom: 50rpx;
		.tabs{
			height: 80rpx;
			line-height: 80rpx;
			background: #FFFFFF;
			box-sizing: border-box;
			padding: 0 30rpx;
			.scroll{
				width: 100%;
				.scroll_box{
					display: flex;
					align-items: center;
					.item{
						font-size: 30rpx;
						margin-right: 30rpx;
						flex: 0 0 auto;
						&.active{
							color: #B20000;
						}
					}
				}
			}
		}
		.list{
			margin: 0 30rpx;
			display: flex;
			flex-wrap: wrap;
			product{
				width: calc(50% - 10rpx);
				margin-top: 20rpx;
				&:nth-child(2n+1){
					margin-right: 10rpx;
				}
				&:nth-child(2n+2){
					margin-left: 10rpx;
				}
			}
		}
	}
	.layer,.layer1{
		background: rgba($color: #000000, $alpha: 0.5);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		.container{
			width: 560rpx;
			min-height: 400rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			text-align: center;
			box-sizing: border-box;
			padding: 40rpx;
			.title{
				font-size: 30rpx;
				color: #3D3D3D;
			}
			.text{
				font-size: 18rpx;
				color: #D1D1D1;
			}
			.input{
				height: 85rpx;
				background: #F9F5FA;
				border-radius: 10rpx;
				text-align: left;
				padding: 0 15px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin: 40rpx 0 50rpx 0;
				.name{
					font-size: 18rpx;
					color: #3D3D3D;
				}
				.ui-input{
					width: 100%;
					font-size: 18rpx;
				}
			}
			.msg{
				width: 340rpx;
				position: relative;
				.msg_btn{
					text-align: center;
					position: absolute;
					width: 130rpx;
					background: #CD0000;
					right: -140rpx;
					border-radius: 10rpx;
					font-size: 20rpx;
					color: #FFFFFF;
					height: 85rpx;
					line-height: 85rpx;
				}
			}
			.btn{
				display: flex;
				justify-content: space-between;
				.cancel{
					height: 77rpx;
					width: 210rpx;
					border-radius: 77rpx;
					color: #CD0000;
					border:2rpx solid #CD0000;
					font-size: 30rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.confirm-btn{
					height: 77rpx;
					width: 210rpx;
					border-radius: 77rpx;
					background: #CD0000;
					color: #FFFFFF;
					font-size: 30rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 0;
					margin: 0;
				}
			}
		}
	}
	.layer1{
		.container{
			align-items: center !important;
			justify-content: center !important;
			font-size: 30rpx;
			color: #000000;
			position: relative;
			.close{
				position: absolute;
				width: 42rpx;
				height: 42rpx;
				background: url(../../static/close2.png) no-repeat;
				background-size: cover;
				top: -120rpx;
				right: -40rpx;
			}
			view{
				margin-top: 100rpx;
			}
		}
	}
}
</style>
