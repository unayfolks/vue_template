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
            <FormCustomer @response="refreshTable" />
        </div>
    </div>
    <vue-good-table :columns="columns" :rows="rows" :line-numbers="true"
        :search-options="{ enabled: false, externalQuery: searchTerm }"
        :pagination-options="{ enabled: true, perPage: 50 }">
        <template v-slot:table-row="{ column, row }">
            <span v-if="column.field === 'actions'">
                <Button @click="deleteCustomer(row)" btnClass="btn-danger btn-sm" icon="heroicons-outline:trash" />
                <Button @click="editCustomer(row)" btnClass="btn-primary btn-sm" icon="heroicons-outline:pencil" />
            </span>
        </template>
    </vue-good-table>
    <TableSkeltion v-if="isSkeletion2" />

</template>
<script setup>
import { useCustomerStore } from '../stores/customer';
import { onMounted, ref, computed} from 'vue';
import { column } from '../constant/column';
import { useToast } from "vue-toastification";

import TableSkeltion from "@/components/Skeleton/Table";
import Button from "@/components/Button";
import InputGroup from "@/components/InputGroup";
import FormCustomer from '@/views/Customer/components/FormCustomer.vue';
import Swal from 'sweetalert2';
// const errorStatus = computed(() => customerStore.error.status) //status error
const errorMessage = computed(() => customerStore.error.message) //message error

const customerStore = useCustomerStore()
const toast = useToast();
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
const deleteCustomer = (row) => {
    Swal.fire({
        title: "Apakah data ini ingin dihapus?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya",
        denyButtonText: `Jangan`
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await customerStore.deleteCustomer(row.id)
                toast.success(` ${errorMessage.value}`, {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            } catch (error) {
                toast.error(` ${errorMessage.value}`, {
                    pauseOnHover: false,
                    timeout: 2000,
                });
            }finally{
                await getCustomer()
            }
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}
const editCustomer = (row) => {
    customerStore.openForm('edit', row)
}
const refreshTable = async () => {
    await getCustomer()
}

onMounted(async () => {
    await getCustomer()
})
</script>