<template>
	<view class="container">
		<live-player
		  :src="liveInfo.path"
		  autoplay
		  :muted="!isMic"
		  @statechange="statechange"
		  @error="error"
		  class="livePlayer"
		>
			<cover-view class="user-section" :style="'margin-top: '+height+'rpx'">
				<cover-image @click="back" src="../../static/back.png" class="back" style="">
					
				</cover-image>
				<cover-view class="portrait">
					<cover-image class="image" :src="liveInfo.img||'../../static/missing-face.png'">
						
					</cover-image>
				</cover-view>
				<cover-view class="user-mask">
					<cover-view style="margin-left: 100upx;">{{liveInfo.title}}</cover-view>
					<!-- <cover-view style="font-size: 18upx;margin-left: 100upx;margin-top: 10upx;">人气：23.5万</cover-view> -->
				</cover-view>
			</cover-view>
			<cover-view style="height: 88vh;display: flex;flex-direction: column;justify-content: flex-end;">
				<cover-view class="info">
					<cover-view v-for="item in infoList" class="info-items">
						<cover-view class="info-item show" v-if="item.type=='message'">
							<cover-view class="text-left">{{item.nickname}}:</cover-view>
							<cover-view style="margin-left: 20upx;">{{item.content}}</cover-view>
						</cover-view>
						<cover-view class="enter-item show" v-if="item.type=='enter'">
							{{item.nickname}}进入了直播间
						</cover-view>
					</cover-view>
				</cover-view>
				<cover-view class="section">
					<cover-view class="share">
						<cover-image src="../../static/shareIcon2.png" style="width: 35upx;height: 34upx;"></cover-image>
						<button class="share-button" open-type="share">分享给朋友，可以收获更多粉丝</button>
						<cover-image src="../../static/right.png" style="width: 15upx;height: 23upx;"></cover-image>
					</cover-view>
					<cover-image style="width: 88upx;height: 88upx;" src="../../static/buy.png" @click="toggleMask('show')"></cover-image>
				</cover-view>
				<cover-view class="bottom">
					<cover-view class="input" @click="showKeyBord">{{msg||tipMessage}}</cover-view>
					<cover-view style="margin-right: 35upx;display: flex;">
						<!-- <cover-image src="../../static/tabCamera1.png" class="bottom-icon"></cover-image> -->
						<!-- <cover-image src="../../static/play.png" class="bottom-icon"></cover-image> -->
						<!-- <cover-image src="../../static/meiyan.png" class="bottom-icon"></cover-image> -->
						<cover-image @click="toggleMic" :src="isMic?'../../static/voice.png':'../../static/closeVoice.png'" class="bottom-icon"></cover-image>
					</cover-view>
				</cover-view>
			</cover-view>
			<!-- 商品面板 -->
			<cover-view class="coupon-mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask" @touchmove.stop.prevent="stopPrevent">
				<cover-view class="coupon-mask-content" @click.stop.prevent="stopPrevent">
					<cover-view style="display: flex;justify-content: space-between;margin-top: 30upx;width: 94%;margin-left: 3%;">
						<cover-view style="color: #999999;font-size: 32upx;line-height: 70upx;height: 70upx;">直播商品({{plist.length}})</cover-view>
						<!-- <cover-view class="addProduct" @click="goAddProduct">添加商品</cover-view> -->
					</cover-view>
					<cover-view class="coupon-mask-content" @click.stop.prevent="stopPrevent" v-if='plist.length>0' style="width: 94%;margin-left: 3%;overflow-y: scroll;max-height: 60vh;">
						<cover-view class="p-list">
							<cover-view  class="p-item" v-for="item in plist" :key="item.id">
								<cover-view class="p-img">
									<cover-image style="width: 170upx;height: 170upx;border-radius: 10upx;" :src="item.pic"></cover-image>
								</cover-view>
								<cover-view class="p-content">
									<cover-view class="p-name ui-nowrap">
										{{item.name}}{{ item.attr||''}}
									</cover-view>
									<cover-view class="p-price">
										<cover-view class='price'>￥{{item.price}}</cover-view>
										<cover-view class="dis-price" v-if="item.originalPrice&&item.originalPrice!=0">
											￥{{item.originalPrice}}
										</cover-view>
									</cover-view>
									<!-- <cover-view class="p-sale ui-nowrap">
										销量:{{item.sale}}
									</cover-view> -->
								</cover-view>
								<cover-view class="p-button">
									<cover-view class="p-btn" @click="goDetail(item)">去购买</cover-view>
								</cover-view>
							</cover-view>
						</cover-view>
					</cover-view>
					<cover-view v-if='plist.length==0' class="textcenter mtrpx100">
						<cover-view class="font10 fontcolor16">主播没有添加商品哦~</cover-view>
					</cover-view>
				</cover-view>
			</cover-view>
		</live-player>
		<input style="height: 0;min-height: 0;" :focus="isFocus" type="text" v-model="msg" @blur="onBlur" @confirm='confirm' confirm-type="send"/>
	</view>
