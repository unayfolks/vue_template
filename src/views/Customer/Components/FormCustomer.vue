<template>
    <button class="btn btn-success btn-sm" @click="modalAdd">Add Customer</button>
    <Modal :title="modal_title" label="Add Customer" centered :activeModal="show" @close="closeModal">
        <div class="grid grid-cols-1 gap-4">
            <Textinput v-model="customer.name" label="Name*" type="text" placeholder="Name" />
            <Textinput v-model="customer.email" label="Email*" type="email" placeholder="Email" />
            <Textinput v-model="customer.phone" label="Phone*" type="number" placeholder="Phone" />
            <Textinput v-model="customer.address" label="Address*" type="text" placeholder="Address" />
            <Textinput v-if="isAddMode" v-model="customer.password" label="Password*" type="password"
                placeholder="Password" />
            <div v-if="previewImage">
                <img :src="previewImage" alt="Preview" width="200">
            </div>
            <FileInput @change="onFileChange" :value="customer.photo" />
        </div>
        <template #footer>
            <div>
                <Button :text="modal_button" btnClass="btn-primary" @click="addUpdateCustomer" />
            </div>
        </template>
    </Modal>
</template>
<script setup>
import Modal from "@/components/Modal";
import FileInput from "@/components/Fileinput";
import Textinput from "@/components/Textinput";
import Button from "@/components/Button";

import { computed, ref, watch, reactive, onMounted, defineEmits } from 'vue';
import { useCustomerStore } from "../stores/customer";
import { useToast } from "vue-toastification";

const customerStore = useCustomerStore();
const toast = useToast();
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const show = ref(false);
const modal_title = ref('');
const modal_button = ref('');
const previewImage = ref('');
const isAddMode = computed(() => action.value === 'add')
// const action = ref(customerStore.action);
const action = computed(() => customerStore.modalAction.action) // action add or edit
const errorStatus = computed(() => customerStore.error.status) //status error
const errorMessage = computed(() => customerStore.error.message) //message error
const emit = defineEmits(['response'])

const customer = reactive({
    id: "",
    name: '',
    phone: '',
    email: '',
    password: '',
    photo: '',
    address: '',
    file: null,
});
watch(action, (newAction) => {
    if (newAction === 'edit') {
        console.log('edit')
        show.value = true;
        modal_title.value = 'Edit customer';
        modal_button.value = 'Change';
        Object.assign(customer, {
            id: customerStore.customer.id,
            name: customerStore.customer.name,
            phone: customerStore.customer.phone,
            email: customerStore.customer.email,
            photo: customerStore.customer.photo,
            address: customerStore.customer.address,
            file:null
        })
        previewImage.value = customerStore.customer.photo ? `${apiUrl.value}/storage/${customerStore.customer.photo}` : '';
    } else if (newAction === 'add') {
        show.value = true;
        modal_title.value = 'Add new customer';
        modal_button.value = 'Add'
        Object.assign(customer, {
            id: "",
            name: '',
            phone: '',
            email: '',
            password: '',
            photo: '',
            address: '',
            file: null,
        })
        previewImage.value = '';
    }
})
const modalAdd = () => {
    // console.log(customerStore.action)
    customerStore.openForm('add')
}
const closeModal = () => {
    show.value = false;
    customerStore.openForm(null)
};
const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        customer.file = file;
        customer.photo = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}
const addUpdateCustomer = async () => {
    const formData = new FormData();
    formData.append('id', customer.id)
    formData.append('name', customer.name)
    formData.append('phone', customer.phone)
    formData.append('email', customer.email)
    formData.append('password', customer.password)
    formData.append('address', customer.address)
    if(customer.file){
        formData.append('photo', customer.file)
    }else{
        formData.append('photo', '')

    }
    // formData.forEach((value, key) => {
    //     console.log(key, value);
    // });
    try {
        if (customer.id) {
            console.log(formData)
            await customerStore.updateCustomer(formData)
            if (errorStatus.value == '200') {
                toast.success(` ${errorMessage.value}`, {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            }else{
                toast.error(` ${errorMessage.value}`, {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            }
            emit('response')
        } else {
            await customerStore.addCustomer(formData)
            if (errorStatus.value == '200') {
                toast.success(` ${errorMessage.value}`, {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            }else{
                toast.error(` ${errorMessage.value}`, {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            }
            emit('response')
        }
    } catch (error) {

    }
}
</script>