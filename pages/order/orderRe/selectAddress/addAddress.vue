<template>
	<view>
		<view class="text-info">
			<text class="t-text">姓名：</text>
			<input class="c-text" type="string" v-model="name" placeholder="请填写收货人姓名" placeholder-style="color: #cfcfd1;">
		</view>
		<view class="text-info">
			<text class="t-text">电话号码：</text>
			<input class="c-text" type="number" v-model="phone" placeholder="请填写收货人联系电话" placeholder-style="color: #cfcfd1;">
		</view>
		<view class="text-info">
			<text class="t-text">所在区域：</text>
			<view class="c-text" style="display:flex;justify-content: center;align-items: center;" @click="openAddres">
				<text v-if="pickerText===''" style="color: #cfcfd1;flex: 1;">请选择区域</text>
				<text v-else-if="pickerText!==''" style="flex: 1;">{{ pickerText }}</text>
				<image class="rightImage" src="../../../../static/into.png" mode=""></image>
			</view>
		</view>
		<view class="text-info">
			<text class="t-text">详细地址：</text>
			<input class="c-text" type="string" v-model="address" placeholder="请填写详细地址" placeholder-style="color: #cfcfd1;">
		</view>
		<view style="height: 10px;background-color: #F5F5F5;margin-top: 30upx;" />
		<checkbox-group @change="onckeckbox" class="defaultAdd">
			<label v-for="item in items" :key="item.value">
				 <checkbox :value="item.value" :checked="item.checked" /><text >设为常用地址</text>
			</label>
		</checkbox-group>
		<button class="btn" @click="save">保存</button>
		<button v-if="edit==true" class="btn deletbtn" @click="confirmDelete">删除</button>
		
		<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#007AFF"></simple-address>
	</view>
</template>

<script>
	import simpleAddress from '@/components/simple-address/simple-address.vue';
	
	export default {
		data() {
			return {
				cityPickerValueDefault: [0, 0, 1],
				pickerText: '',
				pickerData:null,
				name:'',
				phone:'',
				address:'',
				defaultAdd:0,
				items:[{value: '0'}],
				edit:false,
				loading:false,
				id:''
			}
		},
		components: {
			simpleAddress,
		},
		async onLoad(e) {
			try{
				if(!e.id){
					return;
				}
				this.id = e.id;
				let res = await this.$http.getAddresInfo(e);
				if(res && res.code==200 &&  res.data){
					let addressInfo = res.data;
					 this.name = addressInfo.name;
					 this.phone = addressInfo.phoneNumber;
					 this.address = addressInfo.detailAddress;
					 this.pickerText = addressInfo.city+"-"+addressInfo.province+"-"+addressInfo.region
					 this.defaultAdd = addressInfo.defaultStatus
					 addressInfo.defaultStatus==1?this.items[0].checked ="true":null;
					 let index = this.$refs.simpleAddress.queryIndex([addressInfo.city, addressInfo.province, addressInfo.region], 'label');
					 this.pickerData = {
						 city:addressInfo.city,
						 province:addressInfo.province,
						 region:addressInfo.region,
						 area_code:addressInfo.area_code
					 };
					  console.log('this.pickerData',this.pickerData)
					 this.cityPickerValueDefault = index.index;
					 console.log('getAddresInfo',res)
					 this.edit = true
					uni.setNavigationBarTitle({title: '修改地址'})
				}else{
					//this.$api.msg(res.message);
					//console.log('getAddresInfo',res)
				}
			}catch(e){
				console.log(e)
			}
		},
		methods: {
			openAddres() {
				this.$refs.simpleAddress.open();
			},
			onConfirm(e) {
				this.pickerData = {
					area_code:e.areaCode,
					city:e.labelArr[0],
					province:e.labelArr[1],
					region:e.labelArr[2],
				}
				this.pickerText = e.label;
			},
			onckeckbox(e){
				
				this.defaultAdd = e.detail.value.length;
			},
			async save(){
				if(this.loading){
					return;
				}
				this.loading = true;
				if(!this.name || this.name==""){
					this.$api.msg("请填写收货人姓名");
					return;
				}
				if(!this.phone || this.phone==""){
					this.$api.msg("请填写收货人电话号码");
					return;
				}
				if(!this.pickerData){
					this.$api.msg("请选择区域");
					return;
				}
				if(!this.address || this.address==""){
					this.$api.msg("请填写详细地址");
					return;
				}
				 let option = {
					 name:this.name,
					 phoneNumber:this.phone,
					 detailAddress:this.address,
					 city:this.pickerData.city,
					 province:this.pickerData.province,
					 region:this.pickerData.region,
					 area_code:this.pickerData.area_code,
					 defaultStatus:this.defaultAdd
				 };
				if(!this.edit){
					let res = await this.$http.setAddress(option);
					if(res && res.code==200){
						this.$api.msg("添加成功")
						uni.navigateBack({});
					}
				}else{
					option.id = this.id;
					let res = await this.$http.editAddress(option);
					if(res && res.code==200){
						this.$api.msg("修改成功")
						uni.navigateBack({});
					}
				}
				this.loading = false;
			},
			confirmDelete(){
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否确定删除地址',
					success: function(res) {
						if (res.confirm) {
							that.deleteAddress()
						}
					}
				});
			},
			async deleteAddress(){
				let option = {id:this.id}
				let res = await this.$http.deletAddress(option);
				if(res && res.code==200){
					this.$api.msg("删除成功")
					uni.navigateBack({});
				}
			}
		}
	}
</script>

<style lang="scss">
	.text-info {
		display: flex;
		margin: 0 0 0 40upx;
		justify-content: center;
		align-items: center;
		color: #000;
		height: 120upx;
		font-size: 14px;

		.t-text {
			flex: 3;
		}

		.c-text {
			flex: 7;
			flex-direction: row;
			height: 80upx;
			border-bottom: #F5F5F5 solid 2upx;
		}
	}

	.rightImage {
		margin-right: 40upx;
		width: 16upx;
		height: 28upx;
	}

	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 2%;
		margin-right: 2%;
		width: 96%;
		height: 88upx;
		color: #FFFFFF;
		background: #ff9001;
		position: absolute;
		bottom: 144upx;
	}
	.deletbtn {
		background: #ffa000;
		bottom: 24upx;
	}

	.defaultAdd {
		margin-left: 20px;
		margin-top: 48rpx;
		font-size: 14px;
	}
</style>
