import {
    defineStore
} from "pinia";
import axios from 'axios';
import {
    useCustomerStore
} from '@/views/Customer/stores/customer';

export const useSalesStore = defineStore('sales', {
    state: () => ({
        sales: [],
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        totalData: 0,
        current: 1,
        perpage: 5,
        searchQuery: '',
        error: {
            status: null,
            message: null,
        },

    }),
    getters:{
        filteredSales(state) {
            return state.sales.filter(sale =>
                sale.name.toLowerCase().includes(state.searchQuery.toLowerCase())
            );
        }
    },
    actions: {
        async getSales() {
            try {
                const url = `${this.apiUrl}/api/v1/sales?page=${this.current}&perPage=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                // this.sales = res.data.data.list
                const salesData = res.data.data.list;

                const customerStore = useCustomerStore();
                await customerStore.getCustomers();
                this.sales = salesData.map(sale => {
                    const customer = customerStore.customers.find(c => c.id === sale.m_customer_id);
                    return {
                        ...sale,
                        name: customer ? customer.name : 'Unknown',
                    };
                });
                this.totalData = res.data.data.meta.total
                
            } catch (error) {
                this.error = {
                    status: error.response ?.status,
                    message: 'Failed to fetch users: ' + error.message,
                };
            }
        },
        async changePage(newPage) {
            this.current = newPage;
            await this.getSales();
        },
        async searchUsers(query) {
            this.searchQuery = query;
            this.current = 1;
            await this.getSales();
        }
    }
})