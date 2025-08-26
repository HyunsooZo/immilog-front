<template>
	<div class="splash color--bg_dark">
		<!-- //.color--bg -->
		<div class="svg--wrap">
			<div class="logo-container animate">
				<svg
					class="svg--logo"
					viewBox="0 0 70 50"
					width="70"
					height="50"
				>
					<!-- Circle 1 -->
					<circle
						cx="20"
						cy="18"
						r="16"
						fill="none"
						stroke="#a5b4fc"
						stroke-width="4"
						stroke-linecap="round"
						stroke-dasharray="100.48"
						stroke-dashoffset="100.48"
						class="circle1"
					/>
					
					<!-- Circle 2 -->
					<circle
						cx="36"
						cy="28"
						r="16"
						fill="none"
						stroke="#ddd6fe"
						stroke-width="4"
						stroke-linecap="round"
						stroke-dasharray="100.48"
						stroke-dashoffset="-100.48"
						class="circle2"
					/>
				</svg>
			</div>
		</div>
	</div>
</template>

<style scoped>
.logo-container {
  display: inline-block;
}

.svg--wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.circle1,
.circle2 {
  transform-origin: center;
}

.logo-container.animate .circle1 {
  animation: drawCircle1 1.3s ease-in-out 0.1s both;
}

.logo-container.animate .circle2 {
  animation: drawCircle2 1.3s ease-in-out 0.1s both;
}

@keyframes drawCircle1 {
  0% {
    stroke-dashoffset: 100.48;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes drawCircle2 {
  0% {
    stroke-dashoffset: -100.48;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>
