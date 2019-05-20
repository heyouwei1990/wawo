
class Uploader {
	choose(num) {
		return new Promise((resolve, reject) => {
			uni.chooseImage({
				count: num,
				success(res) {
					resolve(res.tempFilePaths)
				},
				fail(err) {
					reject(err)
				}
			})
		})

	}
	upload_one(path,url) {
		var token=uni.getStorageSync('Jwt');
		return new Promise((resolve, reject) => {
			uni.showLoading({
				title: '上传中'
			})
			uni.uploadFile({
				url: url, //仅为示例，非真实的接口地址
				filePath: path,
				name: 'file',
				header:{
					Jwt:token
				},
				success: (uploadFileRes) => {
					if ("string" === typeof uploadFileRes.data) {
						resolve(JSON.parse(uploadFileRes.data).data)
					} else {
						resolve(uploadFileRes.data.data)
					}

				},
				complete() {
					uni.hideLoading()
				}
			});
		})
	}
	upload(path_arr,url) {
		let num = path_arr.length;
		return new Promise(async (resolve, reject) => {
			let img_urls = []
			for (let i = 0; i < num; i++) {
				let img_url = await this.upload_one(path_arr[i],url);
				img_urls.push(img_url)
			};
			resolve(img_urls)
		})
	}
	choose_and_upload(num, url) {
		return new Promise(async (resolve, reject) => {
			let path_arr = await this.choose(num);
			let img_urls = await this.upload(path_arr,url);
			resolve(img_urls);
		})

	}
}
export default Uploader;
