<template>
	<div class="content">
		<!-- 상단 고정 영역 -->
		<SearchBar />
		<!-- tab button -->
		<div class="menu-wrap">
			<ul class="menu__inner">
				<li
					v-for="(menu, index) in menus"
					:key="index"
					:class="{ active: menu.active.value }"
					class="menu__list"
				>
					<button
						@click="selectMenu(menu)"
						type="button"
						class="button"
						:aria-selected="menu.active.value.toString()"
					>
						{{ menu.label }}
					</button>
				</li>
			</ul>
			<span
				class="menu__bar"
				:style="{ left: menuBarLeft, width: menuBarWidth }"
			></span>
		</div>

		<!-- 목록 -->
		<BoardContent />
	</div>
</template>

<script setup>
import SearchBar from '@/components/SearchBar.vue';
import BoardContent from '@/components/BoardContent.vue';
</script>
