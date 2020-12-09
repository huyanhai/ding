<template>
	<view>
		<view class="submit">
			<view class="input-container">
				<input @blur="getInput" :value="inputValue" :disabled="disabled"/>
			</view>
			<view @tap="sendMsg" class="submit-btn">
				发送
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F6F7F6;
	}
	.submit {
		background: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		justify-content: center;
		align-items: center;
		display: flex;
	
		.input-container {
			flex: 5;
	
			input {
				border-radius: 10upx;
				background-color: #F6F7F6;
				margin: 0 auto;
				width: 96%;
				height: 40px;
				line-height: 40px;
				font-size: 1rem;
				padding: 0 20rpx;
				background: rgba($color: #D9D8D8, $alpha: 0.6);
	
			}
		}
	
		.submit-btn {
			text-align: center;
			flex: 1;
			color: #EBA542;
		}
	}
</style>
