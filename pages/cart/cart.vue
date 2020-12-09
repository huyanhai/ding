<template>
	<view class="container">
		<scroll-view  scroll-y="true" @scrolltolower="loadProductData" class="cart_scrollview" @click="checkLogin">
			<!-- 空白页 -->
			<view v-if="!hasLogin || empty===true">
				<!-- <image src="/static/emptyCart.png"></image>
				<view v-if="hasLogin" class="empty-tips">
					空空如也
					<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
				</view> -->
				<view class="top_ad"></view>
				<!-- <view v-else class="empty-tips">
					您还没有登录
					<view class="navigator" @click="navToLogin">去登录></view>
				</view> -->
				<!-- 			<view v-if="hasLogin && flag==0" class="empty-tips"> 
					完善资料
					<view class="navigator" @click="navToBindPhone">去完善资料></view>
				</view> -->
			</view>
			<view v-else>
				<!-- 列表 -->
				<view class="cart-list">
					<block v-for="(item, index) in cartList" :key="item.id">
						<view class="cart-item" :class="{'b-b': index!==cartList.length-1}" @click="goDetail(item)">
							<view  v-if="item.status==1" class="yticon icon-xuanzhong2 checkbox ml10" :class="{checked: item.checked}" @click.stop="check('item', index)"></view>
							<view  v-if="item.status==0" class="lose">
								失效
							</view>
							<view class="image-wrapper">
								<image :src="item.productPic" :class="[item.loaded]" mode="aspectFill" lazy-load @load="onImageLoad('cartList', index)"
								 @error="onImageError('cartList', index)"></image>
							</view>
							<view class="item-right">
								<text class="clamp title">{{item.productName}}</text>
								<text v-if="item.endTime!=undefined" class="attr" style="color: #000;"><text style="font-weight: bold;margin-right: 10upx;">秒杀 </text>距离活动结束还剩：{{item.endTimeString}}</text>
								<text class="attr">{{item.sp1?item.sp1:''}} {{item.sp2?item.sp2:''}} {{item.sp3?item.sp3:''}}</text>
								<view v-if="item.status==1" style="margin-top: 20upx;">
									<view class='price'>￥{{item.flashPromotionPrice||item.price}}<!-- <text style="color: #999;font-size: 24upx;text-decoration: line-through;" v-if="item.flashPromotionPrice!=undefined">{{item.price}}</text> --></view>
									<view  @click.stop="onClickItems">
										<uni-number-box ref="number" class="step" :min="1" :max="item.stock?item.stock:999999" :value='item.quantity' :isMax="item.number>=item.stock?true:false"
										 :isMin="item.number===1" :index="index" @eventChange="numberChange"></uni-number-box>
									</view>
								</view>
								<view style="font-size: 30upx;color: #DD524D;" v-if="item.status==0">
									{{item.statusMessage}}
								</view>
							</view>
							<text class="del-btn yticon icon-fork" @click.stop="deleteCartItem(index)"></text>
						</view>
					</block>
				</view>
				
			</view>
			
			<view class="list" v-if="allProductList.length">
				<view class="title">
					爽辣食界，爽的炸口
				</view>
				<view class="list_box">
					<product :item.sync="item" v-for="item in allProductList" :key="item.id"/>
				</view>
			</view>
			<uni-load-more :status="loadingType" :contentText="{
				contentnomore:'爽辣进行到底，好味从头再来'
			}"></uni-load-more>
		</scroll-view>
		<!-- 底部菜单栏 -->
		<view class="action-section" v-if="hasLogin && !empty">
			<view class="checkbox">
				<view class="textcenter" style="margin-top: -8px;">
					<view class="yticon icon-xuanzhong2 checkboxfont ml10" :class="{checked: allChecked}" @click="check('all')"></view>
					<!-- <image :src="allChecked?'/static/selected.svg':'/static/select.png'" mode="aspectFit" @click="check('all')" style="width:20px;height: 20px;"></image> -->
				</view>
				<view class="font10 fontB">{{allChecked?'全选':'全选'}}</view>
				<!-- <view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
					清空
				</view> -->
			</view>
			<view class="total-box">
				<view class="font12 fontB" style="color: #000; text-align: center;">¥{{total||0}}</view>
				<view class="font9 fontcolor17" style="text-align: center;">合计</view>
				<!--
				<text class="coupon">
					已优惠
					<text>74.35</text>
					元
				</text>
				-->
			</view>
			<view type="primary" class="no-border buyFriend-btn" ></view>
			<view type="primary" class="no-border confirm-btn" @click="createOrder(0)">立即购买</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import wfalls3 from 'components/wfalls-flow/wfalls-flow3';
	import product from "../index/product.vue"
	
	export default {
		components: {
			uniNumberBox,
			uniLoadMore,
			wfalls3,
			product
		},
		data() {
			return {
				total: 0, //总价格
				allChecked: false, //全选状态  true|false
				empty: false, //空白页现实  true|false
				cartList: [],
				pageNum:1,
				allProductList:'',
				loadingType:'more'
			};
		},
		onShow() {
			this.allChecked = false;
			this.loadData();
			uni.removeTabBarBadge({
				index:2
			})
		},
		onReady() {
			this.loadProductData('reLoad')
		},
		onPullDownRefresh(){
			console.log(1)
		},
		onHide() {
			let number = 0;
			for(let item of this.cartList){
				number+=item.quantity
			}
			if(number>0){
				uni.setTabBarBadge({
					index:2,
					text:number.toString(),
				})
			}
		},
		watch: {
			//显示空白页
			cartList(e) {
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
			}
		},
		computed: {
			...mapState(['hasLogin', 'loginStatus', "flag", "phone"]),
		},
		methods: {
			checkLogin(){
				if(!this.hasLogin){
					uni.navigateTo({
						url: '/pages/public/register'
					})
				}
			},
			goDetail(e){
				uni.navigateTo({
					url: `/pages/product/product?id=${e.productId}`
				});
			},
			onClickItems(){
				console.log("onClickItem")
			},
			async add(data){
				let options = {
					skuId:data.skuId,
					quantity:1
				}
				let result = await this.$http.cartAdd(options);
				if (result.code == 200) {
					this.$api.msg('成功加入购物车');
					this.loadData()
				} else {
					this.$api.msg(result.message);
				}
			},
			async loadProductData(source){
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
						"pageSize": 10,
						"pageNum": this.pageNum,
					};
					result = await this.$http.getProductList(params);
					if (result.code != 200) {
						return false;
					}
					
					let allProductList = result.data;
					if (this.pageNum === 1) { //下拉刷新
						this.allProductList = allProductList;
						uni.stopPullDownRefresh()
					} else { //加载更多
						allProductList.forEach(item => {
							this.allProductList.push(item);
						})
						uni.stopPullDownRefresh()
					}
					setTimeout(()=>{
						this.$refs.allProduct.init();
					},100)
					this.pageNum = this.pageNum + 1;
					if (result.data.length > 0) {
						//判断是否还有数据， 有改为 more， 没有改为noMore 
						this.loadingType = 'more';
					} else {
						this.loadingType = 'noMore';
					}
				}, 600);
			},
			formatDuring(mss) {
			    var hours = parseInt(mss/ (1000 * 60 * 60));
			    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
			    var seconds = parseInt((mss % (1000 * 60)) / 1000);
				if(hours<10){
					hours = '0'+hours
				}
				if(minutes<10){
					minutes = '0'+minutes
				}
				if(seconds<10){
					seconds = '0'+seconds
				}
			    return  hours + ":" + minutes + ":" + seconds;
			},
			//请求数据
			async loadData() {
				let token = uni.getStorageSync('token')
				if (token) {
					this.$store.commit("setLoginStatus", 2);
					this.$store.commit("setHasLogin", true)
				} else {
					console.log('请登录')
				}
				if (!this.hasLogin) {
					// uni.navigateTo({
					// 	url: "/pages/public/register"
					// })
				} else {
					let result = await this.$http.getCartList();
					console.log('cartResult',result)
					if (result.code == 200) {
						let list = result.data
						let cartLists = list.map(item => {
							if(item.endTime==""){
								item.endTime = undefined;
							}
							if(item.endTime!=undefined){
								item.endTimeString = 0;
								item.timer = 0;
								item.timer=setInterval(()=>{
									let nowTime = new Date().getTime();
									let day = new Date().getDate();
									let month = new Date().getMonth()+1;
									let year = new Date().getFullYear();
									let endTime_ = Date.parse(year+'-'+month+'-'+day+' '+item.endTime);
									let time = endTime_ - nowTime
									item.endTimeString = this.formatDuring(time)
								},1000)
							}else{
								item.endTimeString = "";
							}
							item.checked = false;
							return item;
						});
						this.cartList = cartLists;
						try{
							let number = this.$refs.number
							number && this.cartList.forEach((e,i)=>{
								number[i].update(e.quantity)
							})
						}catch(e){
							console.log(e)
							//TODO handle the exception
						}
						this.calcTotal(); //计算总价
					} else {
						this.$api.msg(result.message)
					}
				}
			},
			//监听image加载完成
			onImageLoad(key, index) {
				this.$set(this[key][index], 'loaded', 'loaded');
			},
			//监听image加载失败
			onImageError(key, index) {
				this[key][index].image = '/static/errorImage.jpg';
			},
			navToLogin() {
				uni.navigateTo({
					url: '/pages/public/register'
				})
			},
			//选中状态处理
			check(type, index) {
				if (type === 'item') {
					this.cartList[index].checked = !this.cartList[index].checked;
				} else {
					const checked = !this.allChecked
					const list = this.cartList;
					list.forEach(item => {
						if(item.status!=0){
							item.checked = checked;
						}
					})
					this.allChecked = checked;
				}
				this.calcTotal(type);
				//单个商品选中按钮被全部选中时影响全选
				for(let i = 0;i<this.cartList.length;i++){
					if(this.cartList[i].checked==false&&this.cartList[i].status!=0){
						this.allChecked = false;
						return;
					}
				}
				this.allChecked = true;
			},
			//数量
			async numberChange(data) {
				let result = await this.$http.updateQuantity({
					"quantity": data.number,
					"id": this.cartList[data.index].id
				})
				console.log("numberChange",result)
				if (result.code == 200) {
					//this.cartList[data.index].flashPromotionPrice = result.data.flashPromotionPrice;
					this.cartList[data.index].quantity = data.number;
					this.calcTotal();
				}else{
					this.$api.msg(result.message)
					return
				}
			},
			//删除
			async deleteCartItem(index) {
				let list = this.cartList;
				let row = list[index];
				console.log(row);
				let id = row.id;
				let options = {
					ids: id
				}
				let result = await this.$http.cartDelete(options);
				if (result.code == 200) {
					this.cartList.splice(index, 1);
					this.calcTotal();
					uni.hideLoading();
				} else {
					this.$api.msg('请重试!');
				}
			},
			//清空
			clearCart() {
				uni.showModal({
					content: '清空购物车？',
					success: async (e) => {
						if (e.confirm) {
							let result = await this.$http.cartClear();
							if (result.code == 200) {
								this.cartList = [];
							}
						}
					}
				})
			},
			//计算总价
			calcTotal() {
				let list = this.cartList;
				if (list.length === 0) {
					this.total = 0;
					this.allChecked = false
					this.empty = true;
					return;
				}
				let total = 0;
				let checked = true;
				list.forEach(item => {
					if (item.checked === true) {
						//total += item.price * item.number;
						//默认设置1
						if(item.status!=0){
							total += item.price * item.quantity;
						}
					} else if (checked === true) {
						checked = false;
					}
				})
				// this.allChecked = checked;
				this.total = Number(total.toFixed(2));
			},
			navToBindPhone() {
				uni.navigateTo({
					url: "/pages/public/bindPhone/bindPhone?phone=" + this.phone
				});
			},
			//创建订单
			createOrder(e) {
				let isGiving = e
				let list = this.cartList;
				let goodsData = [];
				list.forEach(item=>{
					console.log(item)
					if(item.checked){
						// console.log(item,'商品信息');
						// goodsData.push({
						// 	productAttr: item.productAttr,
						// 	number: item.quantity
						// })
						// item.productPic = '';
						// item.productName = '';
						goodsData.push(item)
					}
				})
				if(goodsData.length==0){
					this.$api.msg('没有选择商品')
					return;
				}
				// console.log(list, '下单数据');
				uni.navigateTo({
					url: `/pages/order/createOrder?type=2&isGiving=${e}&data=${JSON.stringify({
						goodsData: goodsData
					})}`
				})
				//this.$api.msg('跳转下一页 sendData');
			},
			// // #ifdef MP-WEIXIN
			// onTabItemTap(item) {
			// 	if(item.text=="我的"){
			// 		this.token = uni.getStorageSync('token');
			// 		if (this.token == '') {
			// 			uni.reLaunch({
			// 				url: '/pages/public/login'
			// 			});
			// 		}
			// 	}
			// }
			// // #endif
		}
	}
