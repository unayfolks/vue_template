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
            <Textinput @change="onFileChange" :value="user.photo" label="photo" type="file" placeholder="photo" />
        </div>
        <template #footer>
            <div>
                <Button :text="modal_button" btnClass="btn-primary" @click="addUpdateUser" />
            </div>
        </template>
    </Modal>
    <!-- ! Alert dialog -->
    <div>
        <Modal title="Information" label="Modal title" :activeModal="showAlert" centered @close="showAlert = false">
            {{ messageResponse }}
        </Modal>
    </div>
</template>
<script>
import { computed, ref, watch, reactive, onMounted } from 'vue'
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Textinput from "@/components/Textinput";
import { useUserCrudStore } from '@/views/User/Stores/user'

export default {
    components: {
        Textinput,
        Button,
        Modal,
    },
    setup() {
        const crudStore = useUserCrudStore()

        const show = ref(false)
        const showAlert = ref(false)
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
        const messageResponse = ref('');
        const previewImage = ref('');
        const isAddMode = computed(() => message.value === 'add')
        const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
        const message = computed(() => crudStore.modalAction.action)

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
        const toggleModal2 = () => {
            showAlert.value = true
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
            } else {
                formData.append('photo', user.photo_url);
            }
            // formData.forEach((value, key) => {
            //     console.log(key, value);
            // });
            try {
                if (user.id) {
                    console.log(formData.values)
                    await crudStore.updateUser(formData);
                } else {
                    await crudStore.addUsers(formData);
                }
                showAlert.value = true
                messageResponse.value = "Berhasil"
            } catch (error) {
                showAlert.value = true
                messageResponse.value = "Error"
                console.error(error);
            }
            show.value = false;
        };
        onMounted(async () => {
            await getUsers()
        })
        return {
            show,
            user,
            isAddMode,
            closeModal,
            modalAdd,
            toggleModal2,
            onFileChange,
            addUpdateUser,
            showAlert,
            messageResponse,
            previewImage,
            modal_title,
            modal_button
        }
    },
}


</script>