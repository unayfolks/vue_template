<template>

    <div>
        <vue-good-table :columns="columns" :rows="rows" :pagination-options="{
            enabled: true, perPage: 5
        }">
            <template v-slot:table-row="{ column, row }">
                <span v-if="column.field === 'actions'">
                    <button @click="editUser(row)" class="btn btn-primary btn-sm mr-2">Edit</button>
                    <button @click="deleteuser(row)" class="btn btn-danger btn-sm">Delete</button>
                </span>
            </template>
        </vue-good-table>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserCrudStore } from '@/views/User/Stores/user'

export default {
    setup() {
        const crudStore = useUserCrudStore()
        const columns = [

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
        const rows = ref([
        ])

        const getUsers = async () => {
            await crudStore.getUsers()
            if (crudStore.users) {

                rows.value = crudStore.users || []
                rows.value.forEach((row) => {
                    row.actions = '<button class="btn btn-primary btn-sm" >Edit</button> <button @click="deleteUser(row)" class="btn btn-danger btn-sm">Delete</button>'
                })

            } else {
                console.warn('Users data is not available')
                rows.value = []
            }
        }
        const deleteuser = (row) => {
            crudStore.deleteUser(row.id)
        }

        onMounted(async () => {
            await getUsers()
        })
        return {
            columns,
            rows,
            deleteuser
        }
    },
}
</script>
