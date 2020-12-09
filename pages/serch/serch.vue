<template>
	<view>
		<view>
			<view class="flexbetween">
				<view class="positionr padding1 box_col_85">
					<image style="width: 15px;height: 15px;position: absolute;left:20px;top:15px" src='../../static/search.svg'></image>
					<input type="text" class="serchInput" placeholder="输入您想搜索的商品名称" v-model="keyWord"/>
				</view>
				<view class="box_col_15 flex-between padding1 font10">
					<view style="margin-top: 10rpx;" @click="clear">
						清空
					</view>
				</view>
			</view>
			<view>
				<wfalls ref='allProduct' :list='list' v-if='list.length>0' @eventAdd="add"></wfalls>
			</view>
			<!-- <view v-if='history.length>0'>
				<view class="padding1 font12 fontB">
					搜索历史
				</view>
				<view class="flexstart">
					<view v-for="item in history" :key='item' class="padding1">
						<view class="font10 serchItem">
							{{item}}
						</view>
					</view>
				</view>
			</view> -->
		</view>
		<view v-if='noItem' class="textcenter">
			<image src="/static/noFind.png" style="width: 300rpx;height: 250rpx;margin-top: 45%"></image>
			<view style="color: #7e7e7e;" class="mt10 font10">没有搜索到该结果</view>
			<!-- <view style="color: #7e7e7e;" class="margintb10 font10">您可以留言给后台我们后续更新</view> -->
			<view class="flexcenter mt10">
				<!-- <view class="mr10 radius10 padding5 bgcolor18 fontcolor4" @click="goMessage">去留言</view> -->
				<view class="radius10 padding5 bgcolor10 color13" style="border: 1px solid black;" @click="goIndex">返回首页</view>
			</view>
		</view>
	</view>
</template>

<script>
	import wfalls from 'components/wfalls-flow/wfalls-flow3'
	export default {
		components: {
			wfalls
		},
		data() {
			return {
				history:[],
				noItem:false,
				keyWord:'',
				list:[],
				memberInfo:{}
			}
		},
		onShow() {
			let history = uni.getStorageSync('serchInfo')
			if(history){
				this.history = history
			}
		},
		async onLoad() {
			let memberInfo = await this.$api.getMemberInfo();
			this.memberInfo = memberInfo.data
		},
		watch:{
			keyWord(val, oldVal){//普通的watch监听
			this.serch()
			},
		},
		methods: {
			async add(data){
				console.log(data)
				let options = {
					skuId:data.skuId,
					quantity:1
				}
				let result = await this.$http.cartAdd(options);
				if (result.code == 200) {
					this.$api.msg('成功加入购物车');
				} else {
					this.$api.msg(result.message);
				}
			},
			goMessage(){
				this.noItem = false
				this.keyWord = ''
				uni.navigateTo({
					url:"../leaveMessage/leaveMessage"
				})
			},
			goIndex(){
				uni.reLaunch({
					url:"../index/index"
				})
			},
			back(){
				uni.reLaunch({
					url:"../index/index"
				})
			},
			clear(){
				this.keyWord = ''
				},
			async serch(){
				if(this.keyWord == ''){
					return
				}
				let option = {
					pageSize:100,
					pageNum:1,
					keyWord:this.keyWord
				}
				let data = await this.$http.getProductList(option);				
				this.list = data.data || []
				
				try{
					if(this.list.length>0){
						this.$refs.allProduct.update(this.list);
					}
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
				if(this.list.length==0){
					this.noItem = true
				}else{
					this.noItem = false
				}
			}
		}
	}
</script>

<style scoped>
.serchInput {
		padding: 10rpx 20rpx 10rpx 80rpx;
		background-color: #EEEFF0;
		border-radius: 8px;
		border: none;
		width: 100%;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
	}
.serchItem{
	background-color: #EEEFF0;
	border-radius: 2px;
	padding: 10rpx 15rpx;
	}
</style>
