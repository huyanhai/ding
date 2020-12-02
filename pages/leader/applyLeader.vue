<template>
	<view>
		<view class="form-list">
			<view class="item">
				<view class="left">
					*店铺名称
				</view>
				<view class="right">
					<input type="text" v-model="formData.storeName" placeholder="你的店铺名称"/>
				</view>
			</view>
			<view class="item">
				<view class="left">
					*手机号
				</view>
				<view class="right">
					<input type="number" v-model="formData.phone" placeholder="输入手机号"/>
					<!-- <view class="btn-phone">
						<button type="primary" open-type="getPhoneNumber" @getPhoneNumber="getPhoneNumber">使用微信手机号</button>
					</view> -->
				</view>
				
			</view>
			<!-- <view class="item">
				<view class="left">
					*省份
				</view>
				<view class="right">
					<input type="text" v-model="formData.province" placeholder="你的省份"/>
				</view>
			</view>
			<view class="item">
				<view class="left">
					*城市
				</view>
				<view class="right">
					<input type="text" v-model="formData.city" placeholder="你的城市"/>
				</view>
			</view> -->
			<!-- <view class="item">
				<view class="left">
					*验证码
				</view>
				<view class="right">
					<input type="text" v-model="formData.authcode" placeholder="输入验证码"/>
					<view class="btn-code">
						<view class="" @click="getAuthCode()">
							获取验证码
						</view>
					</view>
				</view>
			</view> -->
			<view class="item" @click="showMode()">
				<view class="left">
					*地区
				</view>
				<view class="right">
					{{areaList[checkAreaIndex[0]].name||''}}-{{areaList[checkAreaIndex[0]].children[checkAreaIndex[1]].name||''}}
				</view>
				<view class="">
					<text class="cell-more yticon icon-you"></text>
				</view>
			</view>
			<view class="item" @click="getRigon()">
				<view class="left">
					*地址
				</view>
				<view class="right">
					{{formData.region||'请选择地址'}}
				</view>
				<view class="">
					<text class="cell-more yticon icon-you"></text>
				</view>
			</view>
			<view class="item">
				<view class="left">
					*详细地址
				</view>
				<view class="right">
					<input type="text" v-model="formData.detail" placeholder="如道路、门牌号等"/>
				</view>
			</view>
			<view class="item">
				<view class="left">
					邀请码
				</view>
				<view class="right">
					<input type="text" v-model="formData.inviteCode" placeholder="你的邀请码（选填）"/>
				</view>
			</view>
			<!-- <view class="item">
				<view class="left">
					营业执照
				</view>
				<view class="right">
					<view style="width: 100upx;height: 100upx;margin-right: 20upx;" v-if="tempImg">
						<image style="width: 100%;height: 100%;" :src="tempImg" mode=""></image>
					</view>
					<view class="btn-code">
						<view class="" @click="chooseImg">
							选择图片
						</view>
					</view>
				</view>
			</view> -->
		</view>
		<view class="submit" @click="submit()">
			立即申请
		</view>
		<view class="tip">
			注：申请后，我们将尽快与您联系，并为您开通团长身份
		</view>
		<!-- 屏幕背景变暗的背景 -->
		<view class="region_screen" @click="hideModal" v-if="showAddressModel"></view>
		<!--地址选择框-->
		<view  :animation="animation" class="region-box" v-if="showAddressModel">
			<view class='top'>
			  <text @click='hideModal' class='cancel'>取消</text>
			  <text @click='sureRegion' class='sure'>确认</text>
			</view>
			<picker-view indicator-style="height: 50px;" class='region' :value="tempCheckAreaIndex" @change="addressChang">
				<picker-view-column>
				  <view v-for="(item,index) in  areaList" :key='index'  class='region-item'>{{item.name}}</view>
				</picker-view-column>
				<picker-view-column>
				  <view class='region-item' v-for="(item,index) in areaList[tempCheckAreaIndex[0]].children" :key='index' >{{item.name}}</view>
				</picker-view-column>
				<!-- <picker-view-column>
				  <view class='region-item' v-for="(item,index) in areaList[tempCheckAreaIndex[0]].children[tempCheckAreaIndex[1]].children" :key='index' >{{item.name}}</view>
				</picker-view-column> -->
			</picker-view>
		</view>
	</view>
</template>

