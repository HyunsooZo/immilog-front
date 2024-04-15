import { defineStore } from 'pinia'

interface MenuState {
  menu: number
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menu: 0
  }),
  actions: {
    // 메뉴 번호를 설정하는 메서드, number 타입의 매개변수를 받음
    setMenu(number: number): void {
      this.menu = number
    },
    // 현재 메뉴 번호를 반환하는 메서드
    getMenu(): number {
      return this.menu
    }
  }
})
