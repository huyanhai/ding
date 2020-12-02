<template>
  <view class="total-wrap" :style="{marginTop: isMainNode?'22rpx':'6rpx'}">
    <view class="node-container">
      <view class="node-container-left">
        <view class="tag-container">
          <view class="node-tag-container">
            <view v-if="isMainNode" class="main-tag"></view>
			<view v-else class="node-tag"></view>
          </view>
        </view>
        <view class="line-container" :style="{height: isMainNode?'142rpx':'88rpx', paddingTop: isMainNode?'22rpx':'8rpx'}">
          <view v-if="!isFirst" class="line" :style="{height: isMainNode?'120rpx':'80rpx'}"></view>
        </view>
      </view>
      <view class="node-container-right" :style="{paddingTop: isMainNode?'0':'8rpx'}">
        <view class="node-desc" :style="{color: isMainNode?'#1DC7AC':'#333333', marginTop: isMainNode?'10rpx':'0'}">{{acceptStationFixed}}</view>
        <view v-if="nodeData.phone" class="node-phone">{{nodeData.phone}}</view>
        <view class="node-time">{{nodeData.createTime}}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    isNewest: {
      type: Boolean,
      default: false
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    isMainNode: {
      type: Boolean,
      default: false
    },
    nodeData: {
      type: Object,
      default () {
        return {
          status: '',
          statusName: '',
          createTime: '2019-01-01 00:00:00',
          acceptStation: 'xxxxxx'
        }
      }
    }
  },
  computed: {
    nodeIconUrl () {
      if (this.nodeData.status === 'WATTING_PAY') { // 待付款
        return this.isNewest ? '/static/images/ic-order-commit.png' : '/static/images/ic-order-commit-G.png'
      } else if (this.nodeData.status === 'PAYED') { // 待发货
        return this.isNewest ? '/static/images/ic-paied.png' : '/static/images/ic-paied-G.png'
      } else if (this.nodeData.status === 'WATTING_DELIVER') { // 已揽件
        return this.isNewest ? '/static/images/ic-pacakaging.png' : '/static/images/ic-pacakaging-G.png'
      } else if (this.nodeData.status === 'DELIVERING') { // 运输中
        return this.isNewest ? '/static/images/ic-sending.png' : '/static/images/ic-sending-G.png'
      } else if (this.nodeData.status === 'COMPLETE') { // 已完成
        return this.isNewest ? '/static/images/ic-delivering.png' : '/static/images/ic-delivering-G.png'
      }
    },
    acceptStationFixed () {
      if (!this.nodeData.acceptStation) return ''
      return this.nodeData.acceptStation.replace(/(\d{3})\d{4}(\d{4})/, '')
    }
  }
}
</script>
<style lang="scss">
.total-wrap {
  margin-top: 22rpx;
  width: 100%;
  .node-container {
    width: 100%;
    height: auto;
    display: flex;
    &-left {
      width: 44rpx;
      height: auto;
      .tag-container {
        width: 44rpx;
        height: 44rpx;
        img {
          width: 44rpx;
          height: 44rpx;
        }
        .node-tag-container {
          width: 44rpx;
          height: 44rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          .node-tag {
            width: 32rpx;
            height: 32rpx;
            background-color: #dcdcdc;
            border-radius: 50%;
          };
		  .main-tag {
		    width: 24rpx;
		    height: 24rpx;
		    //background-color: #dcdcdc;
			background: linear-gradient(90deg, #1DC7AC, #2ED8BD);
		    border-radius: 50%;
		  }
        }
      }
      .line-container {
        box-sizing: border-box;
        width: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .line {
          width: 4upx;
          background-color: #DDDDDD;
        }
      }
    }
    &-right {
      flex: 1;
      box-sizing: border-box;
      padding: 0 10rpx 0 24rpx;
      .node-title {
        width: 100%;
        height: 40rpx;
        line-height: 44rpx;
        color: #222;
        font-size: 28rpx;
        font-family: 'PingFangSC-Medium';
      }
      .node-desc {
        margin-top: 16rpx;
        width: 100%;
        min-height: 30rpx;
        line-height: 30rpx;
        color: #222;
        font-size: 24rpx;
        font-family: 'PingFangSC-Regular';
        word-wrap: break-word;
        word-break: normal;
      }
      .node-phone {
        margin-top: 8rpx;
        width: 100%;
        height: 26rpx;
        line-height: 26rpx;
        color: #FE4E2C;
        font-size: 26rpx;
        font-family: 'Avenir-Medium';
      }
      .node-time {
        margin-top: 12rpx;
        width: 100%;
        height: 34rpx;
        line-height: 34rpx;
        color: #999;
        font-size: 24rpx;
        font-family: 'Avenir-Book';
      }
    }
  }
}
</style>