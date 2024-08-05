<template>
    <button class="btn btn-primary btn-sm" @click="modalAdd">Add User</button>
    <Modal :title="modal_title" label="Add User" centered :activeModal="show" @close="closeModal">
        <div class="grid grid-cols-1 gap-4">
            <Textinput v-model="user.name" label="Name*" type="text" placeholder="Name" />
            <Textinput v-model="user.email" label="Email*" type="email" placeholder="Email" />
            <Textinput v-if="isAddMode" v-model="user.password" label="Password*" type="password"
                placeholder="Password" />
            <div v-if="previewImage">
                <img :src="previewImage" alt="Preview" width="200">
            </div>
            <FileInput @change="onFileChange" :value="user.photo"/>
            <!-- <Textinput @change="onFileChange" :value="user.photo" label="photo" type="file" placeholder="photo" /> -->
        </div>
        <template #footer>
            <div>
                <Button :text="modal_button" btnClass="btn-primary" @click="addUpdateUser" />
            </div>
        </template>
    </Modal>

</template>
<script setup>
import { computed, ref, watch, reactive, onMounted, defineEmits } from 'vue'
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Textinput from "@/components/Textinput";
import { useUserCrudStore } from '@/views/User/Stores/user'
import { useToast } from "vue-toastification";
import FileInput from "@/components/Fileinput"

const crudStore = useUserCrudStore()
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
const modal_title = ref('')
const modal_button = ref('')
const previewImage = ref('');
const isAddMode = computed(() => message.value === 'add')
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const message = computed(() => crudStore.modalAction.action)
const statusMessage = computed(() => crudStore.error.status)
const errorMessage = computed(() => crudStore.error.message)
const emit = defineEmits(['response'])

watch(message, (newMessage) => {
    if (newMessage === 'edit') {
        show.value = true;

        modal_title.value = 'Edit user';
        modal_button.value = 'Change';
        Object.assign(user, {
            id: crudStore.user.id,
            name: crudStore.user.name,
            email: crudStore.user.email,
            photo: crudStore.user.photo_url,
            file: null,
        });
        previewImage.value = crudStore.user.photo_url ? `${apiUrl.value}${crudStore.user.photo_url.substring(16)}` : '';
    } else if (newMessage === 'add') {
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
    crudStore.setMessage(null)
};
const modalAdd = () => {
    crudStore.setMessage('add')
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
const getUsers = async () => {
    await crudStore.getUsers()
}
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
            await crudStore.updateUser(formData);
            console.log(statusMessage.value)

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
            await crudStore.addUsers(formData);
            console.log(statusMessage.value)
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
onMounted(async () => {
    await getUsers()
})
</script>