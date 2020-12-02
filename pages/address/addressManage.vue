<template>
	<view class="content">
		<view class="row mb10">
			<text class="tit fontB">联系人</text>
			<input class="input" type="text" v-model="name" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row mb10">
			<text class="tit fontB">手机号</text>
			<input class="input" type="number" v-model="phoneNumber" placeholder="收货人手机号码" placeholder-class="placeholder" maxlength="11"/>
		</view>
		<view class="row mb10">
			<text class="tit fontB">地址</text>
			<view @click="showMode()" class="area" v-if="areaList.length>0">
				 {{areaList[checkAreaIndex[0]].name}}-{{areaList[checkAreaIndex[0]].children[checkAreaIndex[1]].name}}-{{areaList[checkAreaIndex[0]].children[checkAreaIndex[1]].children[checkAreaIndex[2]].name}}
			</view>
		</view>
		<view class="row mb10">
			<text class="tit fontB">门牌号</text>
			<input class="input" type="text" v-model="detailAddress" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view>

		<view class="row default-row">
			<text class="tit fontB" style="border-right: none;">设为默认地址</text>
			<switch :checked="defaultStatus" color="#EBA542" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
		
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
				<picker-view-column>
				  <view class='region-item' v-for="(item,index) in areaList[tempCheckAreaIndex[0]].children[tempCheckAreaIndex[1]].children" :key='index' >{{item.name}}</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>	
</template>

<script>
	//import addressd from '@/components/jm-address/jm-address.vue';
	export default {
		data() {
			return {
				areaList:'',//地址数据集合
				checkAreaIndex:[0,0,0],//选中地址下标
				tempCheckAreaIndex:[0,0,0],//临时选中地址下标
				
				province: '',//省
				region: '',//区
				city: '',//市
				areaId: '',//区id
				defaultStatus: false,//是否为默认地址
				detailAddress: '',//详细地址
				id: 0,//地址id
				name: '',//姓名
				phoneNumber: '',//电话
				postCode: '000000',//邮编
				
				animation:'',//动画
				showAddressModel:false,//是否打开地址选择
				sumbitFlag: false //提交标志，防止重复提交
			};
		},
		onLoad(option) {
			this.$api.showLoading();
			let title = '新增收货地址';
			if (option.type === 'edit') {
				title = '编辑收货地址';
				this.InitData(JSON.parse(option.data));
				this.getAreaList(this.initAddress);
			}else{
				this.getAreaList();
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			});
		},
		methods: {
			
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
			
			//初始化数据
			async InitData(option) {
				this.city = option.city;
				let status = option.defaultStatus;
				if (status == 1) {
					this.defaultStatus = true;
				} else {
					this.defaultStatus = false;
				}
				this.detailAddress = option.detailAddress;
				this.id = option.id;
				this.name = option.name;
				this.phoneNumber = option.phoneNumber;
				this.postCode = option.postCode;
				this.province = option.province;
				this.region = option.region;
				this.areaId = option.areaId;
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
			
			//初始地址下标
			initAddress(){
				
				let addressIndnx=[0,0,0];
				let province=this.province;
				let city=this.city;
				let region=this.region;
				
				//省匹配
				let list=this.areaList;
				let index=0;
				while(index<list.length && province!=list[index].name)index++;
				if(index==list.length){
					this.$api.msg("地址库匹配失败!");
					return;
				}
				addressIndnx[0]=index;
				list=list[index].children;
				index=0;
				
				while(index<list.length &&city!=list[index].name)index++;
				if(index==list.length){
					this.$api.msg("地址库匹配失败!");
					return;
				}
				addressIndnx[1]=index;
				
				list=list[index].children;
				index=0;
				
				while(index<list.length &&region!=list[index].name)index++;
				if(index==list.length){
					this.$api.msg("地址库匹配失败!");
					return;
				}
				addressIndnx[2]=index;
				this.checkAreaIndex=addressIndnx;
				console.log(addressIndnx);
				uni.hideLoading();
			},
			
			//选择是否为默认地址
			switchChange(e) {
				this.defaultStatus = e.detail.value;
			},

			//提交地址信息
			async confirm() {
				if (!this.name) {
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if (!/(^1[0-9]{10}$)/.test(this.phoneNumber)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (!this.detailAddress) {
					this.$api.msg('请填写详细地址');
					return;
				}

				//防止重复提交
				if(!this.sumbitFlag) {
					this.sumbitFlag = true;
					
					let defaultStatus = 0;
					if (this.defaultStatus) {
						defaultStatus = 1;
					}
					let areaList=this.areaList;
					let checkAreaIndex=this.checkAreaIndex;
					let data = {
						defaultStatus: defaultStatus,
						detailAddress: this.detailAddress,
						id: this.id,
						name: this.name,
						phoneNumber: this.phoneNumber,
						postCode: this.postCode,
						province: areaList[checkAreaIndex[0]].name,
						city: areaList[checkAreaIndex[0]].children[checkAreaIndex[1]].name,
						region: areaList[checkAreaIndex[0]].children[checkAreaIndex[1]].children[checkAreaIndex[2]].name,
						areaId: areaList[checkAreaIndex[0]].children[checkAreaIndex[1]].children[checkAreaIndex[2]].id
					};
					let result = {};
					if (this.manageType == 'edit') {
						result = await this.$http.memberAddressUpdate(data);
					} else {
						result = await this.$http.memberAddressAdd(data);
					}
					if (result.code === 200) {
						this.$api.msg(result.message);
						setTimeout(() => {
							uni.navigateBack({
								url: '/pages/address/address'
							});
						}, 800);
					} else {
						this.$api.msg(result.message);
					}
				
				}	
				
			},

		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
			border-right: 1px solid #EFF0F0;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
			margin-left: 20rpx;
		}
		
		.area{
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
			margin-left: 20rpx;
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

	.add-btn{
		margin-left: 10%;
		margin-top: 20px;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80%;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: black;
		border-radius: 10upx;
		/* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		 */
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
