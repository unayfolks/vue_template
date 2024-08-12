<template>
    <div>
        report main page
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useReportStore } from '../stores/report';

const reportStore = useReportStore()

const getReport = async() => {
    await reportStore.getReport()
}
onMounted(async() => {
    await getReport()
})
</script>