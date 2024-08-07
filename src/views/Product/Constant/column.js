export const column = [{
        label: 'Picture',
        field: 'photo_url',
        thClass: 'text-center',
    },
    {
        label: 'Name',
        field: 'name',
        thClass: 'text-center',
    },
    {
        label: 'Kategori',
        field: 'product_category_name',
        type: 'email',
        thClass: 'text-center',
    },
    {
        label: 'Status',
        field: 'is_available',
        tdClass: 'text-center',
        thClass: 'text-center',
    },
    {
        label: 'Price',
        field: 'price',
        tdClass: 'text-center',
        thClass: 'text-center',
    },
    {
        label: 'Actions',
        field: 'actions',
        tdClass: 'text-center',
        thClass: 'text-center',
    }

];
export const selectAvailable = [{
        value: "option1",
        label: "Option 1",
    },
    {
        value: "option2",
        label: "Option 2",
    },
    {
        value: "option3",
        label: "Option 3",
    },
]
export const detailHeader = [{
        label: "Action",
        field: "action"
    },
    {
        label: "Description",
        field: "description"
    },
    {
        label: "Type",
        field: "type"
    },
    {
        label: "Price",
        field: "price"
    }
]
export const detailHeaderAdd = [{
    label: "Action",
    field: "action",
    // hidden: true,
},
{
    label: "Description",
    field: "description",
    // hidden: true,
},
{
    label: "Type",
    field: "type",
    // hidden: true,
},
{
    label: "Price",
    field: "price",
    // hidden: true,
}
]