<script>
	import amap from '../../common/amap-wx.js';
	// import addressd from '@/components/jm-address/jm-address.vue';
	export default {
		data() {
			return {
				formData:{
					storeName:'',
					phone :'',
					region:'',
					lat:0,
					lon:0,
					province:'',
					city:'',
					inviteCode:'',
				},
				amapPlugin: null,
				key: 'd52befc87beb8ce929d2eaa887e488ad',
				addressName: '',
				areaList:'',//地址数据集合
				areaSubList:'',
				checkAreaIndex:[0,0],//选中地址下标
				tempCheckAreaIndex:[0,0],//临时选中地址下标
				location:{},//定位
				animation:'',//动画
				showAddressModel:false,//是否打开地址选择
				userInfo:{},
				Qiniu:'',
				tempImg:''
			}
		},
		onLoad() {
			this.getAreaList();
			this.amapPlugin = new amap.AMapWX({
				key: this.key  
			});
			this.getQiniu()
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
						// this.uploadImg();
				    }
				});
			},
			uploadImg(){
				if(!this.tempImg){
					this.submit();
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
						that.formData.businessLicense = that.Qiniu.cdnUrl + '/' + JSON.parse(uploadFileRes.data).key
						that.submit();
					},
					file:(e)=>{
						uni.hideLoading();
						this.$api.msg('图片上传失败')
					}
				});
			},
			getRigon(){
				let that = this
				uni.chooseLocation({
				    success: function (res) {
						console.log(res)
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
						that.formData.lat = res.latitude;
						that.formData.lon = res.longitude;
						that.formData.region = res.name;
						that.formData.detail = res.address;
				    },
					fail(e) {
						if(e.errMsg=='chooseLocation:fail auth deny'){
							wx.showModal({
							  title: '提示',
							  content: '您没有授权使用位置信息，将无法使用地图功能',
							  cancelText:'不授权',
							  cancelColor:'#999',
							  confirmText:'授权',
							  confirmColor:'#f94218',
							  success(res) {
								if (res.confirm) {
								  wx.openSetting({
									  success(res) {
										console.log(res.authSetting)
									  }
									})                                
								} else if (res.cancel) {
								  console.log('用户点击取消')
								}
							  }
							})
						}
					}
				});
			},
			//选择地址
			addressChang(e){
				this.tempCheckAreaIndex=e.detail.value;
			},
			
			//显示地址选择框
			showMode(){
				let that=this;
				let areaIndex = this.checkAreaIndex;
				// 显示遮罩层
				let animation = uni.createAnimation({
				  duration: 100,
				  timingFunction: "linear",
				  delay: 0
				})
				this.animation = animation;
				animation.translateY(500).step();
				this.animation=animation.export();
				this.showAddressModel=true;
				this.tempCheckAreaIndex=areaIndex;
				
				setTimeout(function () {
				  animation.translateY(0).step();
				  that.animation=animation.export();
				}.bind(this), 100)
			},
			
			//隐藏地址选择模态框
			hideModal(){
				// 隐藏遮罩层
				let that=this;
				let animation = uni.createAnimation({
				  duration: 200,
				  timingFunction: "linear",
				  delay: 0
				});
				animation.translateY(500).step();
				this.animation=animation.export()
				setTimeout(function () {
				  animation.translateY(0).step();
				  this.animation=animation.export();
				  this.showAddressModel= false
				}.bind(this), 200)
			},
			
			//确认当前选择
			sureRegion(){
				this.checkAreaIndex=this.tempCheckAreaIndex;
				this.hideModal();
			},
			//得到地址数据集
			async getAreaList(fun){
				let reponse = await this.$http.getAllArea();
				if(reponse.code!=200){
					this.$api.msg(reponse.message);
					return;
				}
				this.areaList=reponse.data;
				if (typeof fun=="function")
				 fun();
				 else
					uni.hideLoading();
			},
			async getAuthCode(){
				const result = await this.$http.getAuthCode(this.formData.telPhone);//获取验证码接口
				this.$api.msg(result.msg);
			},
			getPhoneNumber: function(e){
				console.log(e)
			},
			submit(){
				uni.showLoading({
					title: '正在提交信息'
				})
				this.formData.province = this.areaList[this.checkAreaIndex[0]].name
				this.formData.city = this.areaList[this.checkAreaIndex[0]].children[this.checkAreaIndex[1]].name
				this.$http.applyLeader(this.formData).then(res=>{
					console.log(res)
					// uni.hideLoading();
					// this.$api.msg(res.msg)
					if(res.code==200){
						this.$api.msg('申请成功,'+res.data)
						setTimeout(()=>{
							uni.navigateBack({
								
							})
						},1000)
					}else{
						this.$api.msg(res.message)
					}
				});//申请团长接口
			}
		}
	}
</script>

<style lang="scss">
	.item {
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
	.submit{
		margin: 40upx;
		height: 100upx;
		background-color: #8FCA45;
		text-align: center;
		line-height: 100upx;
		border-radius: 5upx;
		color: #fff;
	}
	.tip {
		margin-left: 40upx;
		font-size: 25upx;
	}
	/*使屏幕变暗  */
	.region_screen {
	  width: 100%;
	  height: 100%;
	  position: fixed;
	  top: 0;
	  left: 0;
	  background: #000;
	  opacity: 0.4;
	  overflow: hidden;
	  z-index: 1000;
	  color: #fff;
	 }
	.region-box {
	  height: 591upx;
	  width: 100%;
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  overflow: hidden;
	  z-index: 2000;
	  background: #fff;
	  
	  
	  .top{
	    height:91upx;
	    border-bottom: 1upx solid gray;
	    padding:0 31.25upx;
	    line-height: 90upx;
	    font-size: 35upx;
	    font-weight: 400;
	    
	    
	  }
	  
	  .top .cancel{
	    float: left;
	    font-size: inherit;
	    line-height:inherit;
	    font-weight: inherit;
	  }
	  
	  .top .sure{
	    font-size: inherit;
	    color: green;
	    float: right;
	    line-height:inherit;
	    font-weight: inherit;
	  }
	  
	  .region{
	    width: 100%;
	    height: 500upx;
	    
	  }
	  
	  .region .region-item{
	   line-height: 50px;
	    text-align: center;
	  }
	  
	}
</style>
