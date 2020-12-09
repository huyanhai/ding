<template>
	<view class="content">

  <view class="transferPhone">
      <text class="tit">转账到</text>
      <input v-model="phone" type="number" maxlength="11" placeholder="电话号码"/>
  </view>

  <view class="transferBox">
      <text class="top">转账余额</text>
      <view class="transfer">
        <text class="icon">¥</text>
        <input type="number" v-model="transferAmount" @input="changAmount" maxlength="6"/>
      </view>

      <view class="transferTip">
        <text class="totle">可转账余额{{memberInfo.balance>999999?999999:memberInfo.balance}}</text>
        <text class="op" @click="allForm">全部转账</text>
      </view>

  </view>
  
  <text class="transferBtn" @click="toDetail()">转账记录</text>

  <view  class="sure" @click="sureTransfer()">确认转账</view>
  <view class=""></view>
</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	
	export default {
		data() {
			return {
				phone:'',//电话号码
				transferAmount:'',//转账余额
				isTransfer:true,
				sumbitFlag: false //提交标志，防止重复提交
			}
		},
		onLoad() {
			this.refMemInfo();
		},
		computed:{
			...mapState(['memberInfo']),
		},
		methods: {
			//刷新用户信息
			refMemInfo(){
				let memInfoResult=this.$api.getMemberInfo();
			},
			
			//全部转账
			allForm(){
				let all=this.memberInfo.balance;
				if(all>999999)
					all=999999;
				this.transferAmount=all;
			},
			
			//余额改变
			changAmount(e){
				let amount=e.detail.value;
				if(amount>this.memberInfo.balance){
					this.transferAmount=this.memberInfo.balance;
				}else if(amount<0)
					this.transferAmount=0;
			},
			
			//确认转让
			async sureTransfer(){
				let that=this;
				if(this.memberInfo.balance==0){
					this.$api.msg("没有可用转账余额!");
					return;
				}
					
				if(!this.phone){
					this.$api.msg("请输入电话号码!");
					return;
				}
				
				if(!/(^1[0-9]{10}$)/.test(this.phone)){
					this.$api.msg("请输入正确的电话号码!");
					return;
				}
				
				if(this.transferAmount==0){
					this.$api.msg("转账余额必须大于0!");
					return;
				}
				
				let result = await this.$http.getRealName({
					phone: this.phone
				});
				
				if(result.data.realName == null || result.data.realName === "") {
					this.$api.msg("转入账户不存在!");
					return;
				}
				
				uni.showModal({
					title:"提示",
					content:"你是否确认向: ["+ result.data.realName+"] 转账？",
					async success(res) {
							if(!res.confirm) {
								return;
							}
							
							//防止重复提交
							if(!that.sumbitFlag) {
								that.sumbitFlag = true;
								let option={
									phone:that.phone,
									value:that.transferAmount
								};
								let reqResult=await that.$http.transferMoney(option);
								
								if(reqResult.code==200){
									uni.navigateBack({
										delta:1
									})
									that.$api.msg(reqResult.message);
								}else {
									that.$api.msg(reqResult.message);
								}
							}
					
						}
				});
					
			},
				//跳转到详情页面
			toDetail(){
				uni.navigateTo({
					url:"/pages/user/transferList"
				})
			}
		}
	}
</script>

<style lang="scss">
	page{
	  height: 100%;
	  width: 100%;
	  background: #f4f4f4;
	}

	.content{
		width: 100%;
	}

	/* 头部电话框 */
	.transferPhone{
	  height: 100upx;
	  width: 100%;
	  display: flex;
	  flex-direction: row;
	  align-items: center;
	  padding: 0 30upx;
	  margin: 40upx 0;
	  background: #fff;
	  
	  .tit{
		  font-size: 32upx;
	  }
	  
	  input{
		flex: 1;
		margin-left: 20upx;
	  }
	  
	}


	.transferBox{
	  height: auto;
	  width: 100%;
	  display: flex;
	  flex-direction: column;
	  background: #fff;
	}

	.transferBox .top{
	  height: 60upx;
	  line-height: 60upx;
	  font-size: 32upx;
	  padding: 0 30upx;
	}



	.transferBox .transfer{
	  height: 120upx;
	  display: flex;
	  flex-direction: row;
	  padding: 15upx 30upx;
	  border-bottom: 1upx solid #f4f4f4;
	  
	   .icon{
		font-size: 60upx;
		text-align: right;
	  }
	  
	   input{
		height: 100%;
		font-size: 50upx;
		flex: 1;
		margin: 0 20upx;
	  }
	}



	/* 底部提升框 */
	.transferBox .transferTip{
	  height: 80upx;
	  display: flex;
	  flex-direction: row;
	  justify-content: space-between;
	  align-items: center;
	  padding: 0 30upx;
	  
	   .totle{
		font-size: 30upx;
		color: gray;
	  }
	  
	   .op{
		color: red;
		font-size: 32upx;
	  }
	}



	.sure{
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  width: 690upx;
	  height: 80upx;
	  margin: 60upx auto;
	  font-size: 32upx;
	  color: #fff;
	  background-color: #fa436a;
	  border-radius: 10upx;
	  box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
	
	.transferBtn{
		height: 30upx;
		padding: 0 20upx;
		margin: 20rpx 0;
		color: gray;
		display: inline-block;
		width: 100%;
		font-size:29upx;
		text-align: right;
	}

</style>
