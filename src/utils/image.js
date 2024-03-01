// 이미지 사이즈를 줄이는 함수
const resizeImage = (file, scale) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.src = URL.createObjectURL(file);
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.toBlob(blob => {
				resolve(blob);
			}, file.type);
		};
		img.onerror = reject;
	});
};

export { resizeImage };
