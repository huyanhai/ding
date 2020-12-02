<template>
	<view>
		<view class="status_bar">
			<image style="width: 15px;height: 15px;position: absolute;left:6%;top: 30upx;" src='../../static/search.svg'></image>
			<input type="text" class="serchInput" placeholder="搜索银行" v-model="keyWord" />
			<button class="contact" style="width: 50upx;height: 50upx;position: absolute;right: 3%;top: 25%;padding: 0;background-color: transparent;" type="default" open-type="contact">
				<image style="width: 50upx;height: 50upx;" src="../../static/kefu.png" mode=""></image>
			</button>
			
		</view>
		<view class="">
			<scroll-view scroll-y="true" @scrolltolower="loadData">
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
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components:{
			uniLoadMore
		},
		data() {
			return {
				bankList:[],
				keyWord:'',
				pageSize:10,
				pageNum:1,
				tip:'输入关键字找到所属银行。。。',
				loadingType:'more'
			}
		},
		watch:{
			keyWord(val, oldVal){//普通的watch监听
				this.serch()
			},
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
						"bankName":keyWord,
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
			checkBank(item){
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let nowPage = pages[ pages.length - 1];  //当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				// prevPage.$vm.bankInfo = item;
				prevPage.setData({
					bankInfo:item
				})
				// uni.setStorageSync('bankInfo',JSON.stringify(item))
				setTimeout(()=>{
					uni.navigateBack({});
				},500)
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #f5f5f5;
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
