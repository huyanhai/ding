<template>
	<view class="holdon">
		<view>
			<view v-show='number > 0 ' :style="'left:'+(moveX==9999?'': moveX+30)+'px;top:'+ (moveY == 9999?'':moveY) +'px'" :class="isFirst ? 'first1' : ''"  class="tip">{{number}}</view>
			<image class="ball" :style="'left:'+(moveX==9999?'': moveX)+'px;top:'+ (moveY == 9999?'':moveY) +'px'" :class="isFirst ? 'first' : ''"
			 @touchstart.stop="drag_start" @touchmove.prevent="drag_hmove" :src="image" mode="aspectFill" @click="nav" @touchend="end">
			</image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			image: {
				type: String,
				default: ''
			},
			navIndex: {
				type: String,
				default: ''
			},
			number: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				start: [0, 0],
				moveY: 9999,
				moveX: 9999,
				isFirst: true,
				old: [0, 0]
			}
		},
		onLoad() {

		},
		methods: {
			drag_start(event) {
				// console.log(event)
				this.start[0] = event.touches[0].clientX - event.target.offsetLeft;
				this.start[1] = event.touches[0].clientY - event.target.offsetTop;
				this.old[0] = this.moveX
				this.old[1] = this.moveY
			},
			drag_hmove(event) {
				// console.log(event)
				let tag = event.touches;
				this.moveX = tag[0].clientX - this.start[0];
				this.moveY = tag[0].clientY - this.start[1];
			},
			end(event) {
				// console.log(event)
				if (this.old[0] == this.moveX && this.old[1] == this.moveY) {
					uni.switchTab({
						url: '../../pages/cart/cart'
					})
				}
			},
			nav() {
				console.log(this.navIndex)
				if (this.navIndex) {
					uni.navigateTo({
						url: this.navIndex
					})
				}
			},
		}
	}
</script>

<style lang="less">
	.holdon {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.ball {
		width: 100upx;
		height: 100upx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed !important;
		z-index: 999;

	}
	.tip {
		border-radius: 50%;
		background-color: #EC7858;
		color: white;
		width: 40upx;
		height: 40upx;
		font-size: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed !important;
		z-index: 1000;
	}
	.first {
		right: 20upx !important;
		bottom: 150upx !important;
	}
	.first1 {
		right: 20upx !important;
		bottom: 210upx !important;
	}
</style>
