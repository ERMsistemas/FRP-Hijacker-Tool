export default new Vuex.Store({
/* const store = new Vuex.Store({ */
    /* mode: history; */
    state: {
        user: null,
        cursos: []
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setCursos(state, cursos) {
            state.cursos = cursos;
        }
    },
    actions: {
        login({commit, dispatch}, creds) {
            return axios.post('../api/login.php', creds)
                .then(res => {
                    commit('setUser', res.data.user);
                    return dispatch('fetchCursos');
                });
        },
        fetchCursos({commit}) {
            return axios.get('../api/cursos_alumnos.php')
                .then(res => {
                    commit('setCursos', res.data);
                });
        }
    }
});
