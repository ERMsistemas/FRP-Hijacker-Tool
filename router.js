import Trayectos from './components/Trayectos.js';
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
    components: {
        Trayectos
  },
    data() {
        return {
            seleccionados: [],
            filtroDesdeTrayectos: '',
            listaAnios: ['2025TRGN', '2025TRGO'],
            listaTurnos: ['LU1500', 'VI1500', 'MI1700'],
            listaTipos: ['TR1', 'TR2'],
            estadoSeleccionado: 'Presente'
            /* cursoSeleccionado: '',
            cursoSel: '' */
        };
    },
created() {
    this.$store.dispatch('fetchCursos').then(() => {
        this.$nextTick(() => {
            this.seleccionados = this.$store.state.cursos
                .filter(al => al.estado === 'Presente')
                .map(al => al.id);
                this.listaAnios = Array.from(new Set(this.$store.state.cursos.map(c => c.curso.split(".")[0])));
                this.listaTurnos = Array.from(new Set(this.$store.state.cursos.map(c => c.curso.split(".")[1])));
                this.listaTipos = Array.from(new Set(this.$store.state.cursos.map(c => c.curso.split(".")[2])));
        });
    });
},
    computed: {
        cursos() {
            return this.$store.state.cursos;
        },
        cursosFiltrados() {
            if (!this.filtroDesdeTrayectos) return this.cursos;
            return this.cursos.filter(c => c.curso?.includes(this.filtroDesdeTrayectos))
            .sort((a, b) => a.alumno.localeCompare(b.alumno));
/*             return this.cursos.filter(c => c.curso === this.filtroDesdeTrayectos);
 */                /* if (!this.cursoSeleccionado) return this.cursos;
                return this.cursos.filter(c => c.curso === this.cursoSeleccionado); */
            },
            Presentes() {
                return this.cursosFiltrados.filter(c => c.asistencias === 'Presente').length;
            },
            Ausentes() {
                return this.cursosFiltrados.filter(c => c.asistencias !== 'Presente').length;
            }
            /* listaCursosUnicos() {
                const set = new Set(this.cursos.map(c => c.curso));
                return Array.from(set);
            },
            listaCurso() {
                const set = new Set(this.cursos.map(c => c.curso));
                return Array.from(set);
            } */
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
            this.$nextTick(() => {
                $('#asistenciaModal').modal('show');
            });
        },
        confirmarGuardar() {
            $('#asistenciaModal').modal('hide');
            fetch('../api/marcar_presentes.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                seleccionados: this.seleccionados,
                estado: this.estadoSeleccionado
                })
            })
            .then(res => res.json())
            .then(() => {
                alert('Guardado correctamente');
                this.seleccionados = [];
                this.$store.dispatch('fetchCursos');
            })
            .catch(err => console.error(err));
            }
    },
    template: `
    <div class="dyntab">
    <!-- Contenedor de Cards -->
<div class="d-flex justify-content-center flex-wrap gap-5 my-4">

  <!-- Card Alumnos -->
  <div class="card text-bg-primary text-center shadow" style="width: 10rem;">
    <div class="card-body">
      <div class="mb-2">
        <i class="bi bi-people-fill fs-3"></i><br>
        <strong>Alumnos</strong>
      </div>
      <h3 class="card-title mb-0">1537</h3>
    </div>
  </div>

  <!-- Card Presentes -->
  <div class="card text-bg-success text-center shadow" style="width: 10rem;">
    <div class="card-body">
      <div class="mb-2">
        <i class="bi bi-check-circle-fill fs-3"></i><br>
        <strong>Presentes</strong>
      </div>
      <h3 class="card-title mb-0">5</h3>
    </div>
  </div>

  <!-- Card Ausentes -->
  <div class="card text-bg-danger text-center shadow" style="width: 10rem;">
    <div class="card-body">
      <div class="mb-2">
        <i class="bi bi-x-circle-fill fs-3"></i><br>
        <strong>Ausentes</strong>
      </div>
      <h3 class="card-title mb-0">1532</h3>
    </div>
  </div>

</div>


            <div class="container-fluid px-4">
                    <trayectos
                    :anios="listaAnios" 
                    :turnos="listaTurnos" 
                    :tipos="listaTipos" 
                    @filtro-cambiado="filtroDesdeTrayectos = $event"></trayectos>
        </div>
        <div class="container my-3" style="margin-top: 10px;">

        </div>
            <div class="table-responsive table-wrapper" style="height: calc(100vh - 160px); overflow-y: auto;">
                <table class="table table-primary table-hover text-center">
                    <thead class="bg-primary text-white sticky-top">
                        <tr>
                     
                        <th class="text-center w-50">Alumno</th>
                        <th class="text-center w-50">DNI</th>
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
                            <td class="text-start">
                                <div class="row">
                                    <div class="col-2"></div>
                                    <div class="col-8"> {{ al.alumno }}</div>
                                </div>
                            </td>
                            <td class="text-center pe-4">{{ al.dni }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="guardar-fixed text-center">
                <button class="btn btn-success btn-block btn-lg px-4"
                        :disabled="seleccionados.length === 0"
                        @click="guardar">
                    Guardar ({{ seleccionados.length }})
                </button>
            </div>
            
            
            
            <div class="modal fade" id="asistenciaModal" tabindex="-1" role="dialog" aria-labelledby="asistenciaModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="asistenciaModalLabel">Confirmar asistencia</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div>
                  <label><input type="radio" v-model="estadoSeleccionado" value="Presente"> Presente</label><br>
                  <label><input type="radio" v-model="estadoSeleccionado" value="Ausente"> Ausente</label>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" @click="confirmarGuardar">Confirmar</button>
              </div>
            </div>
          </div>
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
export default router;
