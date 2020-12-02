<template>
	<view class="list-container" :style="{'background-color': background}">
		<!-- <view id="wf-list" class="list" v-for="(list,listIndex) of viewList" :key="listIndex" v-if='type=="1"'>
            
        </view> -->
		<view class="item" v-for="(item,index) of viewList" :key="index">
			<!-- <view style='position: absolute;right: 5px;top: 20rpx;width: 25px;height: 25px;z-index: 5;' @click.stop="toFavorite(item)">
				<image src="../../static/heart_selected.svg" v-if="item.favorite" style="width: 25px;height: 25px;"></image>
				<image src="../../static/heart.svg" mode="" v-if="!item.favorite" style="width: 25px;height: 25px;"></image>
			</view> -->
			<view class="yticon icon-xuanzhong2 checkbox ml10" :class="{checked: item.checked}" @click="check(item,index)"></view>
		    <image :id="'id'+item.id" :src="item.pic" mode="aspectFill" style="z-index: 1;height:200upx"></image>
		    <view class="item-right">
		    	<view class="desc ui-nowrap" style="margin-left:16upx">{{item.name}} {{item.attr||''}}</view>
		    	<view style="display: flex;">
		    		<view class='price'>￥{{item.price}}</view>
		    		<view class="dis-price" v-if="item.originalPrice&&item.originalPrice!=0">
		    			￥{{item.originalPrice}}
		    		</view>
		    	</view>
		    	<view style="display: flex;padding: 16upx;">
		    		<!-- <view class="ui-nowrap" style="font-size: 24upx;color: #999999;">
		    			销量:{{item.sale}}
		    		</view> -->
		    		<view class="ui-nowrap" style="font-size: 24upx;color: #999999;margin-left: 20upx;">
		    			库存:{{item.stock}}
		    		</view>
		    	</view>
		    </view>
			<!-- <view class="flexend" style="padding: 16upx;">
				<view class="">
				</view>
				<view>
					<view class="buy ml10" @click.stop="buy(item)">立即添加</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import darkeCartsBall from '@/components/darke-cartsBall/darke-cartsBall.vue'
	export default {
		components:{
			darkeCartsBall
		},
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
				memberInfo:'',
				endPos:''
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
			check(item,index){
				item.checked = !item.checked
				this.$emit('eventChecked', index);
			},
			update(list){
				this.viewList = list
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
					url: `/pages/product/product?id=${e.id}`
				});
			},
			gift(e){
				uni.navigateTo({
					url: `/pages/product/product?id=${e.id}&gift=1&type=present`
				});
			},
			add(e){
				// uni.navigateTo({
				// 	url: `/pages/product/product?id=${e.id}&type=add`
				// });
				
				let view = uni.createSelectorQuery().in(this).select('#add-'+e.id);
				view.fields({
					rect: true,
				}, data => {
					// console.log(data);
					data.skuId = e.skuId;
					this.$emit('eventAdd', data);
				}).exec();
			},
			buy(e){
				uni.setStorageSync('tempProduct',JSON.stringify(e))
				uni.navigateBack({
					
				})
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
						// console.log(item)
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
        padding 10rpx 24rpx 16rpx
        .item
            margin-bottom 24rpx
            image
                width 200rpx
            .desc
                margin-bottom 16rpx
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
				font-size 24upx
				color #999
				text-decoration line-through
			.checkbox
				margin 0 20rpx
				z-index 8
				font-size 44rpx
				line-height 1
				padding 4rpx
				color #C0C4CC
				background #fff
			.checkbox.checked
				color #1DC7AC
					
	.item
		// box-shadow: 0 6upx 8upx 0 rgba(0, 0, 0, 0.1), 0 6upx 8upx 0 rgba(0, 0, 0, 0.1);
		border-radius 8px
		width 100%
		height 240rpx
		overflow hidden
		background-color white
		position relative
		display flex
		align-items center
	.item-right
	    width 55%
	.list-container
		background-color #F7F8FC
		flex-wrap wrap
	.buy
		background-color #EBA542
		padding 1px 10px
		font-size 26rpx
		border-radius 5px
		color white
		height 50rpx
		line-height 50rpx
</style>
