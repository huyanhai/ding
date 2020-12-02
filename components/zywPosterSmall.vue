<template>
	<view class="bg" catchtouchmove="true">
		<!-- 海报 -->
		<canvas canvas-id="zwyPoster" :style="{ width: cansWidth + 'px', height: cansHeight + 'px' }" class="isCan"></canvas>
		<image v-if="tempImgShow" @longpress="longpress" class="showImg" :style="{ width: cansWidth + 'px', height: cansHeight + 'px' }" :src="tempImg"></image>
		<view v-if="tempImgShow" class="fixedBox">
			<view class="boxLeft"><button class="flexBtn btnLeft" hover-class="btnHover" @click="longpress">长按图片保存</button></view>
			<view class="boxRight"><button class="flexBtn btnRight" hover-class="btnHover" @click="closeCans">关闭</button></view>
		</view>
	</view>
</template>

<script>
let nowTop = '';
export default {
	props: {},
	data() {
		return {
			// 海报
			tempImgShow: false,
			tempImg: '',
			cansWidth: 270, //海报宽度
			cansHeight: 430 //海报高度
			// 海报
		};
	},
	created() {
		this.ctx = uni.createCanvasContext('zwyPoster', this);
		var that = this;
		uni.getSystemInfo({
			success(res) {
				let ratio = (res.windowWidth - 80) / 300;
				that.cansHeight *= ratio;
				that.cansWidth *= ratio;
			}
		});
	},
	computed: {
		today() {
			let year = new Date().getFullYear();
			let month = new Date().getMonth() + 1;
			let date = new Date().getDate();
			let time = year + '年' + month + '月' + date + '日';
			return time;
		}
	},
	methods: {
		sleep(){
			return new Promise((resolve,reject)=>{
				setTimeout(()=>{
					resolve()
				},50)
			})
		},
	async drawPoster(isList) {
		console.log(isList)
			await this.sleep();
				/*
						绘制图片
						网络图片使用 this.drawWebBgTest(),可异步.then() 
						本地图片使用 this.drawBg() h5发行时需要添加域名图片才能显示
						参数相同
						调用方式:this.drawBg({
							url:'',路径，必须
							sLeft:0~1 | 'center' 百分比离左边距离 1则为100vw,必须
							sTop:0~1 百分比离顶部距离,必须
							sWidth:0~1 百分比宽度，必须
							sHeight:0~1 百分比高度，可不填，不填则默认使用sWidth的值
							r:Number 可不填，图片使用圆角矩形模式
						})
				*/
				this.ctx.setFillStyle('white')
				this.ctx.fillRect(0, 0, this.cansHeight, this.cansHeight)
				await this.drawBg(isList.bg)
					/*
							绘制头像
							绘制头像如果地址属于微信官网需要添加域名白名单	downloadFile合法域名	https://wx.qlogo.cn 
							小程序未配置预览需要开启调试模式
							h5可能会有跨域（可能||猜测）问题导致图片无法显示
							调用方式:this.circleImg(img, x, y, r)
							img:图片路径
							x:0~1 百分比离左边距离,
							y:0~1 百分比离顶部距离
							r:0~1 || Number  半径
						*/
				// await this.circleImg('https://wx.qlogo.cn/mmopen/vi_32/tQTicYLeq4icmGWyd95tXUAZt7ibMpWqAvt2Df8MykLtfJM2D1oN5rueJno94qkSZeFLDlkha2MxFWzWn0y8AdgIA/132',0.35,0.22,12)
				// await this.circleImg('https://wx.qlogo.cn/mmopen/vi_32/tQTicYLeq4icmGWyd95tXUAZt7ibMpWqAvt2Df8MykLtfJM2D1oN5rueJno94qkSZeFLDlkha2MxFWzWn0y8AdgIA/132',0.35,0.22,12)
				await this.drawBg(isList.scan)
				await this.drawText(isList.title)
				await this.drawText(isList.price)
				// await this.drawText({ text: 'zwyboom', sLeft: 0.67, sTop: 0.53, fontSize: 10, color: '#5A390F' })
				// await this.drawText({ text: this.today, sLeft: 0.64, sTop: 0.58, fontSize: 10, color: '#5A390F' })
				// await this.drawText({ text: '有些人走着走着就没了', sLeft: 0.1, sTop: 0.65, fontSize: 10, color: '#5A390F', bold: true })
				// await this.drawText({ text: ['XXXXXXXXXXXXXXXX', 'XXXXXXXXX', 'XXXXXXXX'], sLeft: 0.37, sTop: 0.85, fontSize: 10, color: '#5A390F', lineHeight: 12 })
							/*
									绘制单行文本
									调用方式:this.drawText({
										text:'文本', String || Array
										sLeft:0~1 || 'center' 百分比离左边距离,
										sTop:0~1 百分比离顶部距离,
										fontSize:Number 文字大小,
										color:'' 颜色,
										bold:Boolean 粗体,
										lineHeight:Number //如果是数组则设置行高
									})
								*/
				console.log('drawPara')
				this.drawPara({
					para: '', //文本
					fontSize: 10, //字体大小
					sLeft: 0.06, //百分比离左边距离
					sTop: 0.32, //百分比李作边距离
					titleHeight: 16, //一行高度
					sMaxWidth: 0.84, //一行最大宽度
					redWord: ['高1亮1文1字', '高2亮2文2字', '兰博基尼优惠劵'], //关键字
					color: '#5A390F', //正常颜色
					redColor: '#DD524D', //高亮颜色
					bold: false //是否加粗
				}).then(()=>{
					console.log('saveCans')
					this.saveCans();
				})
		},
		longpress() {
			uni.saveImageToPhotosAlbum({
				filePath: this.tempImg,
				success: function(res) {
					uni.showToast({
						title: '保存相册成功'
					});
					console.log('save success');
				},
				fail(res) {
					console.log(res);
					if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
						uni.showModal({
							title: '您需要授权相册权限',
							success(res) {
								if (res.confirm) {
									uni.openSetting({
										success(res) {},
										fail(res) {
											console.log(res);
										}
									});
								}
							}
						});
					}
				}
			});
		},
		measureText(text, fontSize = 10) {
			text = String(text);
			var text = text.split('');
			var width = 0;
			text.forEach(function(item) {
				if (/[a-zA-Z]/.test(item)) {
					width += 7;
				} else if (/[0-9]/.test(item)) {
					width += 5.5;
				} else if (/\./.test(item)) {
					width += 2.7;
				} else if (/-/.test(item)) {
					width += 3.25;
				} else if (/[\u4e00-\u9fa5]/.test(item)) {
					//中文匹配
					width += 10;
				} else if (/\(|\)/.test(item)) {
					width += 3.73;
				} else if (/\s/.test(item)) {
					width += 2.5;
				} else if (/%/.test(item)) {
					width += 8;
				} else {
					width += 10;
				}
			});
			return (width * fontSize) / 10;
		},
		closeCans() {
			this.$emit('closePost');
		},
		drawForm(form, title) {
			return new Promise((resolve, reject) => {
				let lineHeight = 20;
				let formWidth = this.cansWidth * 0.9;
				let formHeight = lineHeight * (form.length + 2) + nowTop;
				let tempWidth = {};
				for (var i = 0; i < title.length + 1; i++) {
					if (i == 0) {
						tempWidth[0] = this.cansWidth * 0.1;
					} else if (i == title.length) {
						tempWidth[i] = this.cansWidth * 0.9;
					} else {
						tempWidth[i] = this.cansWidth * title[i]['sWidth'];
					}
				}
				this.ctx.lineWidth = 0.5;
				this.ctx.setFontSize(8);
				this.ctx.setTextBaseline('top');
				// 竖直
				for (var i = 0; i <= title.length + 1; i++) {
					this.ctx.moveTo(tempWidth[i], nowTop + lineHeight);
					//如果不设置moveTo，当前画笔没有位置
					this.ctx.lineTo(tempWidth[i], formHeight);
				}
				// 横线
				for (var i = 0; i <= form.length + 1; i++) {
					let tempH = lineHeight * (i + 1) + nowTop;
					this.ctx.moveTo(tempWidth[0], tempH);
					this.ctx.lineTo(formWidth, tempH);
					if (i <= form.length) {
						if (i == 0) {
							for (var t = 0; t < title.length; t++) {
								this.ctx.fillText(title[t].name, tempWidth[t] + 8, tempH + 8);
							}
						} else {
							let tempI = i - 1;
							for (var key in form[tempI]) {
								this.ctx.fillText(form[tempI][key], tempWidth[key] + 8, tempH + 8);
							}
						}
					}
				}
				this.ctx.stroke();
				this.ctx.draw(true);
				setTimeout(() => {
					nowTop = formHeight + 30;
					resolve();
				}, 50);
			});
		},
		saveCans() {
			console.log('保存');
			let tempRatio = 1.5;

			// #ifdef H5 || APP-PLUS
			tempRatio = 1;
			// #endif

			var that = this;
			uni.canvasToTempFilePath(
				{
					x: 0,
					y: 0,
					width: that.cansWidth * tempRatio,
					height: that.cansHeight * tempRatio,
					destWidth: that.cansWidth * tempRatio * 2,
					destHeight: that.cansHeight * tempRatio * 2,
					canvasId: 'zwyPoster',
					success: function(res) {
						uni.hideLoading();
						that.tempImg = res.tempFilePath;
						setTimeout(() => {
							that.tempImgShow = true;
						}, 100);
					},
					fail(res) {
						uni.hideLoading();
						console.log(res);
					}
				},
				this
			);
		},
		circleImg(img, x, y, r) {
			var that = this;
			return new Promise((resolve, reject) => {
				uni.downloadFile({
					url: img,
					success(res) {
						console.log(res)
						x = Math.ceil(that.cansWidth * x);
						y = Math.ceil(that.cansHeight * y);
						r = r > 1 ? r : Math.ceil(that.cansWidth * r);
						that.ctx.save();
						var d = 2 * r;
						var cx = x + r;
						var cy = y + r;
						that.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
						that.ctx.clip();
						console.log(res.tempFilePath)
						that.ctx.drawImage(res.tempFilePath, x, y, d, d);
						that.ctx.restore();
						that.ctx.draw(true);
						resolve();
					},
					fail(res) {
						console.log(res)
						resolve()
					}
				});
			});
		},
		drawPara(item) {
			return new Promise((resolve, reject) => {
				var redIndexObj = {};
				if (item.redWord.length > 0) {
					for (var i = 0; i < item.redWord.length; i++) {
						let startIndex = 0,
							index;
						while ((index = item.para.indexOf(item.redWord[i], startIndex)) > -1) {
							redIndexObj[index] = true;
							for (var j = 0; j < item.redWord[i].length; j++) {
								redIndexObj[index + j] = true;
							}
							startIndex = index + 1;
						}
					}
				}
				this.ctx.font = `normal normal ${item.fontSize}px sans-serif`;
				this.ctx.setFillStyle(item.color);
				var isLeft;
				if (item.sLeft == 'center') {
					isLeft = this.cansWidth * (0.5 - item.sMaxWidth / 2) - item.fontSize;
				} else {
					isLeft = item.sLeft * this.cansWidth;
				}
				var maxWidth = Math.floor(this.cansWidth * item.sMaxWidth);
				console.log(item.sMaxWidth);
				console.log(maxWidth);
				var tempList = item.para.split('');
				var nowText = '',
					isCol = 0,
					textWidth = 0;
				for (var i = 0; i < tempList.length; i++) {
					if (i > 0) {
						nowText += tempList[i - 1];
					} else {
						nowText += tempList[0];
					}
					textWidth = this.measureText(nowText, item.fontSize);
					if (textWidth > maxWidth) {
						isCol++;
						nowText = '占';
						textWidth = this.measureText(nowText, item.fontSize);
					}
					if (redIndexObj[i]) {
						this.ctx.save();
						if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px sans-serif`;
						this.ctx.setFillStyle(item.redColor);
					}
					this.ctx.fillText(tempList[i], isLeft + textWidth, item.sTop * this.cansHeight + item.titleHeight * isCol);
					this.ctx.restore();
				}
				this.ctx.draw(true);
				setTimeout(() => {
					resolve();
				}, 50);
			});
		},
		drawBg(item) {
			return new Promise((resolve, reject) => {
				let x, y, w, h, r;
				y = item.sTop <= 1 ? this.cansHeight * item.sTop : item.sTop;
				w = item.sWidth <= 1 ? this.cansWidth * item.sWidth : item.sWidth;
				h = item.sHeight <= 1 ? this.cansHeight * item.sHeight : item.sHeight;
				if (item.sLeft == 'center') {
					x = item.sWidth <= 1 ? this.cansWidth * (0.5 - item.sWidth / 2) : this.cansWidth * 0.5 - item.sWidth / 2;
				} else {
					x = this.cansWidth * item.sLeft;
				}
				if (item.r) {
					r = item.r;
					this.ctx.save();
					if (w < 2 * r) r = w / 2;
					if (h < 2 * r) r = h / 2;
					this.ctx.beginPath();
					this.ctx.moveTo(x + r, y);
					this.ctx.arcTo(x + w, y, x + w, y + h, r);
					this.ctx.arcTo(x + w, y + h, x, y + h, r);
					this.ctx.arcTo(x, y + h, x, y, r);
					this.ctx.arcTo(x, y, x + w, y, r);
					this.ctx.closePath();
					this.ctx.clip();
					this.ctx.drawImage(item.url, x, y, w, h);
					this.ctx.restore(); // 返回上一状态
					this.ctx.draw(true);
				} else {
					this.ctx.drawImage(item.url, x, y, w, h);
					this.ctx.draw(true);
				}
				console.log(item.url);
				setTimeout(() => {
					resolve();
				}, 50);
			});
		},
		drawWebBgTest(item) {
			var that = this;
			return new Promise((resolve, reject) => {
				uni.downloadFile({
					url: item.url,
					success(res) {
						let x, y, w, h, r;
						y = that.cansHeight * item.sTop;
						w = that.cansWidth * item.sWidth;
						h = item.sHeight ? that.cansHeight * item.sHeight : w;
						if (item.sLeft == 'center') {
							x = that.cansWidth * (0.5 - item.sWidth / 2);
						} else {
							x = that.cansWidth * item.sLeft;
						}
						if (item.r) {
							r = item.r;
							// 开始绘制
							that.ctx.save();
							that.ctx.beginPath();
							that.ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
							that.ctx.moveTo(x + r, y);
							that.ctx.lineTo(x + w - r, y);
							that.ctx.lineTo(x + w, y + r);
							that.ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
							that.ctx.lineTo(x + w, y + h - r);
							that.ctx.lineTo(x + w - r, y + h);
							that.ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
							that.ctx.lineTo(x + r, y + h);
							that.ctx.lineTo(x, y + h - r);
							that.ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
							that.ctx.lineTo(x, y + r);
							that.ctx.lineTo(x + r, y);
							that.ctx.closePath();
							that.ctx.clip();
							that.ctx.drawImage(res.tempFilePath, x, y, w, h);
							that.ctx.restore(); // 返回上一状态
							that.ctx.draw(true);
						} else {
							that.ctx.drawImage(res.tempFilePath, x, y, w, h);
							that.ctx.draw(true);
						}
						resolve();
					}
				});
			});
		},
		drawText(item) {
			return new Promise((resolve, reject) => {
				var isLeft;
				this.ctx.save();
				if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px sans-serif`;
				this.ctx.setFillStyle(item.color);
				this.ctx.setFontSize(item.fontSize);
				if (item.sLeft == 'center') {
					let textWidth = this.measureText(item.text, item.fontSize);
					isLeft = this.cansWidth * 0.5 - textWidth / 2;
				} else {
					isLeft = item.sLeft <= 1 ? item.sLeft * this.cansWidth : item.sLeft;
				}
				let tempTop = item.sTop;
				if (item.sTop <= 1) item.sTop = item.sTop * this.cansHeight;
				if (item.text instanceof Array) {
					if (!item.lineHeight) item.lineHeight = item.fontSize + 2;
					console.log('我是数组', item.text);
					for (var i = 0; i < item.text.length; i++) {
						this.ctx.fillText(item.text[i], isLeft, item.sTop + item.lineHeight * i);
					}
				} else {
					console.log('我是字符串', item.text);
					this.ctx.fillText(item.text, isLeft, item.sTop);
				}
				this.ctx.draw(true);
				this.ctx.restore();
				setTimeout(() => {
					resolve();
				}, 50);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.bg {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	top: 0;
	z-index: 998;
	background-color: rgba(0, 0, 0, 0.8);
}
.fixedBox {
	width: 100%;
	height: 100rpx;
	position: fixed;
	bottom: 30rpx;
	left: 0;
	display: flex;
	z-index: 1000;
	.boxLeft,
	.boxRight {
		width: 50%;
		height: 100rpx;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 1000;
		justify-content: center;
		.flexBtn {
			position: relative;
			z-index: 1000;
			width: 300rpx;
			height: 60rpx;
			text-align: center;
			line-height: 55rpx;
			font-size: 24rpx;
			// border-bottom: 6rpx #f58365 solid;
			border-radius: 32rpx;
			color: white;
			background: linear-gradient(to left, #4cd964, #1DC7AC);
		}
	}
}
.btnHover {
	height: 55rpx !important;
	border-bottom: 0 #f6be3c solid !important;
	transform: translateY(3px) translateZ(0px) !important;
}
.isCan {
	// border: 6px solid white;
	border-radius: 10px;
	z-index: 999;
	position: fixed;
	left: 0;
	// right: 0;
	// bottom: 0;
	top: -99999px;
	margin: auto;
	background-size: 100%;
}
.showImg {
	border: 6px solid white;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	z-index: 1111;
}
</style>
