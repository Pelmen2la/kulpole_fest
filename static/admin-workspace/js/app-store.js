import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        usersPage: {
            grid: getGridInitialState(),
            searchText: ''
        },
        systemUsersPage: {
            grid: getGridInitialState()
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
            searchText: '',
            isCostumeAcceptedFilter: 'all',
            isArmorAcceptedFilter: 'all',
        },
        clubsPage: {
            grid: getGridInitialState(),
            searchText: '',
            isClubConfirmedFilter: 'all',
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