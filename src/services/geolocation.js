// useGeolocation.js
export const getCoordinate = (latitude, longitude) => {
	return new Promise((resolve, reject) => {
		if ('geolocation' in navigator) {
			navigator.permissions
				.query({ name: 'geolocation' })
				.then(permissionResult => {
					if (
						permissionResult.state === 'granted' ||
						permissionResult.state === 'prompt'
					) {
						navigator.geolocation.getCurrentPosition(
							position => {
								latitude.value = position.coords.latitude;
								longitude.value = position.coords.longitude;
								localStorage.setItem('latitude', position.coords.latitude);
								localStorage.setItem('longitude', position.coords.longitude);
								resolve();
							},
							error => {
								console.error(`ERROR(${error.code}): ${error.message}`);
								reject(error);
							},
						);
					} else if (permissionResult.state === 'denied') {
						console.error('Geolocation permission denied.');
						reject(new Error('Geolocation permission denied.'));
					}
				})
				.catch(error => {
					console.error('Failed to get location:', error);
					reject(error);
				});
		} else {
			reject(new Error('Geolocation is not supported by this browser.'));
		}
	});
};
