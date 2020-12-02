<template>
	<view class="content">
		<!-- <view class="row b-b">开户银行信息</view> -->
		<view class="legalIdCard">
			<view style="font-size: 32upx;font-weight: bold;">
				请拍摄并上传你的身份证照片
			</view>
			<view class="mid">
				<view class="mid-img">
					<image style="width: 218upx;height: 150upx;" :src="tempImg1||'../../static/idcardFront.png'" mode=""></image>
					<view class="mid-btn" @click="chooseImg1">
						正面照片
					</view>
				</view>
				<view class="mid-img">
					<image style="width: 218upx;height: 150upx;" :src="tempImg2||'../../static/idcardBack.png'" mode=""></image>
					<view class="mid-btn" @click="chooseImg2">
						反面照片
					</view>
				</view>
				<view class="mid-img">
					<image style="width: 218upx;height: 150upx;" :src="tempImg3||'../../static/handIdcard.png'" mode=""></image>
					<view class="mid-btn" @click="chooseImg3">
						手持证件
					</view>
				</view>
			</view>
			<view class="bottom">
				大陆公民持有的本人有效二代身份证；拍摄时确保身份证<text style="color: rgb(299,26,26);">边框完整，字体清晰，亮度均匀；</text>
			</view>
		</view>
		<view class="row">
			<text class="tit">卡号:</text>
			<input class="input" type="text" v-model="bankCardNum" placeholder="请输入卡号" placeholder-class="placeholder" v-if="isEdit" />
			<text class="tit" v-else style="width: 75%;">{{bankCardNum}}</text>
		</view>
		<view class="row">
			<text class="tit">姓名:</text>
			<input class="input" type="text" v-model="accountName" placeholder="请输入姓名" placeholder-class="placeholder" v-if="isEdit" />
			<text class="tit" v-else style="width: 75%;">{{accountName}}</text>
		</view>
		<view class="row">
			<text class="tit">手机号:</text>
			<input class="input" type="text" v-model="phone" placeholder="请输入手机号" placeholder-class="placeholder" v-if="isEdit" />
			<text class="tit" v-else style="width: 75%;">{{phone}}</text>
		</view>
		<!-- <view class="row">
			<text class="tit">详细地址:</text>
			<input class="input" type="text" v-model="address" placeholder="请输入详细地址" placeholder-class="placeholder" v-if="isEdit" />
			<text class="tit" v-else style="width: 75%;">{{address}}</text>
		</view> -->
		<view class="row">
			<text class="tit">身份证号:</text>
			<input class="input" type="text" v-model="legalIdCard" placeholder="请输入身份证号" placeholder-class="placeholder" v-if="isEdit" />
			<text class="tit" v-else style="width: 75%;">{{legalIdCard}}</text>
		</view>
		<view class="row">
			<text class="tit">所属银行:</text>
			<text class="tit" style="width: 75%;" @click="toggleBankMask('show')">{{bankInfo.bankName||'选择银行'}}</text>
		</view>
		<view class="row" @click="showMode()">
			<text class="tit">开卡地址:</text>
			<text class="">
				{{areaList[checkAreaIndex[0]].name||''}}-{{areaList[checkAreaIndex[0]].children[checkAreaIndex[1]].name||''}}
			</text>
		</view>
		<view class="row" @click="showMode2()">
			<text class="tit">所属支行:</text>
			<text class="">
				{{branchInfo[checkBranchIndex].name||'请选择所属银行支行'}}
			</text>
		</view>
		
		<!-- <view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="defaultStatus=='Yes'" :disabled="!isEdit" color="#1DC7AC" @change="switchChange" />
		</view> -->
		<button class="add-btn" @click="isEdit = true" v-if="!isEdit">更改信息</button>
		<button class="add-btn" @click="confirm" v-else>提交</button>
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
		<!-- 屏幕背景变暗的背景 -->
		<view class="region_screen" @click="hideModal" v-if="showBranchModel"></view>
		<!--地址选择框-->
		<view  :animation="animation" class="region-box" v-if="showBranchModel">
			<view class='top'>
			  <text @click='hideModal2' class='cancel'>取消</text>
			  <text @click='sureRegion2' class='sure'>确认</text>
			</view>
			<picker-view indicator-style="height: 50px;" class='region' :value="tempCheckBranchIndex" @change="branchChang">
				<picker-view-column>
				  <view v-for="(item,index) in  branchInfo" :key='index'  class='region-item'>{{item.name}}</view>
				</picker-view-column>
				<!-- <picker-view-column>
				  <view class='region-item' v-for="(item,index) in areaList[tempCheckAreaIndex[0]].children" :key='index' >{{item.name}}</view>
				</picker-view-column> -->
				<!-- <picker-view-column>
				  <view class='region-item' v-for="(item,index) in areaList[tempCheckAreaIndex[0]].children[tempCheckAreaIndex[1]].children" :key='index' >{{item.name}}</view>
				</picker-view-column> -->
			</picker-view>
		</view>
		<!-- 选择银行面板 -->
		<view class="bank-mask" :class="bankMaskState===0 ? 'none' : bankMaskState===1 ? 'show' : ''" @click="toggleBankMask" @touchmove.stop.prevent="stopPrevent">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view class="status_bar">
					<image style="width: 15px;height: 15px;position: absolute;left:6%;top: 30upx;" src='../../static/search.svg'></image>
					<input type="text" class="serchInput" placeholder="搜索银行" v-model="keyWord" />
					<!-- <button class="contact" style="width: 50upx;height: 50upx;position: absolute;right: 3%;top: 25%;padding: 0;background-color: transparent;" type="default" open-type="contact">
						<image style="width: 50upx;height: 50upx;" src="../../static/kefu.png" mode=""></image>
					</button> -->
					
				</view>
				<scroll-view scroll-y="true" style="max-height: 760upx;min-height: 360upx;" @scrolltolower="loadData">
					<view class="bank-item" v-for="item in bankList" v-if="bankList.length>0" @click="checkBank(item)">
						<view class=".bank-left">
							{{item.bankName}}
						</view>
						<!-- <view class=".bank-right">
							点击选择
						</view> -->
					</view>
					<view style="height: 100upx;text-align: center;line-height: 100upx;font-size: 35upx;" v-if="bankList.length<=0">
						{{tip}}
					</view>
					<uni-load-more :status="loadingType"></uni-load-more>
				</scroll-view>
			</view>
		</view>
		<!-- <camera device-position="back" flash="off" @error="error" style="width: 100%; height: 300px;"></camera> -->
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components:{
			uniLoadMore
		},
		data() {
			return {
				id:'',//id
				bankCardNum: '', //用户卡号
				accountName: '', //用户姓名
				phone:'',//手机号
				address:'',//详细地址
				legalIdCard:'',//身份证号
				bankName: '去选择', //所属银行
				openBankAddress: '', //开户地址
				defaultStatus:'No',//是否默认
				isEdit: false,
				type:'add',//操作类型
				sumbitFlag: false, //提交标志，防止重复提交
				animation:'',//动画
				showAddressModel:false,//是否打开地址选择
				showBranchModel:false,//是否打开支行选择
				addressName: '',
				areaList:'',//地址数据集合
				areaSubList:'',
				checkAreaIndex:[0,0],//选中地址下标
				tempCheckAreaIndex:[0,0],//临时选中地址下标
				checkBranchIndex:0,//选中支行下标
				tempCheckBranchIndex:0,//临时选中支行下标
				brankTip:'选择开卡地址与所属银行后可选择',
				bankInfo:'',
				branchInfo:'',
				branchCode:'',
				tempImg1:'',
				tempImg2:'',
				tempImg3:'',
				Qiniu:'',
				bankMaskState:0,
				bankList:[],
				keyWord:'',
				pageSize:10,
				pageNum:1,
				tip:'输入关键字找到所属银行。。。',
				loadingType:'more'
			};
		},
		onReady() {
			//this.loadData();
		},
		watch:{
			keyWord(val, oldVal){//普通的watch监听
				this.serch()
			},
		},
		onLoad(option) {
			this.getQiniu();
			this.getAreaList();
			if(option && option.type=='add'){
				this.type=option.type;
				this.isEdit=true;
			}else if(option && option.type=="edit" && option.data){
				this.type=option.type;
				let data=JSON.parse(option.data);
				this.bankCardNum=data.bankCardNum;
				this.accountName=data.accountName;
				this.bankName=data.bankName;
				this.openBankAddress=data.openBankAddress;
				this.defaultStatus=data.defaultStatus;
				this.id=data.id;
			}else{
				this.$api.msg("参数错误!");
				uni.navigateBack({});
			}
		},
		async onShow() {
			console.log(this.bankInfo)
		},
		methods: {
			loadData(source,keyWord){
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				if (source === 'reLoad') {
					//tab切换只有第一次需要加载数据
					this.pageNum = 1
				}
				this.loadingType = 'loading';
				setTimeout(async () => {	
					let result = undefined
					let params = {
						"bankName":keyWord||this.keyWord,
						"pageSize": 10,
						"pageNum": this.pageNum,
					};
					result = await this.$http.getBankList(params);
							
					if (result.code != 200) {
						return false;
					}
					let bankList = result.data;
					if (this.pageNum === 1) { //下拉刷新
						this.bankList = bankList;
						if(bankList.length<=0){
							this.tip = '没有找到银行'
						}
						uni.stopPullDownRefresh();
					} else { //加载更多
						bankList.forEach(item => {
							this.bankList.push(item);
						})
					}
					this.pageNum = this.pageNum + 1;
					if (result.data.length > 0) {
						//判断是否还有数据， 有改为 more， 没有改为noMore 
						this.loadingType = 'more';
					} else {
						this.loadingType = 'noMore';
					}
				}, 600);
			},
			async serch(){
				if(this.keyWord == ''){
					return
				}
				this.loadData('reLoad',this.keyWord);
			},
			async checkBank(item){
				this.bankInfo = item;
				if(this.bankInfo&&this.areaList){
					//查询支行编码
					let options = {
						bankCityNo:this.areaList[this.checkAreaIndex[0]].children[this.checkAreaIndex[1]].id,
						bankProvinceNo:this.areaList[this.checkAreaIndex[0]].id,
						headBankNo:this.bankInfo.bankCode
					}
					let res = await this.$http.getBankBranch(options)
					this.toggleBankMask()
					if(res.code==200){
						console.log(res.data)
						let data = res.data;
						let branchInfo = []
						for(let item in data){
							let object = {
								code:item,
								name:data[item],
							}
							branchInfo.push(object)
						}
						this.branchInfo = branchInfo;
						this.brankTip = '请选择支行';
					}else{
						this.$api.msg(res.message)
					}
				}
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
			//显示选择团长面板
			toggleBankMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.bankMaskState = 2;
				setTimeout(() => {
					this.bankMaskState = state;
				}, timer)
			},
			startSoterAuthenticationFaceID() {
				uni.startSoterAuthentication({
					requestAuthModes: ['facial'],
					challenge: '123456',
					authContent: '请用FaceID解锁',
					success(res) {
						console.log(res);
					},
					fail(err) {
						console.log(err);
					},
					complete(res) {
						console.log(res);
					}
				})
			},
			chooseImg1(){
				// const ctx = uni.createCameraContext();
				// ctx.takePhoto({
				// 	quality: 'high',
				// 	success: (res) => {
				// 		console.log(res.tempImagePath)
				// 	}
				// });
				let that = this;
				uni.chooseImage({
					sourceType:['camera','album'],
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(chooseImageRes)
						uni.showLoading({
							title: '上传中'
						})
						console.log(tempFilePaths[0])
						let time = new Date().getTime();
						uni.uploadFile({
							url: that.Qiniu.host,
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
							    "token": that.Qiniu.token,//后端返回的token
								"host": that.Qiniu.host,
								"cdnUrl":that.Qiniu.cdnUrl,
								"key":'xcx'+time+'.jpg'
							},
							header: {
							        "Content-Type": "multipart/form-data"
							},
							success: (uploadFileRes) => {
								uni.hideLoading()
								console.log(uploadFileRes.data);
								that.tempImg1 = that.Qiniu.cdnUrl + '/' + JSON.parse(uploadFileRes.data).key
							},
							file:(e)=>{
								uni.hideLoading();
								this.$api.msg('图片上传失败')
							}
						});
				    }
				});
			},
			chooseImg2(){
				let that = this;
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(chooseImageRes)
						uni.showLoading({
							title: '上传中'
						})
						let time = new Date().getTime();
						uni.uploadFile({
							url: that.Qiniu.host,
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
							    "token": that.Qiniu.token,//后端返回的token
								"host": that.Qiniu.host,
								"cdnUrl":that.Qiniu.cdnUrl,
								"key":'xcx'+time+'.jpg'
							},
							header: {
							        "Content-Type": "multipart/form-data"
							},
							success: (uploadFileRes) => {
								uni.hideLoading()
								console.log(uploadFileRes.data);
								that.tempImg2 = that.Qiniu.cdnUrl + '/' + JSON.parse(uploadFileRes.data).key
							},
							file:(e)=>{
								uni.hideLoading();
								this.$api.msg('图片上传失败')
							}
						});
				    }
				});
			},
			chooseImg3(){
				let that = this;
				uni.chooseImage({
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
						console.log(chooseImageRes)
						uni.showLoading({
							title: '上传中'
						})
						let time = new Date().getTime();
						uni.uploadFile({
							url: that.Qiniu.host,
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
							    "token": that.Qiniu.token,//后端返回的token
								"host": that.Qiniu.host,
								"cdnUrl":that.Qiniu.cdnUrl,
								"key":'xcx'+time+'.jpg'
							},
							header: {
							        "Content-Type": "multipart/form-data"
							},
							success: (uploadFileRes) => {
								uni.hideLoading()
								console.log(uploadFileRes.data);
								that.tempImg3 = that.Qiniu.cdnUrl + '/' + JSON.parse(uploadFileRes.data).key
							},
							file:(e)=>{
								uni.hideLoading();
								this.$api.msg('图片上传失败')
							}
						});
				    }
				});
			},
			async getQiniu(){
				let Qiniu = await this.$http.getQiniu()
				if(Qiniu.code==200){
					this.Qiniu = Qiniu.data
				}else{
					this.$api.msg(Qiniu.message)
				}
			},
			nav(url){
				uni.navigateTo({
					url:url
				})
			},
			//提交
			async confirm() {
				if (!this.bankCardNum) {
					this.$api.msg('请输入银行卡号');
					return;
				}
				if (!this.accountName) {
					this.$api.msg('请输入银行卡持有人姓名');
					return;
				}
				if (!this.phone) {
					this.$api.msg('请输入银行卡持有人手机号');
					return;
				}
				// if (!this.address) {
				// 	this.$api.msg('请输入银行卡持有人详细地址');
				// 	return;
				// }
				if (!this.legalIdCard) {
					this.$api.msg('请输入银行卡持有人身份证号');
					return;
				}
				if (!this.bankInfo) {
					this.$api.msg('请输入所属银行');
					return;
				}
				if (this.checkAreaIndex[0]==0) {
					this.$api.msg('请输入银行开户地址');
					return;
				}
				if(!this.tempImg1){
					this.$api.msg('请上传身份证正面');
					return;
				}
				if(!this.tempImg2){
					this.$api.msg('请上传身份证反面');
					return;
				}
				if(!this.tempImg3){
					this.$api.msg('请上传本人手持身份证的照片');
					return;
				}
				//防止重复提交
				if(!this.sumbitFlag) {
					this.sumbitFlag = true;
					let data = {
						legalName: this.accountName,
						merLegalPhone:this.phone,
						legalIdCard:this.legalIdCard,
						cardNo: this.bankCardNum,
						headBankCode: this.bankInfo.bankCode,
						bankProvince: this.areaList[this.checkAreaIndex[0]].id,
						bankCity:this.areaList[this.checkAreaIndex[0]].children[this.checkAreaIndex[1]].id,
						bankCode:this.branchInfo[this.checkBranchIndex].code,
						idcardFront:this.tempImg1,
						idcardBack:this.tempImg2,
						handIdcard:this.tempImg3
					};
					// let data = {
					// 	legalName: this.accountName,
					// 	merLegalPhone:this.phone,
					// 	legalIdCard:this.legalIdCard,
					// 	cardNo: this.bankCardNum,
					// 	headBankCode: this.bankInfo.bankCode,
					// 	bankProvince: this.areaList[this.checkAreaIndex[0]].id,
					// 	bankCity:this.areaList[this.checkAreaIndex[0]].children[this.checkAreaIndex[1]].id,
					// 	bankCode:this.branchInfo[this.checkBranchIndex].code,
					// 	idcardFront:'http://dssc.qn.cnyiliaosc.com/1595763761865.jpg',
					// 	idcardBack:'http://dssc.qn.cnyiliaosc.com/1595763855607.jpg',
					// 	handIdcard:'http://dssc.qn.cnyiliaosc.com/1595764119141.jpg'
					// };
					console.log(data)
					uni.showLoading({
						title:'提交中'
					})
					let result = await this.$http.merchantAdd(data);
					uni.hideLoading()
					if (result.code === 200&&result.data=='提交成功') {
						this.$api.msg('添加成功,审核成功后即可查看银行卡');
						setTimeout(()=>{
							uni.navigateBack({})
						},500)
					} else {
						this.sumbitFlag = false;
						this.$api.msg(result.message);
					}
					
				}
			},
			//修改是否为默认
			switchChange(){
				if(this.defaultStatus=='Yes')
					this.defaultStatus='No';
				else
					this.defaultStatus='Yes';
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
			async sureRegion(){
				this.checkAreaIndex=this.tempCheckAreaIndex;
				if(this.bankInfo){
					//查询支行编码
					let options = {
						bankCityNo:this.areaList[this.checkAreaIndex[0]].children[this.checkAreaIndex[1]].id,
						bankProvinceNo:this.areaList[this.checkAreaIndex[0]].id,
						headBankNo:this.bankInfo.bankCode
					}
					let res = await this.$http.getBankBranch(options)
					if(res.code==200){
						console.log(res.data)
						let data = res.data;
						let branchInfo = [];
						for(let item in data){
							let object = {
								code:item,
								name:data[item],
							}
							branchInfo.push(object)
						}
						this.branchInfo = branchInfo;
						this.brankTip = '请选择支行';
					}else{
						this.$api.msg(res.message)
					}
				}
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
			//显示支行选择框
			showMode2(){
				if(!this.branchInfo){
					this.$api.msg('请先选择所属银行与开发地址')
					return
				}
				let that=this;
				let areaIndex = this.checkBranchIndex;
				// 显示遮罩层
				let animation = uni.createAnimation({
				  duration: 100,
				  timingFunction: "linear",
				  delay: 0
				})
				this.animation = animation;
				animation.translateY(500).step();
				this.animation=animation.export();
				this.showBranchModel=true;
				this.tempCheckBranchIndex=areaIndex;
				
				setTimeout(function () {
				  animation.translateY(0).step();
				  that.animation=animation.export();
				}.bind(this), 100)
			},
			//选择支行
			branchChang(e){
				console.log(1,e)
				this.tempCheckBranchIndex = e.detail.value
			},
			//隐藏地址选择模态框
			hideModal2(){
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
				  this.showBranchModel= false
				}.bind(this), 200)
			},
			
			//确认当前选择
			sureRegion2(){
				this.checkBranchIndex=this.tempCheckBranchIndex;
				console.log(this.branchInfo[this.checkBranchIndex],this.checkBranchIndex)
				this.hideModal2();
			},
		}
	};
