<template>
	<view>
		<view class="top-section">
			<view class="tab-section">
				<view class="tab-item" :class="{'active':currentTab == 0}" @click="tabTap(0)">
					自提
				</view>
				<view class="tab-item" :class="{'active':currentTab == 1}" @click="tabTap(1)">
					送货上门
				</view>
			</view>
			<view class="address-section" style="margin:0 30upx">
				<view class="text-dark">
					<text>团长：</text>
					<view class="leader" @click="toggleLeaderMask('show')">
						<view class="storeName">
							{{defaultLeader.storeName||'未选择'}}
						</view>
						<image src="../../static/right.svg" mode=""></image>
					</view>
				</view>
				<view class="text-lg">
					<text v-if="currentTab == 0">自提点：</text><text v-if="currentTab == 1">送货范围：</text><text>{{defaultLeader.region}}</text>
				</view>
				<view class="line">
					
				</view>
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
			</view>
		</view>

		<view class="goods-section">

			<!-- 商品列表 -->
			<view class="g-item" v-for="(item, index) in goodsData" :key="item.productId">
				<image :src="item.productPic"></image>
				<view class="right">
					<text class="title clamp mt10 fontB">{{item.productName}}</text>
					<view class="price-box">
						<view class="flex-between mtrpx10">
							<text class="price fontB font14" style="color: #000;">￥{{item.productPrice}}</text>
							
						</view>
						<text class="number font14">x {{item.productQuantity}}</text>
					</view>
					<text class="spec">{{item.sp1?item.sp1:''}} {{item.sp2?item.sp2:''}} {{item.sp3?item.sp3:''}}</text>
					<view class="flexend">
						<view class="action-btn mt10" style="height: 60rpx;line-height: 60rpx;color: #888;border: 1px solid #888;background-color: white;" v-if='orderInfo.orderStatus == 2 && item.status!==undefined'>
							<text>待处理</text>

						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list" v-if="orderInfo">

			<!-- 			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">下单时间</text>
				<text class="cell-tip">{{orderInfo.createTime}}</text>
			</view> -->

			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">付款金额</text>
				<text class="cell-tip">￥{{orderInfo.payAmount}}</text>
			</view>
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">备注</text>
				<view v-if="orderInfo.note" class="cell-tip">
					<text>{{orderInfo.note}}</text>
				</view>
				<view v-else class="cell-tip">
					<text>暂无</text>
				</view>
			</view>
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
		<!-- 底部 -->
		<!-- 订单状态: 0->待付款；1->待发货；2->待收货；3->已完成；4->已关闭 -->
		<view>
			<!-- 待付款:未提交支付信息 -->
			<view class="footer">
				<!-- <view class="price-content-left">
					<text>实付款</text>
					<text class="price-tip">￥</text>
					<text class="price">{{orderInfo.payAmount}}</text>
				</view> -->
				<view class="price-content-right flexcenter">
					<!-- <view class="action-btn" @click.stop="cancelOrder" style="color:#272A30;background-color: white;">取消订单</view> -->
					<view class="action-btn" @click.stop="pay" v-if="orderInfo.orderStatusName=='待领取'">领取商品</view>
					<view class="action-btn" @click.stop="have" v-if="orderInfo.orderStatusName!='待领取'">已领取</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import amap from '../../common/amap-wx.js';
	export default {
		data() {
			return {
				addressData: '', //地址信息
				orderInfo: '', //订单信息
				goodsData: '', //订单商品信息
				orderId: '', //订单id
				sumbitFlag: false, //提交标志，防止重复提交,
				timer: 0,
				leftTime: 0,
				deliveryType:1,//0:自提，1：物流
				memberInfo: '',
				defaultLeader:'',
				leaderList:[],
				amapPlugin: null,  
				key: 'd52befc87beb8ce929d2eaa887e488ad',
				addressName: '',
				currentTab:0,
				name:'',
				phone:'',
				detail:'',
				leaderMaskState:0
			}
		},
		async onLoad(option) {
			let that = this
			if (!option.orderId) {
				this.$api.msg("参数错误!");
				uni.navigateBack({});
				return;
			}
			this.orderId = option.orderId;
			let address = uni.getStorageSync('address');
			if(address!=''){
				let data = JSON.parse(address)
				this.name = data.name;
				this.phone = data.phone;
				this.detail = data.detail||'';
			}
			uni.showLoading({
				mask:true,
				title:'加载中'
			})
			let token = uni.getStorageSync('token');
			if(token!=''){
				let memberInfo = await that.$api.getMemberInfo();
				that.memberInfo = memberInfo.data
				that.getOrderInfo();
				that.loadLeaderList()
				that.$http.defaultLeader(that.memberInfo.userId).then(res=>{
					uni.hideLoading()
					if(res.code==200){
						if(!res.data){
						}
						that.defaultLeader = res.data
					}else {
						that.$api.msg(res.message)
					}
				})
			}else{
				uni.login({
					async success(res) {
						if (res.code) {
							let result = await that.$http.login({code:res.code});
							if(result.code==200){
								uni.setStorageSync('token', result.data.token);
								uni.setStorageSync('tokenHead', result.data.tokenHead);
								that.token=uni.getStorageSync('token')
								let memberInfo = await that.$api.getMemberInfo();
								that.memberInfo = memberInfo.data
								that.getOrderInfo();
								that.loadLeaderList()
								that.$http.defaultLeader(that.memberInfo.userId).then(res=>{
									uni.hideLoading()
									if(res.code==200){
										if(!res.data){
										}
										that.defaultLeader = res.data
									}else {
										that.$api.msg(res.message)
									}
								})
							}else {
								console.log('登录失败！' + res.errMsg)
								this.$api.msg('请先注册')
								uni.navigateTo({
									url: '/pages/public/register'
								})
								return;
							}
						} 
					}
				})
			}
		},
		async onShow() {
			
		},
		methods: {
			stopPrevent(){},
			tabTap(index){
				this.currentTab = index
			},
			toCheckLeader() {
				uni.navigateTo({
					url:"/pages/leader/checkLeader"
				})
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
			//获取订单详情
			async getOrderInfo() {
				let that = this
				uni.showLoading({
					title: '加载中'
				})
				let option = {
					orderId: this.orderId
				};
				let result = await this.$http.getOrderInfo(option);
				uni.hideLoading();
				if (result.code == 200) {
					if (result.data) {
						console.log(result.data)
						that.orderInfo = result.data;
						that.goodsData = that.orderInfo.orderItem;
					}
				}
			},
			have(){
				this.$api.msg('该订单已被领取')
			},
			//领取订单
			async pay() {
				if (this.name == ''){
					this.$api.msg('请输入购买人!');
					return false;
				}
				if (this.phone == ''){
					this.$api.msg('请输入手机号!');
					return false;
				}
				if(!(/^1[3456789]\d{9}$/.test(this.phone))){ 
					this.$api.msg("请输入正确的手机号!");  
					return false; 
				}
				// if(!this.defaultLeader){
				// 	let defaultLeader = uni.getStorageSync('leader')
				// 	this.defaultLeader = JSON.parse(defaultLeader);
				// }
				if(!this.defaultLeader){
					this.$api.msg('请选择团长!');
					return false;
				}
				let options = {
				  "orderId":this.orderId,
				  "deliveryType": this.currentTab,
				  "name": this.name,
				  "phone": this.phone,
				  "storeId": this.defaultLeader.id
				};
				if(this.detail!=''&&this.currentTab==1){
					options.detail =this.detail
				}
				uni.showLoading({
					title:'领取中'
				})
				let address = {
					name:this.name,
					phone:this.phone,
					detail:this.detail
				}
				uni.setStorageSync('address',JSON.stringify(address))
				let res = await this.$http.receiveGift(options)
				uni.hideLoading()
				if(res.code==200){
					uni.navigateTo({
						url:'/pages/order/orderInfo?orderId='+this.orderId
					})
				}
			},
			//复制内容到剪贴板
			paste() {
				uni.setClipboardData({
					data: this.orderInfo.orderSn,
					success: function() {
						console.log(`复制:${this.orderInfo.orderSn}成功`);
					},
					fail: function() {
						console.log(`复制:${this.orderInfo.orderSn}失败`);
					}
				});
			},
			//取消订单
			async cancelOrder() {
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定取消订单',
					success: function(res) {
						if (res.confirm) {
							that.cancle()
						}
					}
				});
			},
			async cancle() {
				let options = {
					orderId: this.orderInfo.orderId
				};
				uni.showLoading({
					title: '请稍后'
				})
				let result = await this.$http.cancelOrder(options);
				uni.hideLoading();
				if (result.code == 200) {
					this.$api.msg(result.message);
					this.getOrderInfo();
				} else {
					this.$api.msg(result.message);
				}
			},
			setTimes(data) {
				var s;
				var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = (data % (1000 * 60)) / 1000;
				s = (hours < 10 ? ('0' + hours) : hours) + '时' + (minutes < 10 ? ('0' + minutes) : minutes) + '分' + (seconds < 10 ?
					('0' + seconds) : seconds) + '秒';
				return s;
				// return hours + '时' + minutes + '分' + seconds + '秒'
			},
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
							console.log(res)
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
				console.log(item)
				this.defaultLeader = item;
				this.toggleLeaderMask()
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
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
				height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: $font-base;
				color: #fff;
				image{
					margin-left: 20upx;
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

	.orderStatus {
		background: #fff;
		padding: 15upx 24upx 15upx 24upx;

		view {
			.sn {
				font-size: 30upx;
				color: #999;
			}

			.copy {
				padding: 5upx 20upx 5upx 20upx;
				color: $base-color;
				background: #fff9f9;
				font-size: 30upx;
				margin-left: 10upx;
				border: 1px solid #f7bcc8;
			}
		}

		.status {
			font-size: 30upx;
			color: $base-color;
		}

	}

	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;
		margin-top: 16upx;

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
			flex-wrap: wrap;
			color: $font-color-dark;
			font-weight: bolder;
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
	}

	.logistics {
		padding: 5upx 20upx 5upx 20upx;
		color: #fff;
		background: #272A30;
		float: right;
		font-size: 30upx;
		margin-left: 10upx;
		border-radius: 10upx;
		margin-right: 30upx;
		border: 1px solid #272A30;
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding: 10px 0;

		.g-header {
			display: flex;
			align-items: center;
			height: 100upx;
			padding: 0 30upx;
			position: relative;
		}
		.region{
			color: #8BC844;
			font-size: 25upx;
			margin-left: 24upx;
		}
		.logo {
			display: block;
			width: 100upx;
			height: 100upx;
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

	.yt-list {
		margin-top: 16upx;
		background: #fff;
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
			font-weight: bolder;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;
			font-weight: bolder;

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
		justify-content: flex-end;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		// box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

		.price-content-left {
			padding-left: 30upx;
		}

		.price-content-right {
			position: absolute;
			right: 30upx;
		}

		.price-tip {
			color: $font-base;
			margin-left: 8upx;
			font-weight: bolder;
		}

		.price {
			font-size: 38upx;
			color: $font-base;
			font-weight: bolder;
		}

		.pay {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 220upx;
			height: 70%;
			color: white;
			font-size: 32upx;
			background-color: black;
			border: 1px solid #000;
			margin-right: 30rpx;
			border-radius: 5px;
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

	/* 优惠券列表 */
	.coupon-item {
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;

		.con {
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;

			&:after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}

		.left {
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}

		.time {
			font-size: 24upx;
			color: $font-color-light;
		}

		.right {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}

		.price {
			font-size: 44upx;
			color: $base-color;

			&:before {
				content: '￥';
				font-size: 34upx;
			}
		}

		.tips {
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}

		.circle {
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;

			&.r {
				left: auto;
				right: -6upx;
			}
		}
	}

	.action-btn {
		display: block;
		width: 200upx;
		height: 80upx;
		margin-right: 24upx;
		line-height: 80upx;
		font-size: $font-sm + 2upx;
		color: #fff;
		background: $border-color;
		border-radius: 5px;
		z-index: 9999;
		border: 1px solid $border-color;
		text-align: center;
		font-weight: bolder;

		&.afterSales {
			margin-top: 25rpx;
			height: 60rpx;
			line-height: 60rpx;
			background-color: white;
			color: black;
			width: 170rpx;
			margin-right: 0px;

		}

		&:after {
			border-radius: 5px;
		}

		&.recom {
			color: #fff;

			&:after {
				border-color: $border-color;
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
