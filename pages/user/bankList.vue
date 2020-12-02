<template>
	<view class="content b-t">
		<scroll-view scroll-y="true" @scrolltolower="loadData" style="height: 90vh;">
			<view class="list b-b" v-for="(item, index) in bankList" :key="index">
				<view class="wrapper" :style="background[index%3]">
					<view class="address-box">
						<view class="">
							<text :class="item.isDefault==1?'show':'hidden'" class="tag" :style="fontColor[index%3]">默认</text>
						</view>
						<text class="default" @click="setDefault(item)">
							设为默认
						</text>
					</view>
					<view class="cardNo-box">
						<text class="cardNo">{{item.cardNo}}</text>
					</view>
					<view class="u-box">
						<text class="name">{{item.legalName}}</text>
						<text class="mobile">{{item.handBankName}}</text>
					</view>
				</view>
				<!-- <text class="yticon icon-jianhao" @click.stop="del(item.id)"></text> -->
				<!-- <view class="">
					{{item.status==0?'申请中':(item.status==1?'审核成功':'审核失败')}}
				</view> -->
				<!-- <image src="/static/delete.png" style="width:40rpx;height: 40rpx;" @click.stop="del(item.id)"></image> -->
				
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
			<button class="add-btn" @click="BankDetail('add')">新增银行卡</button>
		</scroll-view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				source: 0,
				bankList:[
					// {
					// 	cardNo:'6222620590008914016',
					// 	legalName:'名字',
					// 	handBankName:'交通银行',
					// 	isDefault:1
					// }
				],
				background:[
					'background:linear-gradient(to right,#facc22,#f83600);',
					'background:linear-gradient(to right,#22dcfd,#1c91e2);',
					'background:linear-gradient(to right,#ffab96,#ff0f47);'
				],
				fontColor:[
					'color:#f83600',
					'color:#1c91e2',
					'color:#ff0f47'
				],
				loadingType:'more',
			}
		},
		onShow(){
			this.loadData('reLoad');
		},
		onLoad(options){
			if(options.source){
				this.source = options.source;
			}
		},
		methods: {
			async loadData(source) {
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
					result = await this.$http.getMyBankList(params);
							
					if (result.code != 200) {
						return false;
					}
					let bankList = result.data;
					if (this.pageNum === 1) { //下拉刷新
						this.bankList = bankList;
						uni.stopPullDownRefresh()
					} else { //加载更多
						bankList.forEach(item => {
							this.bankList.push(item);
						})
						uni.stopPullDownRefresh()
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
			async setDefault(item){
				let res = await this.$http.setDefaultBank({memberBankId:item.id});
				if(res.code==200){
					this.loadData('reLoad');
				}else{
					this.$api.msg(res.message)
				}
			},
			switchChange(item,index){
				console.log(item,index)
			},
			BankDetail(type, item){
				uni.navigateTo({
					url: `/pages/user/bankDetail?type=${type}&data=${JSON.stringify(item)}`
				})
			},
			//选择银行卡
			checkBank(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().bank = item;
					uni.navigateBack();
					return;
				}
				uni.navigateTo({
					url: `/pages/user/bankDetail?type=edit&data=${JSON.stringify(item)}`
				})
			},
			//删除银行卡
		 	async del(id) {
				 uni.showModal({
				    content: '确定要删除么?',
				    success: async(e)=>{
				        if(e.confirm){
				    		let options = {
								id:id
							};
							let result = await this.$http.delBank(options);
							if(result.code == 200){
								this.$api.msg(result.message);
								this.loadData();
							}else{
								this.$api.msg(result.message);
							}
				    		
				    	}
				    }
				});
			}
		}
	}
</script>

<style lang='scss'>
	page{
		padding-bottom: 120upx;
	}
	.content{
		position: relative;
	}
	.list{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;;
		background: #fff;
		position: relative;
	}
	.wrapper{
		width: 702upx;
		height: 220upx;
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 0 32upx;
	}
	.address-box{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 24upx;
		.tag{
			font-size: 22upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fff;
			height: 38upx;
			line-height: 38upx;
			border-radius: 38upx;
			padding:6upx 18upx;
		}
		.show{
			opacity: 255;
		}
		.hidden{
			opacity: 0;
		}
		.default{
			font-size: 22upx;
			border: 1upx solid #fff;
			padding: 0 18upx;
			height: 38upx;
			line-height: 38upx;
			border-radius: 38upx;
			color: #fff;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.cardNo-box{
		margin-top: 19upx;
		.cardNo{
			color: #fff;
			font-size: 44upx;
			font-weight: bold;
		}
	}
	.u-box{
		font-size: 24upx;
		margin-top: 19upx;
		.name{
			margin-right: 30upx;
			color: #fff;
		}
		.mobile{
			color: #fff;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
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
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 100upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color2;
		border-radius: 100upx;
		/* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		 */
	}
</style>