</template>

<script>
	import TIM from '@/components/tim-sdk/tim-wx.js';
	// import LibGenerateTestUserSig from '@/components/tim-sdk/lib-generate-test-usersig.min.js';
    export default {
        data() {
            return {
				fil: true,
				pusherUrl: '',
				height:'',
				msg:'',
				isFocus:false,
				isMic:true,
				liveInfo:'',
				infoList:[],
				param:'',
				memberInfo:'',
				maskState:0,
				plist:[],
				tipMessage : '一起聊天吧~'
			};
        },
		async onShow(){
			let that = this;
			let data = uni.getStorageSync('tempProduct');
			if(data!=''){
				let tempProduct = JSON.parse(data);
				this.sendCustomMsgAndEmitEvent(tempProduct,'addProduct')
			}
		},
		//分享
		onShareAppMessage() {
			return {
				"title": "一个直播间",
				"path": `/pages/live/live?live_sn=${this.liveInfo.live_sn}&_q=${this.memberInfo.inviteCode}`,
				"imageUrl": this.liveInfo.img
			};
		},
        async onLoad(option) {
			let that = this;
			// 获取手机状态栏高度
			uni.getSystemInfo({
				success: function(data) {
					// 将其赋值给this
					console.log(data)
					that.height = data.statusBarHeight+40;
				},
				fail:function(res){
					console.log(res)
				}
			})
			if (option['_q']) {
				this.$store.commit("setShareMember", option['_q']);
			}
			let token = uni.getStorageSync('token')
			if(token!=''){
				let memberInfo = await this.$api.getMemberInfo();
				this.memberInfo = memberInfo.data
				this.login();
				let res = await this.$http.getLiveDetail({live_sn:option.live_sn})
				if(res.code==200){
					this.liveInfo = res.data
				}else{
					this.$http.msg(res.msg)
				}
			}else{
				uni.login({
					async success(res) {
						if (res.code) {
							let result = await that.$http.login({code:res.code});
							if(result.code==200){
								console.log('登录成功')
								uni.setStorageSync('token', result.data.token);
								uni.setStorageSync('tokenHead', result.data.tokenHead);
								let memberInfo = await that.$api.getMemberInfo();
								that.memberInfo = memberInfo.data;
								that.login();
								let res = await that.$http.getLiveDetail({live_sn:option.live_sn})
								if(res.code==200){
									that.liveInfo = res.data
								}else{
									that.$http.msg(res.msg)
								}
							}else {
								console.log('登录失败！' + res.errMsg)
							}
						} 
					}
				})
			}
        },
        methods: {
			toggleMic(){
				if(this.isMic){
					this.isMic = false;
				}else{
					this.isMic = true;
				}
			},
			goAddProduct(){
				uni.navigateTo({
					url: "/pages/live/addPruduct"
				});
			},
			//防止冒泡和滚动穿透
			stopPrevent(){},
			goDetail(e){
				uni.navigateTo({
					url: `/pages/product/product?id=${e.id}&attr=${e.attr}`
				});
			},
			removeProduct(item,index){
				let that = this;
				this.sendCustomMsgAndEmitEvent(item,'removeProduct',index)
			},
			toggleMask(type) {
				console.log(type)
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(() => {
					this.maskState = state;
				}, timer)
			},
			sendCustomMsgAndEmitEvent(description,type,index) {
				let that = this;
				let productType = type;
				let productIndex = index;
				let message = this.tim.createCustomMessage({
				  to: this.liveInfo.room_id,
				  conversationType: TIM.TYPES.CONV_GROUP,
				  // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
				  // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
				  // priority: TIM.TYPES.MSG_PRIORITY_HIGH,
				  payload: {
					data: type, // 类型
					description: JSON.stringify(description), // 数据
					extension: ''
				  }
				});
				// 3. 发送消息
				let promise = this.tim.sendMessage(message);
				promise.then(function(imResponse) {
				  // 发送成功
				  console.log(imResponse);
				  if(productType=='addProduct'){
					  console.log('添加商品')
					  that.plist.push(description)
					  uni.removeStorageSync('tempProduct')
				  }else if(productType=='removeProduct'){
					  console.log('移除商品')
					  console.log(productIndex)
					  that.plist.splice(productIndex,1)
				  }
				}).catch(function(imError) {
				  // 发送失败
				  console.warn('sendMessage error:', imError);
				});
			},
			sendMessage(text,type){
				let that = this;
				// 发送文本消息，Web 端与小程序端相同
				// 1. 创建消息实例，接口返回的实例可以上屏
				let data = {
					content:text,
					nickname:this.memberInfo.nickname,
					headPicture:this.memberInfo.headPicture,
					type:type
				}
				let message = this.tim.createTextMessage({
				  to: this.liveInfo.room_id,
				  conversationType: TIM.TYPES.CONV_GROUP,
				  // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
				  // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
				  priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
				  payload: {
				    text: JSON.stringify(data)
				  }
				})
				
				// 2. 发送消息
				let promise = this.tim.sendMessage(message)
				promise.then(function(imResponse) {
				  // 发送成功
				  console.log(imResponse);
				  that.infoList.push(data)
				}).catch(function(imError) {
				  // 发送失败
				  console.warn('sendMessage error:', imError)
				})
			},
			async login(){
				let that = this;
				let options = {
				  SDKAppID: 1400407611 // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
				};
				// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
				that.tim = TIM.create(options); // SDK 实例通常用 tim 表示
				
				// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
				// that.tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
				// tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
				// 监听事件，例如：
				that.tim.on(TIM.EVENT.SDK_READY, function(event) {
					console.log(event)
					// 匿名用户加入（无需登录，入群后仅能接收消息）
					let promise = that.tim.joinGroup({ groupID: that.liveInfo.room_id});
					promise.then(function(imResponse) {
					  switch (imResponse.data.status) {
					    case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL: // 等待管理员同意
					      break
					    case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
					      console.log(imResponse.data.group) // 加入的群组资料
						  that.sendMessage('进入了直播间','enter')
					      break
					    case TIM.TYPES.JOIN_STATUS_ALREADY_IN_GROUP: // 已经在群中
					      break
					    default:
					      break
					  }
					}).catch(function(imError){
					  console.warn('joinGroup error:', imError) // 申请加群失败的相关信息
					});
				  // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
				  // event.name - TIM.EVENT.SDK_READY
				});
				
				that.tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
				  // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
				  // event.name - TIM.EVENT.MESSAGE_RECEIVED
				  // event.data - 存储 Message 对象的数组 - [Message]
				  const length = event.data.length
				  let message
				  for (let i = 0; i < length; i++) {
				    // Message 实例的详细数据结构请参考 Message
				    // 其中 type 和 payload 属性需要重点关注
				    // 从v2.6.0起，AVChatRoom 内的群聊消息，进群退群等群提示消息，增加了 nick（昵称） 和 avatar（头像URL） 属性，便于接入侧做体验更好的展示
				    // 前提您需要先调用 updateMyProfile 设置自己的 nick（昵称） 和 avatar（头像 URL），请参考 updateMyProfile 接口的说明
				    message = event.data[i]
				    switch (message.type) {
				      case TIM.TYPES.MSG_TEXT:
				        // 收到了文本消息
				        that._handleTextMsg(message)
				        break
				      case TIM.TYPES.MSG_CUSTOM:
				        // 收到了自定义消息
				        that._handleCustomMsg(message)
				        break
				      case TIM.TYPES.MSG_GRP_TIP:
				        // 收到了群提示消息，如成员进群、群成员退群
				        that._handleGroupTip(message) 
				        break
				      case TIM.TYPES.MSG_GRP_SYS_NOTICE:
				        // 收到了群系统通知，通过 REST API 在群组中发送的系统通知请参考 在群组中发送系统通知 API
				        that._handleGroupSystemNotice(message)
				        break
				      default:
				         break
				    }
				  }
				})
				
				that.tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
				  // 收到消息被撤回的通知
				  // event.name - TIM.EVENT.MESSAGE_REVOKED
				  // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
				});
				
				that.tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, function(event) {
				  // SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
				  // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
				  // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
				});
				
				that.tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
				  // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
				  // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
				  // event.data - 存储 Conversation 对象的数组 - [Conversation]
				});
				
				that.tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
				  // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
				  // event.name - TIM.EVENT.GROUP_LIST_UPDATED
				  // event.data - 存储 Group 对象的数组 - [Group]
				});
				
				that.tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
				  // 收到自己或好友的资料变更通知
				  // event.name - TIM.EVENT.PROFILE_UPDATED
				  // event.data - 存储 Profile 对象的数组 - [Profile]
				});
				
				that.tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
				  // 收到黑名单列表更新通知
				  // event.name - TIM.EVENT.BLACKLIST_UPDATED
				  // event.data - 存储 userID 的数组 - [userID]
				});
				
				that.tim.on(TIM.EVENT.ERROR, function(event) {
				  // 收到 SDK 发生错误通知，可以获取错误码和错误信息
				  // event.name - TIM.EVENT.ERROR
				  // event.data.code - 错误码
				  // event.data.message - 错误信息
				});
				
				that.tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
				  // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
				  // event.name - TIM.EVENT.SDK_NOT_READY
				});
				
				that.tim.on(TIM.EVENT.KICKED_OUT, function(event) {
				  // 收到被踢下线通知
				  // event.name - TIM.EVENT.KICKED_OUT
				  // event.data.type - 被踢下线的原因，例如:
				  //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
				  //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
				  //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。 
				});
				
				 that.tim.on(TIM.EVENT.NET_STATE_CHANGE, function(event) { 
				  //  网络状态发生改变（v2.5.0 起支持）。 
				  // event.name - TIM.EVENT.NET_STATE_CHANGE 
				  // event.data.state 当前网络状态，枚举值及说明如下： 
				  //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络 
				  //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中” 
				  //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息  
				});
				// // 开始登录
				//  const generator = new LibGenerateTestUserSig(
				// 	 1400406018,
				// 	 'ecdf4b62a60afa4d14d12df4d9210a8575f28e8486cf43fb2632572b6ba5523a',
				// 	 604800
				//    );
				// const userSig = generator.genTestUserSig(this.memberInfo.memberId+'');
				let res = await this.$http.gensin({username:this.memberInfo.memberId+''})
				let userSig;
				if(res.code==200){
					userSig = res.data
				}else{
					this.$api.msg(res.msg)
					return;
				}
				console.log(userSig)
				that.tim.login({userID: this.memberInfo.memberId+'', userSig: userSig});
			},
			_handleTextMsg(message) {
			  // 详细数据结构请参考 TextPayload 接口的说明
			  console.log('收到消息',message.payload.text) // 文本消息内容
			  let data = JSON.parse(message.payload.text)
			  this.infoList.push(data);
			},
			
			_handleCustomMsg(message) {
			  // 详细数据结构请参考 CustomPayload 接口的说明
			  console.log(message.payload)
			  let product = JSON.parse(message.payload.description);
			  if(message.payload.data=='addProduct'){
				  this.plist.push(product)
				  this.$api.msg('主播添加了一个商品')
			  }else if(message.payload.data=='removeProduct'){
				  this.plist.forEach((e,i)=>{
					  if(e.skuId==product.skuId){
						  this.plist.splice(i,1)
					  }
				  })
			  }
			},
			
			_handleGroupTip(message) {
			  // 详细数据结构请参考 GroupTipPayload 接口的说明
			  switch (message.payload.operationType) {
			    case TIM.TYPES.GRP_TIP_MBR_JOIN: // 有成员加群
					console.log('有人进入了直播间',message)
			      break
			    case TIM.TYPES.GRP_TIP_MBR_QUIT: // 有群成员退群
			      break
			    case TIM.TYPES.GRP_TIP_MBR_KICKED_OUT: // 有群成员被踢出群
			      break
			    case TIM.TYPES.GRP_TIP_MBR_SET_ADMIN: // 有群成员被设为管理员
			      break
			    case TIM.TYPES.GRP_TIP_MBR_CANCELED_ADMIN: // 有群成员被撤销管理员
			      break
			    case TIM.TYPES.GRP_TIP_GRP_PROFILE_UPDATED: // 群组资料变更
			      //从v2.6.0起支持群组自定义字段变更内容
			      // message.payload.newGroupProfile.groupCustomField 
			      break
			    case TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED: // 群成员资料变更，例如群成员被禁言
			      break
			    default:
			      break
			  }
			},
			
			_handleGroupSystemNotice(message) {
			  // 详细数据结构请参考  GroupSystemNoticePayload 接口的说明
			  console.log(message.payload.userDefinedField) // 用户自定义字段。使用 RESTAPI 发送群系统通知时，可在该属性值中拿到自定义通知的内容。
			  // 用 REST API 发送群系统通知请参考 在群组中发送系统通知 API
			},
			back(){
				uni.navigateBack({
					
				})
			},
			showKeyBord(){
				this.isFocus = true;
				this.tipMessage = '输入中。。。';
			},
			onBlur(){
				this.isFocus = false;
				this.tipMessage = '一起聊天吧~';
			},
			confirm(){
				console.log(this.msg)
				this.sendMessage(this.msg,'message');
				this.msg = ''
				this.isFocus = false;
				this.tipMessage = '一起聊天吧~';
			},
            statechange(e){
            	console.log('live-player code:', e.detail.code)
            },
            error(e){
            	console.error('live-player error:', e.detail.errMsg)
            }
        }
    }
