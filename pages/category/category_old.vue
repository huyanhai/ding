<template>
	<view>
		<view class="status_bar">
			<image style="width: 15px;height: 15px;position: absolute;left:6%;top: 30upx;" src='../../static/search.svg'></image>
			<input type="text" class="serchInput" placeholder="搜索商品" v-model="keyWord" />
			<button class="contact" style="width: 50upx;height: 50upx;position: absolute;right: 3%;top: 25%;padding: 0;background-color: transparent;" type="default" open-type="contact">
				<image style="width: 50upx;height: 50upx;" src="../../static/kefu.png" mode=""></image>
			</button>
			
		</view>
		<scroll-view scroll-x class="top-aside" scroll-with-animation :scroll-into-view="'main-'+currentId">
			<view class="top-aside-container">
				<view :id="'main-'+item.id" v-for="item in flist" :key="item.id" class="top-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item)">
					<text>{{item.name}}</text>
				</view>
			</view>
		</scroll-view>
		<view class="list" @click="toggleMask">
			<image src="../../static/list.svg" mode=""></image>
		</view>
		<view class="content">
			<scroll-view scroll-y class="left-aside" scroll-with-animation :scroll-into-view="'main-'+currentSecondId">
				<view :id="'main-'+hotItem.id" class="f-item b-b" :class="{active: hotItem.id === currentSecondId}" @click="tabtap2(hotItem)">
					<image style="width: 40upx;height: 40upx;" src="../../static/fire.svg" mode=""></image>
					{{hotItem.name}}
				</view>
				<view :id="'main-'+item.id" v-for="item in slist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentSecondId}" @click="tabtap2(item)">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view show-scrollbar="false" scroll-with-animation scroll-y class="right-aside" :scroll-top="scrollTop" @scroll="onScroll" :scroll-into-view="'main-'+currentId" @scrolltolower="loadProductData">
				<view class="p-list" :class="showCategory?'show':'hide'">
					<view  class="p-item" v-for="item in plist" @click="goDetail(item)">
						<view class="p-img">
							<image :src="item.pic"></image>
						</view>
						<view class="p-content">
							<view class="p-name ui-nowrap">
								{{item.name}}{{ item.attr||''}}
							</view>
							<view class="p-price">
								<view class='price'>￥{{item.price}}</view>
								<view class="dis-price" v-if="item.originalPrice&&item.originalPrice!=0">
									￥{{item.originalPrice}}
								</view>
							</view>
						<!-- 	<view class="p-sale ui-nowrap">
								销量:{{item.sale}}
							</view> -->
						</view>
						<view class="p-button">
							<image :id="'add-'+item.id" src="../../static/addCart.png" style="width: 65rpx;height: 60rpx;margin-top: 90upx;" class="marginlr10" @click.stop="add(item)"></image>
						</view>
					</view>
					<uni-load-more :status="loadingType"></uni-load-more>
				</view>
			</scroll-view>
		</view>
		<darke-cartsBall ref="cartsBall"
		    :ballImage="'url('+require('@/static/repay.png')+')'" 
		    :duration="ballTimer" 
		    :endPos="endPos"
		    :is3dSheet="true"
		    zIndex="9999"
		    ballColor="red"
		>
		</darke-cartsBall>
		<view v-if="show" @click="toggleMask" class="mask" @touchmove.stop.prevent="touchmoveStop"
			:style="{backgroundColor: backgroundColor}"
		>
			<view 
				class="mask-contents"
				@click.stop.prevent="touchmoveStop"
				:style="[{
					transform: transform
				}]"
			>
				<view class="cate-title">
					全部分类
				</view>
				<view class="icon" @click="toggleMask">
					<image src="../../static/close.svg" mode=""></image>
				</view>
				<view class="cate-content">
					<view class="cate-item" v-for="item in flist" :class="{active: item.id === currentId}" @click="tabtap3(item)">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import darkeCartsBall from '@/components/darke-cartsBall/darke-cartsBall.vue'
	export default {
		comments:{
			darkeCartsBall
		},
		data() {
			return {
				sizeCalcState: false,
				scrollTop:0,
				old: {
					scrollTop: 0
				},
				tabScrollTop: 0,
				currentId: 1,
				currentSecondId: 0,
				flist: [],
				slist: [],
				tlist: [],
				plist: [],
				pageNum: 1,
				loadingType:'more',
				keyWord:'',
				show:false,
				transform:'',
				backgroundColor:'',
				config:'',
				memberInfo:'',
				hotItem:{
					id:0,
					name:'热卖'
				},
				endPos:{x:0,y:0},
				ballTimer:800,
				showCategory:false
			}
		},
		async onLoad(){
			var _this = this;
			// 获取手机状态栏高度
			uni.getSystemInfo({
				success: function(data) {
					// 将其赋值给this
					console.log(data)
					_this.endPos = {x:data.windowWidth*0.6,y:data.windowHeight}
				},
				fail:function(res){
					console.log(res)
				}
			})
			const height = uni.upx2px(this.contentHeight) + 'px';
			this.config = {
				height: height,
				transform: `translateY(${height})`,
				backgroundColor: 'rgba(0,0,0,.4)',
			}
			this.transform = this.config.transform;
			let token = uni.getStorageSync("token")
			if(token!=''){
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data;
			}
			if(uni.getStorageSync('cateid')==''){
				await this.loadData();
				this.loadProductData('reLoad')
			}
		},
		async onShow() {
			if(uni.getStorageSync('cateid')&&this.flist.length>0){
				let item = {id:uni.getStorageSync('cateid')}
				this.tabtap(item)
				uni.setStorageSync('cateid','')
			}else if(uni.getStorageSync('cateid')){
				await this.loadData();
				let item = {id:uni.getStorageSync('cateid')}
				this.tabtap(item)
				uni.setStorageSync('cateid','')
			}
		},
		watch:{
			keyWord(val, oldVal){//普通的watch监听
				this.serch()
			},
		},
		methods: {
			touchmoveStop(){
				
			},
			end(event){
				console.log(event)
				
			},
			async add(e){
				let options = {
					skuId:e.skuId,
					quantity:1
				}
				let result = await this.$http.cartAdd(options);
				if (result.code == 200) {
					let view = uni.createSelectorQuery().select('#add-'+e.id);
					view.fields({
						rect: true,
					}, data => {
						// console.log(data)
						this.ballTimer = (this.endPos.y/data.top)*200
						this.$refs.cartsBall.drop({
						    x: data.left, y:data.top
						})
					}).exec();
					let res = await this.$http.getCartList();
					if (res.code == 200) {
						let number = 0
						let list = res.data
						for(let item of list){
							number+=item.quantity
						}
						if(number>0){
							uni.setTabBarBadge({
								index:2,
								text:number.toString(),
							})
						}
					} else {
						this.$api.msg(res.message)
					}
				} else {
					this.$api.msg(result.message);
				}
				
			},
			onScroll(e){
				// console.log(e)
				// console.log(e.detail.scrollTop)
				this.old.scrollTop = e.detail.scrollTop
			},
			async loadProductData(source){
				if (this.loadingType === 'loading') {
					//防止重复加载
					return;
				}
				if (source === 'reLoad') {
					//tab切换只有第一次需要加载数据
					this.pageNum = 1
					this.showCategory = false;
				}
				this.loadingType = 'loading';
				// uni.showLoading({
				// 	title:'加载中'
				// })
				setTimeout(async () => {
					let option = {
						pageSize:10,
						pageNum:this.pageNum
					}
					let result;
					if(this.currentSecondId==0){
						option.categoryId = this.currentId
						// console.log('option',option);
						result = await this.$http.getHotProductList(option);
					}else{
						option.categoryId = this.currentSecondId
						// console.log('option',option);
						result = await this.$http.getProductList(option);
					}
					//console.log('result',result);
					// uni.hideLoading()
					if (result.code != 200) {
						return false;
					}
					let plist = result.data;
					if (this.pageNum === 1) { //下拉刷新
						this.plist = [];
						this.plist = plist;
						this.scrollTop = this.old.scrollTop
						this.$nextTick(function() {
							this.scrollTop = 0
						});
						uni.stopPullDownRefresh();
					} else { //加载更多
						plist.forEach(item => {
							this.plist.push(item);
						})
					}
					this.showCategory = true;
					this.pageNum = this.pageNum + 1;
					if (result.data.length > 0) {
						//判断是否还有数据， 有改为 more， 没有改为noMore 
						this.loadingType = 'more';
					} else {
						this.loadingType = 'noMore';
						if(this.loadingType == 'noMore'&&source!='reLoad'){
							let id;
							if(this.currentSecondId==0){
								id = this.slist[0].id
							}else{
								let index = this.slist.findIndex(sitem=>sitem.id === this.currentSecondId);
								if(index<this.slist.length-1){
									id = this.slist[index+1].id
								}else{
									id = 0
								}
							}
							this.tabtap2({id:id})
							return;
						}
					}
				}, 600);
			},
			async loadData(){
				let list = await this.$http.productCateList();
				if(list.code===200){
					let cagList = list.data || [];
					this.flist = cagList
					this.slist = this.flist[0].children
					this.currentSecondId = 0
					this.currentId = this.flist[0].id
				}else{
					console.log("ErrProductCateList",list);
				}
				
			},
			//一级分类点击
			async tabtap(item){
				this.currentId = item.id;
				let index = this.flist.findIndex(sitem=>sitem.id === item.id);
				this.pageNum = 1;
				this.slist = this.flist[index].children||[]
				this.currentSecondId = 0
				this.loadProductData('reLoad')
			},
			//一级分类点击
			async tabtap3(item){
				this.currentId = item.id;
				let index = this.flist.findIndex(sitem=>sitem.id === item.id);
				this.pageNum = 1
				this.slist = this.flist[index].children||[]
				this.currentSecondId = 0
				this.loadProductData('reLoad')
				setTimeout(()=>{
					this.toggleMask()
				},1000)
			},
			//二级分类点击
			async tabtap2(item){
				this.pageNum = 1;
				this.currentSecondId = item.id;
				this.loadProductData('reLoad')
			},
			async serch(){
				if(this.keyWord == ''){
					return
				}
				let option = {
					pageSize:100,
					pageNum:1,
					keyWord:this.keyWord
				}
				let data = await this.$http.getProductList(option);
				this.plist = data.data
			},
			//右侧栏滚动
			asideScroll(e){
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let scrollHeight = 0;
				let h = 0;
				let view = uni.createSelectorQuery().select('.left-aside');
				view.fields({
					size: true,
				}, data => {
					console.log(data)
					h = -data.height
				}).exec();
				this.flist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					console.log(view)
					view.fields({
						size: true,
					}, data => {
						item.top = h>0?h:0;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			goDetail(e){
				console.log(e)
				uni.navigateTo({
					url: `/pages/product/product?id=${e.id}&attr=${e.attr}`
				});
			},
			toggleMask(){
				//防止高频点击
				if(this.timer == 1){
					return;
				}
				this.timer = 1;
				setTimeout(()=>{
					this.timer = 0;
				}, 500)
				
				if(this.show){
					this.transform = this.config.transform;
					this.backgroundColor = 'rgba(0,0,0,0)';
					this.show = false;
					return;
				}
				
				this.show = true;
				//等待mask重绘完成执行
				setTimeout(()=>{
					this.backgroundColor = this.config.backgroundColor;
					this.transform = 'translateY(0px)';
				}, 10)
			},
		}
	}
</script>

<style lang='scss'>
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
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
		margin-top: 1vh;
		height: 83vh;
	}
	.list{
		background-color: #fff;
		height: 8vh;
		width: 100upx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		right: 0;
		top: 8vh;
		image{
			width: 60upx;
			height: 60upx;
		}
	}
	.top-aside {
		width: 650upx;
		height: 8vh;
		background-color: #fff;
		position: relative;
		.top-aside-container{
			display: flex;
			flex-direction : row;
			flex-wrap: nowrap;
			height: 80upx;
			line-height: 80upx;
		}
		.top-item {
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			width: 22%;
			height: 80upx;
			line-height: 80upx;
			font-size: 28upx;
			color: #000;
			text {
				height: 80upx;
			}
			&.active{
				text {
					color: $base-color2;
					border-bottom: 6upx solid $base-color2;
				}
			}
		}
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		
		background: #f8f8f8;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color2;
			background-color: #fff;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: $base-color2;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		height: 100%;
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
		background-color: #fff;
	}
	/* 显示或关闭内容时动画 */
	.show {animation:show 0.3s linear both;}
	@keyframes show {0% {opacity:0;}100% {opacity:1;}}
	.hide {animation:hide 0.3s linear both;}  
	@keyframes hide {0% {opacity:1;}100% {opacity:0;}}
	.p-list{
		.p-item {
			margin-top: 1upx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
			height: 200upx;
			.p-img {
				width: 35%;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 150upx;
					height: 150upx;
					border-radius: 10upx;
				}
			}
			.p-content {
				width: 52%;
				.p-name {
					color: #000;
					height: 60upx;
					line-height: 60upx;
					font-size: 32upx;
					font-weight: bold;
				}
				.p-sale{
					color: #999;
					height: 30upx;
					line-height: 30upx;
					font-size: 24upx;
				}
				.p-sku {
					font-size: 28upx;
				}
				.p-price {
					display: flex;
					flex-direction: row;
					line-height: 60upx;
					.price{
						color: #ff464e;
						height: 60upx;
						font-size: 35upx;
						font-weight: bold;
					}
					.dis-price{
						margin-left: 16upx;
						color: #999999;
						height: 60upx;
						font-size: 24upx;
						text-decoration: line-through;
					}
				}
			}
			.p-button {
				width: 18%;
			}
		}
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color: $font-color-dark;
		background-color: white;
		padding-left: 10px;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		width: 100%;
		height: 100vh;
		margin-top: 100upx;
		justify-content: center;
		align-items: flex-start;
		z-index: 998;
		transition: .3s;
		.mask-contents{
			width: 100%;
			transition: .3s;
			background: #fff;
			.cate-title{
				margin-left: 40upx;
			}
			.icon{
				position: absolute;
				right: 40upx;
				top: 20upx;
				image{
					width: 40upx;
					height: 40upx;
				}
			}
			.cate-content{
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				flex-wrap: wrap;
				margin: 30upx;
				.cate-item{
					margin: 0 15upx;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 28%;
					font-size: $font-base;
					height: 60upx;
					border-radius: 60upx;
					border: 1upx solid #C0C4CC;
					color: #909399;
					margin-bottom: 30upx;
				}
				.active {
					border: 1upx solid $base-color2;
					color: $base-color2;
				}
			}
		}
	}
</style>
