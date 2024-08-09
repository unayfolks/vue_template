<template>
    <Card>
        <div class="md:flex justify-between pb-6 md:space-y-0 space-y-3 items-center">
            <div>
                <InputGroup v-model="searchTerm" placeholder="Search" type="text" prependIcon="heroicons-outline:search"
                    merged @input="onSearch" />
            </div>
        </div>
        <TableSkeleton v-if="isSkeleton" />

        <vue-good-table v-if="!isSkeleton" :columns="columns" :rows="rows" styleClass=" vgt-table"
            :pagination-options="{ enabled: true }">
            <template #pagination-bottom="props">
                <div class="flex justify-center py-4 px-3">
                    <Pagination :total="salesStore.totalData" :current="salesStore.current" :per-page="salesStore.perpage"
                        @page-changed="salesStore.changePage" @click="getSales" />
                </div>
            </template>
        </vue-good-table>
    </Card>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useSalesStore } from '../stores/sales';
import { column } from '../constant/column';
import Card from "@/components/Card";
import TableSkeleton from "@/components/Skeleton/Table";
import InputGroup from "@/components/InputGroup";
import Pagination from "@/components/Pagination";

const salesStore = useSalesStore()
var searchTerm = ref("");
var columns = ref(column);
var rows = ref([]);
const isSkeleton = ref(null);


const getSales = async () => {
    isSkeleton.value = true
    await salesStore.getSales()
    if (salesStore.sales) {
        isSkeleton.value = false
        // rows.value = salesStore.sales || []
        rows.value = salesStore.filteredSales;
    } else {
        rows.value = []
    }
}
const onSearch = () => {
    salesStore.searchUsers(searchTerm.value);
    getSales()
};
onMounted(async () => { await getSales() })
</script>