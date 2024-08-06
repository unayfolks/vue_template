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
                <button class="btn btn-success btn-sm">Add Menu</button>
            </div>
        </div>
        <vue-good-table  :search-options="{ enabled: false, externalQuery: searchTerm }" :columns="columns" :rows="rows"
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
                    <Button @click="deleteuser(row)" btnClass="btn-danger btn-sm" icon="heroicons-outline:trash"/>
                    <Button @click="editUser(row)"  btnClass="btn-primary btn-sm" icon="heroicons-outline:pencil"/>

                </span>
            </template>
        </vue-good-table>
        <TableSkeltion v-if="isSkeletion2" />

    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useProductStore } from '../stores/product';
import { column, selectAvailable } from '../constant/column';
import TableSkeltion from "@/components/Skeleton/Table";
import Select from "@/components/Select";
import InputGroup from "@/components/InputGroup";
import Button from "@/components/Button";

const isSkeletion2 = ref(null);
const rows = ref([]);
const searchTerm = ref()
const selected = ref()
const columns = ref(column)
const Available = ref(selectAvailable)
const productStore = useProductStore();
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)

const getProducts = async () => {
    isSkeletion2.value = true;
    await productStore.getProducts();
    if (productStore.products) {
        isSkeletion2.value = false;
        rows.value = productStore.products || []
    } else {
        rows.value = []
    }
}
const formatPhoto = (photoUrl) => {
    return photoUrl ? `${apiUrl.value}${photoUrl.substring(16)}` : '';
}
onMounted(async () => {
    await getProducts()
})
</script>