import type { ICompany } from '@/shared/types/common.ts';
import { defineStore } from 'pinia';

interface UserCompanyState {
	companyNameValue: string | null;
	industryValue: string | null;
	industryCode: string | null;
	companyPhoneValue: string | null;
	companyEmailValue: string | null;
	companyHomepageValue: string | null;
	companyAddressValue: string | null;
	countryValue: string | null;
	countryCode: string | null;
	regionValue: string | null;
	companyLogo: string | null;
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
		companyLogo: '',
	}),
	actions: {
		setCompanyInfo(companyInfo: ICompany): void {
			if (!companyInfo) {
				return;
			}
			this.companyNameValue = companyInfo.company ?? null;
			this.industryValue = companyInfo.industry;
			this.industryCode = companyInfo.companyIndustryCode ?? null;
			this.companyPhoneValue = companyInfo.companyPhone ?? null;
			this.companyEmailValue = companyInfo.companyEmail ?? null;
			this.companyHomepageValue = companyInfo.companyHomepage ?? null;
			this.companyAddressValue = companyInfo.companyAddress ?? null;
			this.countryValue = companyInfo.companyCountry ?? null;
			this.countryCode = companyInfo.companyCountryCode ?? null;
			this.regionValue = companyInfo.companyRegion ?? null;
			this.companyLogo = companyInfo.companyLogo ?? null;
		},
	},
});
