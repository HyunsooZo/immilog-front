import { defineStore } from 'pinia'
import type { ILocation, ICountry } from '@/types/interface'

// 위치 정보를 위한 Pinia 스토어
export const useLocationStore = defineStore('location', {
  state: (): ILocation => ({
    latitude: null,
    longitude: null
  }),
  actions: {
    // 위치 설정 메서드
    setLocation({ latitude, longitude }: { latitude: number; longitude: number }): void {
      this.latitude = latitude
      this.longitude = longitude
    }
  }
})

// 국가 정보를 위한 Pinia 스토어
export const useCountryStore = defineStore('country', {
  state: (): ICountry => ({
    country: null,
    region: null
  }),
  actions: {
    // 국가 설정 메서드
    setCountry({ country, region }: { country: string; region: string }): void {
      this.country = country
      this.region = region
    }
  }
})
