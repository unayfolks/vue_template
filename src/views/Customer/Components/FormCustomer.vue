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
            <!-- <Textinput @change="onFileChange" :value="user.photo" label="photo" type="file" placeholder="photo" /> -->
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

const customerStore = useCustomerStore();
const show = ref(false);
const modal_title = ref('');
const modal_button = ref('');
const previewImage = ref('');
const isAddMode = computed(() => action.value === 'add')
// const action = ref(customerStore.action);
const action = computed(() => customerStore.modalAction.action) // action add or edit


const customer = reactive({
    id: "",
    name: '',
    phone:'',
    email: '',
    password: '',
    photo: '',
    address:'',
    file: null,
});
watch(action, (newAction) => {
    if(newAction === 'edit'){
        console.log('edit')
        show.value = true;
        modal_title.value = 'Edit customer';
        modal_button.value = 'Change';
    }else if(newAction === 'add'){
        show.value = true;
        modal_title.value = 'Add new customer';
        modal_button.value = 'Add'
        console.log('add')
    }
})
const modalAdd = () => {
    console.log(customerStore.action)
    customerStore.openForm('add')
}
const closeModal = () => {
    show.value = false;
    customerStore.openForm(null)
};
const onFileChange = () => {

}
const addUpdateCustomer = () => {

}
</script>