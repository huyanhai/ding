<template>
	<view v-if="show" class="mask" @click="toggleMask" @touchmove.stop.prevent="stopPrevent"
		:style="{backgroundColor: backgroundColor}"
	>
		<view 
			class="mask-contents"
			@click.stop.prevent="stopPrevent"
			:style="[{
				transform: transform
			}]"
		>
			<view class="share-header">
				分享 
			</view>
				<view class="share-list">
					<button 
						open-type="share"
						 :key="index"
						class="share-item" 
					>
						<image src="../static/share_wechat.png" mode=""></image>
						<text>微信好友</text>
					</button>
					<button
						@click="createCanvasImageEvn()"
						 :key="index"
						class="share-item" 
					>
						<image src="../static/share_moment.png" mode=""></image>
						<text>朋友圈</text>
					</button>
				</view>
			</view>
			<view class="bottom b-t" @click="toggleMask">取消</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				transform: 'translateY(50vh)',
				timer: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				show: false,
				config: {},
				leaderId:null,
				posterShow: false,
			};
		},
		props:{
			contentHeight:{
				type: Number,
				default: 0
			},
			//是否是tabbar页面
			hasTabbar:{
				type: Boolean,
				default: false
			},
			shareList:{
				type: Array,
				default: function(){
					return [];
				}
			},
			shareItem:{
				type: Object,
				default: function(){
					return {};
				}
			},
			productData:{
				type: Object,
				default: function(){
					return {};
				}
			}
		},
		created() {
			const height = uni.upx2px(this.contentHeight) + 'px';
			this.config = {
				height: height,
				transform: `translateY(${height})`,
				backgroundColor: 'rgba(0,0,0,.4)',
			}
			this.transform = this.config.transform;
		},
		methods:{
			closePost() {
				this.posterShow = false;
			},
			openPost() {
				console.log(this.productData)
				let postData = {
					bg:{url: this.productData.pic,sLeft: 0,sTop: 0,sWidth: 1,sHeight: 0.8},
					scan:{ url: '/static/scan.jpg', sLeft: 0.66, sTop: 0.82, sWidth: 0.3, sHeight: 0.15},
					title:{ text: this.productData.name, sLeft: 0.04, sTop: 0.86, fontSize: 15, color: '#000' },
					price:{ text: this.productData.price, sLeft: 0.04, sTop: 0.95, fontSize: 15, color: '#DD524D' }
				};
				uni.showLoading({
					title: '绘制ing...',
					mask: true
				});
				this.posterShow = true;
				setTimeout(() => {
					console.log(this.$refs.poster);
					this.$refs.poster.drawPoster(postData); //在组件内drawPoster()函数编写需要绘制的内容
				}, 10);
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
					setTimeout(()=>{
						this.show = false;
						this.hasTabbar && uni.showTabBar();
					}, 200)
					return;
				}
				
				this.show = true;
				//等待mask重绘完成执行
				if(this.hasTabbar){
					uni.hideTabBar({
						success: () => {
							setTimeout(()=>{
								this.backgroundColor = this.config.backgroundColor;
								this.transform = 'translateY(0px)';
							}, 10)
						}
					});
				}else{
					setTimeout(()=>{
						this.backgroundColor = this.config.backgroundColor;
						this.transform = 'translateY(0px)';
					}, 10)
				}
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
			//分享操作
			shareToFriend(type){
				// this.$api.msg(`分享到${type}`);
				if(type===1){
					console.log(type)
					uni.share({
					    provider: 'weixin',
					    scene: "WXSceneSession",
					    type: 5,
					    imageUrl: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/app/share-logo@3.png',
					    title: '欢迎体验uniapp',
					    miniProgram: {
					        id: 'gh_abcdefg',
					        path: 'pages/index/index',
					        type: 1,
					        webUrl: 'http://uniapp.dcloud.io'
					    },
					    success: ret => {
					        console.log(JSON.stringify(ret));
					    }
					});
				}
				this.toggleMask();
			},
			//分享
			onShareAppMessage() {
				console.log(this.shareItem)
				return {
					"title": "丁老表",
					"path": "/pages/index/index?_q=" + this.memberInfo.memberId,
					"imageUrl": "http://qn.zuizhezhi.com/1594190557521f313a4af1128d9c4315d4f36424d2a.png"
				};
			
			},
			createCanvasImageEvn(){
			    Object.assign(this.posterData,
			    {
			        url:'https://img0.zuipin.cn/mp_zuipin/poster/hch-pro.jpg',//商品主图
			        icon:'https://img0.zuipin.cn/mp_zuipin/poster/hch-hyj.png',//会员价图标
			        title:"诗酒茶系列 武夷大红袍 2018年 花香型中火 一级 体验装 16g",//标题
			        discountPrice:"250.00",//折后价格
			        orignPrice:"300.00",//原价
			        code:'https://img0.zuipin.cn/mp_zuipin/poster/hch-code.png',//小程序码
			        closeUrl: "https://img0.zuipin.cn/mp_zuipin/poster/close_btn.png" //关闭按钮
			    })
				this.$forceUpdate();//强制渲染数据
				setTimeout(()=>{
					this.canvasFlag=false;//显示canvas海报
					this.deliveryFlag = false;//关闭分享弹窗
					this.$refs.hchPoster.createCanvasImage();//调用子组件的方法
				},500)
			},
		}
	}
</script>

<style lang='scss'>
	.mask{
		position:fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display:flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 9999;
		transition: .3s;
		.bottom{
			position:absolute;
			left: 0;
			bottom: 0;
			display:flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 90upx;
			background: #fff;
			z-index: 9;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
		}
	}
	
	.mask-contents{
		width: 100%;
		height: 400upx;
		transition: .3s;
		background: #fff;
		&.has-bottom{
			padding-bottom: 90upx;
		}
		.view-content{
			height: 100%;
		}
	}
	.share-header{
		height: 110upx;
		font-size: $font-base+2upx;
		color: #000;
		display:flex;
		/* align-items:center; */
		justify-content: center;
		padding: 20upx 0;
		line-height: 60upx;
		font-size: 35upx;
		font-weight: 600;
		/* &:before, &:after{
			content: '';
			width: 240upx;
			heighg: 0;
			border-top: 1px solid $border-color-base;
			transform: scaleY(.5);
			margin-right: 30upx;
		} */
		 &:after{
			 margin-left: 30upx;
			 margin-right: 0;
		 }
	}
	.share-list{
		margin: 0 100upx;
		display:flex;
		flex-wrap: wrap;
		height: 180upx;
		justify-content: center;
		align-items: center;
	}
	.share-item{
		min-width: 33.33%;
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 200upx;
		background-color: #fff;
		margin: 0;
		padding: 0;
		border: none;
		image{
			width: 100upx;
			height: 100upx;
			/* margin-bottom: 16upx; */
		}
		text{
			font-size: $font-base;
			color: $font-color-base;
			position: static;
		}
	}
	button::after{
		border: none;
	}
</style>
