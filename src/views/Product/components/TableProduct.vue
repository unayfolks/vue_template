<template>
    <div>
        <div class="md:flex justify-between pb-6 md:space-y-0 space-y-3 items-center">
            <div>
                <InputGroup v-model="searchTerm" placeholder="Search" type="text" prependIcon="heroicons-outline:search"
                    merged @input="onSearch" />
            </div>
            <div>
                <button class="btn btn-primary btn-sm" @click="addProduct">
                    Add Product
                </button>
            </div>
        </div>
        <div class="flex align-center justify-between  gap-2 ">
            <div class="flex align-center  justify-center">
                <h3>
                    Daftar Menu
                </h3>
            </div>
            <div class="flex align-center  justify-center gap-2">
                <Select class="w-60" :options="Available" placeholder="available" v-model="selected" />
            </div>
        </div>
        <TableSkeleton v-if="isSkeleton" />
        <vue-good-table v-if="!isSkeleton" :columns="columns" :rows="rows"
            :pagination-options="{ enabled: true, perPage: 50 }" :line-numbers="true">
            <template v-slot:table-row="props">
                <span v-if="props.column.field == 'photo_url'" class="flex align-center justify-center">
                    <span v-if="props.row.photo_url">
                        <img :src="formatPhoto(props.row.photo_url)" style="width: 50px; height: 50px" />
                    </span>
                    <span v-else> No Image </span>
                </span>
                <span v-if="props.column.field == 'name'">
                    <span v-if="props.row.name">
                        {{ props.row.name }}
                    </span>
                </span>
                <span v-if="props.column.field === 'actions'">
                    <div class="flex justify-center">
                        <div class="flex space-x-3 rtl:space-x-reverse">
                            <Tooltip placement="top" arrow theme="danger-500">
                                <template #button>
                                    <div class="action-btn" @click="editProduct(props.row)">
                                        <Icon icon="heroicons:pencil-square" />
                                    </div>
                                </template>
                                <span> Edit</span>
                            </Tooltip>
                            <Tooltip placement="top" arrow theme="dark">
                                <template #button>
                                    <div class="action-btn" @click="deleteProduct(props.row)">
                                        <Icon icon="heroicons:trash" />
                                    </div>
                                </template>
                                <span>Delete</span>
                            </Tooltip>
                        </div>
                    </div>
                </span>
            </template>
            <template #pagination-bottom="props">
                <div class="flex justify-center py-4 px-3">
                    <Pagination :total="productStore.totalData" :current="productStore.current" :per-page="productStore.perpage"
                        @page-changed="productStore.changePage" @click="getProduct" />
                </div>
            </template>
        </vue-good-table>
    </div>
</template>
<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { onMounted, ref, computed } from 'vue';
import { useProductStore } from '../stores/product';
import { column, selectAvailable } from '../constant/column';
import { useToast } from "vue-toastification";
import TableSkeleton from "@/components/Skeleton/Table";
import Select from "@/components/Select";
import InputGroup from "@/components/InputGroup";
import Swal from 'sweetalert2'
import Pagination from "@/components/Pagination";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";

const router = useRouter();
const toast = useToast();
const productStore = useProductStore();
const isSkeleton = ref(null);
const rows = ref([]);
const searchTerm = ref()
const selected = ref()
const columns = ref(column)
const Available = ref(selectAvailable)
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const errorMessage = computed(() => productStore.error.message) //message error


const getProduct = async () => {
    isSkeleton.value = true;
    await productStore.getProducts();
    if (productStore.products) {
        isSkeleton.value = false;
        rows.value = productStore.products || []
    } else {
        rows.value = []
    }
}
const addProduct = () => {
    productStore.openForm('add')
    router.push({ name: 'product-form', params: { product: '' } });
}
const editProduct = (row) => {
    productStore.openForm('edit')
    router.push({ name: 'product-form', params: { product: JSON.stringify(row) } });
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
const onSearch = () => {
    productStore.searchProducts(searchTerm.value)
    getProduct()
}
const formatPhoto = (photoUrl) => {
    return photoUrl ? `${apiUrl.value}${photoUrl.substring(16)}` : '';
}
onMounted(async () => {
    await getProduct()
})
</script>