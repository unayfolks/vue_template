<template>
    <div>
        <div class="flex align-center justify-between  gap-2 ">
            <div class="flex align-center  justify-center">
                <h3>
                    Daftar Menu
                </h3>
            </div>
            <div class="flex align-center  justify-center gap-2">
                <InputGroup type="text" v-model="searchTerm" prependIcon="heroicons-outline:search" />
                <Select class="w-60" :options="Available" placeholder="available" v-model="selected" />
                <!-- <a href="/product/add">Add Product</a> -->
                <button class="btn btn-primary btn-sm">
                    <router-link to="product-add">Add Product
                    </router-link>

                </button>
            </div>
        </div>
        <vue-good-table :search-options="{ enabled: false, externalQuery: searchTerm }" :columns="columns" :rows="rows"
            :pagination-options="{ enabled: true, perPage: 50 }" :line-numbers="true">
            <template v-slot:table-row="{ column, row }">
                <span v-if="column.field == 'photo_url'" class="flex align-center justify-center">
                    <span v-if="row.photo_url">
                        <img :src="formatPhoto(row.photo_url)" style="width: 50px; height: 50px;" />
                    </span>
                    <span v-else>
                        No Image
                    </span>
                </span>
                <span v-if="column.field === 'actions'">
                    <Button @click="deleteProduct(row)" btnClass="btn-danger btn-sm" icon="heroicons-outline:trash" />
                    <Button @click="editProduct(row)" btnClass="btn-primary btn-sm" icon="heroicons-outline:pencil" />

                </span>
            </template>
        </vue-good-table>
        <TableSkeltion v-if="isSkeletion2" />
    </div>
</template>
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref, computed } from 'vue';
import { useProductStore } from '../stores/product';
import { column, selectAvailable } from '../constant/column';
import TableSkeltion from "@/components/Skeleton/Table";
import Select from "@/components/Select";
import InputGroup from "@/components/InputGroup";
import Button from "@/components/Button";
import Swal from 'sweetalert2'
import { useToast } from "vue-toastification";

const toast = useToast();
const isSkeletion2 = ref(null);
const rows = ref([]);
const searchTerm = ref()
const selected = ref()
const columns = ref(column)
const Available = ref(selectAvailable)
const productStore = useProductStore();
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const errorMessage = computed(() => productStore.error.message) //message error

const getProduct = async () => {
    isSkeletion2.value = true;
    await productStore.getProducts();
    if (productStore.products) {
        isSkeletion2.value = false;
        rows.value = productStore.products || []
    } else {
        rows.value = []
    }
}
const deleteProduct = async (row) => {

    Swal.fire({
        title: "Apakah data ini ingin dihapus?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya",
        denyButtonText: `Jangan`
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await productStore.deleteProduct(row.id)
                toast.success(` ${errorMessage.value}`, {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            } catch (error) {
                toast.error(` ${errorMessage.value}`, {
                    pauseOnHover: false,
                    timeout: 2000,
                });
            } finally {
                await getProduct()
            }
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}
const formatPhoto = (photoUrl) => {
    return photoUrl ? `${apiUrl.value}${photoUrl.substring(16)}` : '';
}
onMounted(async () => {
    await getProduct()
})
</script>