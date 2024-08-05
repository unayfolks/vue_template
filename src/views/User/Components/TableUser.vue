<template>
    <div>
        <vue-good-table :search-options="{ enabled: true }" :columns="columns" :rows="rows"
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
                <span v-if="column.field == 'name'">
                    <span v-if="row.name">
                        {{ row.name }}
                        <Badge v-if="row.photo_url == null" label="No Image" badgeClass="bg-primary-500 text-white" />
                        <Badge v-if="row.name != 'Admin'" label="user" badgeClass="bg-success-500 text-white" />
                        <Badge v-if="row.name == 'Admin'" label="Admin" badgeClass="bg-red-900 text-white" />
                    </span>
                </span>
                <span v-if="column.field === 'actions'">
                    <Button @click="deleteuser(row)" btnClass="btn-danger btn-sm" icon="heroicons-outline:trash"/>
                    <Button @click="editUser(row)"  btnClass="btn-primary btn-sm" icon="heroicons-outline:pencil"/>
                </span>
            </template>
            <template #table-actions>
                <AddUser @response="refreshTable" />
            </template>
        </vue-good-table>
        <TableSkeltion  v-if="isSkeletion2" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserCrudStore } from '@/views/User/Stores/user';
import Badge from '@/components/Badge';
import AddUser from '@/views/User/Components/AddUser.vue';
import Swal from 'sweetalert2';
import { useToast } from "vue-toastification";
import {column} from '../Constant/column'
import TableSkeltion from "@/components/Skeleton/Table";
import Button from "@/components/Button";


const toast = useToast();
const crudStore = useUserCrudStore()
const isSkeletion2 = ref(null);
const columns = ref(column)
const rows = ref([]);
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const editUser = (row) => {
    crudStore.setMessage('edit', row)
}
const getUsers = async () => {
    isSkeletion2.value = true;
    await crudStore.getUsers()
    if (crudStore.users) {
        isSkeletion2.value = false;
        rows.value = crudStore.users || []
    } else {
        rows.value = []
    }
}
const deleteuser = async (row) => {
    Swal.fire({
        title: "Apakah data ini ingin dihapus?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya",
        denyButtonText: `Jangan`
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await crudStore.deleteUser(row.id)
                await getUsers()
                toast.success("Data berhasil dihapus", {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            } catch (error) {
                toast.error(" Data gagal dihapus ", {
                    pauseOnHover: false,
                    timeout: 2000,
                });
            }
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}
const refreshTable = async () => {
    await getUsers()
}
const formatPhoto = (photoUrl) => {
    return photoUrl ? `${apiUrl.value}${photoUrl.substring(16)}` : '';
}
onMounted(async () => {
    await getUsers()
})
</script>
