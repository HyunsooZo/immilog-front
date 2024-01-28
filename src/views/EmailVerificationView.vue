<template>
	<div class="content">
		<div class="msg-wrap">
			<i class="item__icon item__icon--check">
				<!-- //완료 .item__icon--check / 취소 .item__icon--error / 알림 .item__icon--warning -->
				<div class="svg--item-wrap">
					<svg class="svg--circle" viewBox="0 0 168 168">
						<path
							d="M163 84C163 127.63 127.63 163 84 163C40.3695 163 5 127.63 5 84C5 40.3695 40.3695 5 84 5C127.63 5 163 40.3695 163 84Z" />
					</svg>
					<!-- check -->
					<svg class="svg--check" viewBox="0 0 168 168">
						<path d="M50 85 75 110 120 65" />
					</svg>
					<!-- error -->
					<svg class="svg--error path--1" viewBox="0 0 168 168">
						<path d="M55 55 113 113" />
					</svg>
					<svg class="svg--error path--2" viewBox="0 0 168 168">
						<path d="M113 55 55 113" />
					</svg>
					<!-- warning -->
					<svg class="svg--warning" viewBox="0 0 168 168">
						<path d="M84 50 84 96" />
						<path d="M84 114 84 118" />
					</svg>
				</div>
			</i>
			<p class="item__msg"><em>회원가입이 완료</em> 되었습니다.</p>
			<p class="item__description">
				가입한 이메일에서 인증 확인 후 이용이 가능합니다.
			</p>
		</div>

	</div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
