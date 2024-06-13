import { defineStore } from 'pinia'

interface MenuState {
  menu: number
  notification: boolean // Change the type to boolean
}

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menu: 0,
    notification: false
  }),
  actions: {
    // 메뉴 번호를 설정하는 메서드, number 타입의 매개변수를 받음
    setMenu(number: number): void {
      this.menu = number
    },
    // 현재 메뉴 번호를 반환하는 메서드
    getMenu(): number {
      return this.menu
    },
    setNotification(notification: boolean): void {
      this.notification = notification
    },
    getNotification(): boolean {
      return this.notification
    }
  }
})
