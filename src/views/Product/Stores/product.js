import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore('product', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        products: [],
    }),
    actions: {
        async getProducts(){
            try {
                const res = await axios.get(`${this.apiUrl}/api/v1/products`);
                let data = res.data.data.list
                this.products = data
                console.log(res)
            } catch (error) {
                console.error(error)
            }
        }
    }
})