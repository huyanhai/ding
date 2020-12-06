<template>
	<view class="container">
		<scroll-view scroll-y="true" style="height:90vh" @scrolltolower="loadProductData">
			<view class="carousel b-b">
				<swiper indicator-dots circular=true duration="400">
					<swiper-item class="swiper-item" v-for="(item,index) in goodInfo.listAlbumPics" :key="index">
						<!-- <view style='position: absolute;right: 5px;top: 30rpx;width: 50px;height: 50rpx;z-index: 99999;' @click.stop="toFavorite">
							<image src="../../static/heart_selected.svg" mode="" v-if="favorite"></image>
							<image src="../../static/heart.svg" mode="" v-else></image>
						</view> -->
						<view class="image-wrapper">
							<image :src=item class="loaded" mode="aspectFill" @click="preImage"></image>
						</view>
					</swiper-item>
				</swiper>
				<button class="share-btn" open-type="share" :style="'left:'+(moveX==9999?'': moveX)+'px;top:'+ (moveY == 9999?'':moveY) +'px'"
				 @touchstart.stop="drag_start" @touchmove.prevent="drag_hmove" @touchend="shareEvn">
					<image style="width:40upx;height: 40upx;" src="../../static/shareIcon.svg" mode=""></image>
				</button>
			</view>
			<!-- <view>{{goodInfo.listAlbumPics}}</view> -->
			<!-- <view class="seckill" v-if="goodInfo.flashPrice">
				<view class="left">
					<view style="font-weight: bold;color: #fff;font-size: 40upx;">秒杀中</view>
					<view class="">
						<text style="font-size: 28upx;color: #fff;">限购{{goodInfo.flashLimit}}份 / 剩余{{goodInfo.flashCount}}份</text>
					</view>
				</view>
				<view class="right">
					仅售
					<text>
						<text style='font-size: 25upx;color: rgb(242,95,0)'>￥</text>
						<text style="color: rgb(242,95,0)">{{goodInfo.flashPrice}}</text>
					</text>
				</view>
			</view> -->
			
			<view class="bgcolor10" style="padding: 10upx 20upx 10upx;">
				<view class="font10 mt10 mb10">{{goodInfo.subTitle || '暂无'}}{{ goodInfo.specChildList[currentSkuIndex].name||''}}</view>
				<view style="display: flex;">
					<view class="fontB font14">
						<span style='color: #e82229;'>￥</span>
						<span style="color: #e82229;">{{goodInfo.flashCount>0?(goodInfo.flashPrice||skuGoodInfo.price):skuGoodInfo.price || goodInfo.price}}</span>
					</view>
					<view class="dis-price" v-if="goodInfo.flashPrice&&goodInfo.flashCount>0">
						￥{{skuGoodInfo.price }}
					</view>
					<view class="dis-price" v-if="!goodInfo.flashPrice&&goodInfo.orignPrice&&goodInfo.orignPrice!=0">
						{{goodInfo.orignPrice}}
					</view>
				</view>
				<view class="mb10" style="display:flex;justify-content: space-between;">
					<view class="font10" v-if="goodInfo.vipPrice" >
						<span >会员价：</span>
						<span style='color: #e82229;'>￥</span>
						<span style="color: #e82229;">{{goodInfo.vipPrice || 0}}</span>
					</view>
					<view class="font9" >
						<!-- <text class="fontcolor16 font12">销量：{{goodInfo.sale === undefined ? 0 : goodInfo.sale}}
						</text> -->
						<text class=" font10" style="color: #999999;">库存：{{goodInfo.stock || 0 }}</text>
						<text class=" ml20 font10" style="color: #999999;">运费：{{goodInfo.expressPrice || '免邮'}}</text>
					</view>
				</view>
				
				<view class="couponCan" v-if="couponList.length>0">
					<view class="couponCan-item"><text v-if="couponList.length>0">满{{couponList[0].minPoint}}减{{couponList[0].amount}}</text></view>
					<view class="couponCan-button" @click="toggleMask('show')">
						<view class="">
							领券
						</view>
						<image src="../../static/right.svg" mode=""></image>
					</view>
				</view>
			</view>
			
