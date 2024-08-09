<template>
    <button class="btn btn-primary btn-sm" @click="modalAdd">Add User</button>
    <Modal :title="modal_title" label="Add User" centered :activeModal="show" @close="closeModal">
        <div class="grid grid-cols-1 gap-4">
            <Textinput v-model="user.name" label="Name*" type="text" placeholder="Name" />
            <Textinput v-model="user.email" label="Email*" type="email" placeholder="Email" />
            <Textinput v-if="isAddMode" v-model="user.password" label="Password*" type="password"
                placeholder="Password" />
            <Fileinput :preview="isPreview" name="preview" @change="onFileChange" :value="user.photo" />
            <div v-if="previewImage">
                <img :src="previewImage" alt="Preview" width="200">
            </div>
        </div>
        <template #footer>
            <div>
                <Button :text="modal_button" btnClass="btn-primary" @click="addUpdateUser" />
            </div>
        </template>
    </Modal>

</template>
<script setup>
import { computed, ref, watch, reactive, onMounted, defineEmits } from 'vue';
import { useUserStore } from '@/views/User/stores/user';
import { useToast } from "vue-toastification";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Textinput from "@/components/Textinput";
import FileInput from "@/components/Fileinput";
import Fileinput from "@/components/Fileinput";


const userStore = useUserStore()
const toast = useToast();
const show = ref(false)
const user = reactive({
    id: "",
    name: '',
    email: '',
    password: '',
    photo: '',
    file: null,
})
const modal_title = ref('');
const modal_button = ref('');
const previewImage = ref('');
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const isAddMode = computed(() => action.value === 'add')
const action = computed(() => userStore.modalAction.action) // action add or edit
const statusMessage = computed(() => userStore.error.status) //status error
// const errorMessage = computed(() => userStore.error.action)
const emit = defineEmits(['response'])
const isPreview = ref(true)

watch(action, (newAction) => {
    if (newAction === 'edit') {
        isPreview.value = false
        show.value = true;
        modal_title.value = 'Edit user';
        modal_button.value = 'Change';
        Object.assign(user, {
            id: userStore.user.id,
            name: userStore.user.name,
            email: userStore.user.email,
            photo: userStore.user.photo_url,
            file: null,
        });
        previewImage.value = userStore.user.photo_url ? `${apiUrl.value}${userStore.user.photo_url.substring(16)}` : '';
        console.log(previewImage.value)
    } else if (newAction === 'add') {
        show.value = true
        modal_title.value = 'Add new user';
        modal_button.value = 'Add'
        Object.assign(user, {
            id: '',
            name: '',
            email: '',
            password: '',
            photo: '',
            file: null,
        });
        previewImage.value = '';
    }
});
const closeModal = () => {
    show.value = false;
    userStore.openForm(null)
};
const modalAdd = () => {
    userStore.openForm('add')
}
const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        user.file = file;
        user.photo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target.result;
        }
        reader.readAsDataURL(file);
    }
};
const addUpdateUser = async () => {
    const formData = new FormData();
    formData.append('id', user.id)
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('password', user.password);
    if (user.file) {
        formData.append('photo', user.file);
        console.log(user.file)
    } else {
        // formData.append('photo', user.photo);
        // console.log(user.photo_url)
    }
    // formData.forEach((value, key) => {
    //     console.log(key, value);
    // });
    try {
        if (user.id) {
            await userStore.updateUser(formData);
            userStore.openForm(null) //reset form action
            if (statusMessage.value != 200) {
                toast.error(" Errorr ", {
                    pauseOnHover: false,
                    timeout: 2000,
                });
            } else {
                toast.success(" Update user successfully", {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            }
            emit('response')

        } else {
            await userStore.addUsers(formData);

            if (statusMessage.value != 200) {
                toast.error(" Errorr ", {
                    pauseOnHover: false,
                    timeout: 2000,
                });
            } else {
                toast.success(" Add user successfully", {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            }
            emit('response')
        }
    } catch (error) {
        console.error(error);
        toast.error(" Errorr ", {
            pauseOnHover: false,
            timeout: 2000,
        });
    }
    show.value = false;
};

</script>