<template>
    <div class="grid xl:grid-cols-2 ">
        <div>
            <Card>
                <div class="grid xl:grid-cols-6 md:grid-cols-2 grid-cols-1 gap-4 mt-5">
                    <Card  v-for="(product, i) in products" :key="i" :title="product.name"
                        :img="formatPhoto(product.photo_url)" imaClass="rounded-t-md" imgTop gapNull noborder
                        class="text-center" >
                        <p @click="selectProduct(product)" >
                            {{ product.description }}
                        </p>
                    </Card>
                </div>
            </Card>
        </div>
        <div>
            <Card>
                Detail order
                <Card v-for="(product, i) in productSelected" :key="i">
                    <div class="flex">
                        <div class="flex-0 mr-6">
                            <div class="author-img w-[65px] h-[88px] rounded-[40px]">
                                <img :src="formatPhoto(product.photo_url)" alt="" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="mb-4 text-base">
                                {{ product.name }}
                            </div>
                            <div class="space-x-5">
                                <span class="inline-block font-medium text-base">
                                    {{ product.price }}</span>
                                <span class="inline-block">CEO at Bitspin</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </Card>
        </div>
    </div>
</template>
<script setup>
import Card from "@/components/Card";
import { useProductStore } from "@/views/Product/stores/product";
import { useCustomerStore } from "@/views/Customer/stores/customer";
import { computed, onMounted, ref, watch } from "vue";
const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)

const productStore = useProductStore()
const customerStore = useCustomerStore()
const products = computed(() => productStore.products)
const productSelected = ref([])
const selectProduct = (product) => {
    // product.value.push = product
    productSelected.value.push({
        name:product.name,
        price:product.price,
        photo_url:product.photo_url
    })
    console.log(product.name)
}
const getAll = async () => {
    await customerStore.getCustomers()
}
const formatPhoto = (photoUrl) => {
    return photoUrl ? `${apiUrl.value}${photoUrl.substring(16)}` : '';
}

onMounted(async () => {
    await productStore.getProducts()

    await getAll()
})
</script>