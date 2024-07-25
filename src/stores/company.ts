import { ICompany } from '@/types/interface.ts'
import { defineStore } from 'pinia'

interface UserCompanyState {
  companyNameValue: string | null
  industryValue: string | null
  industryCode: string | null
  companyPhoneValue: string | null
  companyEmailValue: string | null
  companyHomepageValue: string | null
  companyAddressValue: string | null
  countryValue: string | null
  countryCode: string | null
  regionValue: string | null
  companyLogo: string | null
}

export const useCompanyInfo = defineStore('companyInfo', {
  state: (): UserCompanyState => ({
    companyNameValue: '',
    industryValue: '',
    industryCode: '',
    companyPhoneValue: '',
    companyEmailValue: '',
    companyHomepageValue: '',
    companyAddressValue: '',
    countryValue: '',
    countryCode: '',
    regionValue: '',
    companyLogo: ''
  }),
  actions: {
    setCompanyInfo(companyInfo: ICompany): void {
      if (!companyInfo) {
        return
      }
      this.companyNameValue = companyInfo.company
      this.industryValue = companyInfo.industry
      this.industryCode = companyInfo.companyIndustryCode
      this.companyPhoneValue = companyInfo.companyPhone
      this.companyEmailValue = companyInfo.companyEmail
      this.companyHomepageValue = companyInfo.companyHomepage
      this.companyAddressValue = companyInfo.companyAddress
      this.countryValue = companyInfo.companyCountry
      this.countryCode = companyInfo.companyCountryCode
      this.regionValue = companyInfo.companyRegion
      this.companyLogo = companyInfo.companyLogo
    }
  }
})
