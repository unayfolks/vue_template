import {
    defineStore
} from "pinia";
import axios from "axios";

export const useReportStore = defineStore('report', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        reportData: [],
        reportSetting:[],
        startDate: '',
        endDate: '',
        categoryId: '',
        periodeLength:''
    }),
    actions: {
        async getReport() {
            try {
                const url = `${this.apiUrl}/api/v1/report/sales-menu?start_date=${this.startDate}&end_date=${this.endDate}&category_id=${this.categoryId}`
                const res = await axios.get(url)
                this.reportSetting = res.data.settings
                this.reportData = res.data.data
            } catch (error) {
                console.log(error)
            }
        },
        async changeDate(date) {
            let start = date.substring(0, 10)
            let end = date.substring(14, 28);
            this.startDate = start
            this.endDate = end
        },
        async changeCategory(category){
            this.categoryId = category
        }
    }
})