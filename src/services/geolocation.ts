// 사용자의 현재 위치 좌표를 가져오는 함수
export const getCoordinate = () => {
	return new Promise((resolve, reject) => {
		// 브라우저에서 geolocation 기능을 지원하는지 확인
		if ('geolocation' in navigator) {
			navigator.permissions
				.query({ name: 'geolocation' })
				.then(permissionResult => {
					// 위치 접근 권한이 허용되었거나 사용자에게 요청되는 경우
					if (
						permissionResult.state === 'granted' ||
						permissionResult.state === 'prompt'
					) {
						navigator.geolocation.getCurrentPosition(
							position => {
								// 좌표를 localStorage에 저장
								localStorage.setItem('latitude', position.coords.latitude);
								localStorage.setItem('longitude', position.coords.longitude);
								resolve();
							},
							error => {
								// 위치 정보를 가져오는 데 실패한 경우 에러 출력 및 reject
								console.error(`ERROR(${error.code}): ${error.message}`);
								reject(error);
							},
						);
					} else if (permissionResult.state === 'denied') {
						// 위치 접근 권한이 거부된 경우
						console.error('Geolocation permission denied.');
						reject(new Error('Geolocation permission denied.'));
					}
				})
				.catch(error => {
					// 권한 요청 과정에서 에러 발생한 경우
					console.error('Failed to get location:', error);
					reject(error);
				});
		} else {
			// 브라우저에서 geolocation 기능을 지원하지 않는 경우
			reject(new Error('Geolocation is not supported by this browser.'));
		}
	});
};
