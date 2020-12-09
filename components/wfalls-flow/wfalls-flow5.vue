<template>
	<view class="list-container" :style="{'background-color': background}">
		<!-- <view id="wf-list" class="list" v-for="(list,listIndex) of viewList" :key="listIndex" v-if='type=="1"'>
            
        </view> -->
		<view class="item" v-for="(item,index) of viewList" :key="index" @click="goDetail(item)">
			<view style='position: absolute;left: 7px;top: 20rpx;width: 160upx;height: 50upx;z-index: 5;background-color: rgba(0,0,0,0.4);border-radius: 25px;display: flex;align-items: center;' @click.stop="toFavorite(item)">
				<image src="../../static/liveIcon.png" style="width: 66upx;height: 54upx;margin-top: 16upx;margin-left: 8upx;"></image>
				<view style="font-size: 20upx;color: #fff;">
					直播中
				</view>
			</view>
		    <image :id="'id'+item.id" :src="item.img" mode="aspectFill" style="z-index: 1;height:460upx"></image>
		    <view class="desc ui-nowrap" style="margin:32upx 20upx 0;">{{item.title}}</view>
			<view class="ui-nowrap" style="margin:24upx 20upx 32upx;font-size:24upx;color: #999999;">
				{{item.introduce||'暂无直播间简介'}}
			</view>
			<!-- <view class='price'>￥{{item.price}}<text style="padding:16rpx;font-size:24upx">x{{item.count}}</text></view>
			<view style="width: 100%;display: flex;justify-content: space-between;" class="padding1">
				<view class="" style="font-size: 26upx;color: #999999;">
					库存:{{item.stock}}
				</view>
				<view class="flexend">
					
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
        props:{
			background:{
			    type:String, //实际请求获取的列表数据
				default:'#f5f5f5'
			},
            list:{
                type:Array, //实际请求获取的列表数据
            },
			type:{
			    type:String,
				 default:"1"//实际请求获取的列表数据
			}
        },
		data() {
			return {
                viewList:[]  ,//展示到视图的列表数据
				memberInfo:''
			}
		},
		methods: {
            async init(){
                this.viewList = this.list
				let token = uni.getStorageSync('token')
				if(token!=''){
					let memberInfo = await this.$api.getMemberInfo();
					this.memberInfo = memberInfo.data
				}
            },
			handleViewRender(){
                const index = this.viewList.reduce((total,current)=>total + current.list.length,0)
                if(index>this.list.length-1) {
                    // 加载完成触发事件并返回加载过的图片数
                    this.$emit('finishLoad',index)
                    return
                };
                const query = uni.createSelectorQuery().in(this);
                let listFlag = 0;
                query.selectAll('#wf-list').boundingClientRect(data => {
                    listFlag = data[0].bottom - data[1].bottom<0?0:1;
                    this.viewList[listFlag].list.push(this.list[index])
                }).exec()
            },
			goDetail(e){
				uni.navigateTo({
					url: `/pages/live/live?live_sn=${e.live_sn}`
				});
			},
			gift(e){
				uni.navigateTo({
					url: `/pages/product/product?id=${e.id}&gift=1&type=present`
				});
			},
			add(e){
				uni.navigateTo({
					url: `/pages/product/product?id=${e.id}&type=add`
				});
			},
			buy(e){
				uni.navigateTo({
					url: `/pages/product/product?id=${e.id}&gift=2&type=present`
				});
			},
			//收藏
			async toFavorite(item) {
				//取消收藏
				if (item.favorite) {
					let options = {
						productId: item.id,
					};
					let result = await this.$http.delProductCollection(options);
					if (result.code == 200) {
						item.favorite = false;
						console.log(item.favorite)
					} else {
						this.$api.msg(result.message);
					}
			
				} else {
					//加入收藏
					let options = {
						"productId": item.id,
					};
					let result = await this.$http.addProductCollection(options);
					if (result.code == 200) {
						item.favorite = true;
						console.log(item)
					} else {
						this.$api.msg(result.message);
					}
				}
			},
		},
        mounted() {
            this.init()
        },
		
	}
</script>

<style lang="stylus" scoped>
    .list-container
        display flex
        justify-content space-between
        align-items:flex-start
        padding 10rpx 23rpx 16rpx
        .item
            margin-bottom 18rpx
            image
                width 100%
            .desc
                margins 16rpx
                font-size 24rpx
        	.price
        		padding 16rpx 16rpx 0 16rpx
        		padding-top 0
        		font-size 35rpx
        		color #EBA542
			.dis-price
				display flex
				align-items center
				justify-content center
				padding-top 0
				font-size 24upx
				color #999
				text-decoration line-through
	.item
		// box-shadow: 0 4upx 8upx 0 rgba(0, 0, 0, 0.1), 0 6upx 8upx 0 rgba(0, 0, 0, 0.1);
		border-radius 8px
		width 342upx
		overflow hidden
		background-color white
		position relative

	.list-container
		background-color #F7F8FC
		flex-wrap wrap
	.buy
		background-color #272A30
		padding 1px 6px
		font-size 28rpx
		border-radius 5px
		color white
</style>
