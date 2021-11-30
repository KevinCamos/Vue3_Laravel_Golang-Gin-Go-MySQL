import Constant from '../../Constant';
// import shortid from 'shortid';
import ProductsService from '@/services/ProductsService'

export const products = {
    namespaced: true,
    state: {
        
    },
    mutations: {
        [Constant.ADD_PRODUCTS]: (state, payload) => {
            console.log(payload)
            
            state.productslist.push({ ...payload});
        },
        [Constant.DELETE_PRODUCTS]: (state, payload) => {
            let index = state.productslist.findIndex((item) => item.id === payload.id);
            state.productslist.splice(index, 1);
        },
        [Constant.UPDATE_PRODUCTS]: (state, payload) => {
            console.log(payload)

            let index = state.productslist.findIndex((item) => item.id === payload.id);
            state.productslist[index] = payload;
        },
        [Constant.INITIALIZE_PRODUCTS]: (state, payload) => {
            console.log(payload)
            
            if (payload) {
                state.productslist = payload;
            } else {
                state.productslist = {
                    id: "",
                    name: "",
                    description: "",
                    category: "",
                    price: 0
                };
            }
        },
    },
    actions: {
        [Constant.ADD_PRODUCTS]: (store, payload) => {
            console.log(payload.productsitem)
        
            ProductsService.createProduct(payload.productsitem)
            .then(function (res) {
                console.log(res.data.data)
                store.commit(Constant.ADD_PRODUCTS, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.DELETE_PRODUCTS]: (store, payload) => {
            console.log(payload)
            console.log(payload.id)

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
            console.log(payload.productsitem);
            console.log(payload.productsitem.id);

            ProductsService.updateProduct(payload.productsitem, payload.productsitem.id)
            .then(function (res) {
                console.log(res.data.data)
                store.commit(Constant.UPDATE_PRODUCTS, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.INITIALIZE_PRODUCTS]: (store, /* payload */) => {
            ProductsService.getAllProducts()
            .then(function (res) {
                console.log(res.data.data)
                store.commit(Constant.INITIALIZE_PRODUCTS, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    getters: {
        getProducts(state) {
            console.log(state.productslist);
            return state.productslist;
        }
    }

}