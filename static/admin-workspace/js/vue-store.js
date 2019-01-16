import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        usersPage: {
            grid: getGridInitialState()
        },
        newsPage: {
            grid: getGridInitialState()
        },
        eventsPage: {
            grid: getGridInitialState()
        },
        eventRequestsPage: {
            grid: getGridInitialState()
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