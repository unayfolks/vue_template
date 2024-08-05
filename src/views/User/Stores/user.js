import {
    defineStore
} from "pinia";
import axios from 'axios';

export const useUserCrudStore = defineStore('crud', {
    state: () => ({
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        users: [],
        user: null,
        error: null,
        test: 'test',
        modalAction: {
            'action': "",
            'modal_title': "",
            'modal_button': ""
        }
    }),
    actions: {
        setMessage(newMessage, user) {
            console.log(newMessage)
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
            } catch (error) {
                console.log(error)
            } finally {
                this.getUsers();
            }
        },
        async deleteUser(id) {
            this.loading = true;
            try {
                await axios.delete(`${this.apiUrl}/api/v1/users/${id}`);
            } catch (error) {
                console.log(error)
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
                this.getUsers();
            } catch (error) {
                console.log(error)
            }
        }
    },



})