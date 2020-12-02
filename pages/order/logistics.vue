<template>
	<view class="block">
<!-- 		<view class="topView">
			<image class="img" src="../../static/Bank_card.png"></image>
			<view class="content">
				<view class="text1">莫次有机PWE活性美白洗面奶 优惠套装</view>
				<view class="text2">{{logistice.ShipperCode}}：{{logistice.LogisticCode}} </view>
			</view>
			<view class="text">
				待领取
			</view>
		</view>
		<view class="line"></view> -->
		<view class="wl">
			<image class="wlcard" src="../../static/wlcard.png" mode=""></image>
			<text>物流跟踪</text>
		</view>
		<view class="blocks">
			<block v-for="(item, index) in tracesData" :key="index">
				<trackNode :is-first="index===tracesData.length-1" :is-newest="index===0" :is-main-node="item.isMainNode" :node-data="item"></trackNode>
			</block>
		</view>
	</view>
</template>

<script>
	import trackNode from '../../components/etherealwheat-track/trackNode.vue'
	export default {
		components: {
		  trackNode
		},
		data() {
		    return {
				logistice:{},
		        tracesData: [
		          {
		            acceptStation: '包裹已被吴亦发同学签收', // 节点描述
		            createTime: '2019-10-24 15: 27: 16',
		            status: 'COMPLETE', // 节点状态
		            phone: '', // 电话
		            statusName: '已签收', // 节点标题
		            isMainNode: true // 是否主节点，主节点前方展示icon
		          },
		         
		          {
		            acceptStation: '包裹已到达余杭区集散中心',
		            createTime: '2019-10-24 15: 25: 54',
		            status: 'DELIVERING',
		            phone: '',
		            statusName: '运输中',
		          },
		          {
		            acceptStation: '快递员已上门取件',
		            createTime: '2019-10-24 15: 25: 17',
		            status: 'DELIVERING',
		            phone: '',
		            statusName: '已揽收',
		          },
		          {
		            acceptStation: '等待快递员上门揽件',
		            createTime: '2019-10-24 15: 25: 00',
		            status: 'WATTING_DELIVER',
		            phone: '',
		            statusName: '已发货',
		          },
		          {
		            acceptStation: '您的包裹正在打包',
		            createTime: '2019-10-24 15: 24: 00',
		            status: 'WATTING_DELIVER',
		            phone: '',
		            statusName: '待发货',
		          },
		          {
		            acceptStation: '订单支付成功，等待商家发货',
		            createTime: '2019-10-24 15: 22: 30',
		            status: 'PAYED',
		            statusName: '已支付',
		          },
		          {
		            acceptStation: '订单提交成功',
		            createTime: '2019-10-24 15: 22: 00',
		            status: 'WATTING_PAY',
		            statusName: '已下单',
		          }
		        ]
		    }
		},
		async onLoad(e) {
			if(!e.orderId){
				return;
			}
			let result = await this.$http.getLogistics(e)
			console.log('result',result)
			if (result.code == 200 && result.data) {
				this.logistice = (result.data.data || {}).data || {}
				this.tracesData = this.logistice.traces || [];
			} else { 
				this.$api.msg(result.message)
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.topView{
		display: flex;
		margin-left: 24upx;
		height: 221upx;
		align-items: center;
		.img{
			width: 136upx;
			height: 136upx;
		}
		.content{
			flex: 1;
			margin-left: 27upx;
			margin-right: 75upx;
			height: 136upx;
			.text1{
				font-size: 28upx;
				color: #333333;
			}
			.text2{
				font-size: 24upx;
				color: #999999;
			}
		}
		.text{
			width: 120upx;
			height: 136upx;
			font-size: 28upx;
			color: #1DC7AC;
		}
	}
	.line{
		height: 20upx;
		background-color: #F5F5F5;
	}
	
	.wl{
		margin-left: 24upx;
		display: flex;
		height: 106upx;
		border-bottom: 1upx solid #e5e5e5;
		align-items: center;
		text{
			margin-left: 20upx;
			font-size: 30upx;
		}
		.wlcard{
			width: 41upx;
			height: 33upx;
		}
	}
	
	.blocks{
		margin: 24upx;
		margin-top: 40upx;
	}
</style>
