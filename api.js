const restaurants = {
    id: 1,
    name: "Kitchen J & S",
    address: "Powai Mumbai-76",
    logo: "https://i.imgur.com/RPHIXvr.jpg",
    currency: 'INR',
    menu: [0, 1, 6, 5, 2, 3, 4, ],
    products: [1, 6, 8, 2, 3, 4, 1, 6, 5, 10, 3, 4],
    tax: 15,
    deliveryCharge: 30,
    open: '06:00:00',
    close: '20:00:00'
}

const types = [{
        id: 0,
        name: 'All',
        meta: ''
    },
    {
        id: 1,
        name: 'Breakfast',
        meta: ''
    },
    {
        id: 2,
        name: 'Lunch',
        meta: ''
    },
    {
        id: 3,
        name: 'Dessert',
        meta: ''
    },
    {
        id: 4,
        name: 'Snacks',
        meta: ''
    },
    {
        id: 5,
        name: 'Drinks',
        meta: ''
    },
    {
        id: 6,
        name: 'Beverages',
        meta: ''
    },
]

const products = [{
        id: 1,
        size: '50gms',
        options: [{
                name: 'Select Flavour',
                type: 'radio',
                list: [{
                        name: 'Sweet',
                        price: 0
                    },
                    {
                        name: 'Salty',
                        price: 0
                    },
                ]
            },
            {
                name: 'Make More Tangy',
                max: 2,
                type: 'checkbox',
                list: [{
                        name: 'Extra mint',
                        price: 2
                    },
                    {
                        name: 'Extra ginger',
                        price: 10
                    },
                    {
                        name: 'Extra soda',
                        price: 15
                    },
                ]
            }
        ],
        name: 'Poha',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 1,
        price: 20,
        meta: ''
    },
    {
        id: 2,
        size: '50gms',
        name: 'Veda',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 4,
        price: 20,
        meta: ''
    },
    {
        id: 3,
        size: '50gms',
        name: 'Sada dosa',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 1,
        price: 20,
        meta: ''
    },
    {
        id: 4,
        size: '50gms',
        name: 'Masals dosa',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 5,
        price: 20,
        meta: ''
    },
    {
        id: 5,
        size: '50gms',
        name: 'Mysore sada dosa',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 4,
        price: 20,
        meta: ''
    },
    {
        id: 6,
        size: '50gms',
        name: 'Thali',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 3,
        price: 20,
        meta: ''
    },
    {
        id: 7,
        size: '50gms',
        name: 'Sizzling spicy',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 2,
        price: 20,
        meta: ''
    },
    {
        id: 8,
        size: '50gms',
        name: 'Kulfi',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 3,
        price: 20,
        meta: ''
    },
    {
        id: 9,
        size: '50gms',
        name: 'Refreshing drink',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 5,
        price: 20,
        meta: ''
    },
    {
        id: 10,
        size: '50gms',
        options: [{
                name: 'Select Flavour',
                type: 'radio',
                list: [{
                        name: 'Sweet',
                        price: 0
                    },
                    {
                        name: 'Salty',
                        price: 0
                    },
                ]
            },
            {
                name: 'Make More Tangy',
                max: 2,
                type: 'checkbox',
                list: [{
                        name: 'Extra mint',
                        price: 2
                    },
                    {
                        name: 'Extra ginger',
                        price: 10
                    },
                    {
                        name: 'Extra soda',
                        price: 15
                    },
                ]
            }
        ],
        name: 'Spicy chicken',
        available: true,
        imageURL: 'Https://i.ndtvimg.com/i/2017-08/bread-poha_240x180_81503556243.jpg',
        categoryId: 6,
        price: 20,
        meta: ''
    },
]
const promoCode = [
    {id:1,name:"INVALID",discount:0,hasCondition:false,message:"Invalid Coupon Code Used"},
    {id:2,name:"SUPER30",discount:10,hasCondition:true,minPurchase:0,itemCount:3, message:"discount offered on 3 items",discountType:"price"},
    {id:3,name:"SUPER20",discount:10,hasCondition:true,minPurchase:300,itemCount:0,message:"discount offered up 100 rs on minimum purchase 300 rs",discountType:"percentage"},
]
const getList = (ItemList, list) => {
    return ItemList.filter(item => {
        return list.some(id => id == item.id);
    })
}


export const restaurant = () => {
    const restaurant = restaurants;
    restaurant.menu = getList(types, restaurant.menu);
    restaurant.products = getList(products, restaurant.products);
    restaurant.promoCode = promoCode;
    return restaurant
}