</script>

<style lang="scss">
	page {
		background: $page-color-base;
	}

	.b-b {
		color: red;
	}
	.legalIdCard{
		padding: 30upx 24upx 10upx;
		background-color: #fff;
		.mid{
			margin-top: 28upx;
			display: flex;
			justify-content: space-between;
			.mid-img{
				width: 218upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.mid-btn{
					font-size: 28upx;
					color: #fff;
					text-align: center;
					line-height: 60upx;
					margin-top: 24upx;
					width: 160upx;
					height: 60upx;
					border-radius: 60upx;
					background-color: rgb(29,199,172);
					box-shadow: 0 8upx 16upx 0 rgba(29,199,172, 0.1), 0 8upx 16upx 0 rgba(29,199,172, 0.1);
				}
			}
		}
		.bottom{
			line-height: 1.6;
			margin-top: 35upx;
			font-size: 24upx;
			color: rgb(170,170,170);
		}
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
			font-size: 30upx;
			color: $font-color-dark;
			width: 35%;
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
	.btn-code{
		font-size: 28upx;
		width: 150upx;
		height: 60upx;
		line-height: 60upx;
		border-radius: 60upx;
		text-align: center;
		background-color: #1DC7AC;
		color: #fff;
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
	/* 选择团长面板 */
	.bank-mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;
	
		.mask-content {
			width: 100%;
			min-height: 500upx;
			max-height: 900upx;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			// overflow-y: scroll;
		}
	
		&.none {
			display: none;
		}
	
		&.show {
			background: rgba(0, 0, 0, .4);
	
			.mask-content {
				transform: translateY(0);
			}
		}
	}
	.serchInput {
		padding: 10rpx 20rpx 10rpx 80rpx;
		background-color: #EEEFF0;
		border-radius: 15px;
		border: none;
		width: 85%;
		margin-left: 2%;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		margin-top: 12upx;
	}
	.status_bar {
		width: 100%;
		height: 8vh;
		background: white;
		position: relative;
		.contact::after{
			border: none;
		}
	}
	.status_bar::before {
		display: table;
		content: "";
	}
	.bank-item{
		width: 100%;
		background-color: #fff;
		height: 100upx;
		line-height: 60upx;
		padding: 20upx 30upx;
		margin-top: 5upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.bank-left{
			height: 100upx;
			line-height: 100upx;
		}
		.bank-right{
			width: 150upx;
			height: 60upx;
			border-radius: 60upx;
			font-size: 28upx;
			text-align: center;
			line-height: 60upx;
			background-color: #1DC7AC;
			color: #fff;
		}
	}
</style>
