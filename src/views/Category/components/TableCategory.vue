<template>
    <div>
        <div class="flex justify-end ">
            <button class="btn btn-primary btn-sm" @click="modalAdd">Add Category</button>
            <Modal :title="modal_title" label="Add User" centered :activeModal="show" @close="closeModal">
                <div class="grid grid-cols-1 gap-4">
                    <Textinput v-model="category.name" label="Name*" type="text" placeholder="Name" />
                </div>
                <template #footer>
                    <div>
                        <Button v-if="modal_button == 'Add'" :text="modal_button" btnClass="btn-primary"
                            @click="addCategory" />
                        <Button v-if="modal_button == 'Change'" :text="modal_button" btnClass="btn-primary"
                            @click="updateCategory" />
                    </div>
                </template>
            </Modal>
        </div>
        <vue-good-table :columns="columns" :rows="rows" :pagination-options="{ enabled: true, perPage: 5 }"
            :line-numbers="true">
            <template v-slot:table-row="{ column, row }">

                <span v-if="column.field === 'actions'">
                    <Button @click="deleteCategory(row)" btnClass="btn-danger btn-sm" icon="heroicons-outline:trash" />
                    <Button @click="editCategory(row)" btnClass="btn-primary btn-sm" icon="heroicons-outline:pencil" />
                </span>
            </template>
        </vue-good-table>
    </div>
</template>

<script setup>
import { useCategoryStore } from '../stores/category';
import { onMounted, reactive, ref, computed } from 'vue';
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Textinput from "@/components/Textinput";
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2';

const toast = useToast()
const categoryStore = useCategoryStore()
const columns = [
    {
        label: 'Name',
        field: 'name'
    },
    {
        label: 'Action',
        field: 'actions'
    }
]
const rows = ref([]);
const show = ref(false);
const modal_title = ref('');
const modal_button = ref('');
const category = reactive({
    id: '',
    name: ''
});
const errorMessage = computed(() => categoryStore.error.message) //message error
const errorStatus = computed(() => categoryStore.error.status) //message error

// const error = reactive({
//     status:  categoryStore.error.status,
//     message: categoryStore.error.message
// })
const getCategories = async () => {
    await categoryStore.getCategory();
    rows.value = categoryStore.categories
}
const addCategory = async () => {
    await categoryStore.addCategory(category);
    getCategories();
    // console.log(category)
    show.value = false

}
const updateCategory = async () => {
    // console.log(category)
    await categoryStore.updateCategory(category)
    getCategories();
    console.log(errorStatus.value)
    show.value = false
    if (errorStatus.value != 200) {
        toast.error(`${errorMessage.value}`, {
            pauseOnHover: false,
            timeout: 2000,
        });
    } else {
        toast.success(`${errorMessage.value}`, {
            pauseOnHover: true,
            timeout: 2000,
        });
    }
}
const deleteCategory = async (row) => {

    Swal.fire({
        title: "Apakah data ini ingin dihapus?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Ya",
        denyButtonText: `Jangan`
    }).then(async (result) => {
        if (result.isConfirmed) {
            await categoryStore.deleteCategory(row.id)
            getCategories();
            if (errorStatus.value != 200) {
                toast.error(`${errorMessage.value}`, {
                    pauseOnHover: false,
                    timeout: 2000,
                });
            } else {
                toast.success(`${errorMessage.value}`, {
                    pauseOnHover: true,
                    timeout: 2000,
                });
            }
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}
const editCategory = (row) => {
    Object.assign(category, {
        id: row.id,
        name: row.name
    })
    show.value = true
    modal_title.value = 'Edit category';
    modal_button.value = 'Change'
}
const modalAdd = () => {
    show.value = true
    modal_title.value = 'Add new category';
    modal_button.value = 'Add';
}
const closeModal = () => {
    show.value = false;

    // userStore.openForm(null)
};
onMounted(async () => {
    await getCategories()
})

</script>
