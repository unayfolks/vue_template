import {
    defineStore
} from "pinia";
import axios from "axios";

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        customers: [],
        customer:[],
        modalAction: {
            'action': "",
            'modal_title': "",
            'modal_button': ""
        },
    }),
    actions: {
        openForm(newAction, customer) {
            this.modalAction.action = newAction
            this.customer = customer
        },
        async getCustomers() {
            try {
                const res = await axios.get(`${this.apiUrl}/api/v1/customers`);
                let data = res.data.data.list
                this.customers = data
            } catch (error) {
                console.error(error)
            }
        }
    },
    getters: {
        action(actions){
            const action = actions.openForm(this.modalAction.action)
            return action
        },
        // action:(state)=>state
    }
})