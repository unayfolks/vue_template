<!-- <template>
    <div>
        add product
    </div>
</template>
<script setup>
import { computed, ref, watch, reactive, onMounted, defineEmits } from 'vue';
import { useProductStore } from "../stores/product";
import { useToast } from "vue-toastification";


const productStore = useProductStore()
const toast = useToast();
const show = ref(false)

const modal_title = ref('');
const modal_button = ref('');
const previewImage = ref('');
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const action = computed(() => productStore.modalAction.action)

watch(action, (newAction) => {
    if (newAction === 'edit') {
        console.log('edit')
    } else if (newAction === 'add') {
        console.log('add')
        show.value = true;
        modal_title.value = 'Add new product';
        modal_button.value = 'Add';
        previewImage.value = '';
    }
})
const addUpdateProduct = () => {

}
const modalAdd = () => {
    productStore.openForm('add')
}
const closeModal = () => {
    show.value = false;
    productStore.openForm(null)
};
</script> -->

<template>
    <div>
        <div class="grid xl:grid-cols-2 grid-cols-1 gap-5">
            <div class="">
                <Card title="Upload Photo">
                    <DropZoneVue />
                </Card>
            </div>
            <div>
                <Card>
                    <div>
                        <Textinput label="Name*" type="text" placeholder="product name" class="mb-5" />
                        <div>
                            Category
                        </div>
                        <div class="flex gap-3">
                            <Radio label="Snack" class="mb-5" name="x" value="A" v-model="picked1" />
                            <Radio label="Drink" :checked="true" class="mb-5" name="x" value="B" v-model="picked1" />
                        </div>
                        <div>
                            Status
                        </div>
                        <div class="flex gap-3">
                            <Radio label="Available" class="mb-5" name="x" value="A" v-model="picked2" />
                            <Radio label="Empty" :checked="true" class="mb-5" name="x" value="B" v-model="picked2" />
                        </div>
                        <InputGroup label="Price*" type="text" prepend="Rp" placeholder="100000" />
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import Textinput from "@/components/Textinput";
import InputGroup from "@/components/InputGroup";
import Radio from "@/components/Radio";
import Card from "@/components/Card";
import DropZoneVue from "./DropZone.vue";

const picked1 = ref('A')
const picked2 = ref('A')

</script>
<style></style>