<template>
    <div>
        <div>
            <FromGroup label="Select start date" name="d1">
                <flat-pickr class="form-control" id="d5" placeholder="Multiple Dates" v-model="dateValue"
                    :config="{ mode: 'range' }" @change="changeDate" />
            </FromGroup>
            <Radio v-for="categori in categoryData" :label="categori.name" class="mb-5" :value="categori.id"
                @change="changeCategory" v-model="categorySelected" />
            <TableSkeleton v-if="isSkeleton" />
            <table v-if="!isSkeleton">
                <thead>
                    <tr>
                        <th rowspan="2">Menu</th>
                        <th :colspan="dateLength">Periode {{ dateValue }}</th>
                        <th rowspan="2">Total</th>
                    </tr>
                    <tr>
                        <th v-for="(seting, i) in reportSetting.dates" :key="i">{{ seting.slice(-2) }}</th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th>Grand total</th>
                        <th :colspan="dateLength"></th>
                        <th>{{ settingGrandTotal }}</th>
                    </tr>
                </thead>
                <tbody v-for="category in reportData" :key="category.category_id">
                    <tr>
                        <td :colspan="dateLength + 2" style="font-weight: bolder;">{{ category.category_name }}</td>
                    </tr>
                    <tr v-for="product in category.products">
                        <td>{{ product.product_name }}</td>
                        <td v-for="transaksi in product.transactions" class="text-center">{{ transaksi.total_sales }}
                        </td>
                        <td class="text-center">{{ product.transactions_total }}</td>
                    </tr>
                </tbody>
                <!-- <tfoot>
                    <tr>
                        <th></th>
                        <th v-for="(seting, i) in reportSetting.total_per_date" :key="i">{{ seting }}</th>
                    </tr>
                </tfoot> -->
            </table>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useReportStore } from '../stores/report-category';
import { useCategoryStore } from '@/views/Category/stores/category';
import Radio from "@/components/Radio";
import TableSkeleton from "@/components/Skeleton/Table";
import FromGroup from "@/components/FromGroup";

const reportStore = useReportStore()
const categoryStore = useCategoryStore()
const reportData = ref([]);
const reportSetting = ref([]);
const settingGrandTotal = ref()
const categorySelected = ref('0')
const dateValue = ref("");
const dateLength = ref()
const categoryData = ref([])
const isSkeleton = ref(null);

const changeDate = async () => {
    await reportStore.changeDate(dateValue.value)
    getReport()
}
const changeCategory = async () => {
    await reportStore.changeCategory(categorySelected.value)
    getReport()
}
const getReport = async () => {
    isSkeleton.value = true;

    await reportStore.getReport()
    reportData.value = reportStore.reportData
    reportSetting.value = reportStore.reportSetting
    dateLength.value = reportSetting.value.dates.length

    settingGrandTotal.value = reportSetting.value.grand_total
    isSkeleton.value = false;

}
const getCategory = async () => {
    await categoryStore.getCategory()
    categoryData.value = categoryStore.categories
}
onMounted(async () => {
    await getCategory()
    await getReport()
})
</script>
<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
}

.nested-table {
    width: 100%;
    border: none;
}

.nested-table td {
    border: none;
}
</style>