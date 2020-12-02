<template>
	<view class="container">
		<view class="" v-if="!haveSubmit">
			<view class="liveImage">
				<view style="font-size: 32upx;color: rgb(51,51,51);">
					直播海报
				</view>
				<view class="liveImageBtn" @click="chooseImg">
					更改
				</view>
			</view>
			<image :src="tempImg||(formData.imgPath||'../../static/errorImage.jpg')" mode="" style="width: 720upx;height: 394upx;border-radius: 20upx;margin-top: 24upx;"></image>
			<view class="desc">
				海报为人工审核，请上传本人面部清晰的照片；请勿上传暴露/低俗/包含边框，相机水印的图片；海报如在审核中被驳回，会保持原海报不变
			</view>
			<view style="margin-top: 36upx;color: rgb(51,51,51);font-size: 32upx;">
				标题/简介
			</view>
			<input style="" class="input" placeholder="请输入您喜欢的标题..." placeholder-class="inputPlaceholder" type="text" v-model="formData.title" />
			<textarea style="padding: 14upx 20upx;height: 160upx;" class="input" placeholder="请输入您喜欢的直播简介..." placeholder-class="inputPlaceholder" v-model="formData.introduce" />
			<view class="submit" @click="uploadImg">
				提交资料
			</view>
		</view>
		<view class="" v-if="haveSubmit">
			<view class="successImg">
				<image style="width: 460upx;height: 297upx;margin-top: 92upx;" src="../../static/submitSuccess.png" mode=""></image>
			</view>
			<view style="font-size: 32upx;color: rgb(51,51,51);text-align: center;">
				提交成功
			</view>
			<view class="desc">
				您已成功提交直播申请，小二正在快马加鞭审核中；还请客官喝杯茶耐心等候哦~
			</view>
			<view class="submit" style="margin-top: 480upx;" @click="navToIndex">
				返回首页
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData:{
					title:'',
					introduce:'',
					imgPath:''
				},
				Qiniu:'',
				tempImg:'',
				haveSubmit:false,
				memberInfo:'',
				type:0,
				live_sn:''
			}
		},
		async onLoad(option) {
			if(option.type&&option.type==1){
				this.type = 1;
				let res = await this.$http.getLiveDetail({live_sn:option.live_sn})
				if(res.code==200){
					console.log(res)
					this.formData.title = res.data.title;
					this.formData.introduce = res.data.introduce;
					this.formData.imgPath = res.data.img;
					this.live_sn = res.data.live_sn;
				}else{
					this.$api.msg(res.message)
				}
			}
			this.getQiniu()
			let memberInfo = await this.$api.getMemberInfo();
			this.memberInfo = memberInfo.data
		},
		methods: {
			navToIndex(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
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
				    }
				});
			},
			uploadImg(){
				if(this.type==1&&this.tempImg==''){
					this.submit()
					return;
				}
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
						uni.hideLoading()
						console.log(uploadFileRes.data);
						that.formData.imgPath = that.Qiniu.cdnUrl + '/' + JSON.parse(uploadFileRes.data).key
						this.submit()
					}
				});
			},
			async submit(){
				if(!this.formData.imgPath){
					this.$api.msg('请上传直播间封面')
					return;
				}
				if(!this.formData.title){
					this.$api.msg('请输入直播间标题')
					return;
				}
				if(!this.formData.introduce){
					this.$api.msg('请输入直播间简介')
					return;
				}
				
				let res;
				if(this.type==0){
					let options = {
						head:this.memberInfo.headPicture,
						nickname:this.memberInfo.nickname,
						telephone:this.memberInfo.phone,
						title:this.formData.title,
						cover:this.formData.imgPath,
						introduce:this.formData.introduce,
						reason:'12'
					}
					res = await this.$http.applyLive(options)
				}else{
					let options = {
						mermber_phone:this.memberInfo.phone,
						title:this.formData.title,
						img:this.formData.imgPath,
						introduce:this.formData.introduce,
						live_sn:this.live_sn,
						status:0
					}
					res = await this.$http.updateLive(options)
				}
				if(res.code==200){
					if(res.data==true&&this.type==0){
						this.haveSubmit = true;
					}else if(res.data==true){
						this.$api.msg('修改成功')
					}
				}else{
					this.$api.msg(res.msg)
				}
			},
		}
	}
</script>

<style lang="scss">
	.container{
		margin: 0 30upx;
		font-size: 24upx;
	}
	.liveImage{
		display: flex;
		justify-content: space-between;
		margin-top: 20upx;
		.liveImageBtn{
			width: 94upx;
			height: 42upx;
			color: rgb(29,199,172);
			border: 1upx solid rgb(29,199,172);
			border-radius: 42upx;
			font-size: 24upx;
			text-align: center;
			line-height: 42upx;
		}
	}
	.desc{
		font-size: 24upx;
		color: rgb(170,170,170);
		line-height: 30upx;
		margin: 20upx 10upx 0;
	}
	.input{
		width: 702upx;
		height: 88upx;
		background-color: rgb(241,246,247);
		color: rgb(29,199,172);
		border-radius: 16upx;
		padding: 0 20upx;
		margin-top: 32upx;
	}
	.inputPlaceholder{
		color: rgb(29,199,172);
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
		margin-top: 100upx;
	}
	.successImg{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
