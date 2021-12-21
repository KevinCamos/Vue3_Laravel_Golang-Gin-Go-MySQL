import Constant from '../../Constant';
import TableService from '@/services/TableService'

export const table = {
    namespaced: true,
    state: {
        
    },
    mutations: {
        [Constant.ADD_TABLE]: (state, payload) => {
            console.log(payload);
            state.tablelist.push({ ...payload});
        },
        [Constant.DELETE_TABLE]: (state, payload) => {
            console.log(payload);
            let index = state.tablelist.findIndex((item) => item.id_table === payload.id);
            state.tablelist.splice(index, 1);
        },
        [Constant.UPDATE_TABLE]: (state, payload) => {
            let index = state.tablelist.findIndex((item) => item.id_table === payload.id_table);
            state.tablelist[index] = payload;
        },
        [Constant.INITIALIZE_TABLE]: (state, payload) => {
            if (payload) {
                state.tablelist = payload;
            } else {
                state.tablelist = {
                    id_table: "",
                    id_order: "",
                    status: "",
                };
            }
        },
    },
    actions: {
        [Constant.ADD_TABLE]: (store, payload) => {
            TableService.createTable(payload.tableitem)
            .then(function (res) {
                store.commit(Constant.ADD_TABLE, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.DELETE_TABLE]: (store, payload) => {
            TableService.deleteTableById(payload.id)
            .then(function (res) {
                if (res.data.message !== "OK") {
                    throw new Error({ 'Message': 'Ha habido algún problema al eliminar el producto' })
                }
                store.commit(Constant.DELETE_TABLE, payload);
            }
            )
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.UPDATE_TABLE]: (store, payload) => {
            TableService.updateTable(payload.tableitem, payload.id)
            .then(function (res) {
                store.commit(Constant.UPDATE_TABLE, res.data.data[0]);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        [Constant.INITIALIZE_TABLE]: (store, /* payload */) => {
            TableService.getAllTables()
            .then(function (res) {
                store.commit(Constant.INITIALIZE_TABLE, res.data.data);
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    getters: {
        getTable(state) {
            return state.tablelist;
        }
    }

}