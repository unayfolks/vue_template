<template>
    <div>
        <div class="grid xl:grid-cols-2 ">
            <div>
                <div>
                    <InputGroup v-model="searchTerm" placeholder="Search" type="text"
                        prependIcon="heroicons-outline:search" merged @input="onSearch" />
                </div>
                <CardSkeleton :count="5" v-if="isSkeleton" />
                <Card v-if="!isSkeleton">
                    <div class="grid xl:grid-cols-6 md:grid-cols-2 grid-cols-1 gap-4 mt-5">
                        <Card v-for="(product, i) in products" :key="i" :title="product.name"
                            :img="formatPhoto(product.photo_url)" imaClass="rounded-t-md" imgTop gapNull noborder
                            class="text-center">
                            <p @click="selectProduct(product)">
                                {{ product.description }}
                            </p>
                        </Card>
                    </div>
                    <div class="flex justify-center py-4 px-3">
                        <Pagination :total="productStore.totalData" :current="productStore.current"
                            :per-page="productStore.perpage" @page-changed="productStore.changePage"
                            @click="getProduct" />
                    </div>
                </Card>
            </div>
            <div>
                <Card class="">
                    <Card class="my-4">
                        <h5>
                            Order detail
                        </h5>
                        <div class="mb-5">
                            <Select label="Customer" name="name" :options="customerOptions"
                                placeholder="Select customer" v-model="customerSelected" />
                        </div>
                        <Card v-for="(product, i) in productSelected" :key="i">
                            <div class="flex">
                                <div class="flex-0 mr-6">
                                    <div class="author-img w-[65px] h-[88px] rounded-[40px]">
                                        <img :src="formatPhoto(product.photo_url)" alt=""
                                            class="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <div class="mb-4 text-base">
                                        <div class="flex justify-between">
                                            <div>
                                                {{ product.name }}
                                            </div>
                                            <div>
                                                <span class="inline-block"><button @click="deleteDetail(product)">
                                                        <Icon icon="heroicons:trash" />
                                                    </button></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="space-x-5">
                                        <span class="inline-block font-medium text-base">
                                            {{ product.price }}</span>
                                    </div>
                                    <Textinput @input="changeTotalItem(product, $event.target.value)"
                                        v-model="product.totalItem" label="total item*" type="number"
                                        placeholder="Total item" class="mb-5" />
                                    <Select label="Detail" name="name" :options="product.details"
                                        placeholder="Select detail" v-model="product.detailSelected"
                                        @change="changeDetail(product, $event.target.value)" />
                                </div>
                            </div>
                        </Card>
                    </Card>
                    <Card>
                        <h5>
                            Payment detail
                        </h5>
                        <div class="mx-5 my-5">
                            <h6>Subtotal : {{ subtotal }}</h6>
                            <h6>Tax : {{ tax }}</h6>
                            <h6>Total : {{ total }}</h6>
                        </div>
                        <div class="mx-5 my-5">
                            <button class="btn btn-primary" @click="addOrder">Order</button>
                        </div>
                    </Card>
                </Card>
            </div>
        </div>
    </div>
</template>
<script setup>
import Card from "@/components/Card";
import { useProductStore } from "@/views/Product/stores/product";
import { useCustomerStore } from "@/views/Customer/stores/customer";
import { useTransactionStore } from "../stores/transaction";
import { computed, onMounted, ref, watch } from "vue";
import { useToast } from "vue-toastification";

import Select from "@/components/Select";
import CardSkeleton from '@/components/Skeleton/Project-grid.vue';
import Textinput from "@/components/Textinput";
import InputGroup from "@/components/InputGroup";
import Pagination from "@/components/Pagination";
import Icon from "@/components/Icon";

const apiUrl = ref(import.meta.env.VITE_API_BASE_URL)
const productStore = useProductStore()
const customerStore = useCustomerStore()
const transactionStore = useTransactionStore()
const toast = useToast();

const products = computed(() => productStore.products)
const customer = computed(() => customerStore.customers)
const errorStatus = computed(() => transactionStore.error.status)
const errorMessage = computed(() => transactionStore.error.message)

const customerOptions = computed(() =>
    customer.value.map(customer => ({
        label: customer.name,
        value: customer.id
    }))
);
var searchTerm = ref()
const customerSelected = ref()
const productSelected = ref([])
const isSkeleton = ref(false)
const product_detail = ref([])
const subtotal = ref()
const tax = ref()
const total = ref()
watch(customerSelected, () => {
    order.value.m_customer_id = customerSelected.value
})
const onSearch = async () => {
    productStore.searchProducts(searchTerm.value)
    await getProduct()
};
const getProduct = async () => {
    isSkeleton.value = true
    await productStore.getProducts()
    isSkeleton.value = false
}
const order = ref(
    {
        m_customer_id: customerSelected.value,
        product_detail: product_detail.value
    }
)
const changeDetail = (product, newValue) => {
    let findIdx = productSelected.value.findIndex(idx => idx.id === product.id)
    let findPrice = product.details.find(idx => idx.value === newValue)
    let item = productSelected.value[findIdx].totalItem

    product_detail.value[findIdx].m_product_detail_id = newValue
    product_detail.value[findIdx].price = findPrice.price
    productSelected.value[findIdx].subtotal = findPrice.price * item
    countSubtotal()
}
const changeTotalItem = (product, newValue) => {
    product.totalItem = newValue;
    let fin = product_detail.value.findIndex(ff => ff.m_product_id === product.id)
    product_detail.value[fin].total_item = newValue

    let findIdx = productSelected.value.findIndex(idx => idx.id === product.id)
    let price = product_detail.value[findIdx].price
    let price2 = productSelected.value[findIdx].price

    if (price) {
        productSelected.value[findIdx].subtotal = newValue * price
    } else {
        productSelected.value[findIdx].subtotal = newValue * price2
    }
    countSubtotal()
}
const selectProduct = (product) => {
    /* maping for detail product */
    const detailOptions = computed(() =>
        product.details.map(detail => ({
            label: detail.description,
            price: detail.price,
            value: detail.id
        })),
    );

    /* insert product into detail order */
    let totalItem = 1
    productSelected.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        product_id: product.id,
        photo_url: product.photo_url,
        totalItem: totalItem,
        detailSelected: '',
        details: detailOptions,
        subtotal: totalItem * product.price
    })

    /* also INSERT INTO product detail for build ORDER post */
    product_detail.value.push({
        m_product_id: product.id,
        m_product_detail_id: '',
        total_item: 1,
        price: '',
        is_added: true
    })
    countSubtotal()

}
const countSubtotal = () => {
    subtotal.value = productSelected.value.reduce((subtotal, item) => subtotal + item.subtotal, 0)
    tax.value = subtotal.value * (11 / 100)
    total.value = subtotal.value + tax.value
}
const addOrder = async () => {
    if (productSelected.value == 0 || customerSelected.value == undefined) {
        alert('order or customer is empty')
    } else {
        await transactionStore.addTransaction(order.value)
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
}
const deleteDetail = (product) => {
    let idx = productSelected.value.findIndex(id => id.id === product.id)
    productSelected.value.splice(idx, 1)

    let idx2 = product_detail.value.findIndex(id => id.m_product_id === product.id)
    product_detail.value.splice(idx2, 1)
}
const formatPhoto = (photoUrl) => {
    return photoUrl ? `${apiUrl.value}${photoUrl.substring(16)}` : '';
}
onMounted(async () => {
    isSkeleton.value = true
    await productStore.getProducts()
    await customerStore.getCustomers()
    isSkeleton.value = false
})
</script>