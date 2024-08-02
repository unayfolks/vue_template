<template>
    <Button text="Add User" @click="toggleModal " />
    <Modal title="Add new user" label="Add User" :activeModal="show" @close="show = false">
        <div class="grid grid-cols-1 gap-4">
            <Textinput v-model="user.name" label="Name*" type="text" placeholder="Name" />
            <Textinput v-model="user.email" label="Email*" type="email" placeholder="Email" />
            <Textinput v-model="user.password" label="Password*" type="password" placeholder="Password" />
            <Textinput @change="onFileChange" v-model="user.photo" label="Photo" type="file" placeholder="Photo" />
        </div>
        <template #footer>
            <div>
                <Button text="Add" btnClass="btn-primary" @click="addUser" />
            </div>
        </template>
    </Modal>

</template>

<script>
import Modal from "@/components/Modal";

import Button from "@/components/Button";
import Textinput from "@/components/Textinput";
// import ModalAddUser from '@/components/Modal/Modal.vue';
import { useUserCrudStore } from '@/views/User/Stores/user'

export default {
    components: {
        // ModalAddUser,
        Textinput,
        Button,
        Modal

    },
    setup() {
        const crudStore = useUserCrudStore()
        return {
            crudStore
        }
    },
    data() {
        return {
            user: {
                name: '',
                email: '',
                password: '',
                photo: ''
            },
            show: false
        }
    },
    methods: {
        toggleModal() {
            this.show = true
        },
        onFileChange(e) {
            const file = e.target.files[0]
            this.user.photo = file
        },
        addUser() {
            const formData = new FormData();
            formData.append('name', this.user.name)
            formData.append('email', this.user.email)
            formData.append('password', this.user.password)
            formData.append('photo', this.user.photo)
            try {
                // console.log(formData)
                this.crudStore.addUsers(formData)

            } catch (error) {
                console.log(error)
            }
            this.show = false
        }
    }
}


</script>