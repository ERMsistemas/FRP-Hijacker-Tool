new Vue({
    el: '#app',
    store,
    router,
    created(){
        if(this.$store.state.user){
            this.$store.dispatch('fetchCursos');
        }
    },
    template:`<router-view></router-view>`
});
