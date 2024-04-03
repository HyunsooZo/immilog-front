<template>
	<div class="item swiper-container">
		<div class="swiper-wrapper">
			<div class="swiper-slide _ad01">
				<button type="button" class="button">
					<div>광고1</div>
				</button>
			</div>
			<!-- //.swiper-slide -->
			<div class="swiper-slide _ad02">
				<button type="button" class="button">
					<div>광고2</div>
				</button>
			</div>
			<div class="swiper-slide _ad03">
				<button type="button" class="button">
					<div>광고3</div>
				</button>
			</div>
			<!-- //.swiper-slide -->
		</div>
		<!-- 옵션 -->
		<!-- <div class="swiper-pagination"></div> -->
	</div>
</template>

<script setup lang="ts">
import Swiper from 'swiper/bundle';
import { onMounted } from 'vue';

const initSwiper = () => {
	const swiper = new Swiper('.swiper-container', {
		slidesPerView: 1,
		observer: true,
		observeParents: true,
		centeredSlides: true,
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
			loop: true,
			loopAdditionalSlides: 1,
			loopPreventsSlide: true,
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	});
};
onMounted(initSwiper);
</script>

<style>
@import 'swiper/swiper-bundle.css';
</style>
