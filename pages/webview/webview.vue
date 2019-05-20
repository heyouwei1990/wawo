<template>
	<view>
		<web-view
			:webview-styles="webviewStyles"
			:src="url"
		></web-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url:'',
			status: 2,
			ifAuth: false,
			webviewStyles: {
				progress: {
					color: '#0193fe'
				}
			},
			idcardno: '',
			realName: ''
		};
	},
	onLoad(option) {
		this.url = option.url;
	},
	methods: {
	}
};
</script>

<style lang="scss">
</style>
