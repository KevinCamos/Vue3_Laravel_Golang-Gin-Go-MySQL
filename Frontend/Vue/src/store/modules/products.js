import Constant from '../../Constant';
// import shortid from 'shortid';
import ProductsService from '@/services/ProductsService'

export const products = {
    namespaced: true,
    state: {
        
    },
    mutations: {
        [Constant.ADD_PRODUCTS]: (state, payload) => {
            /* console.log(payload) */
            
            state.productslist.push({ ...payload});
        },
        [Constant.DELETE_PRODUCTS]: (state, payload) => {
            let index = state.productslist.findIndex((item) => item.id === payload.id);
            state.productslist.splice(index, 1);
        },
        [Constant.UPDATE_PRODUCTS]: (state, payload) => {
            let index = state.productslist.findIndex((item) => item.id === payload.id);
            state.productslist[index] = payload;
        },
        [Constant.UPDATE_STATUS_PRODUCTS]: (state, payload) => {
            let index = state.productslist.findIndex((item) => item.id === payload.id);
            state.productslist[index] = payload;
        },
        [Constant.INITIALIZE_PRODUCTS]: (state, payload) => {
            if (payload) {
                state.productslist = payload;
            } else {
                state.productslist = {
                    id: "",
                    name: "",
                    description: "",
                    category: 0,
                    price: 0
                };
            }
        },
        [Constant.GET_PRODUCTS_BY_ID]: (state, payload) => {
            if (payload) {
                state.productslist = payload;
            }
        }
    },
    actions: {
        [Constant.ADD_PRODUCTS]: (store, payload) => {
            let formData = new FormData();

            formData.append("image",  payload.productsitem.image);
            formData.append("name",  payload.productsitem.name);
            formData.append("description",  payload.productsitem.description);
            formData.append("categories_id",  payload.productsitem.category);
            formData.append("price",  payload.productsitem.price);

            ProductsService.createProduct(formData)
            .then(function (res) {
                /* console.log(res.data.data) */
                store.commit(Constant.ADD_PRODUCTS, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.DELETE_PRODUCTS]: (store, payload) => {
            ProductsService.deleteProductById(payload.id)
            .then(function (res) {
                if (res.data.message !== "OK") {
                    throw new Error({ 'Message': 'Ha habido algún problema al eliminar el producto' })
                }
                store.commit(Constant.DELETE_PRODUCTS, payload);
            }
            )
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.UPDATE_PRODUCTS]: (store, payload) => {
            let formData = new FormData();

            formData.append("image",  payload.productsitem.image);
            formData.append("name",  payload.productsitem.name);
            formData.append("description",  payload.productsitem.description);
            formData.append("categories_id",  payload.productsitem.categories.id);
            formData.append("price",  payload.productsitem.price);
        
            ProductsService.updateProduct(formData, payload.productsitem.id)
            .then(function (res) {
                console.log(res.data.data)
                store.commit(Constant.UPDATE_PRODUCTS, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.UPDATE_STATUS_PRODUCTS]: (store, payload) => {
            console.log(payload.products);
            ProductsService.changeStatusProduct(payload.products, payload.id)
            .then(function (res) {
                console.log(res.data.data)
                store.commit(Constant.UPDATE_STATUS_PRODUCTS, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.INITIALIZE_PRODUCTS]: (store, /* payload */) => {
            ProductsService.getAllProducts()
            .then(function (res) {
                /* console.log(res.data.data) */
                store.commit(Constant.INITIALIZE_PRODUCTS, res.data.data.products);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.GET_PRODUCTS_BY_ID]: (store, payload) => {
            console.log(payload.id);
            ProductsService.getProductById(payload.id)
            .then(function (res) {
                console.log(res.data.data);
                store.commit(Constant.GET_PRODUCTS_BY_ID, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    getters: {
        getProducts(state) {
            /* console.log(state.productslist); */
            return state.productslist;
        }
    }
}