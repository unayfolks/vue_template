import {
    defineStore
} from "pinia";
import axios from 'axios';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        categories: [],
        category: [],
        error: {
            'status': null,
            'message': null
        }
    }),
    actions: {
        async getCategory() {
            try {
                const res = await axios.get(`${this.apiUrl}/api/v1/categories`);
                this.categories = res.data.data.list
            } catch (error) {
                console.error('Failed to fetch users:', error)
            }
        },
        async addCategory(category) {
            try {
                console.log(category)
                const res = await axios.post(`${this.apiUrl}/api/v1/categories`, category);
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
                console.log(res)
            } catch (error) {
                console.log(error)

            }
        },
        async deleteCategory(id) {
            try {
                const res = await axios.delete(`${this.apiUrl}/api/v1/categories/${id}`)
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
                console.log(res)
            } catch (error) {
                console.log(error)

            }
        },
        async updateCategory(category) {
            try {
                const res = await axios.put(`${this.apiUrl}/api/v1/categories`, category);
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
                console.log(this.error)

            } catch (error) {
                console.log(error)
                this.error = {
                    status: error.response.status,
                    message: error.response.data.message
                };
            }
        }
    }
})