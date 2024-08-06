<template>
    <div>
        Category
    </div>
</template>

<script setup>
import { useCategoryStore } from '../stores/category';
import { onMounted, ref  } from 'vue';
const categoryStore = useCategoryStore()

const getCategories = async () => {
    await categoryStore.getCategory();
}
onMounted(async () => {
    await getCategories()
})

</script>
