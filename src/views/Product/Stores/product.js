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
        modalAction: {
            'action': "",
            'modal_title': "",
            'modal_button': ""
        },
        detail:[]

    }),
    actions: {
        openForm(newAction, product){
            this.modalAction.action = newAction
            this.product = product
        },  
        async getProducts() {
            try {
                const res = await axios.get(`${this.apiUrl}/api/v1/products`);
                let data = res.data.data.list
                this.products = data
            } catch (error) {
                console.error(error)
            }
        },
        async deleteProduct(id){
            try {
                const res = await axios.delete(`${this.apiUrl}/api/v1/products/${id}`)
                this.error = {
                    status : res.status,
                    message : res.data.message
                }
            } catch (error) {
                
            }
        },
        async addDetail(detail){
            console.log(detail)
        }   
    }
})