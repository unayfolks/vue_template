<template>
    <div>
        <div class="grid xl:grid-cols-2 grid-cols-1 gap-5">
            <div class="">
                <Card title="Upload Photo" >
                    <DropZoneVue />
                </Card>
            </div>
            <div>
                <Card>
                    <div>
                        <Textinput v-model="product.name" label="Name*" type="text" placeholder="product name" class="mb-5" />
                        <div>
                            Category
                        </div>
                        <div class="flex gap-3">
                            <Radio v-for="categories in category" :label="categories.name" class="mb-5" name="x"
                                :value="categories.id" v-model="product.product_category_id" @change="updateCategory(categories)" />
                        </div>
                        <div>
                            Status
                        </div>
                        <div class="flex gap-3">
                            <Radio label="Available" class="mb-5" name="x" value="1" v-model="product.is_available" />
                            <Radio label="Empty" :checked="true" class="mb-5" name="x" value="" v-model="product.is_available" />
                        </div>
                        <InputGroup label="Price*" type="text" prepend="Rp" placeholder="100000" v-model="product.price"/>
                        <Textinput v-model="product.description" label="Description*" type="text" placeholder="Description" class="mb-5" />
                    </div>
                </Card>
            </div>
        </div>
        <div class="my-5">
            <Card>
                <table class="min-w-full bg-white border border-gray-200">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="px-4 py-2 border-b border-gray-300 text-center">
                                <Button @click="addNewRow" btnClass="btn-primary btn-sm"
                                    icon="heroicons-outline:plus" />
                            </th>
                            <th class="px-4 py-2☺ border-b border-gray-300 text-left">Description</th>
                            <th class="px-4 py-2 border-b border-gray-300 text-left">Type</th>
                            <th class="px-4 py-2 border-b border-gray-300 text-left">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-gray-50" v-for="(row, index) in rows" :key="index">
                            <th class="px-4 py-2 border-b border-gray-300 text-center">
                                <Button btnClass="btn-danger btn-sm" icon="heroicons-outline:minus"
                                    @click="removeRow(index)" />
                            </th>
                            <td class="px-4 py-2 border-b border-gray-200">
                                <input type="text" v-model="row.description" placeholder="Description"
                                    class="form-input" />
                            </td>
                            <td class="px-4 py-2 border-b border-gray-200">
                                <input type="text" v-model="row.type" placeholder="Type" class="form-input" />
                            </td>
                            <td class="px-4 py-2 border-b border-gray-200">
                                <input type="text" v-model="row.price" placeholder="Price" class="form-input" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        </div>
        <div>
            <Card >
                <div class="flex justify-center items-center">
                    <Button btnClass="btn-success btn-sm" text="Add" @click="addProduct" />

                </div>
            </Card>
        </div>
    </div>
</template>
<script setup>
import { useCategoryStore } from "@/views/Category/stores/category";
import { ref, onMounted, reactive } from "vue";
import Textinput from "@/components/Textinput";
import InputGroup from "@/components/InputGroup";
import Radio from "@/components/Radio";
import Card from "@/components/Card";
import Button from "@/components/Button";

import DropZoneVue from "./DropZone.vue";
// import { detailHeader, detailHeaderAdd } from '../constant/column';

const categoryStore = useCategoryStore()
const rows = ref([
    {
        description: '',
        type: '',
        price: '',
    }
]);
const category = ref([])
const picked2 = ref('')
const categorySelected = ref()
const product = ref(
    {
        name:'',
        product_category_id:'',
        is_available:'1',
        price:'',
        description:'',
        product_category_name:'',
        photo_url:''
    }
)

const getCategory = async () => {
    await categoryStore.getCategory()
    category.value = categoryStore.categories
}
const updateCategory = (selectedCategory) => {
    product.value.product_category_id = selectedCategory.id;
    product.value.product_category_name = selectedCategory.name;
};
const addNewRow = () => {

    rows.value.push({
        description: '',
        type: '',
        price: '',
    });
}
const removeRow = (index) => {
    rows.value.splice(index, 1);
}
const addProduct = () => {
    console.log(product.value)
    console.log(rows.value)
}

onMounted(async () => {
    await getCategory();
})
</script>
<style></style>