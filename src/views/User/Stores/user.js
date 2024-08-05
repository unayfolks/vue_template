import {
    defineStore
} from "pinia";
import axios from 'axios';

export const useUserCrudStore = defineStore('crud', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        users: [],
        user: null,
        error: {
            status: null,
            message: null,
        },
        test: 'test',
        modalAction: {
            'action': "",
            'modal_title': "",
            'modal_button': ""
        },
        refreshTable: null
    }),
    actions: {
        setMessage(newMessage, user) {
            this.modalAction.action = newMessage
            this.user = user
        },
        async getUsers() {
            try {
                const res = await axios.get(`${this.apiUrl}/api/v1/users/`);
                const usersDataList = res.data.data.list
                this.users = usersDataList

            } catch (error) {
                console.error('Failed to fetch users:', error)
                this.error = {
                    status: error.response ?.status,
                    message: 'Failed to fetch users: ' + error.message,
                };
            } finally {
                this.loading = false
            }
        },
        async addUsers(users) {
            try {
                await axios.post(`${this.apiUrl}/api/v1/users/add`, users, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                this.getUsers();
                this.error = {
                    status: '200',
                };
            } catch (error) {
                console.log(error)
                this.error = {
                    status: error.response ?.status,
                    message: 'Failed to fetch users: ' + error.message,
                };
            } finally {
                this.getUsers();
            }
        },
        async deleteUser(id) {
            this.loading = true;
            try {
                await axios.delete(`${this.apiUrl}/api/v1/users/${id}`);
                this.error = {
                    status: '200',
                };
            } catch (error) {
                console.log(error)
                this.error = {
                    status: error.response ?.status,
                    message: 'Failed to fetch users: ' + error.message,
                };
            } finally {
                this.getUsers();
            }
        },
        async updateUser(users) {
            try {
                await axios.post(`${this.apiUrl}/api/v1/users/`, users, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
                this.error = {
                    status: '200',
                };
            } catch (error) {
                this.error = {
                    status: error.status,
                    message: 'Failed to fetch users: ' + error.message,
                };
                console.log(this.error)
            }
        }
    },



})