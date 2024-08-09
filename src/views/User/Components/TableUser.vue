<template>
    <Card noborder>
        <div class="md:flex justify-between pb-6 md:space-y-0 space-y-3 items-center">
            <div>
                <InputGroup v-model="searchTerm" placeholder="Search" type="text" prependIcon="heroicons-outline:search"
                    merged @input="onSearch" />
            </div>
            <div>
                <AddUser @response="refreshTable" />
            </div>
        </div>
        <TableSkeleton v-if="isSkeleton" />
        <vue-good-table v-if="!isSkeleton" :columns="columns" :rows="rows" styleClass=" vgt-table"
            :pagination-options="{ enabled: true }">
            <template v-slot:table-row="{ column, row }">
                <span v-if="column.field == 'photo_url'" class="flex align-center justify-center">
                    <span v-if="row.photo_url">
                        <img :src="formatPhoto(row.photo_url)" style="width: 50px; height: 50px;" />
                    </span>
                    <span v-else>
                        No Image
                    </span>
                </span>
                <span v-if="column.field == 'email'">
                    {{ row.email }}
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
                    <Button @click="deleteUser(row)" btnClass="btn-danger btn-sm" icon="heroicons-outline:trash" />
                    <Button @click="editUser(row)" btnClass="btn-primary btn-sm" icon="heroicons-outline:pencil" />
                </span>
            </template>

            <template #pagination-bottom="props">
                <div class="flex justify-center py-4 px-3">
                    <Pagination :total="userStore.totalData" :current="userStore.current" :per-page="userStore.perpage"
                        @page-changed="userStore.changePage" @click="getUsers" />
                </div>
            </template>

        </vue-good-table>
    </Card>
</template>

<script setup>
import Badge from '@/components/Badge';
import AddUser from '@/views/User/components/FormUser.vue';
import Swal from 'sweetalert2';
import TableSkeleton from "@/components/Skeleton/Table";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Pagination from "@/components/Pagination";
import InputGroup from "@/components/InputGroup";

import { ref, onMounted, watch } from 'vue';
import { useUserStore } from '@/views/User/stores/user';
import { useToast } from "vue-toastification";
import { column } from '../constant/column';

const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const toast = useToast();
const userStore = useUserStore();
const isSkeleton = ref(null);
var columns = ref(column);
var rows = ref([]);
var rowsKosong = ref([]);
var searchTerm = ref("");


const editUser = (row) => {
    userStore.openForm('edit', row)
}
const getUsers = async () => {
    isSkeleton.value = true;
    await userStore.getUsers()
    if (userStore.users) {
        isSkeleton.value = false;
        rows.value = userStore.users || [];
        // totalData = userStore.users.meta.total;
    } else {
        rows.value = []
    }
}
const onSearch = () => {
    userStore.searchUsers(searchTerm.value);
    getUsers()
};
const deleteUser = async (row) => {
    Swal.fire({
        title: "Apakah data ini ingin dihapus?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya",
        denyButtonText: `Jangan`
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await userStore.deleteUser(row.id)
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
