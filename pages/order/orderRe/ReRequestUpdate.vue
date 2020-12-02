<template>
	<view>
		<!-- 商品列表 -->
		<view class="goods-section">
			<view class="g-item">
				<image :src="returnInfo.productPic"></image>
				<view class="right">
					<text class="title clamp mt10 fontB">{{returnInfo.productName}}</text>
					<view class="price-box">
						<view class="flex-between mtrpx10">
							<text class="price fontB font14" style="color: #000;">￥{{returnInfo.productRealPrice}}</text>
							<!-- <text class="spec">{{item.sp1?item.sp1:''}} {{item.sp2?item.sp2:''}} {{item.sp3?item.sp3:''}}</text> -->
						</view>
						<text class="number font14">x {{returnInfo.productCount}}</text>
					</view>
				</view>
			</view>
			<view class="flexend padding1 mt10">
				<view class="mr20">
					共：<text style="color: #EBA542;">￥{{returnInfo.returnAmount}}元</text>
				</view>
			</view>
		</view>
		
		<view class="padding1 bgcolor10 mt10">
			<view>
				<view class="font10 fontB padding10" v-if='returnInfo.type==0'>
					退款原因
				</view>
				<view class="font10 fontB padding10" v-else>
					换货原因
				</view>
				<view class="padding10" style="padding-top: 0;">
					<picker @change="bindPickerChange" :value="index" :range="reason" style="color: #EBA542;">
					    <view>{{index==-1?'请选择原因':reason[index]}}</view>
					</picker>
				</view>
			</view>
		</view>
		
		<view class="padding1 bgcolor10 mt10">
			<view>
				<view class="font10 fontB padding10"  v-if='returnInfo.type==0'>
					退款描述
				</view>
				<view class="font10 fontB padding10" v-else>
					换货描述
				</view>
				<view class="padding10" style="padding-top: 0;">
					<textarea placeholder="请将您的售后原因写下来，以便解决售后问题" style="width: 96%;height: 50rpx;font-size: 11px;" maxlength="400" v-model="returnInfo.description" />
				</view>
			</view>
		</view>
		
		<view class="bgcolor10 padding1">
			<view class="font10 fontB padding10">
				上传图片（最多可上传5张）：
			</view>
			<view class="contant-pic">
				<view class="pics-list" v-for="item in pics" :key="item">
					<image :src="item" class="uploadImg"></image>
					<image src="/static/DelImg.svg" class="uploadImg-error" @tap='deleteImg($event)' :data-img='item'></image>
				</view>
				<view class="uploadImgAdd">
					<image src="/static/addImg.svg" class="uploadImg" @tap='chooseImage' :class="isShow?'true':'hideTrue'"></image>
				</view>
			</view>
		</view>
		<view class="bgcolor10 padding1 mt10">
			<view class="flexaround" style="padding: 20rpx 40rpx;">
				<view class="font10 fontB border_r box_col_20">
					联系方式
				</view>
				<view class="font10 fontB box_col_75">
					<input type="number" placeholder="请输入您的联系号码" v-model="returnInfo.returnPhone" maxlength="11"/>
				</view>
			</view>
		</view>
		
		<!-- <view class="bgcolor10 padding1 mt10" style="color: #EBA542;" v-if='type==2' @click="change"> 
			<view class="flexbetween" style="padding: 20rpx 40rpx;">
				<view class="font10 fontB">
					你想要换成什么
				</view>
				<view class="font10 fontB">
					<view class="yticon icon-you"></view>
				</view>
			</view>
		</view> -->
		<view class="action-btn" @click="submit">
			提交信息
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				total:0,
				returnInfo:{},
				returnId:0,
				goodsData:[],
				productId: undefined,
				pics: [],
				picUrls: [],
				isShow: true,
				reason:[],
				index: -1,
				Qiniu:{},
			}
		},
		async onLoad(option) {
			let that = this
			if (!option.returnId) {
				this.$api.msg("参数错误!");
				uni.navigateBack({});
				return;
			}
			this.returnId = option.returnId;
			this.getReturnInfo()
			this.getQiniu()
		},
		
		methods: {
			async submit(){
				// account (string, optional): 手机号/微信 ,
				// description (string, optional): 描述 ,
				// imgs (Array[string], optional): 图片列表 ,
				// orderId (integer, optional): 订单id ,
				// productId (integer, optional): 商品id ,
				// quantity (integer, optional): 数量 ,
				// reason (string, optional): 原因 ,
				// type (integer, optional): 操作类型:0->退货(退款);1:换货;
				
				
				if(this.picUrls.length< 1 ){
					this.$api.msg('请最少上传一张图片')
					return
				}
				
				if(!(/^1[3456789]\d{9}$/.test(this.returnInfo.returnPhone))){
					this.$api.msg('请输入正确的手机号')
					return
				}
				let data = {
					orderReturnApplyId:this.returnId,
					account:this.returnInfo.returnPhone,
					description :this.returnInfo.description,
					imgs :this.picUrls,
					reason: this.reason[this.index]
				}
				let result = await this.$http.updateRefundExchange(data)
				if(result.code==200){
					this.$api.msg(result.message)
					setTimeout(function(){uni.navigateBack({})},1000)
					
				}else{
					this.$api.msg(result.message)
				}
			},
			
			async getQiniu(){
				let Qiniu = await this.$http.getQiniu()
				if(Qiniu.code==200){
					this.Qiniu = Qiniu.data
				}else{
					this.$api.msg(Qiniu.message)
				}
			},
			bindPickerChange(e){
				 this.index = e.target.value
			},
			change(){
				
			},
			async getReason(){
				let reason = await this.$http.getReturnReason()
				if(reason.code==200){
					this.reason = reason.data
					for (let item in this.reason){
						if(this.reason[item] == this.returnInfo.reason){
							this.index = item
						}
					}
				}else{
					this.$api.msg(reason.message)
				}
			},
			async getReturnInfo() {
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				let result = await this.$http.getMemberOrderReturnDetailInfo(this.returnId);
				uni.hideLoading();
				if (result.code == 200) {
					if (result.data) {
						this.returnInfo = result.data
						this.pics = this.returnInfo.proofPics
						this.picUrls = this.returnInfo.proofPics
						this.getReason()
					}
				}
			},
			deleteImg: function(e) {
				let that = this;
				let deleteImg = e.currentTarget.dataset.img;
				let pics = that.pics;
				let pics2 = that.picUrls;
				for (let i = 0; i < pics.length; i++) {
					//判断字符串是否相等
					if (pics[i] === deleteImg) {
						pics.splice(i, 1)
						pics2.splice(i, 1)
					}
				}
				that.pics = pics
				that.picUrls = pics2
				console.log(pics,pics2)
				console.log(that.pics,that.picUrls)
				that.isShow = true
			},
			chooseImage: function() {
				let that = this;
				console.log("zmx ->>> choose")
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album'],
					success: function(res) {
						// console.log("zmx->>>success1" )
						let pics = that.pics
						console.log("zmx ->>> success1")
						console.log(res)
						let imgSrc = res.tempFilePaths[0];
						
						if (pics.length >= 5) {
							that.isShow = false
						}
						uni.uploadFile({
							url: that.Qiniu.host,
							filePath: imgSrc,
							name: 'file',
							formData: {
							    "token": that.Qiniu.token,//后端返回的token
							},
							header: {
							        "Content-Type": "multipart/form-data"
							},
							success: function(res) {
								// pics.push(imgSrc);
								// that.pics = pics
								console.log("zmx ->>> success2")
								console.log(res)
								// let datas = ;
								that.picUrls.push(that.Qiniu.cdnUrl + '/' + JSON.parse(res.data).key);
								if (that.pics.length >= 5) {
									that.isShow = false
								}
							},
							fail: function(err) {
								uni.hideLoading();
								// that.$util.showToast('上传失败请重试！')
							}
						})
					},
				})
			},
			upload(imgPath){
			        let _this = this
			    wx.uploadFile({
			      url: 'https://up.qiniup.com',    //此处为华东地区，其他地区请查阅文档
			      name: 'file',
			      filePath: imgPath,
			      header: {
			        "Content-Type": "multipart/form-data"
			      },
			     formData: {
			       token: _this.token, //后端返回的token
			     },
			     success: function(res) {
			        console.log(res)
			        
			     },
			     fail: function(res) {
			        console.log(res)
			     }
			   });
			}
		}
	}
