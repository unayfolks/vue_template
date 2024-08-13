<template>
    <div>
        <FromGroup label="Select start date" name="d1">
            <flat-pickr class="form-control" id="d5" placeholder="Multiple Dates" v-model="dateValue"
                :config="{ mode: 'range' }" @change="changeDate" />
        </FromGroup>
        <!-- <Select label="Customer" name="name" :options="customerStore.customerOption" placeholder="Select customer"
            @change="changeCustomer($event.target.value)" v-model="customerSelected"/> -->

        <VueSelect :options="customerStore.customerOption" label="Customer" v-model="customerSelected" multiple @change="changeCustomer" />

        <TableSkeleton v-if="isSkeleton" />
        <table v-if="!isSkeleton">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Customer</th>
                    <th v-for="date in reportSetting.dates">{{ date.slice(-2) }}</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(cust, i) in reportData">
                    <td>{{ i + 1 }}</td>
                    <td>{{ cust.customer_name }}</td>
                    <td v-for="trans in cust.transactions">{{ trans.total_buy }}</td>
                    <td>{{ cust.customer_total }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useReportCustomerStore } from '../stores/report-customer';
import { useCustomerStore } from '@/views/Customer/stores/customer';
import FromGroup from "@/components/FromGroup";
import Select from "@/components/Select";
import VueSelect from "@/components/Select/VueSelect";

const reportStore = useReportCustomerStore()
const customerStore = useCustomerStore()
const dateValue = ref("");
const isSkeleton = ref()
const reportData = ref([])
const reportSetting = ref([])
const customerSelected = ref()
const getReport = async () => {
    isSkeleton.value = true;

    await reportStore.getReport()
    reportData.value = reportStore.reportData
    reportSetting.value = reportStore.reportSetting

    isSkeleton.value = false;
}
const getCustomer = async () => {
    await customerStore.getCustomers()
}
const changeDate = async () => {
    await reportStore.changeDate(dateValue.value)
    getReport()
}
const changeCustomer = async (selectedValues) => {
    await reportStore.changeCustomer(selectedValues)
    console.log("changeCustomer called");
    console.log(customerSelected.value);
    getReport()
}
onMounted(async () => {
    await getReport()
    await getCustomer()
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