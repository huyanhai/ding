<template>
	<view class="list-container">
		<view id="wf-list" class="list" v-for="(list,listIndex) of viewList" :key="listIndex">
		    <view class="item" v-for="(item,index) of list.list" :key="index" @click="goDetail(item)">
				<view style='position: absolute;right: 5px;top: 20rpx;width: 25px;height: 25rpx;z-index: 5;' @click.stop="toFavorite(item)">
					<image src="../../static/heart_selected.svg" v-if="item.favorite" style="width: 25px;height: 25px;"></image>
					<image src="../../static/heart.svg" mode="" v-if="!item.favorite" style="width: 25px;height: 25px;"></image>
				</view> 
		        <image :id="'id'+item.id"  @load="handleViewRender" @error="handleViewRender" :src="item.productPic" mode="aspectFill" style="z-index: 1;"></image>
		        <view class="desc ui-nowrap">{{item.productName}}</view>
				<view class='price'>￥{{item.productPrice}}</view>
				<view class="flexend" style="padding: 16upx;">
					<view class="">
						<!-- <image src="../../static/gift.svg" style="width: 40rpx;height: 40rpx;" class="mr10" @click.stop="gift(item)"></image> -->
						<!-- <image src="../../static/add.svg" style="width: 40rpx;height: 40rpx;" class="marginlr10" @click.stop="add(item)"></image> -->
					</view>
					<view>
						<view class="buy ml10" @click.stop="buy(item)">立即购买</view>
					</view>
				</view>
		    </view>
		</view>
	</view>
</template>

<script>
	export default {
        props:{
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
                viewList:[{list:[]},{list:[]}]  //展示到视图的列表数据
			}
		},
		methods: {
            init(){
				// console.log(this.type)
                this.viewList = [{list:[]},{list:[]}];
                this.viewList[0].list = [this.list[0]]
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
						url: `/pages/product/product?id=${e.productId}`
					});
			},
			gift(e){
					uni.navigateTo({
						url: `/pages/product/product?id=${e.productId}&gift=1&type=present`
					});
			},
			add(e){
					uni.navigateTo({
						url: `/pages/product/product?id=${e.productId}&type=add`
					});
			},
			buy(e){
					uni.navigateTo({
						url: `/pages/product/product?id=${e.productId}&gift=2&type=present`
					});
			},
				//收藏
				async toFavorite(item) {
					//取消收藏
					if (item.favorite) {
						let options = {
							productId: item.productId,
						};
						let result = await this.$http.delProductCollection(options);
						if (result.code == 200) {
							item.favorite = false;
							// this.$api.msg(result.message);
						} else {
							this.$api.msg(result.message);
						}
				
					} else {
						//加入收藏
						let options = {
							"productId": item.productId,
						};
						let result = await this.$http.addProductCollection(options);
						if (result.code == 200) {
							item.favorite = true;
							// this.$api.msg(result.message);
						} else {
							this.$api.msg(result.message);
						}
					}
				}
			},
        mounted() {
            this.init()
        }
	}
</script>

<style lang="stylus" scoped>
    .list-container
        display flex
        justify-content space-between
        align-items:flex-start
        padding 10rpx 16rpx 16rpx
        .list
            width calc(50% - 8rpx)
            display flex
            flex-direction column
            .item
                margin-bottom 18rpx
                image
                    width 100%
                .desc
                    margin 16rpx
                    font-size 28rpx
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
					font-size 28rpx
					color #E4E7ED
					text-decoration line-through
	.item
		border-radius 8px
		overflow hidden
		background-color white
		position relative

	.list-container
		background-color #F7F8FC
	.buy
		background-color #EBA542
		padding 1px 6px
		font-size 28rpx
		border-radius 5px
		color white
		
		
</style>
