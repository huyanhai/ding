<template>
	<view>
		<view class="padding10 font9 fontcolor16 fontB mtrpx40">
			为了更快的解决您的问题，请在发生问题时或再次遇到问题时，立即提交反馈
		</view>
		<view class="padding1">
			<view class="bgcolor10">
				<view class="font10 fontB padding10">
					描述商品
				</view>
				<view class="padding10" style="padding-top: 0;">
					<textarea placeholder="请描述您在使用丁老表时遇到的问题,并提出您的想法和建议" style="width: 96%;height: 200rpx;" maxlength="400" v-model="desc" />
					</view>
				<view class="padding10">
				</view>
			</view>
		</view>
		<view class="padding1">
			<view style="width: 100%;background-color: #fff;padding: 10upx;">
				<view style="width: 100%;display: flex;">
					<view style="width: 150upx;height: 150upx;position: relative;" v-for="(item,index) in images">
						<image style="width: 150upx;height: 150upx;" :src="item" mode=""></image>
						<image @click="delImg(item)" style="width: 150upx;height: 150upx;position: absolute;top: 0;left: 0;padding: 20upx;opacity: 200;" class="delImg" src="../../static/DelImg.svg" mode=""></image>
					</view>
					<view>
						<image style="width: 150upx;height: 150upx;" src="../../static/addImg.svg" mode="" @click="chooseImg"></image>
					</view>
				</view>
				<view style="font-size: 32upx;color: #DD524D;">最多上传3张截图</view>
			</view>
		</view>
		<view class="padding1">
			<view class="bgcolor10 padding10 flexaround">
				<view class="font10 fontB border_r box_col_25">
					联系方式
				</view>
				<view class="font10 fontB box_col_75">
					<input type="text" placeholder="请填写手机号或者邮箱" v-model="phone"/>
				</view>
			</view>
		</view>
		
		<view class="padding1 mt10">
			<view style="background-color: #1DC7AC;" class=" padding13 fontcolor4 textcenter font10 radius15" @click="submit">
				提交
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone:undefined,
				desc:'',
				images:[],
				request :false,
				Qiniu:'',
				tempImg:''
			}
		},
		onLoad() {
			this.getQiniu()
		},
		methods: {
			delImg(index){
				this.images.splice(index,1)
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
				if(this.images.length>=3){
					this.$api.msg('最多上传三张截图');
					return;
				}
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
				console.log('that.Qiniu.host',that.Qiniu.host)
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
						console.log(uploadFileRes.data);
						let url = that.Qiniu.cdnUrl + '/' + JSON.parse(uploadFileRes.data).key
						that.images.push(url);
						uni.hideLoading()
					},
					fail() {
						that.$api.msg('上传失败!');
						uni.hideLoading()
					}
				});
			},
			async submit(){
				if(this.request){
					return
				}else{
					this.request = true
				}
				if(this.phone==''){
					this.$api.msg('请填写手机号或邮箱！')
					return
				}
				if(this.desc==''){
					this.$api.msg('请填写内容！')
					return
				}
				let data = {
					contactWay:this.phone,
					content:this.desc,
					images:this.images
				}
				let result = await this.$http.issueFeedback(data)
				console.log('result',result)
				if (result.code == 200) {
					this.$api.msg(result.message)
					setTimeout(function(){
						uni.navigateBack({})
					},1000)
					this.request = false
				} else {
					this.$api.msg(result.message)
					this.request = false
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #F7F8FC;
		width: 100%;
		height: 100%;
	}
	input{
		font-size: 12px;
		line-height: 20px;
		height: 20px;
		margin-left: 10px;
	}
	textarea{
		font-size: 12px;
	}
</style>
