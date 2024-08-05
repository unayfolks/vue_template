<template>
    <div class="flex align-center justify-between  gap-2 ">
        <div class="flex align-center  justify-center">
            <h3>
                Daftar Customer
            </h3>
        </div>
        <div class="flex align-center  justify-center gap-2">
            <InputGroup type="text" v-model="searchTerm" prependIcon="heroicons-outline:search" />
            <!-- <Select class="w-60" :options="Available" placeholder="available" v-model="selected" /> -->
            <button class="btn btn-success btn-sm">Add Customer</button>
        </div>
    </div>
    <vue-good-table :columns="columns" :rows="rows" :line-numbers="true"
        :search-options="{ enabled: false, externalQuery: searchTerm }" :pagination-options="{ enabled: true, perPage: 50 }" >
        <template v-slot:table-row="{ column, row }">
            <span v-if="column.field === 'actions'">
                <Button @click="deleteuser(row)" btnClass="btn-danger btn-sm" icon="heroicons-outline:trash" />
                <Button @click="editUser(row)" btnClass="btn-primary btn-sm" icon="heroicons-outline:pencil" />

            </span>
        </template>
    </vue-good-table>
    <TableSkeltion v-if="isSkeletion2" />

</template>
<script setup>
import { useCustomerStore } from '../Stores/customer';
import { onMounted, ref } from 'vue';
import { column } from '../Constant/column';
import TableSkeltion from "@/components/Skeleton/Table";
import Button from "@/components/Button";
import InputGroup from "@/components/InputGroup";

const customerStore = useCustomerStore()
const rows = ref([])
const columns = ref(column)
const isSkeletion2 = ref(null);
const searchTerm = ref()

const getCustomer = async () => {
    isSkeletion2.value = true;

    await customerStore.getCustomers()
    if (customerStore.customers) {
        isSkeletion2.value = false;

        rows.value = customerStore.customers || []
    } else {
        rows.value = []
    }
}
onMounted(async () => {
    await getCustomer()
})
</script>