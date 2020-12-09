<template>
	<view class="content">
		<view class="row b-b ">商家信息</view>
		<view class="row">
		    <text class="store-tit">商家账号 : {{storeAccounts}}</text>
		</view>
		<view class="row">
		    <text class="store-tit">商家姓名 : {{storeName}}</text>
		</view>
		<view class="row">
		    <text class="store-tit">商家银行 : {{storeBankName}}</text>
		</view>
		<view class="row b-b">用户信息</view>
		<view class="row">
			<text class="tit">汇款账号:</text>
			<input class="input" type="text" v-model="clientAccounts" placeholder="请输入汇款账号" placeholder-class="placeholder" />
		</view>
		<view class="row">
			<text class="tit">汇款姓名:</text>
			<input class="input" type="text" v-model="clientName" placeholder="请输入汇款人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row">
			<text class="tit">付款银行:</text>
			<input class="input" type="text" v-model="clientBankName" placeholder="请输入汇款银行" placeholder-class="placeholder" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId : 0,//订单ID
			clientAccounts: '',//用户汇款账号
			clientName: '',//用户汇款人姓名
			clientBankName: '',//用户汇款银行
			storeAccounts:'暂无',//商家账号
			storeName:'暂无',//商家姓名
			storeBankName:'暂无', //商家银行
			sumbitFlag: false //提交标志，防止重复提交
		};
	},
	onLoad(option){
			this.orderId = option.orderId;
			this.loadData();
	},
	methods: {
		async loadData(){
			let result = await this.$http.getBankInfo();
			if(200 == result.code){
				let data = result.data;
				this.storeAccounts=data.bankCardNum;
				this.storeName=data.accountName;
				this.storeBankName=data.bankName;
			}else{
				this.$api.msg(result.message);
			}
		},
		//提交
		async confirm() {
			if (!this.clientAccounts) {
				this.$api.msg('请输入汇款账号');
				return;
			}
			if (!this.clientName) {
				this.$api.msg('请输入汇款人姓名');
				return;
			}
			if (!this.clientBankName) {
				this.$api.msg('请输入汇款银行');
				return;
			}
			
			//防止重复提交
			if(!this.sumbitFlag) {
				this.sumbitFlag = true;
				let data = {
					orderId : this.orderId,
					paymentBankCardNum: this.clientAccounts,
					paymentAccountName: this.clientName,
					paymentBankName: this.clientBankName
				};
				let result = await this.$http.submitBankInfo(data);
				if (result.code === 200) {
					this.$api.msg(result.message);
					setTimeout(()=>{
						uni.navigateBack()({
							url: `/pages/order/orderInfo?orderId=${this.orderId}`
						})
					},800);
				} else {
					this.$api.msg(result.message);
				}
			}
		},
	},
	// onBackPress() {
	// 	uni.reLaunch({
	// 		url:'pages/index/index'
	// 	})
	// }
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
	padding-top: 16upx;
}
.b-b{
		color: red;
}
.row {
	display: flex;
	align-items: center;
	position: relative;
	padding: 0 30upx;
	height: 110upx;
	background: #fff;

	.tit {
		flex-shrink: 0;
		width: 150upx;
		font-size: 30upx;
		color: $font-color-dark;
	}
	.store-tit {
		flex-shrink: 0;
		font-size: 30upx;
		color: $font-color-dark;
	}
	.input {
		flex: 1;
		font-size: 30upx;
		color: $font-color-dark;
	}
	.icon-shouhuodizhi {
		font-size: 36upx;
		color: $font-color-light;
	}
}
.default-row {
	margin-top: 16upx;
	.tit {
		flex: 1;
	}
	switch {
		transform: translateX(16upx) scale(0.9);
	}
}
.add-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 690upx;
	height: 100upx;
	margin: 60upx auto;
	font-size: $font-lg;
	color: #fff;
	background-color: #1DC7AC;
	border-radius: 100upx;
	// box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
