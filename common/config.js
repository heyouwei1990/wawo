const debug=false;//false为生产环境
const version={
	number:'1.0.6',
	versionId:106
};
let host='';
let origin='';
if(debug){
	// origin='http://minghu.natapp1.cc';
	origin='http://192.168.3.127:8086';
}else{
	origin='http://wawoapi.haomaieco.cn';
}
host=origin+'/api';
let shareHost='http://wawoapi.haomaieco.cn/api/h5'
let imgBaseUrl='http://wawocdn.haomaieco.cn/';
let appid='';
let appkey='';

export default {
	host,
	appid,
	appkey,
	debug,
	origin,
	imgBaseUrl,
	shareHost,
	version,
}