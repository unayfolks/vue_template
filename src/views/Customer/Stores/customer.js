import {
    defineStore
} from "pinia";
import axios from "axios";

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        customers: [],
    }),
    actions: {
        async getCustomers() {
            try {
                const res = await axios.get(`${this.apiUrl}/api/v1/customers`);
                let data = res.data.data.list
                this.customers = data
            } catch (error) {
                console.error(error)
            }
        }
    }
})