</script>

<style lang='scss'>
	
	.cart_scrollview{
		height: 100vh;
		.top_ad{
			height: 530rpx;
			background:url("http://qn.dinglaobiao.com/1607501010373.png") no-repeat center;
			background-size: contain;
			border-radius: 20rpx;
			overflow: hidden;
			margin: 30rpx;
		}
		.list{
			margin: 0 30rpx;
			.title{
				text-align: center;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				color: #000000;
				height: 80rpx;
				&::before,&::after{
					width: 200rpx;
					height: 2rpx;
					background: #dedede;
					content: "";
					display: block;
				}
			}
			.list_box{
				display: flex;
				flex-wrap: wrap;
				product{
					width: calc(50% - 15rpx);
					margin-top: 30rpx;
					&:nth-child(2n+1){
						margin-right: 15rpx;
					}
					&:nth-child(2n+2){
						margin-left: 15rpx;
					}
				}
			}
		}
	}
	
	
	page {
		background-color: #F7F8FC !important;
	}

	.uni-numbox {
		right: 0 !important;
		left: auto !important;
		height: 33px !important;
	}

	.container {
		/* 空白页 */
		.empty {
			/* position: fixed;
			left: 0;
			top: 0; */
			width: 100%;
			height: 100%;
			/* padding-bottom: 100upx; */
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 350rpx;
				height: 350rpx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: #000;
					margin-left: 16upx;
					font-weight: bolder;
				}
			}
		}
	}

	/* 购物车列表项 */
	.cart-item {
		background-color: white;
		display: flex;
		position: relative;
		padding: 40upx 30upx 40upx 20upx;
		justify-content: space-between;
		margin-top: 20rpx;

		.image-wrapper {
			width: 150upx;
			height: 150upx;
			flex-shrink: 0;
			position: relative;
			margin-left: 20rpx;

			image {
				border-radius: 8upx;
			}
		}

		.checkbox {
			margin-top: 50rpx;
			z-index: 8;
			font-size: 44upx;
			line-height: 1;
			padding: 4upx;
			color: $font-color-disabled;
			background: #fff;
			border-radius: 50px;

		}
		.lose{
			width: 60upx;
			height: 40upx;
			font-size: 24upx;
			background-color: #999999;
			color: #fff;
			border-radius: 5upx;
			text-align: center;
			line-height: 40upx;
			margin-top: 50upx;
		}
		.item-right {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position: relative;
			padding-left: 30upx;

			.title,
			.price {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				height: 40upx;
				line-height: 40upx;
				white-space: nowrap;
			}
			.dis-price{
				font-size: $font-base - 4upx;
				color: #999999;
				height: 40upx;
				line-height: 40upx;
				text-decoration: line-through;
			}
			.attr {
				font-size: $font-sm + 2upx;
				color: $font-color-light;
				height: 50upx;
				line-height: 50upx;
				white-space: nowrap;
			}

			.price {
				height: 50upx;
				line-height: 50upx;
			}
		}

		.del-btn {
			position: absolute;
			top: 10upx;
			right: 5upx;
			z-index: 8;
			padding: 4upx 10upx;
			font-size: 34upx;
			height: 50upx;
			background-color: #fff;
			border-radius: 50px;
			color: $font-color-light;
		}
	}

	/* 底部栏 */
	.action-section {
		/* #ifdef H5 */
		/* margin-bottom: 100upx; */
		/* #endif */
		position: fixed;
		left: 0upx;
		bottom: 0upx;
		z-index: 95;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 100upx;
		padding: 0 15upx 0 30rpx;
		background: rgb(255, 255, 255);
		box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);

		.checkbox {
			height: 52upx;
			position: relative;

			image {
				position: relative;
				z-index: 5;
			}
			.checkboxfont{
				color: #C0C4CC;
				font-size: 44upx;
			}
		}

		.clear-btn {
			position: absolute;
			left: 26upx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52upx;
			line-height: 52upx;
			padding-left: 38upx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius: 0 50px 50px 0;
			opacity: 0;
			transition: .2s;

			&.show {
				opacity: 1;
				width: 120upx;
			}
		}

		.total-box {
			flex: 1;
			display: flex;
			flex-direction: column;
			text-align: right;
			padding-right: 40upx;

			.price {
				font-size: $font-lg;
				color: $font-color-dark;
			}

			.coupon {
				font-size: $font-sm;
				color: $font-color-light;

				text {
					color: $font-color-dark;
				}
			}
		}

		.confirm-btn {
			padding: 0 50upx;
			margin: 0;
			height: 75upx;
			line-height: 75upx;
			border-radius: 75upx;
			font-size: $font-base + 2upx;
			background: #CD0000;
			color: white;
		}

		.buyFriend-btn {
			display: flex;
			flex: 1;
		 }
	}

	/* 复选框选中状态 */
	.action-section .checkbox .checkboxfont.checked,
	.cart-item .checkbox.checked {
		color: #1DC7AC;
	}
	.list-scroll-content {
		height: 100%;
	}
	.Recommends{
		/* background-color: #EFD1C6; */
		z-index: 2;
		/* margin-top: 20upx; */
		/* padding: 0rpx 0rpx 10rpx; */
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
	}
	.list-containers{
		background: #EFD1C6;
	}
</style>