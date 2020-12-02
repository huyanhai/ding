<template>
	<view>
		<view class="portrait">
			<image :src="img || memberInfo.headPicture ||'/static/missing-face.png'" mode=""></image>
		</view>
		<view class="update-img">
			<view class="" @click="chooseImg">
				点击修改头像
			</view>
		</view>
		<view class="form-list">
			<view class="item">
				<view class="left">
					昵称
				</view>
				<view class="right">
					<input type="text" v-model="nickname" placeholder="你的昵称"/>
				</view>
			</view>
		</view>
		<view class="button-save">
			<view class="" @click="setNickname">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				memberInfo:'',
				nickname:'',
				tempImg:'',
				img:'',
				Qiniu:''
			}
		},
		async onLoad() {
			this.getQiniu()
			let memberInfo = await this.$api.getMemberInfo();
			this.memberInfo = memberInfo.data
			this.nickname = this.memberInfo.nickname
		},
		methods: {
			async getQiniu(){
				let Qiniu = await this.$http.getQiniu()
				if(Qiniu.code==200){
					this.Qiniu = Qiniu.data
				}else{
					this.$api.msg(Qiniu.message)
				}
			},
			chooseImg(){
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(chooseImageRes)
						this.tempImg = tempFilePaths[0]
						this.uploadImg();
				    }
				});
			},
			uploadImg(){
				let that = this;
				uni.showLoading({
					title: '上传中'
				})
				uni.uploadFile({
					url: that.Qiniu.host,
					filePath: that.tempImg,
					name: 'file',
					formData: {
					    "token": that.Qiniu.token,//后端返回的token
					},
					header: {
					        "Content-Type": "multipart/form-data"
					},
					success: (uploadFileRes) => {
						that.img = that.Qiniu.cdnUrl + '/' + JSON.parse(uploadFileRes.data).key
						let imgs = that.img
						that.setIcon(imgs)
					}
				});
			},
			async setIcon(imgs){
				let option = {
					avatarUrl:imgs
				}
				let res = await this.$http.setIcon(option);
				console.log(res)
				if(res.code==200){
					uni.hideLoading()
					this.$api.msg('设置成功')
				}else{
					this.$api.msg(res.message)
				}
			},
			async setNickname(){
				let option = {
					nickname:this.nickname
				}
				let res = await this.$http.setNickname(option);
				console.log(res)
				if(res.code==200){
					this.$api.msg('设置成功')
				}else{
					this.$api.msg(res.message)
				}
			}
		}
	}
</script>

<style lang="scss">
	.portrait{
		width: 100%;
		height: 400upx;
		display: flex;
		align-items: center;
		justify-content: center;
		image{
			width: 300upx;
			height: 300upx;
			border-radius: 100%;
		}
	}
	.update-img{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		view{
			font-size: $font-base;
			color: #999999;
		}
	}
	.button-save{
		position: fixed;
		bottom: 0;
		height: 100upx;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		view{
			width: 100%;
			height: 100upx;
			line-height: 100upx;
			color: #fff;
			background-color: $base-color2;
			text-align: center;
		}
	}
	.item {
		margin-top: 20upx;
		display: flex;
		height: 110upx;
		align-items: center;
		border-bottom: 1upx solid #979797;
		margin : 0 30upx;
		font-size: 30upx;
		.left {
			flex: 3;
			font-weight: 600;
		}
		.right {
			flex: 7;
			display: flex;
			align-items: center;
			input{
				width: 100%;
			}
			.btn-phone {
				flex: 5;
				button {
					font-size: 25upx;
					color: #fff;
					width: 200upx;
					height: 60upx;
					line-height: 60upx;
					text-align: center;
					background-color: #8FCA45;
					border-radius: 10upx;
					padding: 0;
					margin: 0;
				}
			}
			.btn-code {
				flex: 5;
				view {
					font-size: 25upx;
					color: #fff;
					width: 160upx;
					height: 60upx;
					line-height: 60upx;
					text-align: center;
					border: 2upx solid #000;
					border-radius: 10upx;
					color: #000;
				}
			}
		}
		
	}
</style>