</script>

<style lang="scss">
	.container{
		background-color: #09F709;
		width: 100%;
		height: 100vh;
		color: #fff;
		font-size: 24upx;
	}
	.livePlayer{
		width: 100%;
		height: 100vh;
		background-color: #09F709;
		// position: fixed;
	}
	
	.user-section{
		display: flex;
		align-items: center;
		
		.back{
			width: 20upx;
			height: 37upx;
			margin-left: 30upx;
		}
		.portrait{
			width: 80upx;
			height: 80upx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: rgba($color: #fff, $alpha: 0.5);
			border-radius: 100%;
			.image{
				width: 70upx;
				height: 70upx;
				border-radius: 100%;
			}
			margin-left: 20upx;
			z-index: 5;
		}
		.user-mask{
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 270upx;
			height: 70upx;
			border-radius: 70upx;
			margin-left: -80upx;
			background-color: rgba($color: #000, $alpha: 0.5);
		}
	}
	.info{
		height: 680upx;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		// margin-top: 68%;
		.show {animation:show 0.3s linear both;}
		@keyframes show {0% {opacity:0;}100% {opacity:1;}}
		.info-items{
			flex-shrink: 0;
			margin-left: 35upx;
			width: max-content;
			margin-bottom: 24upx;
		}
		.enter-item{
			padding: 0 35upx;
			height: 58upx;
			border-radius: 58upx;
			line-height: 58upx;
			text-align: center;
			// background: linear-gradient(to right,rgb(93,226,255),rgb(0,174,255));
			background-color: rgb(93,226,255);
		}
		.info-item{
			padding: 0 35upx;
			height: 70upx;
			border-radius: 15upx;
			background-color: rgba($color: #000, $alpha: 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 29upx;
			.text-left{
				color: rgb(171,28,243);
			}
		}
	}
	.section{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 35upx;
		margin-top: 20upx;
		.share{
			width: 520upx;
			height: 68upx;
			border-radius: 68upx;
			background-color: #1dc7ac;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 40upx;
			.share-button{
				font-size: 25upx;
				color: #fff;
				background-color: #1DC7AC;
			}
			.share-button:after{
				border:none;
			}
		}
		.buy{
			
		}
	}
	.bottom{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 40upx;
		.input{
			width: 198upx;
			height: 68upx;
			border-radius: 68upx;
			font-size: 24upx;
			margin-left: 35upx;
			background-color: rgba($color: #000, $alpha: 0.5);
			color: #fff;
			display: flex;
			align-items: center;
			padding: 0 25upx;
		}
		.bottom-icon{
			width: 68upx;
			height: 68upx;
			margin-left: 24upx;
		}
	}
	.btn{
		
	}
	/* 商品面板 */
	.coupon-mask {
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 9995;
		transition: .3s;
	
		.coupon-mask-content {
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #fff;
			transform: translateY(100%);
			transition: .3s;
			.addProduct{
				width:200upx;
				height:70upx;
				font-size: 32upx;
				background-color: #1DC7AC;
				border-radius: 70upx;
				color: #fff;
				line-height: 70upx;
				text-align: center;
			}
		}
	
		&.none {
			display: none;
		}
	
		&.show {
			background: rgba(0, 0, 0, .4);
	
			.coupon-mask-content {
				transform: translateY(0);
			}
		}
	}
	.p-list{
		.p-item {
			margin-top: 1upx;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
			height: 200upx;
			.p-img {
				width: 35%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.p-content {
				width: 52%;
				.p-name {
					color: #000;
					height: 60upx;
					line-height: 60upx;
					font-size: 32upx;
					font-weight: bold;
				}
				.p-sale{
					color: #999;
					height: 30upx;
					line-height: 30upx;
					font-size: 24upx;
				}
				.p-sku {
					font-size: 28upx;
				}
				.p-price {
					display: flex;
					flex-direction: row;
					line-height: 60upx;
					.price{
						color: #ec672c;
						height: 60upx;
						font-size: 35upx;
						font-weight: bold;
					}
					.dis-price{
						margin-left: 16upx;
						color: #999999;
						height: 60upx;
						font-size: 24upx;
						text-decoration: line-through;
					}
				}
			}
			.p-button {
				width: 18%;
				.p-btn{
					width: 120upx;
					height: 50upx;
					color: #fff;
					background-color: #1DC7AC;
					border-radius: 10upx;
					text-align: center;
					line-height: 50upx;
				}
			}
		}
	}
</style>
