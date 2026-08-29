export const ANIOS_DISPONIBLES = ["2025", "2026"];
export const INITIAL_EVENT_STATE = {
  subregion: [],
  operador_pic: "",
  municipio_priorizado: "",
  codigo_nombre_territorio: "",
  codigo_micro_territorio: "",
  total_hogares: "",
  poblacion: "",
  equipo_operativo: "",
  perfil_profesional: "",
  perfil_operativo: "",
  proyecto: "",
  description_event: "",
  indicator_name: "",
  meta_indicator: "",
  eje_estrategico: [],
  linea_operativa: "",
  activities: [],
  product_data: {
    producto: [
      {
        problematica: "",
        descripcion_producto: "",
        indicadores: [
          {
            cantidad: "",
            indicador_linea_base: "",
            meta_producto: "",
          },
        ],
        // nombre_entidad: "",
        // descripcion_operador: "",
      },
    ],
  },
};

export const PARAMETROS_INICIALES = {
  equipos: [],
  ejes: [],
  entornos: [],
  lineas: [],
  cursos: [],
  cups: [],
  poblacion: [],
  soportes: [],
  tecnologias: [],
};

export const NEW_INDICATOR = {
  cantidad: "",
  indicador_linea_base: "",
  meta_producto: "",
};

export const NEW_PRODUCT = {
  problematica: "",
  descripcion_producto: "",
  indicadores: [NEW_INDICATOR],
};

export const NEW_ACTIVITY = {
  descripcion_actividad: "",
  cantidad: "",
  unidad_medida: "",
  entorno: [],
  tecnologia: [],
  cursos_vida: [],
  poblacion_sujeto: [],
  codigo_cups: "",
  valor_unitario: "",
  costo_directo: "",
  costo_indirecto: "",
  valor_total: "",
  array_soportes: [
    {
      tipo_soporte: "",
      descripcion_soporte: "",
      cantidad_soporte: "",
    },
  ],
  cronograma: [
    { mes: "Ene", peso: 0 },
    { mes: "Feb", peso: 0 },
    { mes: "Mar", peso: 0 },
    { mes: "Abr", peso: 0 },
    { mes: "May", peso: 0 },
    { mes: "Jun", peso: 0 },
    { mes: "Jul", peso: 0 },
    { mes: "Ago", peso: 0 },
    { mes: "Sept", peso: 0 },
    { mes: "Oct", peso: 0 },
    { mes: "Nov", peso: 0 },
    { mes: "Dic", peso: 0 },
  ],
};
