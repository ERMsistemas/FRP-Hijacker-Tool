export default {
  name: 'Trayectos',
  props: {
    anios: Array,
    turnos: Array,
    tipos: Array
  },
  data() {
    return {
      anio: '',
      turno: '',
      tipo: ''
    };
  },
  computed: {
    filtroArmado() {
      if (!this.anio || !this.turno || !this.tipo) return '';
      return `${this.anio}.${this.turno}.${this.tipo}`;
    }
  },
  watch: {
    filtroArmado(nuevo) {
      this.$emit('filtro-cambiado', nuevo);
    }
  },
  template: `
    <div class="row justify-content-center mb-3">
      <div class="col-lg-4 col-md-8 mb-3">
        <label>Año/Trayecto:</label>
        <select class="form-control" v-model="anio">
          <option disabled value="">-- Seleccionar --</option>
          <option v-for="a in anios" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>

      <div class="col-lg-4 col-md-8 mb-3">
        <label>Turno:</label>
        <select class="form-control" v-model="turno">
          <option disabled value="">-- Seleccionar --</option>
          <option v-for="t in turnos" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <div class="col-lg-4 col-md-8 mb-3">
        <label>Tipo:</label>
        <select class="form-control" v-model="tipo">
          <option disabled value="">-- Seleccionar --</option>
          <option v-for="tp in tipos" :key="tp" :value="tp">{{ tp }}</option>
        </select>
      </div>
    </div>
  `
};
