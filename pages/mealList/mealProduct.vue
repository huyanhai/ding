<template>
	<view class="container">
		<view>
			<view v-if="allProductList.length>0" class="guess-section">
				<wfalls :list='allProductList'></wfalls>
			</view>
		</view>
		<!-- <view v-else class="textcenter" style="margin-top: 40%;">
			<image src="../../static/noColloection.png" style="width: 300rpx;height: 400rpx;"></image>
			<view class="mtrpx50">
				<span class="addAddress" @click="back">去逛逛</span>
			</view>
		</view> -->
		<view class="bottom">
			<view class="bottom-btn" @click="navCreateOrder">
				立即领取
			</view>
		</view>
	</view>
</template>

<script>
	import wfalls from 'components/wfalls-flow/wfalls-flow4'

	import {
		mapState,
		mapMutations
	} from 'vuex';

	export default {
		components: {
			wfalls
		},
		data() {
			return {
				allProductList: [],
				giftId:'',
				mealId:''
			};
		},
		computed: {
			...mapState(['hasLogin', 'loginStatus', "flag", "phone", "memberInfo"]),
		},

		async onLoad(option) {
			let data = JSON.parse(option.productList);
			this.giftId = option.giftId;
			this.mealId = option.mealId;
			this.allProductList = data;
			// this.allProductList = this.distinct(data)
		},
		onShow() {

		},
		methods: {
			back() {
				uni.reLaunch({
					url: '../index/index'
				})
			},
			getList() {

			},
			distinct(arr) {
				let obj = {};
				let peon = arr.reduce((cur, next) => {
					obj[next.productId] ? "" : obj[next.productId] = true && cur.push(next);
					return cur;
				}, []) //设置cur默认类型为数组，并且初始值为空的数组
				console.log(peon)
				return peon
			},
			navCreateOrder(){
				uni.navigateTo({
					url: `/pages/order/createOrder?type=3&isGiving=0&mealId=${this.mealId}&giftId=${this.giftId}&data=${JSON.stringify({
						goodsData: this.allProductList,
						quantity:this.allProductList.length,
					})}`
				})
			}
			// let arr2 = [];
			// for(let item of arr){
			// 	for (let i of arr2){
			// 		if(item.product)
			// 	}
			// }
		},
	};
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #f7f8fc;
	}

	.addAddress {
		background-color: transparent;
		border: 1px solid #EBA542;
		color: #EBA542;
		padding: 8px;
		border-radius: 16rpx;
		font-size: 16px;
	}
	.bottom{
		width: 100%;
		height: 200upx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		.bottom-btn{
			width: 90%;
			margin-left: 5%;
			height: 100upx;
			border-radius: 100upx;
			text-align: center;
			line-height: 100upx;
			background-color: #1DC7AC;
			color: #fff;
			margin-top: 50upx;
		}
	}
</style>
