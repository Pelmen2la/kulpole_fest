import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        usersPage: {
            grid: getGridInitialState(),
            searchText: ''
        },
        newsPage: {
            grid: getGridInitialState(),
            searchText: ''
        },
        eventsPage: {
            grid: getGridInitialState()
        },
        eventRequestsPage: {
            grid: getGridInitialState(),
            searchText: ''
        },
    },
    mutations: {
        changeGridState(state, {pageName, newState}) {
            Object.assign(state[pageName].grid, newState);
        }
    }

})

function getGridInitialState() {
    return {
        data: [],
        pageIndex: 0,
        pagesCount: 0
    };
}