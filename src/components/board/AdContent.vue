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
import { onMounted } from 'vue';
import Swiper from 'swiper/bundle';

// Swiper를 초기화하는 함수
const initSwiper = () => {
	new Swiper('.swiper-container', {
		slidesPerView: 1,
		observer: true,
		observeParents: true,
		centeredSlides: true,
		loop: true,
		loopAdditionalSlides: 1,
		loopPreventsSliding: true,
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

// 컴포넌트가 마운트될 때 Swiper 초기화
onMounted(initSwiper);
</script>

<style>
@import 'swiper/swiper-bundle.css';
</style>
