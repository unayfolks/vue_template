import {
    defineStore
} from "pinia";
import axios from 'axios';

export const useUserCrudStore = defineStore('crud', {
    state: () => ({
        loading: false,
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        users: null,
        error: null,
        test: 'test'
    }),
    actions: {
        async getUsers() {
            this.loading = true;
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
            this.loading = true;
            try {
                await axios.post(`${this.apiUrl}/api/v1/users/`, users, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },
        async deleteUser(id) {
            this.loading = true;
            try {
                await axios.delete(`${this.apiUrl}/api/v1/users/${id}`);
            } catch (error) {
                console.log(error)
            } finally {
                this.loading = false
            }
        },
        // async updatePosts(id, posts) {
        //     this.loading = true;
        //     try {
        //         await axios.put(`${this.apiUrl}/posts/${id}`, posts);
        //         this.getPosts();
        //     } catch (error) {
        //         console.log(error)
        //     } finally {
        //         this.loading = false
        //     }
        // }
    },



})