</script>

<style lang="scss">
page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}
	.action-btn {
		margin-top: 20rpx;
		display: block;
		width: 80%;
		height: 80upx;
		margin-left: 10%;
		line-height: 80upx;
		font-size: $font-sm + 2upx;
		color: #fff;
		background: $border-color;
		border-radius: 5px;
		z-index: 9999;
		border: 1px solid $border-color;
		text-align: center;
		font-weight: bolder;
	
		&:after {
			border-radius: 5px;
		}
	
		&.recom {
			background-color: #fff;
			color: #272A30;
			&:after {
				border-color: $border-color;
			}
		}
	}
	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding: 20px 0;

		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 50upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 10upx;
				border: 1px solid #ccc;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
				margin-left: 30px;
			}

			.price-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32upx;
				color: #000000;
				padding-top: 10upx;

				.price {
					margin-bottom: 4upx;
				}

				.number {
					font-size: 32upx;
					color: #000000;
					margin-top: 10rpx;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}
	
	.contant-pic {
		display: flex;
		justify-content: start;
		width: 100%;
		padding: 10rpx 0;
		flex-wrap: wrap;
		background-color: white;
	}
	
	.pics-list {
		width: 23%;
		padding: 1%;
		position: relative;
		height: 170rpx;
	}
	
	.uploadImg {
		width: 100%;
		height: 100%;
	}
	
	.uploadImgAdd {
		width: 23%;
		height: 170rpx;
		padding: 1%;
	}
	
	.uploadImg-error {
		position: absolute;
		height: 40px;
		width: 40px;
		top: 50%;
		left: 50%;
		margin-top: -20px;
		margin-left: -20px;
	}
	.hideTrue{
		display: none;
	}
</style>
