import {
    defineStore
} from "pinia";
import axios from "axios";

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        transaction: [],
        error: {
            status: null,
            message: null
        }
    }),
    actions: {
        async addTransaction(transaction) {
            try {
                const res = await axios.post(`${this.apiUrl}/api/v1/sales`, transaction, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                console.log(res.status, res.data.message)
                // this.error = {
                //     status: res.status,
                //     message: res.data.message
                // };
                this.error.status = res.status
                this.error.message = res.data.message
            } catch (error) {
                console.log(error)
                this.error = {
                    status: error.response ?.status,
                    message: 'Failed to fetch users: ' + error.message,
                };
            }
        }
    }
})