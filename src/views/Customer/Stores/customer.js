import {
    defineStore
} from "pinia";
import axios from "axios";

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        customers: [],
        customer: [],
        modalAction: {
            'action': "",
            'modal_title': "",
            'modal_button': ""
        },
        error: {
            status: null,
            message: null,
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
        },
        async addCustomer(customer) {
            try {
                const res = await axios.post(`${this.apiUrl}/api/v1/customers/add`, customer, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        },
        async deleteCustomer(id) {
            try {
                const res = await axios.delete(`${this.apiUrl}/api/v1/customers/${id}`)
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
            } catch (error) {
                console.log(error)

            }
        },
        async updateCustomer(customer) {
            // console.log(customer)
            // customer.forEach((value, key) => {
            //     console.log(key, value);
            // });
            
            try{
                const res = await axios.post(`${this.apiUrl}/api/v1/customers`, customer, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                this.error = {
                    status: res.status,
                    message: res.data.message
                };
            }catch(error){
                console.log(error)
            }
        }
    },
    getters: {
        action(actions) {
            const action = actions.openForm(this.modalAction.action)
            return action
        },
        // action:(state)=>state
    }
})