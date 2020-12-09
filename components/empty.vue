<template>

	<view class="empty-content">
		<image class="empty-content-image" :src="setSrc"></image>
		<view class="font10 mt10 fontcolor16">您还没有相关订单</view>
		<view class="mtrpx20 goIndex" @click="goIndex">
			去逛逛
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: 'empty'
			},
		},

		data() {
			return {
				typeSrc: {
					empty: '/static/noorder.png'
				},
			}
		},

		computed: {
			setSrc() {
				return this.typeSrc[this.src];
			},
		},
		methods:{
			goIndex(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
				}
		}
	}
</script>

<style lang="scss">
	.empty-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: $page-color-base;
		padding-bottom: 120upx;

		&-image {
			width: 120px;
			height: 200upx;
		}
	}
	.goIndex{
		border: 1px solid #CD0000;
		color: #CD0000;
		border-radius: 8px;
		padding: 10rpx 30rpx;
		}
</style>
