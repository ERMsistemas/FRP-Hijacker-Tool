const Login = {
    template: `
    <div class="container mt-5">
        <h3>Ingreso</h3>
        <form @submit.prevent="doLogin">
            <div class="form-group">
                <input v-model="usr" class="form-control" placeholder="Usuario" required>
            </div>
            <div class="form-group">
                <input v-model="pass" type="password" class="form-control" placeholder="Contraseña" required>
            </div>
            <button class="btn btn-primary" type="submit">Ingresar</button>
        </form>
    </div>
    `,
    data(){
        return { usr:'', pass:'' };
    },
    methods:{
        doLogin(){
            this.$store.dispatch('login', {usr:this.usr, pass:this.pass})
                .then(()=> this.$router.push('/home'))
                .catch(()=> alert('Credenciales inválidas'));
        }
    }
};

const Home = {
    data() {
        return {
            seleccionados: [],
            cursoSeleccionado: ''
        };
    },
created() {
    this.$store.dispatch('fetchCursos').then(() => {
        this.$nextTick(() => {
            this.seleccionados = this.$store.state.cursos
                .filter(al => al.estado === 'Presente')
                .map(al => al.id);
        });
    });
},
    computed: {
        cursos() {
            return this.$store.state.cursos;
        },
        cursosFiltrados() {
                /* if (!this.cursoSeleccionado) return this.cursos;
                return this.cursos.filter(c => c.curso === this.cursoSeleccionado); */
            },
            listaCursosUnicos() {
                const set = new Set(this.cursos.map(c => c.curso));
                return Array.from(set);
            }
    },
    methods: {
        toggleSeleccion(id) {
            const i = this.seleccionados.indexOf(id);
            if (i === -1) this.seleccionados.push(id);
            else this.seleccionados.splice(i, 1);
        },
        estaSeleccionado(id) {
            return this.seleccionados.includes(id);
        },
        guardar() {
            fetch('api/marcar_presentes.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.seleccionados)
            })
            .then(res => res.json())
            .then(() => {
                alert('Guardado correctamente');
                this.seleccionados = [];
                this.$store.dispatch('fetchCursos');
                this.$nextTick(() => {
                    this.seleccionados = this.$store.state.cursos
                        .filter(al => al.estado === 'Presente')
                        .map(al => al.id);
                }); 
            })
            .catch(err => console.error(err));
        }
    },
    template: `
    <div class="dyntab">
        <h3 class="text-center my-3">Alumnos</h3>
        
        <div class="container my-3">
  <label><strong>Filtrar por curso:</strong></label>
  <select class="form-control" v-model="cursoSeleccionado">
    <option value="">-- Todos --</option>
    <option v-for="c in listaCursosUnicos" :key="c" :value="c">{{ c }}</option>
  </select>
</div>
        <div class="table-responsive table-wrapper" style="height: calc(100vh - 160px); overflow-y: auto;">
            <table class="table table-hover table-bordered text-center">
                <thead class="bg-primary text-white sticky-top">
                    <tr>
                     
                        <th>Alumno</th>
                        <th>DNI</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="al in cursosFiltrados" 
                        :key="al.id"
                         :class="[
                            'selectable-row',
                            { 'seleccionado': estaSeleccionado(al.id) },
                            al.asistencias ? al.asistencias.toLowerCase() : ''
                        ]"
                        @click="toggleSeleccion(al.id)"
                        style="cursor: pointer;"
                    >
                        <td>{{ al.alumno }}</td>
                        <td>{{ al.dni }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="guardar-fixed">
            <button class="btn btn-success btn-block"
                    :disabled="seleccionados.length === 0"
                    @click="guardar">
                Guardar ({{ seleccionados.length }})
            </button>
        </div>
    </div>
    `
};

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/home', component: Home }
    ]
});
