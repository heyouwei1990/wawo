export default class Validate{
	/**
	 * 验证手机号
	 */
	static mobile(value){
		if(value==''){
			uni.showToast({
				title:'请输入手机号',
				icon:'none'
			})
			return false;
		}
		if(!/^1[3456789]\d{9}$/g.test(value)){
			uni.showToast({
				title:'手机号格式不正确',
				icon:'none'
			})
			return false;
		}
		return true;
	}
	/**
	 * 手机号选填
	 */
	static optionalMobile(value){
		if(value!=='' && !/^1[3456789]\d{9}$/g.test(value)){
			uni.showToast({
				title:'手机号格式不正确',
				icon:'none'
			})
			return false;
		}
		return true;
	}
	/**
	 * 验证密码
	 */
	static password(value){
		if(value==''){
			uni.showToast({
				title:'请输入密码',
				icon:'none'
			})
			return false;
		}else if(!/^\w{6,20}$/.test(value)){
			uni.showToast({
				title:'密码须为6-20个英文字母或数字',
				icon:'none'
			})
			return false;
		}
		return true;
	}
	/**
	 * 验证数字验证码
	 */
	static code(value){
		if(value==''){
			uni.showToast({
				title:'请输入验证码',
				icon:'none'
			})
			return false;
		}else if(!/^\d{4,6}$/.test(value)){
			uni.showToast({
				title:'验证码不正确',
				icon:'none'
			})
			return false;
		}
		return true;
	}
	/**
	 * 验证支付密码
	 */
	static payPassword(value){
		if(value==''){
			uni.showToast({
				title:'请输入密码',
				icon:'none'
			})
			return false;
		}else if(!/^\d{6}$/.test(value)){
			uni.showToast({
				title:'密码请输入6位数字',
				icon:'none'
			})
			return false;
		}
		return true;
	}
	/**
	 * 银行卡号验证
	 */
	static bankcard(value){
		if(value==''){
			uni.showToast({
				title:'请输入银行卡',
				icon:'none'
			})
			return false;
		}else if(!/^([1-9]{1})(\d{15}|\d{18})$/.test(value)){
			uni.showToast({
				title:'请输入正确的银行卡',
				icon:'none'
			})
			return false;
		}
		return true;
	}
	/**
	 * 身份证验证
	 */
	static idCard(value){
		if(value==''){
			uni.showToast({
				title:'请输入身份证号码',
				icon:'none'
			})
			return false;
		}else if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)){
			uni.showToast({
				title:'请输入正确的身份证号码',
				icon:'none'
			})
			return false;
		}
		return true;
	}
	
	/**
	 * 姓名认证
	 */
	static fullName(value){
		if(!/^[\u4e00-\u9fa5]{2,4}$/.test(value)){
			uni.showToast({
				title:'请输入2-4个汉字的姓名',
				icon:'none'
			})
			return false;
		}
		return true;
	}
}