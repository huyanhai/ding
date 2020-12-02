<template>
	<view class="container">
		<view v-if='allProductList.length>0'>
			<view v-if="allProductList.length>0" class="guess-section">
				<wfalls :list='allProductList'></wfalls>
			</view>
		</view>
		<view v-else class="textcenter" style="margin-top: 40%;">
			<image src="../../static/noColloection.png" style="width: 300rpx;height: 400rpx;"></image>
			<view class="textcenter font10 fontcolor16" v-if='type == 1'>
				您的收藏夹里还什么都没有哦
			</view>
			<view class="textcenter font10 fontcolor16" v-else>
				您还没有浏览过商品哦
			</view>
			<view class="mtrpx50">
				<span class="addAddress" @click="back">去逛逛</span>
			</view>
		</view>
	</view>
</template>

<script>
	import wfalls from 'components/wfalls-flow/wfalls-flow2'

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
				type: 2,
				allProductList: []
			};
		},
		computed: {
			...mapState(['hasLogin', 'loginStatus', "flag", "phone", "memberInfo"]),
		},

		async onLoad(option) {
			this.type = option.type
			console.log(this.memberInfo)
			let data = undefined
			if (this.type == 1) {
				data = await this.$http.memberCollectionListProduct({
					id: this.memberInfo.memberId
				})
				for (let item of data.data) {
					item.favorite = true
				}
			} else {
				let favorite = await this.$http.memberCollectionListProduct({
					id: this.memberInfo.memberId
				})

				data = await this.$http.readHistoryList({
					memberId: this.memberInfo.memberId
				});

				for (let item of data.data) {
					for (let i of favorite.data) {
						if (i.productId == item.productId) {
							item.favorite = true
						} else {
							item.favorite = false
						}
					}
				}
			}
			// this.allProductList = data.data;
			this.allProductList = this.distinct(data.data)
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
</style>