<!-- 			<view style="height: 100upx;line-height: 100upx;padding: 0 40upx;font-size: 28upx;background-color: #fff;margin-top: 10upx;">
				<text style="font-weight: bold;color: #000;">配送</text><text style="color: #999999;margin-left: 40upx;">22:00前下单，预计明天({{month}}月{{day}}日)送达</text>
			</view> -->
			<!-- 评价 -->
			<view class="eva-section" v-if="goodInfo.pmsComment">
				<view class="e-header">
					<text class="tit">评价</text>
					<text>({{goodInfo.countComent}})</text>
					<text class="tip">好评率 {{goodInfo.applauseRate}}%</text>
					<text class="yticon icon-you"></text>
				</view>
				<view class="eva-box" v-for="(item, index) in goodInfo.pmsComment" :key="index" v-if="index < 1">
					<image class="portrait" :src="item.memberIcon" mode="aspectFill"></image>
					<view class="right">
						<text class="name">{{item.memberNickName}}</text>
						<text class="con">{{item.content}}</text>
						<view class="bot">
							<text class="attr">购买类型：{{item.productAttribute}}</text>
							<text class="time">{{item.createTime}}</text>
						</view>
					</view>
				</view>
			</view>
			
			<view class="detail-desc">
				<view class="d-header">
					<text class="fontB">图文详情</text>
				</view>
				<rich-text :nodes="desc"></rich-text>
			</view>
			<view class="Recommends" v-if="allProductList.length">
				<view style="margin: 24upx;">
					<view class="font12 fontB">精选商品</view>
				</view>
				<view>
					<view v-if="allProductList.length" class="list-containers">
						<wfalls3 ref='allProduct' :list='allProductList' @eventAdd="add"></wfalls3>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</scroll-view>

		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<!-- <text class="yticon icon-xiatubiao--copy"></text>	 -->
				<view style="width: 40upx;height: 48upx;display: flex;justify-content: center;align-items: center;">
					<image style="width: 40upx;height: 40upx;" src="../../static/tab-home.png" mode=""></image>
				</view>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn" style="position: relative;">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
				<view class="tip" v-if="number>0">
					{{number}}
				</view>
			</navigator>
			
			<!-- <view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view> -->
			
			<!-- <button class="textcenter contact" open-type="contact" style='background-color: white;'>
				<image src="../../static/contact.svg" style="width: 20px;height: 20px;"></image>
				<view style="height: 15rpx;line-height: 15rpx;font-size: 12px;">联系客服</view>
			</button> -->
			<view class="action-btn-group">
				<button style="background-color: #efa023;border-radius: 76upx 0 0 76upx;" type="primary" class=" action-btn no-border add-cart-btn" @click="toggleSpec(2)">加入购物车</button>
				<button style="background-color: #ef4923;border-radius: 0 76upx 76upx 0;" type="primary" class=" action-btn no-border buy-now-btn" @click="toggleSpec(1)">立即购买</button>
				<!-- <button v-if="goodInfo.flashPrice" type="primary" class=" action-btn no-border buy-now-btn" @click="toggleSpec(4)">立即秒杀</button> -->
			</view>
		</view>


		<!-- 规格-模态层弹窗 -->
		<view class="popup spec" :class="specClass" @touchmove.stop.prevent="stopPrevent" @click="toggleSpec(3)">
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="skuGoodInfo.pic?skuGoodInfo.pic:goodInfo.pic"></image>
					<view class="right">
						<view class="mt10">
							<span class="font19 fontB fontcolor13">¥</span>
							<span v-if="goodInfo.flashLimit&&(goodInfo.flashLimit-goodNum)>=0&&goodInfo.flashCount>0" class="price fontB font19">{{goodInfo.flashPrice||skuGoodInfo.price}}</span>
							<span v-else class="price fontB font19">{{skuGoodInfo.price}}</span>
						</view>
						<text class="stock margintb10">库存：{{skuGoodInfo.stock||0}}</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
								{{sItem.name}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="index" class="attr-list">
					<text class="fontB">{{item.name}}</text>
					<view class="item-list">
						<text v-for="(childItem, childIndex) in specChildList" v-if="childItem.pid === item.id" :key="childIndex" class="tit"
						 :class="{selected: childItem.selected}" @click="selectSpec(childIndex, childItem.pid)">
							{{childItem.name}}
						</text>
					</view>
				</view>
				<view class="selectNumber">
					<!-- <text class="cell-icon yticon icon-zuo" @click="subtractGoodNumber"></text>
					<input v-model="goodNum" class="numberInput" type="number"/>
					<text class="cell-icon yticon icon-you" @click="plusGoodNumber"></text> -->
					<text class="fontB">数量</text>
					<view class="box">
						<uni-number-box class="numBox" :min="1" :max="goodInfo.stock?goodInfo.stock:999999" :value='goodNum' :isMax="goodNum>=goodInfo.stock?true:false"
						 :isMin="goodNum===1" @eventChange="numberChange" :lineHeight="40"></uni-number-box>
					</view>
				</view>
				<view class="flexcenter" v-if='operationType==1'>
					<!-- <button style="background-color: #4CD964;border-radius: 80upx 0 0 80upx;" class="btn" @click="jump(1)" v-if='(gift && gift==1) || (!gift)' :style="{width:(gift?'100%':'')}">赠送好友</button> -->
					<button style="border-radius:80upx;" class="btn" @click="jump(0)" v-if='(gift && gift==2) || (!gift)' :style="{width:(gift?'100%':'')}">立即购买</button>
				</view>
				<button class="btn" @click="jump()" v-if='operationType==2' style="width: 100%;border-radius: 80upx;">确定</button>
				<button class="btn" @click="jump(0)" v-if='operationType==4' style="width: 100%;">确定</button>
			</view>
		</view>
		<!-- <view class="content">
			<drag image="/static/cart.svg" navIndex='/pages/cart/cart' :number='number'></drag>
		</view> -->
		<!-- 优惠券面板 -->
		<view class="coupon-mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask" @touchmove.stop.prevent="stopPrevent">
			<view class="coupon-mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-mask-content" @click.stop.prevent="stopPrevent" v-if='couponList.length>0'>
					<!-- 优惠券页面，仿mt -->
					<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
						<view style="display: flex;background: #fff;border-radius: 12upx;">
							<view class="con">
								<view class="top">
									<view class="title">
										<text class="tag">{{item.useType==0?'全场通用':(item.useType==0?'指定分类':'指定商品')}}</text>
										<text style="margin-left: 15upx;">{{item.name}}</text>
									</view>
									<text class="time">{{/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.startTime)+'~'+/\d{4}-\d{1,2}-\d{1,2}/g.exec(item.endTime)}}</text>
								</view>
								<view class="bottom">
									<text class="tips">详细信息</text>
									<image style="width: 40upx;height: 40upx;" :src="item.showDetail==true?'../../static/up.png':'../../static/down.png'" mode="" @click="showDetail(item)"></image>
								</view>
								
								<view class="circle t"></view>
								<view class="circle r"></view>
							</view>
							<!-- <view class="right enable">
								<text class="price">{{item.amount}}</text>
								<text style="color: #fff;">满{{item.minPoint}}元可用</text>
								<view class="getBtn" @click="getCoupon(item)">
									立即领取
								</view>
							</view> -->
						</view>
						<view class="detail" v-if="item.showDetail==true">
							{{item.note||'暂无'}}
						</view>
					</view>
				</view>
				<view v-if='couponList.length==0' class="textcenter mtrpx100">
					<view class="font10 fontcolor16">您已经没有优惠券了哦~</view>
				</view>
			</view>
		</view>
		<!-- <share ref="share" :productData="goodInfo"></share> -->
		<!-- 分享弹窗-->
		<view class="share-pro" >
			<view class="share-pro-mask" v-if="deliveryFlag" @tap="closeShareEvn"></view>
			<view class="share-pro-dialog" :class="deliveryFlag?'open':'close'" >
				<view class="close-btn" @tap="closeShareEvn">
					<span class="font_family">&#xe6e6;</span>
				</view>
				<view class="share-pro-title">分享</view>
				<view class="share-pro-body">
					<view class="share-item">
						<button open-type="share">
							<view class="font_family share-icon">&#xe6fa;</view>
							<view >分享给好友</view>
						</button>
					</view>
					<!-- <view class="share-item" @tap="createCanvasImageEvn">
						<view class="font_family share-icon">&#xe6f9;</view>
						<view >生成分享图片</view>
					</view> -->
				</view>
		
			</view>
		</view>
		<hchPoster ref="hchPoster" :canvasFlag.sync="canvasFlag" @cancel="canvasCancel" :posterObj.sync="posterData"/>
		<view :hidden="canvasFlag"><!-- 海报 要放外面放组件里面 会找不到 canvas-->
			<canvas class="canvas"  canvas-id="myCanvas" ></canvas><!-- 海报 -->
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	import hchPoster from '@/components/hch-poster/hch-poster.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import wfalls3 from 'components/wfalls-flow/wfalls-flow3';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			uniNumberBox,
			uniLoadMore,
			wfalls3,
			hchPoster
		},
		data() {
			return {
				goodInfo: [], //商品信息
				specClass: 'none',
				specSelected: [],
				//收藏
				favorite: false,
				shareList: [],
				imgList: [], //轮播图
				desc: '',
				//规格属性
				specList: [],
				//规则属性值
				specChildList: [],
				skuGoodInfo: [],
				//立即下单还是加入购物车(默认立即下单)
				operationType: 0,
				goodNum: 1,
				number: 0,
				gift:false,
				memberInfo:'',
				maskState: 0, //优惠券面板显示状态
				couponList:'',
				start: [0, 0],
				moveY: 10,
				moveX: 325,
				old: [0, 0],
				deliveryFlag: false,
				canvasFlag: true,
				posterData:{},
				pageNum:1,
				allProductList:'',
				loadingType:'more',
				currentSkuIndex:0,
				month:'',
				day:'',
			};
		},
		async onShow() {
			let that = this;
			//明天的时间
			let myDate = new Date();
			myDate.setTime(myDate.getTime()+24*60*60*1000);
			this.month = myDate.getMonth()+1;
			this.day = myDate.getDate()
			let token = uni.getStorageSync('token')
			if(token!=''){
				let result = await this.$http.getCartList();
				if (result.code == 200) {
					let number = 0
					let list = result.data
					for (let item of list) {
						number += item.quantity
					}
					this.number = number
				} else {
					this.$api.msg(result.message)
				}
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data
				// this.getCouponList()
			}else{
				uni.login({
					async success(res) {
						if (res.code) {
							let result = await that.$http.login({code:res.code});
							if(result.code==200){
								uni.setStorageSync('token', result.data.token);
								uni.setStorageSync('tokenHead', result.data.tokenHead);
								let memberInfo = await that.$api.getMemberInfo();
								that.memberInfo = memberInfo.data;
								let resCart = await that.$http.getCartList();
								if (resCart.code == 200) {
									let number = 0
									let list = resCart.data
									for (let item of list) {
										number += item.quantity
									}
									that.number = number
								} else {
									that.$api.msg(resCart.message)
								}
								// that.getCouponList()
							}else {
								console.log('登录失败！' + result.message)
							}
						} 
					}
				})
			}
		},
		async onLoad(options) {
			if (options['_q']) {
				this.$store.commit("setShareMember", options['_q']);
			}
			if(options.gift){
				this.gift = options.gift
			}
			// try {
			// 	const value = uni.getStorageSync('token');
			// 	if (value) {
			// 		console.log(value);
			// 	}
			// } catch (e) {
			// 	// error
			// }
			//接收传值,id里面放的是标题，因为测试数据并没写id
			let id;
			if (options['scene']) {
				let scene = decodeURIComponent(options['scene'])
				let param = scene.split(',')
				this.$store.commit("setShareMember", param[0]);
				id = param[1];
				options.id = id
			}else{
				id = options.id;
			}
			
			if (!id) {
				this.$api.msg(`参数错误!`);
				return false;
			}
			this.loadData(options).then(() => {
				if (options.type) {
					options.type == "present" && this.toggleSpec(1)
					options.type == "add" && this.toggleSpec(2)
				}
			});
			this.loadProductData('reLoad')
			this.shareList = await this.$api.json('shareList');
		},
		computed: {
			...mapState(['hasLogin', 'loginStatus', "flag", "phone"]),
		},
		methods: {
			preImage(){
				let that = this;
				// 预览图片
				uni.previewImage({
					urls: that.goodInfo.listAlbumPics,
					longPressActions: {
						itemList: ['保存图片'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			showDetail(item){
				item.showDetail = !item.showDetail
			},
			end(){
				this.$refs.share.shareEvn()
			},
			drag_start(event) {
				this.start[0] = event.touches[0].clientX - event.target.offsetLeft;
				this.start[1] = event.touches[0].clientY - event.target.offsetTop;
				this.old[0] = this.moveX
				this.old[1] = this.moveY
			},
			drag_hmove(event) {
				let tag = event.touches;
				this.moveX = tag[0].clientX - this.start[0];
				this.moveY = tag[0].clientY - this.start[1];
			},
			//分享
			onShareAppMessage() {
				return {
					"title": "立即抢，仅售【￥"+(this.goodInfo.flashPrice||this.goodInfo.price)+"】"+this.goodInfo.name+this.goodInfo.specChildList[this.currentSkuIndex].name,
					"path": `/pages/product/product?id=${this.goodInfo.id}&_q=${this.memberInfo.inviteCode}`,
					"imageUrl": this.goodInfo.pic
				};
			},
			async getCouponList(){
				let list = await this.$http.couponCanreceive()
				let couponList = list.data;
				couponList.forEach(item=>{
					item.showDetail = false;
				})
				this.couponList = couponList
			},
			async getCoupon(item){
				uni.showLoading({
					title:'领券中'
				})
				let res = await this.$http.couponAdd(item.id)
				uni.hideLoading()
				if(res.code==200){
					this.$api.msg('领券成功,快去使用吧')
					this.getCouponList()
				}else{
					this.$api.msg(res.message)
				}
			},
			//显示优惠券面板
			toggleMask(type) {
				console.log(type)
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			//联系客服
			customer() {
				
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
			//更改商品數量
			// subtractGoodNumber(){
			// 	if(this.goodNum>1)
			// 		this.goodNum-=1;
			// },
			// plusGoodNumber(){
			// 	if(this.goodNum<this.goodInfo.stock)
			// 		this.goodNum += 1;
			// },

			//数量改变
			numberChange(result) {
				this.goodNum = result.number;
			},
			async loadData(options) {
				uni.showLoading({
					title: '加载中'
				})
				let goodInfo = await this.$http.goodInfo(options);
				console.log('goodInfo',goodInfo)
				uni.hideLoading();
				if (goodInfo.code == 200) {
					this.goodInfo = goodInfo.data;
					this.desc = this.goodInfo.detailMobileHtml;
					this.specList = this.goodInfo.specList;
					this.specChildList = this.goodInfo.specChildList;
					this.defaultSpec(options);
					let token = uni.getStorageSync('token')
					if(token!=''){
						this.memberReadHistoryCreate();
					}
					this.getProductSke();
					if (this.goodInfo.whetherTheCollection == 1) {
						this.favorite = true
					}
				} else {
					this.$api.msg('数据异常!');
				}
			},
			async add(data){
				let options = {
					skuId:data.skuId,
					quantity:1
				}
				let result = await this.$http.cartAdd(options);
				if (result.code == 200) {
					this.$api.msg('成功加入购物车');
					this.number ++
				} else {
					this.$api.msg(result.message);
				}
			},
			async addCart() {
				if (this.goodNum == 0) {
					this.$api.msg("最少购买一件商品!");
					return;
				}

				let sp1 = '';
				let sp2 = '';
				let sp3 = '';
				let productAttr = [];
				for (let i = 0; i < this.specSelected.length; i++) {
					let pid = this.specSelected[i].pid;
					for (let j = 0; j < this.specList.length; j++) {
						if (this.specList[j].id == pid) {
							productAttr.push({
								key: this.specList[j].name,
								value: this.specSelected[i].name
							});
							if (j == 0) {
								sp1 = this.specSelected[i].name;
							}
							if (j == 1) {
								sp2 = this.specSelected[i].name;
							}
							if (j == 2) {
								sp3 = this.specSelected[i].name;
							}
							break;
						}
					}
				}
				//加入购物车数据
				let options = {
					"price": this.skuGoodInfo.price,
					"vipPrice": this.goodInfo.vipPrice,
					"productAttr": JSON.stringify(productAttr),
					"productBrand": this.goodInfo.brandName,
					"productCategoryId": this.goodInfo.productCategoryId,
					"productId": this.goodInfo.id,
					"productName": this.goodInfo.name,
					"productPic": this.goodInfo.pic,
					"productSkuCode": this.skuGoodInfo.SkuCode,
					"skuId": this.skuGoodInfo.skuId,
					expressPrice: this.expressPrice,
					"productSubTitle": this.goodInfo.subTitle,
					"quantity": this.goodNum,
					"sp1": sp1,
					"sp2": sp2,
					"sp3": sp3
				}
				let result = await this.$http.cartAdd(options);
				if (result.code == 200) {
					this.number += this.goodNum
					this.$api.msg('成功加入购物车');
				} else {
					this.$api.msg(result.message);
				}
			},
			//默认规则
			defaultSpec(options) {
				//规格 默认选中第一条
				if(options.attr && options.attr != ""){
					for(let i = 0;i<this.specChildList.length;i++){
						if(options.attr === this.specChildList[i].name){
							this.$set(this.specChildList[i], 'selected', true);
							this.specSelected.push(this.specChildList[i]);
							this.currentSkuIndex = i
							break; //forEach不能使用break
						}
					}
				}else{
					let end = false;
					for(let j=0;j<this.specList.length;j++) {
						let item = this.specList[j];
						for(let i = 0;i<this.specChildList.length;i++){
							if (this.specChildList[i].pid === item.id) {
								this.$set(this.specChildList[i], 'selected', true);
								this.specSelected.push(this.specChildList[i]);
								end = true;
								break; //forEach不能使用break
							}0
						}
						if(end){
							break;
						}
					}
				}
			},
			//获取商品SKU信息
			async getProductSke() {
				let i = 1;
				let skuData = {};
				for (let cItem of this.specSelected) {
					switch (i) {
						case 1:
							skuData['sp1'] = cItem.name;
							break;
						case 2:
							skuData['sp2'] = cItem.name;
							break;
						case 3:
							skuData['sp3'] = cItem.name;
							break;
					}
					i++;
				}
				if(this.specSelected && this.specSelected.length==0){
					skuData['sp1'] = "";
				}

				skuData['productId'] = this.goodInfo.id;
				let result = await this.$http.getProductSke(skuData);
				console.log('result',this.specSelected)
				if (result.code == 200) {
					this.skuGoodInfo = result.data;
					// console.log("skuGoodInfo",this.skuGoodInfo);
				} else {
					this.$api.msg('异常!');
				}
			},
			//规格弹窗开关
			toggleSpec(type) {
				let that = this;
				let token = uni.getStorageSync('token')
				if (token=='') {
					that.$api.msg('请先登录');
					uni.navigateTo({
						url: '../public/register'
					})
					return;
				}
				// if (this.flag == 0) {
				// 	that.$api.msg('请先完善资料！');
				// 	uni.navigateTo({
				// 		url: "/pages/public/bindPhone/bindPhone?phone=" + this.phone
				// 	});
				// 	return;
				// }
				that.operationType = type;
				if (that.specClass === 'show') {
					that.specClass = 'hide';
					setTimeout(() => {
						that.specClass = 'none';
					}, 250);
				} else if (that.specClass === 'none') {
					that.specClass = 'show';
				}
			},
			async jump(e) {
				if (this.goodNum == 0) {
					this.$api.msg("最少购买一件商品！");
					return;
				}
				//立即下单
				if (this.operationType == 1||this.operationType == 4) {
					this.buy(e);
				} else if (this.operationType == 2) {
					//加入购物车
					this.addCart();
					this.toggleSpec();
				} else {
					this.toggleSpec();
				}
			},
			//选择规格
			selectSpec(index, pid) {
				this.currentSkuIndex = index;
				let list = this.specChildList;
				list.forEach(item => {
					if (item.pid === pid) {
						this.$set(item, 'selected', false);
					}
				})

				this.$set(list[index], 'selected', true);
				//存储已选择
				/**
				 * 修复选择规格存储错误
				 * 将这几行代码替换即可
				 * 选择的规格存放在specSelected中
				 */
				this.specSelected = [];
				list.forEach(item => {
					if (item.selected === true) {
						this.specSelected.push(item);
					}
				})
				this.getProductSke();
			},
			//分享f
			share() {
				this.$refs.share.shareEvn();
			},
			//收藏
			async toFavorite() {
				//取消收藏
				if (this.favorite) {
					let options = {
						productId: this.goodInfo.id,
					};
					let result = await this.$http.delProductCollection(options);
					if (result.code == 200) {
						this.favorite = false;
					} else {
						this.$api.msg(result.message);
					}

				} else {
					//加入收藏
					let options = {
						"productId": this.goodInfo.id,
					};
					let result = await this.$http.addProductCollection(options);
					if (result.code == 200) {
						this.favorite = true;
					} else {
						this.$api.msg(result.message);
					}
				}
			},
			//直接购买
			buy(e) {
				if (this.goodNum < 1) {
					this.$api.msg("");
				}
				let sp1 = '';
				let sp2 = '';
				let sp3 = '';
				for (let i = 0; i < this.specSelected.length; i++) {
					let pid = this.specSelected[i].pid;
					for (let j = 0; j < this.specList.length; j++) {
						if (this.specList[j].id == pid) {
							if (j == 0) {
								sp1 = this.specSelected[i].name;
							}
							if (j == 1) {
								sp2 = this.specSelected[i].name;
							}
							if (j == 2) {
								sp3 = this.specSelected[i].name;
							}
							break;
						}
					}
				}
				let actualPrice = this.goodInfo.flashPrice||undefined;
				if(this.goodNum>this.goodInfo.flashLimit||this.goodInfo.flashCount<=0){
					actualPrice = undefined
				}
				let goodInfo = [{
					id: this.goodInfo.id,
					productPic: this.goodInfo.pic,
					"vipPrice": this.goodInfo.vipPrice,
					productName: this.goodInfo.name,
					specSelected: this.specSelected,
					expressPrice: this.goodInfo.expressPrice,
					quantity: this.goodNum,
					price: this.skuGoodInfo.price,
					flashPromotionPrice:actualPrice,
					checked: true,
					sp1: sp1,
					sp2: sp2,
					sp3: sp3
				}];
				uni.navigateTo({
					url: `/pages/order/createOrder?type=1&isGiving=${e}&isSeckill=${false}&data=${JSON.stringify({
						goodsData: goodInfo,
						skuId:this.skuGoodInfo.skuId,
						quantity:this.goodNum,
					})}`
				})
			},
			//添加浏览记录
			async memberReadHistoryCreate() {
				let options = {
					"productId": this.goodInfo.id,
				}
				let result = await this.$http.memberReadHistoryCreate(options);
				if (result.code == 200) {
					//this.$api.msg(result.message);
				} else {
					//this.$api.msg(result.message);
				}
			},
			async createCanvasImageEvn(){
				wx.showLoading({
				  title: "海报生成中..."
				})
				//var index = this.goodInfo.pic.indexOf(':');
				var url = this.goodInfo.pic
				let code = await this.codeImg();
				let price,orignPrice = '';
				price = this.goodInfo.flashCount>0?(this.goodInfo.flashPrice||this.skuGoodInfo.price):this.skuGoodInfo.price
				if(this.goodInfo.flashPrice&&this.goodInfo.flashCount>0){
					orignPrice = this.skuGoodInfo.price
				}else if(!this.goodInfo.flashPrice&&this.goodInfo.orignPrice&&this.goodInfo.orignPrice!=0){
					orignPrice = this.goodInfo.orignPrice
				}
				Object.assign(this.posterData,
				{
					url:url,//商品主图
					icon:'https://img0.zuipin.cn/mp_zuipin/poster/hch-hyj.png',//醉品价图标
					title:this.goodInfo.name+(this.goodInfo.specChildList[this.currentSkuIndex] || {}).name||'',//标题
					discountPrice:price,//折后价格
					orignPrice:orignPrice,//原价
					code:code,//小程序码
					closeUrl: "https://img0.zuipin.cn/mp_zuipin/poster/close_btn.png" //关闭按钮
				})
				this.$forceUpdate();//强制渲染数据
				setTimeout(()=>{
					this.canvasFlag=false;//显示canvas海报
					this.deliveryFlag = false;//关闭分享弹窗
					this.$refs.hchPoster.createCanvasImage('product');//调用子组件的方法
				},500)
				// 这个是固定写死的小程序码 end
				// 以下是根据后端接口动态生成小程序码
				// let code="https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png";
				// this.codeImg().then((res)=>{
				// 	code = res;
				// 	Object.assign(this.posterData,
				// 	{
				// 		url:'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg',//商品主图
				// 		icon:'https://img0.zuipin.cn/mp_zuipin/poster/hch-hyj.png',//醉品价图标
				// 		title:"诗酒茶系列 武夷大红袍 2018年 花香型中火 一级 体验装 16g",//标题
				// 		discountPrice:"250.00",//折后价格
				// 		orignPrice:"300.00",//原价
				// 		code:code,//小程序码
				// 	})
				// 	this.$forceUpdate();//强制渲染数据
				// 	setTimeout(()=>{
				// 		this.canvasFlag=false;//显示canvas海报
				// 		this.deliveryFlag = false;//关闭分享弹窗
				// 		this.$refs.hchPoster.createCanvasImage();//调用子组件的方法
				// 	},500)
				// })
				// 以下是根据后端接口动态生成小程序码 end
			},
			
			// 获取海报的小程序码
			codeImg(){
				return new Promise(async (resolve,reject)=>{
					let option = {
						scene:this.memberInfo.inviteCode+','+this.goodInfo.id,
						page:'pages/product/product'
					}
					let res = await this.$http.getCode(option);
					console.log("res",res)
					if(res.code==200){
						const fsm = wx.getFileSystemManager();
						const FILE_BASE_NAME = 'tmp_img_src';
						let filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.jpg`;//图片临时地址
						fsm.writeFile({
							filePath,
							data: res.data,
							encoding: 'base64',
							success() {
								console.log("success")
								resolve(filePath)
							},
							fail() {
								console.log("fail",filePath)
								this.canvasFlag=true;
								uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
							},
							complete(){
								console.log("complete")
							}
						});
					}else{
						this.canvasFlag=true;
						uni.showToast({title:'海报生成失败',duration:2000,icon:'none'});
					}
				})
			},
			// 分享弹窗
			shareEvn() {
				this.deliveryFlag = true;
			},
			// 关闭分享弹窗
			closeShareEvn() {
				this.deliveryFlag = false;
			},
			// 取消海报
			canvasCancel(val){
				this.canvasFlag=val;
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
					console.log('params',params)
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
		},
	}
</script>

<style lang='scss'>
	//选择商品数量
	.selectNumber {
		margin-bottom: 10upx;
		line-height: 30uxp;
		justify-content: space-between;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 30upx 0 0 10upx;

		.box {
			position: relative;
			width: 230upx;
			height: 70upx;
			margin-right: 30rpx;
		}

		text {
			font-size: 30upx;
			color: #606266;
		}

		.numBox {
			height: 60upx;
		}
	}

	.content {
		display: flex;
	}

	page {
		background: $page-color-base;
	}

	.icon-you {
		font-size: $font-base + 2upx;
		color: #888;
	}

	.carousel {
		height: 722upx;
		position: relative;

		swiper {
			height: 100%;
		}
		.share-btn{
			width:70upx;
			height: 70upx; 
			/* position:absolute;
			top: 20upx;
			right: 120upx; */
			position: fixed !important;
			z-index: 2;
			background-color: rgba($color: #000000, $alpha: 0.5);
			border-radius: 100%;
			padding: 0;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

	}
	.p-price{
		height: 80upx;
		.dis-price{
			margin-left: 16upx;
			line-height: 60upx;
			color: #999999;
			height: 80upx;
			font-size: 24upx;
			text-decoration: line-through;
		}
	}
	.couponCan{
		height: 70upx;
		/* border-bottom: 5px solid #F7F8FC; */
		background-color: #FDFDFD;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		/* padding: 0 40upx; */
		font-size: 28upx;
		.couponCan-item{
			height: 50upx;
			line-height: 50upx;
			padding: 0 10upx;
			border-radius: 10upx;
			border: 2upx solid #DD524D;
			text{
				color: #DD524D;
			}
			
		}
		.couponCan-button{
			color: #fff;
			height: 50upx;
			padding: 0 5upx 0 20upx;
			border-radius: 40upx;
			background-color: #EBA542;
			display: flex;
			justify-content: center;
			align-items: center;
			image{
				width: 40upx;
				height: 40upx;
			}
		}
	}
	/* 标题简介 */
	.introduce-section {
		background: #fff;
		padding: 20upx 30upx;

		.title {
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}

		.price-box {
			display: flex;
			align-items: baseline;
			height: 64upx;
			padding: 10upx 0;
			font-size: 26upx;
			color: $uni-color-primary;
		}

		.price {
			font-size: $font-lg + 2upx;
		}

		.m-price {
			margin: 0 12upx;
			color: $font-color-light;
			text-decoration: line-through;
		}

		.coupon-tip {
			align-items: center;
			padding: 4upx 10upx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6upx;
			line-height: 1;
			transform: translateY(-4upx);
		}

		.bot-row {
			display: flex;
			align-items: center;
			height: 50upx;
			font-size: $font-sm;
			color: $font-color-light;

			text {
				flex: 1;
			}
		}
	}
	.seckill{
		height: 140upx;
		/* line-height: 100upx; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 35upx;
		/* padding: 0 20upx; */
		color: #fff;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAACMAgMAAABe0MQhAAAACVBMVEXyXwD/1oH4mkBGVBK1AAAA6klEQVR42u3ZuXHEMBAAwRM9BIJ85CA05qsQliVDV6PriaANPsDu6+19nd/2/Xp78A+Dh4eHhx+Dh4eHhx+Dh4eHhx+Dh4eHhx+Dh4eHhx+Dh4eHhx+Dh4eHh//7Vhm/y/g7jL9OGL/K+F3G32H8dcL4VcbvMv4O468Txq8yfpfxdxh/nTB+lfEb/mkem3/ywqY/le2fVPp4kD6YpY/E7ctI+hqYvoCnRx/toVN63JcetKZH3O3lQnqtk16owT8MHh4eHn4MHh4eHn4MHh4eHn4MHh4eHn4MHh4eHn4MHh4eHn4MHh4e/vPwP+8npMe5/OX2AAAAAElFTkSuQmCC);
		background-repeat:no-repeat;
		background-size:100% 100%;
		.left{
			flex: 7;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-left: 20upx;
		}
		.right{
			flex: 3;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			color: rgb(242,95,0);
			padding-right: 20upx;
			font-weight: bold;
		}
	}
	/* 分享 */
	.share-section {
		display: flex;
		align-items: center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;

		.share-icon {
			display: flex;
			align-items: center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position: relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;

			&:after {
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position: absolute;
				background: $uni-color-primary;
			}
		}

		.icon-xingxing {
			position: relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}

		.tit {
			font-size: $font-base;
			margin-left: 10upx;
		}

		.icon-bangzhu1 {
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}

		.share-btn {
			flex: 1;
			text-align: right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}

		.icon-you {
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}

	.c-list {
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;

		.c-row {
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			position: relative;
		}

		.tit {
			width: 140upx;
		}

		.con {
			flex: 1;
			color: $font-color-dark;

			.selected-text {
				margin-right: 10upx;
			}
		}

		.bz-list {
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;

			text {
				display: inline-block;
				margin-right: 30upx;
			}
		}

		.con-list {
			flex: 1;
			display: flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}

		.red {
			color: $uni-color-primary;
		}
	}

	/* 评价 */
	.eva-section {
		display: flex;
		flex-direction: column;
		padding: 20upx 30upx;
		background: #fff;
		margin-top: 16upx;

		.e-header {
			display: flex;
			align-items: center;
			height: 70upx;
			font-size: $font-sm + 2upx;
			color: $font-color-light;

			.tit {
				font-size: $font-base + 2upx;
				color: $font-color-dark;
				margin-right: 4upx;
			}

			.tip {
				flex: 1;
				text-align: right;
			}

			.icon-you {
				margin-left: 10upx;
			}
		}
	}

	.eva-box {
		display: flex;
		padding: 20upx 0;

		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

		.right {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26upx;

			.con {
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20upx 0;
			}

			.bot {
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color: $font-color-light;
			}
		}
	}

	/*  详情 */
	.detail-desc {
		background: #fff;
		margin-top: 16upx;
		/* margin-bottom: 150rpx; */

		.d-header {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;

			text {
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}

			&:after {
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 90%;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc;
			}
		}
	}

	/* 规格选择弹窗 */
	.attr-content {
		padding: 10upx 30upx;
		border-radius: 0;
		z-index: 99999;

		.a-t {
			display: flex;
			margin-top: 40rpx;

			image {
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				border-radius: 8upx;
				border: 1px solid #eee;
			}

			.right {
				margin-left: 20px;
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;

				.price {
					color: black;
					margin-top: 10upx;
				}

				.selected-text {
					margin-right: 10upx;
				}
			}
		}

		.attr-list {
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}

		.item-list {
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;

			text {
				display: flex;
				align-items: center;
				justify-content: center;
				background: white;
				margin-right: 20upx;
				margin-bottom: 20upx;
				min-width: 60upx;
				height: 60upx;
				padding: 5upx 30upx;
				font-size: $font-base;
				color: black;
				border: 1px solid #eee
			}

			.selected {
				background: #EBA542;
				color: white;
			}
		}
	}

	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;

		&.show {
			display: block;

			.mask {
				animation: showPopup 0.2s linear both;
			}

			.layer {
				animation: showLayer 0.2s linear both;
			}
		}

		&.hide {
			.mask {
				animation: hidePopup 0.2s linear both;
			}

			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}

		&.none {
			display: none;
		}

		.mask {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}

		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;

			.btn {
				height: 80upx;
				line-height: 80upx;
				background: #EBA542;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
				border-radius: 0;
				width: 90%;

				&::after {
					border: none
				}

				&.present {
					background-color: #272A30;
				}
			}
		}

		@keyframes showPopup {
			0% {
				opacity: 0;
			}

			100% {
				opacity: 1;
			}
		}

		@keyframes hidePopup {
			0% {
				opacity: 1;
			}

			100% {
				opacity: 0;
			}
		}

		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}

			100% {
				transform: translateY(0%);
			}
		}

		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}

			100% {
				transform: translateY(120%);
			}
		}
	}

	/* 底部操作菜单 */
	.page-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 2;
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		height: 120upx;
		background: rgb(255, 255, 255);
		box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.5);
		.p-b-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-around;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96upx;
			height: 80upx;
			.tip {
				position: absolute;
				right: 10rpx;
				top: -5rpx;
				background-color: rgb(255,55,0);
				border: 2upx solid #fff;
				border-radius: 50%;
				width: 35rpx;
				height: 35rpx;
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 20upx;
			}
			.yticon {
				font-size: 40upx;
				line-height: 48upx;
				color: rgb(200,200,200);
			}

			&.active,
			&.active .yticon {
				color: rgb(255,55,0);
			}

			.icon-fenxiang2 {
				font-size: 42upx;
				transform: translateY(-2upx);
			}

			.icon-shoucang {
				font-size: 46upx;
			}
		}

		.action-btn-group {
			display: flex;
			height: 76upx;
			overflow: hidden;
			/* box-shadow: 0 20upx 40upx -16upx #fa436a; */
			/* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4); */
			/* background: linear-gradient(to right, #1A191E, #EBA542); */
			/* margin-left: 20upx; */
			position: relative;
			&:after {
				position: absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255, 255, 255, .5);
			}

			.action-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base;
				padding: 0;
				border-radius: 0;
			}

			.action-btn:nth-child(1) {
				background-color: #EBA542;
			}

			.action-btn:nth-child(2) {
				background-color: #EBA542;
			}
		}

		.uni-numbox-minus,
		.uni-numbox-plus {
			line-height: 80rpx !important;
		}
		.contact{
			margin: 0;
			&:after{
				border: none;
			}
		}
	}
	/* 优惠券面板 */
	.coupon-mask {
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
	
		.coupon-mask-content {
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
	
			.coupon-mask-content {
				transform: translateY(0);
			}
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
	/*每个页面公共css 放app.vue页面的 */
	 @font-face {
		font-family: 'font_family';  /* project id 1065286 */
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot');
		src: url('//at.alicdn.com/t/font_1065286_3bsye5aijur.eot?#iefix') format('embedded-opentype'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff2') format('woff2'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.woff') format('woff'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.ttf') format('truetype'),
		url('//at.alicdn.com/t/font_1065286_3bsye5aijur.svg#font_family') format('svg');
	  }
	  .font_family{
		font-family:"font_family" !important;
		font-size:16px;font-style:normal;
		-webkit-font-smoothing: antialiased;
		-webkit-text-stroke-width: 0.2px;
		-moz-osx-font-smoothing: grayscale;
	  }
	  /* 按钮去掉边框 */
	  button::after {
		border: none;
	  }
	  button{
		margin-left: 0;
		margin-right: 0;
		padding-left: 0;
		padding-right: 0;
		line-height: 1;
		color: #1c1c1c;
		font-size: 28rpx;
		background: none;
	  }
	  .button-hover {
		color:#1c1c1c;
		background:none;
	  }
	  /*每个页面公共css */
	.content {
		text-align: center;
		height: 100%;
	}
	.share-btn{
		padding: 30upx 60upx;background-color:$uni-btn-color;color: $uni-text-color-inverse;
	}
	.share-pro{
	    display: flex;
	    align-items: center;
	    justify-content: flex-end;
	    flex-direction: column;
	    z-index: 5;
	    line-height: 1;
	    box-sizing: border-box;
	    .share-pro-mask{
	        width: 100%;
	        height: 100%;
	        position: fixed;
	        top: 0;
	        right: 0;
	        bottom: 0;
	        left: 0;
	        background: rgba(0, 0, 0, 0.5);
			z-index: 3;
	    }
	    .share-pro-dialog {
	        width: 750rpx;
	        height: 310rpx;
	        overflow: hidden;
	        background-color: #fff;
	        border-radius: 24rpx 24rpx 0px 0px;
	        position: relative;
	        box-sizing: border-box;
	        position: fixed;
	        bottom: 0;
			z-index: 3;
	        .close-btn {
	            padding: 20rpx 15rpx;
	            position: absolute;
	            top: 0rpx;
	            right: 29rpx;
	        }
	        .share-pro-title {
	            font-size: 28rpx;
	            color: #1c1c1c;
	            padding: 28rpx 41rpx;
	            background-color: #f7f7f7;
	        }
	
	        .share-pro-body{
	            display: flex;
	            flex-direction: row;
	            justify-content:space-around;
	            font-size: 28rpx;
	            color: #1c1c1c;
	            .share-item{
	                display: flex;
	                flex-direction:column;
	                justify-content: center;
	                justify-content:space-around;
					button{
						height: 100%;
					}
	                .share-icon{
	                    text-align:center;
	                    font-size: 70rpx;
	                    margin-top: 39rpx;
	                    margin-bottom: 16rpx;
	                    color: #42ae3c;
	                }
	                &:nth-child(2){
	                    .share-icon{
	                        color: #ff5f33;
	                    }
	                }
	            }
	        }
	    }
	
	    /* 显示或关闭内容时动画 */
	
	    .open {
	        transition: all 0.3s ease-out;
			transform: translateY(0);
	    }
	
	    .close {
	        transition: all 0.3s ease-out;
			transform: translateY(310rpx);
	    }
	
	}
	 .canvas{
	    position: fixed !important;
	    top: 0 !important;
	    left: 0 !important;
	    display: block !important;
	    width: 100% !important;
	    height: 100% !important;
	    z-index: 10;
	}
	.Recommends{
		z-index: 2;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
	}
	.list-containers{
		background: #EFD1C6;
	}
</style>
