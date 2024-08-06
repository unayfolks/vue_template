import {
    defineStore
} from "pinia";
import axios from 'axios';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        categories: []
    }),
    actions: {
        async getCategory() {
            try {
                const res = await axios.get(`${this.apiUrl}/api/v1/categories`);
                this.categories = res.data.data.list
                console.log(this.categories)
            } catch (error) {
                console.error('Failed to fetch users:', error)
            }
        }
    }
})