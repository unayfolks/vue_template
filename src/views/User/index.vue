<template>
    <div>
        <div class="flex justify-end mb-4">
            <ModalAdd/>
        </div>
        <Table/>
        
    </div>
</template>

<script>
// import Table from '@/components/User/TableDataUser'
// import ModalAdd from '@/components/User/UserAdd'
import Table from '@/views/User/Components/TableUser.vue'
import ModalAdd from '@/views/User/Components/AddUser.vue'
export default {
    components: {
        Table,
        ModalAdd
    }
}
</script>
