// useGeolocation.js

export const getCoordinate = () => {
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
