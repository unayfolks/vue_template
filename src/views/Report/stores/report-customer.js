import { defineStore } from "pinia";
import axios from "axios";

export const useReportCustomerStore = defineStore('report',{
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        startDate: '',
        endDate: '',
        customerId:'',
        settingDate:'',
        reportData:[],
        reportSetting:[]
    }),
    actions:{
        async getReport(){
            try {
                const url = `${this.apiUrl}/api/v1/report/sales-customer?start_date=${this.startDate}&end_date=${this.endDate}&customer_id=${this.customerId}`
                const res = await axios.get(url)
                this.reportData = res.data.data
                this.reportSetting = res.data.settings
                // console.log(this.reportData, this.reportSetting)
            } catch (error) {
                console.log(error);
            }
        },
        async changeDate(date){
            let start = date.substring(0,10)
            let end = date.substring(14, 28)
            this.startDate = start
            this.endDate = end
        },
        async changeCustomer(customer){
            this.customerId = customer
        }
    }
} )