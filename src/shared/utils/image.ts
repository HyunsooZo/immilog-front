// 이미지 사이즈를 줄이는 함수
const resizeImage = (file: File, scale: number): Promise<Blob> => {
	return new Promise((resolve, reject) => {
		// 이미지 파일 형식 확인
		if (!file.type.startsWith('image/')) {
			reject(new Error('이미지 파일이 아닙니다.'));
			return;
		}

		const img = new Image();
		const url = URL.createObjectURL(file);
		
		img.onload = () => {
			// URL 객체 정리
			URL.revokeObjectURL(url);
			
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Canvas를 지원하지 않는 환경입니다.'));
				return;
			}

			// 스케일 적용한 크기 계산 (최소 1픽셀 보장)
			const newWidth = Math.max(1, Math.round(img.width * scale));
			const newHeight = Math.max(1, Math.round(img.height * scale));
			
			canvas.width = newWidth;
			canvas.height = newHeight;
			
			// 이미지 품질 향상을 위한 설정
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';
			
			ctx.drawImage(img, 0, 0, newWidth, newHeight);
			
			// 지원되는 MIME 타입 확인 후 fallback
			let mimeType = file.type;
			if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
				mimeType = 'image/jpeg'; // fallback to JPEG
			}
			
			canvas.toBlob(blob => {
				if (blob) {
					resolve(blob);
				} else {
					// JPEG로 다시 시도
					canvas.toBlob(blob => {
						if (blob) {
							resolve(blob);
						} else {
							reject(new Error('Blob 생성에 실패했습니다.'));
						}
					}, 'image/jpeg', 0.9);
				}
			}, mimeType, 0.9);
		};
		
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('이미지 로딩 실패'));
		};
		
		img.src = url;
	});
};

export { resizeImage };
