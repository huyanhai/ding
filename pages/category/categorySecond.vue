<template>
	<view class="content">
		<view class="serach-section">
			<view class="btn" @click="navBack">
				<uni-icons type="arrowleft" size="25"></uni-icons>
			</view>
			<view class="search">
				<uni-search-bar bgColor="#EEEFF0" :radius="40" @confirm="search" placeholder="搜索商品"></uni-search-bar>
				<view class="mask" @click="navSearch">				
				</view>
			</view>
		</view>
		<scroll-view scroll-with-animation scroll-x class="top-aside" @scroll="scroll" :scroll-left="scrollLeft" :scroll-into-view="'x'+currentId">
			<view class="" style="display: flex;" :style="cateWidth">
				<view :id="'x'+item.id" class="cate-item" v-for="item in cateList"  :class="{active: item.id === currentId}" @click="tabtap(item)">
					<image :src="ip+item.classificationIcon"></image>
					<text>{{item.classificationLabel}}</text>
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-x class="mid-aside" @scroll="scroll" :scroll-left="scrollLeft2" :scroll-into-view="'x'+currentSubId">
			<view class="" style="display: flex;padding-bottom: 20upx;" :style="cateWidth2">
				<view :id="'x'+item.id" class="cate-item" v-for="item in cateList2"  :class="{active: item.id === currentSubId}" @click="tabtap2(item)">
					<view>{{item.label}}</view>
				</view>
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<!-- <view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
				<text class="s-item">{{item.name}}</text>
				<view class="t-list">
					<view @click="navToList(titem.id)" v-if="titem.pid === item.id" class="t-item" v-for="titem in tlist" :key="titem.id">
						<image :src="titem.icon"></image>
						<text>{{titem.name}}</text>
					</view>
				</view>
			</view> -->
			<view class="floor-item" @click="navToDetailPage(item)" v-for="(item, index) in tlist">
				<view class="left">
					<image :src="ip+item.coverImg1" mode="aspectFill"></image>
				</view>
				<view class="right">
					<view class="title clamp">{{ item.title }}</view>
					<view class="des clamp">{{ item.secondTitle }}</view>
					<view class="bottom">
						<view class="price">￥{{ item.discountPrice }}</view>
						<view class="dis-price">￥{{ item.oldPrice }}</view>
						<view class="btn" @click.stop.prevent="stopPrevent">
							<view @click='minusCart(item)' type="primary" v-if="item.number>0">
								-
							</view>
							<text>{{item.number}}</text>
							<view @click='addCart(item)' type="primary">
								+
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import uniSearchBar from '@dcloudio/uni-ui/lib/uni-search-bar/uni-search-bar.vue'
	import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue' //也可使用此方式引入组件
	export default {
		components:{
			uniSearchBar,
			uniIcons
		},
		data() {
			return {
				cateList:[],
				cateWidth:0,
				cateList2:[],
				cateWidth2:0,
				sizeCalcState: false,
				tabScrollTop: 0,
				scrollLeft:0,
				scrollLeft2:0,
				scrollWidth:0,
				currentId: 1,
				currentSubId: 1,
				flist: [],
				tlist: [],
				queryType:0,
				ip:''
			}	
		},
		onLoad(option){
			this.ip = this.$ip
			this.loadData();
			console.log(option)
			if(option.id){
				setTimeout(()=>{
					this.currentId = parseInt(option.id);
					this.$http.queryCateSecond('00'+option.id).then(e=>{
						if(e.data.length!=0){
							if(e.data.length!=0){
								this.currentSubId = e.data[0].id;
								let cateList2 = e.data
								this.cateList2 = cateList2;
								this.cateWidth2 = cateList2.length >= 5 ? 'width:'+(cateList2.data.length * 20)+'%' : 'width:100%';
							}else{
								this.cateList2 = []
							}
						}
					});
					this.loadDataOne(this.currentId)
				},1000)
			}
		},
		created() {
			let _t = this;
			setTimeout(() => { //获取状态栏高度，setTimeout后才能调用uni.  
				uni.getSystemInfo({
					success: function(res) {
						_t.scrollWidth = res.windowWidth;
					}
				});
			}, 1);
		},
		methods: {
			async loadData(){
				let list = await this.$http.queryCateTopList();
				this.cateList = list.data;
				this.cateWidth = list.data.length >= 5 ? 'width:'+(list.data.length * 20)+'%' : 'width:100%'
				// let cateList2 = await this.$http.queryCateSecondList()
				// this.cateList2 = cateList2.data;
				// this.cateWidth2 = cateList2.data.length >= 5 ? 'width:'+(cateList2.data.length * 20)+'%' : 'width:100%';
				this.loadDataOne(this.currentId)
			},
			async loadDataOne(id){
				this.queryType = 0;
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let res = await this.$http.queryCateSecondByOne(id)
				let tlist = res.data
				let res2 = await this.$http.getCartList(userInfo.userId)
				let cartlist = res2.data;
				tlist.forEach(t=>{
					cartlist.forEach(c=>{
						console.log(t,c)
						if(t.goodsId==c.goodsId){
							t.cartId = c.id;
							t.number = c.number;
						}
					})
				})
				this.tlist = tlist;
			},
			async loadDataTwo(id){
				this.queryType = 1;
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'))
				let res = await this.$http.queryCateSecondByTwo(id)
				let tlist = res.data
				let res2 = await this.$http.getCartList(userInfo.userId)
				let cartlist = res2.data;
				tlist.forEach(t=>{
					cartlist.forEach(c=>{
						console.log(t,c)
						if(t.goodsId==c.goodsId){
							t.cartId = c.id;
							t.number = c.number;
						}
					})
				})
				this.tlist = tlist;
			},
			//一级分类点击
			tabtap(item){
				this.currentId = item.id;
				let list = this.$http.queryCateSecond(item.classificationValue).then(e=>{
					console.log(e.data.length)
					if(e.data.length!=0){
						this.currentSubId = e.data[0].id;
						let cateList2 = e.data
						this.cateList2 = cateList2;
						this.cateWidth2 = cateList2.length >= 5 ? 'width:'+(cateList2.data.length * 20)+'%' : 'width:100%';
					}else{
						this.cateList2 = []
					}
				});
				this.loadDataOne(item.id)
			},
			tabtap2(item){
				this.currentId = parseInt(item.classificationValue);
				this.currentSubId = item.id;
				this.loadDataTwo(item.id)
			},
			// tab2Tap(item){
			// 	this.currentQueryId = item.queryId;
			// 	this.currentId = item.id;
			// },
			//右侧栏滚动
			asideScroll(e){
				// if(!this.sizeCalcState){
				// 	this.calcSize();
				// }
				let scrollTop = e.detail.scrollTop;
				// let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				// if(tabs.length > 0){
				// 	this.currentId = tabs[0].pid;
				// }
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(id){
				console.log(id,'分类ID');
				uni.navigateTo({
					url: `/pages/product/list?source=2&id=${id}`
				})
			},
			scroll(e){
				// console.log(e.detail)
			},
			navToDetailPage(item) {
				uni.navigateTo({
					url: `/pages/product/product?id=${item.goodsId}`
				})
			},
			navBack(){
				uni.navigateBack({
					
				})
			},
			navSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
			addCart(item){
				if(item.stock<=0){
					this.$api.msg('该商品没有库存了')
					return;
				}
				console.log(item,item.number==true)
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				if(item.number!=undefined){
					this.$http.cartIncr(item.cartId).then(res=>{
						this.$api.msg(res.message)
						if(res.code==0){
							if(this.queryType==0){
								this.loadDataOne(this.currentId)
							}else{
								this.loadDataTwo(this.currentSubId)
							}
						}
					})
				}else {
					let option = {
						goodsCar:'1',
						goodsId:item.goodsId,
						number:1,
						openid:userInfo.openId,
						telPhone:'1',
						userId:userInfo.userId
					}
					this.$http.cartAdd(option).then(res=>{
						console.log(res)
						this.$api.msg(res.message)
						if(res.code==0){
							if(this.queryType==0){
								this.loadDataOne(this.currentId)
							}else{
								this.loadDataTwo(this.currentSubId)
							}
						}
					})
				}			
			},
			minusCart(item){
				console.log(item,item.number>1)
				if(item.number>1){
					this.$http.cartDect(item.cartId).then(res=>{
						this.$api.msg(res.message)
						if(res.code==0){
							if(this.queryType==0){
								this.loadDataOne(this.currentId)
							}else{
								this.loadDataTwo(this.currentSubId)
							}
						}
					})
				}else {
					this.$http.cartDelete(item.cartId).then(res=>{
						this.$api.msg(res.message)
						if(res.code==0){
							if(this.queryType==0){
								this.loadDataOne(this.currentId)
							}else{
								this.loadDataTwo(this.currentSubId)
							}
						}
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		/* height: 100%; */
		background-color: #f8f8f8;
	}
	.serach-section{
		background-color: #fff;
		width: 100%;
		height: 150upx;
		display: flex;
		.btn{	
			width: 10%;
			margin-top: 75upx;
		}
		.search {
			margin-top: 80upx;
			width: 55%;
			height: 80upx;
			position: relative;
			.mask {
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
	.serach-section::before {
	   display: table;
	   content: "";
	}
	%flex-center {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}
	.content {
		/* display: flex; */
		/* background: #fff; */
	}
	.top-aside {
		/* flex-shrink: 0; */
		display: flex;
		/* justify-content: space-around; */
		width: 100%;
		height: 200upx;
		background-color: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			width: 20%;
			margin: 30upx 20upx 0;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			image {
				width: 88upx;
				height: 88upx;
				margin-bottom: 14upx;
				border-radius: 100%;
				/* opacity: 0.7; */
				/* box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3); */
			}
		}
		.active{
			image {
				border: 4upx solid $base-color;
			}
		}
	}
	.mid-aside {
		/* flex-shrink: 0; */
		display: flex;
		/* justify-content: space-around; */
		width: 100%;
		/* height: 100upx; */
		background-color: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			width: 20%;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
			margin: 0 20upx 0;
			view {
				background: #F7F7F7;
				width: 150upx;
				height: 50upx;
				border-radius: 50upx;
				text-align: center;
				line-height: 50upx;
			}
		}
		.active{
			view {
				background: #EEF8E3;
				border: 2upx solid $base-color;
				color: $base-color;
			}
		}
	}
	.right-aside{
		flex: 1;
		overflow: hidden;
		/* padding-left: 20upx; */
		/* margin: 0 20upx; */
	}
	.floor-item {
		width: 100%;
		font-size: $font-sm + 2upx;
		color: $font-color-dark;
		line-height: 1.8;
		height: 250upx;
		background: #fff;
		margin-top: 20upx;
		@extend %flex-center;
		.left{
			/* flex: 4.5; */
			width: 35%;
			/* margin: ; */
			@extend %flex-center;
			image {
				width: 160upx;
				height: 160upx;
				border-radius: 20upx;
			}
		}
		.right{
			/* flex: 5.5; */
			width: 65%;
			.title{
				width: 90%;
				font-size: 32upx;
			}
			.des{
				color: #AFB0B0;
				width: 50%;
			}
			.bottom{
				@extend %flex-center;
				.price {
					flex: 3;
					color: $uni-color-primary;
					font-size: 40upx;
				}
				.dis-price {
					flex: 3;
					margin-left: 5upx;
					color: $uni-color-primary;
					text-decoration: line-through;
					color: #AFB0B0;
				}
				.btn{
					flex: 4;
					@extend %flex-center;
					view{
						width: 50upx;
						height: 50upx;
						border-radius: 100%;
						background: #9ECF57;
						text-align: center;
						line-height: 45upx;
						color: #fff;
						font-size:35upx;
						font-weight: 600;
					}
					
				}
			}
		}
	}
</style>
