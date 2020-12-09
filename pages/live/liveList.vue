<template>
	<view class="container">
		<view v-if='allLiveList.length>0'>
			<view v-if="allLiveList.length>0" class="guess-section">
				<wfalls :list='allLiveList'></wfalls>
			</view>
		</view>
		<!-- <canvas type="2d" style="width: 300px; height:300px; background-color: black" id="myCanvas"></canvas> -->
	</view>
</template>

<script>
	import wfalls from 'components/wfalls-flow/wfalls-flow5'
	// import SVGA from "../../components/svga/svga.min.js"
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
				allLiveList: []
			};
		},
		computed: {
			...mapState(["memberInfo"]),
		},
		onReady() {
			// let parser = new SVGA.Parser()
			// let player = new SVGA.Player("#myCanvas")
			// console.log(SVGA)
			// parser.load("https://cdn.jsdelivr.net/gh/svga/SVGA-Samples@master/angel.svga", function (videoItem) {
			//   console.log(videoItem)
			//   player.setVideoItem(videoItem);
			//   player.startAnimation();
			// })
		},
		async onLoad(option) {
		},
		async onShow() {
			let data = undefined
			data = await this.$http.getLiveList({
				page:1,
				limit:10
			})
			console.log(data)
			this.allLiveList = data.data;
		},
		methods: {
		},
	};
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #f5f5f5;
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
