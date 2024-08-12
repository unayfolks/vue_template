import { defineStore } from "pinia";
import axios from "axios";

export const useReportStore = defineStore('report', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,

    }),
    actions:{
        async getReport () {
            try {
                const url = `${this.apiUrl}/api/v1/report/sales-menu`
                const res = await axios.get(url)

                console.log(res.data)

            } catch (error) {
                console.log(error)
            }
        }
    }
})