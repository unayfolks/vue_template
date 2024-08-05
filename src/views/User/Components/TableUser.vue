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
                    <button @click="editUser(row)" class="btn btn-primary btn-sm mr-2">Edit</button>
                    <button @click="deleteuser(row)" class="btn btn-danger btn-sm">Delete</button>
                </span>
            </template>
            <template #table-actions>
                <AddUser  />
            </template>
        </vue-good-table>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserCrudStore } from '@/views/User/Stores/user'
import Badge from '@/components/Badge';
import Modal from "@/components/Modal";
import AddUser from '@/views/User/Components/AddUser.vue'


export default {
    components: {
        Badge,
        Modal,
        AddUser
    },
    setup() {
        const crudStore = useUserCrudStore()
        const columns = [
            {
                label: 'Photo',
                field: 'photo_url',
                thClass: 'text-center',
            },
            {
                label: 'Name',
                field: 'name',
                thClass: 'text-center',
            },
            {
                label: 'Email',
                field: 'email',
                type: 'email',
                thClass: 'text-center',
            },
            {
                label: 'Actions',
                field: 'actions',
                tdClass: 'text-center',
                thClass: 'text-center',
            }
        ]
        const rows = ref([]);
        const show = ref(false);
        const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)

        const toggleModal = () => {
            show.value = !show.value;
        };
        const editUser = (row) => {
            crudStore.setMessage('edit', row)
        }
        const getUsers = async () => {
            await crudStore.getUsers()
            if (crudStore.users) {
                rows.value = crudStore.users || []
            } else {
                rows.value = []
            }
        }
        const deleteuser = async (row) => {
            await crudStore.deleteUser(row.id)
            await getUsers()
        }
        const formatPhoto = (photoUrl) => {
            return photoUrl ? `${apiUrl.value}${photoUrl.substring(16)}` : '';
        }

        onMounted(async () => {
            await getUsers()
        })
        return {
            columns,
            rows,
            deleteuser,
            editUser,
            show,
            toggleModal,
            formatPhoto,
            apiUrl,
        }
    },
}
</script>
