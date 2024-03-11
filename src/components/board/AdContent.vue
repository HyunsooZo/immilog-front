<template>
	<div class="item swiper-container">
		<div class="swiper-wrapper">
			<div class="swiper-slide">
				<button type="button" class="button">
					<div>광고1</div>
				</button>
			</div>
			<!-- //.swiper-slide -->
			<div class="swiper-slide">
				<button type="button" class="button">
					<div>광고2</div>
				</button>
			</div>
			<!-- //.swiper-slide -->
		</div>
		<!-- 옵션 -->
		<!-- <div class="swiper-pagination"></div> -->
	</div>
</template>

<script setup>
import Swiper from 'swiper/bundle';

const initSwiper = () => {
	const swiper = new Swiper('.swiper-container', {
		slidesPerView: 1,
		spaceBetween: 0,
		effect: 'fade', //default slide
		loop: true,
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	});
};
import { onMounted } from 'vue';
onMounted(initSwiper);
</script>

<style>
@import 'swiper/swiper-bundle.css';
</style>