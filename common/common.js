export function toast(title) {
	uni.showToast({
		icon: 'none',
		title: title
	})
}
/**
 * 手机验证
 */
export function checkPhone(value) {
	let reg = /^1\d{10}$/
	if (reg.test(value)) {
		return true;
	}
	toast('手机号格式错误');
	return false
}
/**
 * 密码验证
 */
export function checkPwd(value) {
	if (value.length >= 6) {
		return true;
	}
	toast('密码必须大于6位');
	return false
}
/**
 * 验证码验证
 */
export function checkCode(value) {
	if (value.length == 6) {
		return true;
	}
	toast('验证码必须是6位数字');
	return false
}
/**
 * 身份证验证
 */
export function checkIdCard(value) {
	let reg = /^\d{15}|\d{18}$/
	if (reg.test(value)) {
		return true;
	}
	toast('身份证必须是15或18位数字');
	return false
}
/**
 * 银行卡验证
 */
export function checkBankCard(value) {
	let reg = /^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{18})$/
	if (reg.test(value)) {
		return true;
	}
	toast('请输入正确的银行卡号');
	return false
}
// 获取url参数
export function getValue(url) {
	//首先获取地址
	var url = url || window.location.href;
	//获取传值
	var arr = url.split("?");
	//判断是否有传值
	if (arr.length == 1) {
		return null;
	}
	//获取get传值的个数
	var value_arr = arr[1].split("&");
	//循环生成返回的对象
	var obj = {};
	for (var i = 0; i < value_arr.length; i++) {
		var key_val = value_arr[i].split("=");
		obj[key_val[0]] = key_val[1];
	}
	return obj;
}
