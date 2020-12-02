<template>
	<view>
		<!-- 地址 -->
		
		<view class="yt-list">
			<view class="yt-list-cell b-b" @click="toSeletAddress()">
				<view v-if="defaultAddress!=null">
					<view class="leftView">
						<text class="leftText userFont">{{defaultAddress.name}}</text>
						<text class="userFont">{{defaultAddress.phoneNumber}}</text>
					</view>
					<view class="leftView">
						<text class="leftText textAddress addressFont">地址</text>
						<text class="addressRight addressFont">{{addressDetil}}</text>
					</view>
				</view>
				<view v-else style="margin: 22upx 0 22upx 10upx;">
					<text style="font-size: 14px;">请选择收货地址</text>
				</view>
				<view class="rightViewImg" >
					<image class="rightImage" src="../../static/into.png" mode=""></image>
				</view>
			</view>
			
		</view>
		<view class="top-section" v-if="!isGiving">
			

			<!-- <view class="address-section" style="margin:0 30upx">
				<view class="text-dark" v-if="currentTab == 1">
					<text>请填写您的地址：</text>
				</view>
				<view class="text-info" v-if="currentTab == 1">
					<text class="t-text">详细地址：</text>
					<input class="c-text" type="string" v-model="detail" placeholder="小区、楼号、门牌号" placeholder-style="color: #cfcfd1;">
				</view>
				<view class="text-info">
					<text class="t-text">收货人：</text>
					<input class="c-text" type="string" v-model="name" placeholder="请填写收货人名字" placeholder-style="color: #cfcfd1;">
				</view>
				<view class="text-info">
					<text class="t-text">手机号：</text>
					<input class="c-text" type="number" v-model="phone" placeholder="输入手机号码" placeholder-style="color: #cfcfd1;">
				</view>
			</view> -->
		</view>
		
		<view class="goods-section">
			<!-- 商品列表 -->
			<view class="g-item" v-for="(item, index) in goodsData" :key="item.id">
				<image :src="item.productPic"></image>
				<view class="right">
					<text class="title clamp fontB" style="margin-top: 15upx;">{{item.productName}}</text>
					<view class="price-box">
						<view class="flex-between mtrpx10">
							<text class="price fontB" style="color: #000;font-size: 30upx;">￥{{item.flashPromotionPrice||item.price}}<text style="color: #999;font-size: 24upx;text-decoration: line-through;" v-if="item.flashPromotionPrice">￥{{item.price}}</text></text>
							<!-- <text v-if="memberInfo.vip==1" class="price fontB font14" style="color: #000;">￥{{item.vipPrice}}</text> -->
							
						</view>
						<text class="number" style="font-size: 32upx;">x {{item.quantity||item.count}}</text>
					</view>
					<view class="spec" style="margin-top: 12upx;">{{item.sp1?item.sp1:''}} {{item.sp2?item.sp2:''}} {{item.sp3?item.sp3:''}}</view>
				</view>
			</view>
			<view class="g-item" v-for="(item, index) in giftsData" :key="item.id">
				<image :src="item.productPic"></image>
				<view class="right">
					<text class="title clamp mt10 fontB">{{item.productName}}</text>
					<view class="price-box">
						<view class="price-left mtrpx10">
							<view class="gift">
								赠品
							</view>
							<text class="price fontB font14" style="color: #000;">￥{{item.productPrice}}</text>
						</view>
						<text class="number font14">x {{item.quantity||item.count}}</text>
					</view>
					<text class="spec">{{item.sp1?item.sp1:''}} {{item.sp2?item.sp2:''}} {{item.sp3?item.sp3:''}}</text>
				</view>
			</view>
		</view>

		<!-- 优惠明细 -->

		<view class="yt-list">
			<!-- <view class="yt-list-cell b-b" @click="toggleMask('show')" v-if="type!=3">
				<view class="cell-icon">
					券
				</view>
				<text class="cell-tit clamp fontB">优惠券</text>
				<text class="cell-tip active">
					{{useCouponName}}
				</text>
				<text class="cell-more wanjia wanjia-gengduo-d"></text>
			</view> -->
			<!-- <view class="yt-list-cell b-b" v-if="type!=3">
				<view class="cell-icon hb">
					积
				</view>
				<text class="cell-tit clamp fontB">积分抵扣(可用积分{{memberInfo.integral||0}})</text>
				<view class="yticon icon-xuanzhong2 ml10 integral" :class="{checked: isIntegral}" @click="useIntegral"></view>
			</view> -->
			<!-- <view class="yt-list-cell b-b">
				<view class="cell-icon hb">
					减
				</view>
				<text class="cell-tit clamp">商家促销</text>
				<text class="cell-tip disabled">暂无可用优惠</text>
			</view> -->
		</view>
		
		<!-- <view class="yt-list">
			<view class="yt-list-cell b-b">
				<view style="margin-top: 20upx;margin-bottom: 20upx;">
					<text class="cell-tit fontB" v-if="currentTab == 0">配送方式：</text>
				</view>
				<view class="rightViewImg" >
					<picker @change="bindPickerChange" :value="index" :range="array" range-key="label">
					    <view class="cell-tip fontB">{{array[index].label}}</view>
					</picker>
					<image class="rightImage" src="../../static/into.png" mode=""></image>
				</view>
			</view>
		</view> -->
		<picker></picker>

		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp fontB">商品金额</text>
				<text class="cell-tip fontB">￥{{total || ""}}</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp fontB">是否赠送订单</text>
				<text class="cell-tip fontB">{{isGiving == 1? '是':'否'}}</text>
			</view> -->
		<!-- 	<view class="yt-list-cell b-b" v-if="type!=3">
				<text class="cell-tit clamp fontB">优惠券</text>
				<text class="cell-tip fontB" style="color:#999">-￥{{discountAmount}}</text>
			</view> -->
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp fontB">积分抵扣</text>
				<text class="cell-tip fontB" style="color:#999">-￥{{integral}}</text>
			</view> -->
			<!-- <view v-if="memberInfo.balance>0" class="yt-list-cell b-b integration">
				<text class="cell-tit clamp">余额抵扣</text>
				<switch :checked="integration>0" style="transform: scale(0.7,0.7); transform: ;"  color="#fa436a" @change="switchChange" />
			</view> -->
			<!-- <view class="yt-list-cell b-b" @click="checkReceiving()">
				<text class="cell-tit clamp fontB">收货方式</text>
				<view class="cell-right">
					<text class="cell-value fontB">{{deliveryType==1?'快递':deliveryType==0?'自提':''}}</text>
				</view>
			</view> -->
			<view v-if="deliveryType==1" class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">{{freight? "¥"+freight : "免邮费"}}</text>
			</view>
			
			<view v-if="memberInfo.vip==1 && vipPrice" class="yt-list-cell b-b">
				<text class="cell-tit clamp">会员优惠</text>
				<text class="cell-tip"> - ¥{{vipPrice}}</text>
			</view>

		</view>
		<view class="yt-list-cell desc-cell mtrpx10 bgcolor10" style="display: block;">
			<view class="cell-tit clamp fontB">备注</view>
			<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
			<!-- <textarea v-if="!maskState" value="" placeholder="请填写备注信息（10-400字)" class="font10" v-model="desc" maxlength="400" /> -->
			</view>
		<!-- <view class="fwtk">
			<checkbox-group class="check" @change="agreedAgreement"><checkbox style="transform: scale(0.5,0.5);"/></checkbox-group>
			<text @click="toAgreement" class="prompt">同意本《购物协议》,请认真阅读此协议</text>
		</view> -->

		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text class="fontB">实付款:</text>
				<text class="fontB ml10">￥</text>
				<text v-if="memberInfo.vip==1" class="fontB font14">{{(actualPayment-integral-integration-discountAmount+freight-vipPrice).toFixed(2)>0?(actualPayment-integral-integration-discountAmount+freight-vipPrice).toFixed(2):0}}</text>
				<text v-else class="fontB font14">{{(actualPayment-integral-integration-discountAmount+freight).toFixed(2)>0?(actualPayment-integral-integration-discountAmount+freight).toFixed(2):0}}</text>
			</view>
			<text class="submit" @click="submit">{{type==3?'打开礼包':'提交订单'}}</text>
		</view>
		<!-- 选择团长面板 -->
		<view class="leader-mask" :class="leaderMaskState===0 ? 'none' : leaderMaskState===1 ? 'show' : ''" @click="toggleLeaderMask" @touchmove.stop.prevent="stopPrevent">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<view class="selectPos">
					<view class="title">
						当前位置
					</view>
					<view class="info" @click="getLocation()">
						<view class="left ui-nowrap">
							{{addressName}}
						</view>
						<view class="right">
							修改<text class="cell-more yticon icon-you"></text>
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" style="max-height: 760upx;min-height: 360upx;" v-if='leaderList.length!=0'>
					<view class="leader-list">
						<view class="leader-item" v-for="(item,index) in leaderList" @click="setLeader(item)">
							<view class="leader-image">
								<image :src="item.icon" mode=""></image>
							</view>
							<view class="leader-info">
								<view class="top">
									<view class="leader-name ui-nowrap">
										{{item.storeName}}
									</view>
									<view class="leader-dis">
										距您{{item.distance}}KM
									</view>
								</view>
								<view class="position">
									{{item.region}}
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<view v-if='leaderList.length==0' class="textcenter mtrpx100">
					<view class="font10 fontcolor16">附近没有团长~</view>
				</view>
			</view>
		</view>
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask" @touchmove.stop.prevent="stopPrevent">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index" @click="useCoupon(item)">
					<view style="display: flex;background: #fff;border-radius: 12upx;">
						<view class="con">
							<view class="top">
								<view class="title">
									<text class="tag">{{item.coupon.useType==0?'全场通用':(item.coupon.useType==0?'指定分类':'指定商品')}}</text>
									<text style="margin-left: 15upx;">{{item.coupon.name}}</text>
								</view>
								<text class="time">{{/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.coupon.startTime)+'~'+/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.coupon.endTime)}}</text>
							</view>
							<view class="bottom">
								<text class="tips">详细信息</text>
								<image style="width: 40upx;height: 40upx;" :src="item.showDetail==true?'../../static/up.png':'../../static/down.png'" mode="" @click.stop.prevent="stopPrevent" @click="showDetail(item)"></image>
							</view>
							
							<view class="circle t"></view>
							<view class="circle r"></view>
						</view>
						<view class="right enable">
							<text class="price">{{item.coupon.amount}}</text>
							<text style="color: #fff;">满{{item.coupon.minPoint}}元可用</text>
						</view>
					</view>
					<view class="detail" v-if="item.showDetail==true">
						{{item.coupon.note||'暂无'}}
					</view>
				</view>
				<view v-if='couponList.length==0' class="textcenter mtrpx100">
					<view class="font10 fontcolor16">当前订单没有可以使用的优惠券了哦~</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import amap from '../../common/amap-wx.js';
	export default {
		data() {
			return {
				type: 2,
				skuId: 0, //直接下单用
				defaultAddress:null,
				quantity: 0, //直接下单购买数据
				goodsData: [],
				total: 0, //商品金额
				discountAmount: 0, //优惠金额
				actualPayment: 0, //实付金额
				maskState: 0, //优惠券面板显示状态
				leaderMaskState: 0, //选择团长面板显示状态
				desc: '', //备注
				name:'',
				phone:'',
				detail:'',
				payType: 1, //1微信 2支付宝
				sumbitFlag: false, //提交标志，防止重复提交
				couponList:[],
				//收货地址
				addressData: '',
				deliveryType:1,//0:自提，1：物流
				integration:0,//余额抵扣金额
				integral:0,//积分抵扣金额
				isIntegral:false,
				//isAgreed:false//是否同意协议
				isGiving:0,//0为自己买1为好友买
				useCouponId:0 ,//优惠券使用
				useCouponName:'选择优惠券' ,//优惠券使用
				orderId:'',//再次激活订单时使用订单id
				currentTab:0,
				defaultLeader:'',
				leaderList:[],
				amapPlugin: null,  
				key: 'd52befc87beb8ce929d2eaa887e488ad',
				addressName: '',
				memberInfo:'',
				giftId:'',
				mealId:'',
				array: [],
				index: 0,
				addressDetil:'',
				storeId:0,
				freight:0,
				vipPrice:0
			}
		},
		computed: {
			...mapState([])
		},
		async onShow(){
			if(this.$store.state.address){
				this.defaultAddress = this.$store.state.address;
				this.addressDetil = this.defaultAddress.city+this.defaultAddress.province+this.defaultAddress.region+this.defaultAddress.detailAddress;
			}else{
				let resdefault = await this.$http.getDefaultReceivingAddress();
				if(resdefault && resdefault.data && resdefault.data!=""){
					this.defaultAddress = resdefault.data;
					this.addressDetil = this.defaultAddress.city+this.defaultAddress.province+this.defaultAddress.region+this.defaultAddress.detailAddress;	
				}
			}
			
			//console.log(this.defaultLeader)
		},
		async onLoad(option) {
			try{
				// let address = uni.getStorageSync('address');
				// if(address!=''){
				// 	let data = JSON.parse(address)
				// 	this.name = data.name;
				// 	this.phone = data.phone;
				// 	this.detail = data.detail||'';
				// }
				//let res = await this.$http.getExpressOptions();
				// console.log('res',res)
				// if(res && res.data && res.data.length>0){
				// 	this.array = res.data;
				// }
				let resdefault = await this.$http.getDefaultReceivingAddress();
				//console.log('resdefault',resdefault)
				if(resdefault && resdefault.data && resdefault.data!=""){
					this.defaultAddress = resdefault.data;
					this.addressDetil = this.defaultAddress.city+this.defaultAddress.province+this.defaultAddress.region+this.defaultAddress.detailAddress;
				}
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data
				this.type = option.type;
				this.isGiving = option.isGiving;
				if(option.giftId){
					this.giftId = option.giftId;
					this.mealId = option.mealId;
				}
			}catch(e){
				this.type = option.type;
				this.$api.msg(e)
			}
			//直接下单
			if (option.type == 1) {
				let data = JSON.parse(option.data);
				let skuId = data.skuId;
				this.skuId = skuId;
				this.quantity = data.quantity;
				for(let i = 0;i<data.goodsData.length;i++){
					let goodInfo = await this.$http.goodInfo({id:data.goodsData[i].id});
					data.goodsData[i].productPic = goodInfo.data.pic
				}
				this.goodsData = data.goodsData;
				this.calcTotal();
				//实付金额
				this.actualPayment = this.total;
				let form = [
					{
						count:this.quantity,
						skuId:this.skuId
					}
				]
				// let list = await this.$http.couponOrderList(form)
				// let couponList = list.data;
				// couponList.forEach(item=>{
				// 	item.showDetail = false;
				// })
				// this.couponList = couponList
			} else if(option.type == 2) {
				//购物车商品数据
				let data = JSON.parse(option.data);
				this.goodsData = data['goodsData'];
				
				for(let goodInfo of this.goodsData){
					// let goodInfo = await this.$http.goodInfo({id:data.goodsData[i].productId});
					// data.goodsData[i].productPic = goodInfo.data.pic
					// data.goodsData[i].productName = goodInfo.data.name;
					// let item = {
					// 	count:data.goodsData[i].quantity,
					// 	skuId:data.goodsData[i].productSkuId
					// }
					// form.push(item);
					this.storeId = goodInfo.storeId;
				}
				
				this.calcTotal();
				//实付金额
				this.actualPayment = this.total;
				// let list = await this.$http.couponOrderList(form)
				// let couponList = list.data;
				// couponList.forEach(item=>{
				// 	item.showDetail = false;
				// })
				// this.couponList = couponList
			} else if(option.type == 3) {
				//礼包套餐
				let data = JSON.parse(option.data);
				this.quantity = data.quantity;
				this.goodsData = data.goodsData;
				this.calcTotal();
				//实付金额
				this.actualPayment = this.total;
			} else{
				this.$api.msg("参数错误!");
				uni.navigateBack({});
			}
			// this.$http.defaultLeader().then(res=>{
			// 	if(res.code==200){
			// 		if(!res.data){
			// 			return;
			// 		}
			// 		this.defaultLeader = res.data
			// 	}else {
			// 		this.$api.msg(res.message)
			// 	}
			// })
			// this.loadLeaderList();
			// let res = await this.$http.getGive({totalPrice:this.total});
			// if(res.code==200){
			// 	console.log(res);
			// 	this.giftsData = res.data
			// }
		},
		onBackPress(res) {
			setTimeout(function(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			},50)
		},
		methods: {
			loadLeaderList(){
				let that = this;
				this.amapPlugin = new amap.AMapWX({  
					key: this.key  
				});
				this.amapPlugin.getRegeo({
					success: (data) => {  
						this.addressName = data[0].name;
						that.$http.queryLeaderList({lat:data[0].latitude,lon:data[0].longitude,pageSize:10,pageNum:1}).then(res=>{
							that.leaderList = res.data.sotres
							// console.log(res)
							that.leaderList.forEach(e=>{
								e.distance = parseFloat(e.distance)/1000
							})
						})  
						// uni.hideLoading();  
					},
					fail: (data)=>{
						console.log(data)
						uni.hideLoading(); 
					}
				});
			},
			useIntegral(){
				if(this.isIntegral){
					this.isIntegral = false;
					this.integral = 0;
				}else{
					this.isIntegral = true;
					this.integral = this.memberInfo.balance;
					if(this.integral>this.actualPayment*0.2){
						this.integral = this.actualPayment*0.2
					}
				}
			},
			showDetail(item){
				item.showDetail = !item.showDetail
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
			tabTap(index){
				this.currentTab = index
			},
			toCheckLeader() {
				uni.navigateTo({
					url:"/pages/leader/checkLeader"
				})
			},
			//使用优惠券抵扣
			useCoupon(item){
				this.discountAmount = item.coupon.amount
				this.useCouponName = item.coupon.name
				this.useCouponId  = item.id
				this.toggleMask()
			},
			//显示优惠券面板
			toggleMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			//显示选择团长面板
			toggleLeaderMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.leaderMaskState = 2;
				setTimeout(() => {
					this.leaderMaskState = state;
				}, timer)
			},
			//余额抵扣
			// async switchChange(){
			// 	let memberInfo=await this.$api.getMemberInfo();
			// 	if(memberInfo.code!=200){
			// 		this.$api.msg(memberInfo.message);
			// 		return;
			// 	}
			// 	memberInfo=memberInfo.data;
			// 	if(memberInfo.balance<1){
			// 		this.$api.msg("当前无余额可抵付!");
			// 		this.$set(this.integration,0);
			// 		return;
			// 	}
			// 	//开启余额抵付
			// 	if(this.integration==0)
			// 		if(memberInfo.balance>=this.actualPayment) this.integration=this.actualPayment;
			// 		else this.integration=memberInfo.balance;
			// 	else this.integration=0;
			// 	if(this.integration>0)
			// 		this.$api.msg("已抵付"+this.integration);
			// },
			//选择收货方式
			checkReceiving(){
				// let that=this;
				// uni.showActionSheet({
				// 	itemList:['自提','物流'],
				// 	success(res) {
				// 		that.deliveryType=res.tapIndex ;
				// 	}
				// })
			},
			//计算商品总价
			calcTotal() {
				let list = this.goodsData;
				if (list.length === 0) {
					this.empty = true;
					return;
				}
				let total = 0;
				let vipTotal = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						//total += item.price * item.number;
						//默认设置1
						let price = item.flashPromotionPrice||item.price;
						total += price * item.quantity;
						//会员价
						let vipPrice = item.vipPrice || price;
						
						vipTotal += vipPrice * item.quantity;
						//运费
						this.freight = (this.freight>=(item.expressPrice || 0)?this.freight:item.expressPrice)*1;
					} else if (checked === true) {
						checked = false;
					}
				})
				this.total = Number(total.toFixed(2));
				this.vipPrice = Number((total-vipTotal).toFixed(2));
				this.vipPrice = this.vipPrice>0?this.vipPrice:0;
			},
			//获取用户默认地址
			async getDefaulteceivingAddress() {
					let result = await this.$http.getDefaulteceivingAddress();
					if (result.code == 200) {
						if (result.data) {
							this.addressData = result.data;
						}
					}
			},
			//提交订单
			async submit() {
				if(!this.defaultAddress || this.defaultAddress==""){
					this.$api.msg('请选择收货地址!');
					return false;
				}
				
				let options = {}
				options = {
				  deliveryType: 1,
				  detail:this.addressDetil,
				  memberReceiveAddressId:this.defaultAddress.id,
				  name:this.defaultAddress.name,
				  phone:this.defaultAddress.phoneNumber,
				  expressPrice:this.freight
				};
				
				if(this.useCouponId!=0){
					options.couponId = this.useCouponId
				}
				if(this.desc!=''){
					options.note =this.desc
				}
				
				let result = {};
				//添加防止重复提交代码
				if(!this.sumbitFlag) {
					this.sumbitFlag = true;
					
					try{
						if (this.type == 2) {
							uni.showLoading({
								title: "提交中"
							})
							let ids = [];
							for(let item of this.goodsData){
								ids.push(item.id)
							}
							options.ids = ids;
							options.storeId = this.storeId;
							// console.log('optons',options)
							result = await this.$http.generateOrder(options);
							uni.hideLoading();
						} else if(this.type==1) {
							options.skuId=this.skuId;
							options.quantity=this.quantity;
							uni.showLoading({
								title: "提交中"
							})
							
							result = await this.$http.orderCreateOrder(options);
							uni.hideLoading();
						}
						else{
							uni.showLoading({
								title: "提交中"
							})
							options.giftId = parseInt(this.giftId);
							options.giftProductId = parseInt(this.mealId);
							result = await this.$http.openGift(options);
							uni.hideLoading();
						}
					}catch(e){
						//TODO handle the exception
						this.sumbitFlag = false
					}
				}
				
				if (result.code == 200) {
					// uni.redirectTo({
					// 	url:`/pages/order/orderInfo?orderId=${result.data.orderId}`
					// })
					this.pay(result.data);
				} else {
					this.$api.msg(result.message);
					this.sumbitFlag = false
				}
				this.$api.getMemberInfo();
			},
			getLocation(){
				let that = this
				uni.chooseLocation({
				    success: function (res) {
				        console.log('位置名称：' + res.name);
				        console.log('详细地址：' + res.address);
				        console.log('纬度：' + res.latitude);
				        console.log('经度：' + res.longitude);
						that.addressName = res.name;
						that.$http.queryLeaderList({lat:res.latitude,lon:res.longitude,pageSize:10,pageNum:1}).then(data=>{
							that.leaderList = data.data.sotres
							that.leaderList.forEach(e=>{
								e.distance = parseFloat(e.distance)/1000
							})
						})
				    }
				});
			},
			async setLeader(item){
				// console.log(item)
				this.defaultLeader = item;
				this.toggleLeaderMask()
			},
			toSeletAddress(){
				uni.navigateTo({
					url:"/pages/order/orderRe/selectAddress/selectAddress",
				})
				 
			},
			
			bindPickerChange: function(e) {
				this.index = e.target.value
			},
			//支付订单
			async pay(data) {
				uni.redirectTo({
					url: `/pages/money/pay?money=${data.totalAmount}&orderId=${data.orderId}`
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 120upx;
	}
	.addressLeft{
		color: #FFFFFF;
	}
	.leftView {
		margin-right: 100upx;
	}
	.top-section {
		border-radius: 20upx;
		margin: 20upx;
		background-color: #fff;
	}
	.freight {
		font-size: 24upx;
		color: #999999;
		margin-top: 5upx;
	}
	.tab-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		height: 80upx;
		text-align: center;
		font-size: $font-base;
		.tab-item {
			flex: 1;
			height: 100%;
			line-height: 80upx;
			color: rgba(136, 190, 70, 0.5);
			background-color: #F2F2F2;
		}
		.active {
			color: rgba(136, 190, 70, 1);
			background-color: #fff;
		}
	}
	.rightViewImg{
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		right: 15upx;
	}
	.rightImage{
		margin-right: 20upx;
		margin-left: 20upx;
		width: 26upx;
		height: 42upx;
	}
	.leftText{
		margin-right: 10upx;
	}
	.textAddress{
		background-color: #00bcb3;
		color: #FFFFFF;
	}
	.userFont{
		font-size: 26upx;
	}
	.addressRight{
		color: #999999;
	}
	.addressFont{
		font-size: 32upx;
	}
	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: #000;
		}

		.selectAddress{
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
		.line {
			height: 1px;
			border-top: 1px solid #ddd;
			text-align: center;
			margin: 40upx 0;
		}
		.text-dark {
			height: 60upx;
			line-height: 60upx;
			display: flex;
			color: $font-color-light;
			margin: 10upx 0;
			.leader{
				padding: 20upx;
				background-color: $base-color2;
				border-radius: 60upx;
				flex: 1;
				height: 60upx;
				display: flex;
				justify-content: right;
				align-items: center;
				font-size: $font-base;
				color: #fff;
				image{
					margin-right: 20upx;
					width: 50upx;
					height: 50upx;
				}
			}
		}
		
		.text-lg {
			font-size: 35upx;
			color: #000;
			font-weight: 600;
			margin: 10upx 0;
		}
		.text-info {
			display: flex;
			margin: 20upx 0;
			color: #000;
			.t-text {
				flex: 3;
			}
			.c-text {
				flex: 7;
			}
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding: 20px 0;

		.g-item {
			display: flex;
			margin: 20upx 50upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 180upx;
				height: 180upx;
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
				// margin-left: 30px;
			}

			.price-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 32upx;
				color: #000000;
				padding-top: 10upx;
				.price-left{
					display: flex;
					align-items: center;
				}
				.gift{
					width: 54upx;
					height: 30upx;
					font-size: 20upx;
					border-radius: 6upx;
					margin-right: 10upx;
					text-align: center;
					color: #fff;
					background: linear-gradient(to right, rgb(242,142,38), rgb(253,100,79));
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

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}
	.integral{
		color: #C0C4CC;
	}
	.integral.checked{
		color: #1DC7AC;
	}
	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-dark;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}

			&.red {
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}


	}

	.integration switch{
		padding: 0;
		margin: 0;
	}

	.cell-right{
		font-size:24upx;
		color: $font-color-dark;
		display:flex;
		align-items:center;
		justify-content: flex-end;
		.headpic{
			width: 70upx;
			height: 70upx;
		}
		.cell-more{
			align-self: baseline;
			font-size: $font-base;
			margin-left:10upx;
			.cell-moreImg{
				width:12upx;
				height:22upx;
			}
		}
	}

	/* 支付列表 */
	.pay-list {
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;

		.pay-item {
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;
			position: relative;
		}

		.icon-weixinzhifu {
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}

		.icon-alipay {
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}

		.icon-xuanzhong2 {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}

		.tit {
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 120upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		// box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content {
			padding-left: 30upx;
		}

		.price-tip {
			color: $base-color;
			margin-left: 8upx;
		}

		.price {
			font-size: 36upx;
			color: $base-color;
		}

		.submit {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 220upx;
			height: 70%;
			color: #fff;
			font-size: 32upx;
			background-color: #EBA542;
			margin-right: 30rpx;
			border-radius: 10rpx;
		}
	}

	/* 优惠券面板 */
	.mask {
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
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y: scroll;
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
	.fwtk{
		height: 80upx;
		width: 100%;
		text-align: center;
		padding: 10upx;

		.prompt{
			font-size: 25upx;
			color: #fa436a;
			text-decoration: underline #fa436a;
		}

		.check{
			display: inline-block;
		}

	}

	/* 优惠券列表 */
	.coupon-item {
		margin: 20upx 24upx;
		.con {
			border-radius: 12upx;
			flex: 7;
			display: flex;
			// align-items: center;
			flex-direction: column;
			position: relative;
			height: 200upx;
			padding: 0 30upx;
	
			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-right: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
	
		.top {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.bottom{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 60upx;
		}
		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
			display: flex;
			align-items: center;
		}
		.tag{
			padding: 0 15upx;
			height: 28upx;
			line-height: 28upx;
			border-radius: 28upx;
			background-color: #EBA542;
			color: #fff;
			font-size: 22upx;
		}
		.time {
			font-size: 24upx;
			color: $font-color-light;
		}
	
		.right {
			border-radius: 0 12upx 12upx 0;
			flex: 3.5;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			height: 200upx;
			background-color: #EBA542;
			.getBtn{
				width: 150upx;
				height: 50upx;
				color: #EBA542;
				background-color: #fff;
				line-height: 50upx;
				text-align: center;
				border-radius: 50upx;
				margin-top: 20upx;
			}
		}
		.enable{
			background-color: #EBA542;
		}
		.dis-enable{
			background-color: #C0C4CC;
		}
		.price {
			font-size: 44upx;
			color: #fff;
			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips {
			font-size: 24upx;
			color: $font-color-light;
			// line-height: 60upx;
		}
		.detail{
			margin-top: 5upx;
			background: #fff;
			padding: 30upx;
			z-index: 11;
			border-radius: 12upx;
			font-size: 24upx;
		}
		.circle {
			position: absolute;
			left: auto;
			right: -8upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f5f5f5;
			border-radius: 100px;
	
			&.r {
				
			}
			&.t {
				bottom: 190upx;
			}
		}
	}
	/* 选择团长面板 */
	.leader-mask {
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
	.selectPos {
		margin: 20upx;
		font-size: 35upx;
		height: 100upx;
		.title {
			color: #b9b9b9;
		}
		.info {
			display: flex;
			height: 50upx;
			.left {
				flex: 8;
				color: #000;
				font-size: 40upx;
			}
			.right {
				flex: 2;
				height: 50upx;
				text-align: right;
			}
		}
	}
	.leader-list {
		.leader-item {
			background: #fff;
			border-radius: 20upx;
			margin: 20upx;
			display: flex;
			height: 140upx;
			.leader-image {
				flex: 3;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 110upx;
					height: 110upx;
					border-radius: 100%;
				}
			}
			.leader-info {
				flex: 8;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.top {
					display: flex;
					height: 70upx;
					line-height: 70upx;
					justify-content: space-between;
					.leader-name {
						flex: 4;
						font-size: 37upx;
						font-weight: 600;
					}
					.leader-dis {
						flex: 3;
						color: #A7D159;
						font-size: $font-base;
						text-align: right;
						margin-right: 20upx;
					}
					.leader-btn {
						flex: 3;
						view {
							width: 140upx;
							height: 70upx;
							font-size: $font-base;
							flex: 3;
							color: #fff;
							background-color: #A7D159;
							border-radius: 20upx;
							text-align: center;
						}
					}
				}
				.position {
					color: #B9B9B9;
					font-size: $font-base;
				}
			}
		}
	}
</style>
