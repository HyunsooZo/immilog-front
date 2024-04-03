const criteria = 7;

export const showAd = index => {
	return index % criteria === 0 && index !== 0;
};
