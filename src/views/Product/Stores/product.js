import {
    defineStore
} from "pinia";
import axios from "axios";

export const useProductStore = defineStore('product', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        products: [],
        product: [],
        error: {
            status: null,
            message: null
        },
        formAction: {
            'action': "",
            'form_title': "",
            'form_button': ""
        },
        totalData: 0,
        current: 1,
        perpage: 5,
        searchQuery: '',
    }),
    actions: {
        openForm(newAction) {
            this.formAction.action = newAction
        },
        async getProducts() {
            try {
                const url = `${this.apiUrl}/api/v1/products?page=${this.current}&perPage=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url)
                let data = res.data.data.list
                this.products = data
                this.totalData = res.data.data.meta.total
            } catch (error) {
                console.error(error)
            }
        },
        async changePage(newPage) {
            this.current = newPage;
            console.log(newPage)
            await this.getProducts(); 
        },
        async searchProducts(query) {
            this.searchQuery = query;
            this.current = 1; 
            await this.getProducts(); 
            console.log(query)
        },
        async deleteProduct(id) {
            try {
                const res = await axios.delete(`${this.apiUrl}/api/v1/products/${id}`)
                this.error = {
                    status: res.status,
                    message: res.data.message
                }
            } catch (error) {

            }
        },
        async addProduct(product) {
            try {
                const res = await axios.post(`${this.apiUrl}/api/v1/products`, product, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                this.error = {
                    status: res.status,
                    message: res.data.message
                }
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        },
        async updateProduct(product) {
            console.log(product)
            try {
                const res = await axios.put(`${this.apiUrl}/api/v1/products`, product, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                this.error = {
                    status: res.status,
                    message: res.data.message
                }
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }
    }
})