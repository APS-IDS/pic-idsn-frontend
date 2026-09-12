export const ANIOS_DISPONIBLES = ["2025", "2026"];
export const NEW_ANEXO_DATE = "2026-01-01";
export const OLD_ANEXO_DATE = "2025-01-01";
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

export const transformEvent = (evento) => {
  return {
    //subregion: evento.territorializacion.subregion,
    subregion: evento?.territorializacion?.municipios?.map(
      (muni) => muni.documentId,
    ),
    operador_pic: evento?.operador_pic?.documentId,
    // municipio_priorizado: evento.territorializacion.municipio,
    codigo_nombre_territorio: evento?.territorializacion?.territorio,
    codigo_micro_territorio: evento?.territorializacion?.microterritorio,
    total_hogares: evento?.territorializacion?.numero_hogares,
    poblacion: evento?.territorializacion?.numero_pobalcion_intervenir,
    equipo_operativo: evento?.equipo,
    perfil_profesional: evento?.perfiles_profesional,
    perfil_operativo: evento?.perfil_operativo,
    proyecto: evento?.proyectos_idsn?.documentId,
    description_event: evento?.descripcion,
    indicator_name: evento?.indicador_evento,
    meta_indicator: evento?.meta_indicador_evento,
    eje_estrategico: evento?.ejes_estrategicos?.map((eje) => eje.nombre),
    linea_operativa: evento?.lineas_operativa?.nombre,

    activities: evento.productos.map((producto) =>
      producto.actividades.map((actividad) => ({
        descripcion_actividad: actividad.descripcion,
        cantidad: actividad.cantidad_a_ejecutar,
        uuid: actividad.uuid,
        unidad_medida: actividad.unidad_medida,
        entorno: actividad.entornos.map((entorno) => entorno.nombre),
        tecnologia: actividad.tecnologias.map((tecno) => tecno.nombre),
        cursos_vida: actividad.curso_de_vida.map((curso) => curso.nombre),
        poblacion_sujeto: actividad.poblaciones.map((pobla) => pobla.nombre),
        codigo_cups: actividad.cups.codigo,
        valor_unitario: actividad.valor_unitario,
        costo_directo: actividad.costos_directos,
        costo_indirecto: actividad.costos_indirectos,
        valor_total: actividad.valor_total,
        array_soportes: actividad.soportes.map((soporte) => ({
          tipo_soporte: soporte.tipo,
          descripcion_soporte: soporte.descripcion,
          cantidad_soporte: soporte.cantidad,
          uuid: soporte.uuid,
        })),

        cronograma: [
          {
            mes: "Ene",
            peso: actividad.cronograma[0].Ene,
          },
          {
            mes: "Feb",
            peso: actividad.cronograma[1].Feb,
          },
          {
            mes: "Mar",
            peso: actividad.cronograma[2].Mar,
          },
          {
            mes: "Abr",
            peso: actividad.cronograma[3].Abr,
          },
          {
            mes: "May",
            peso: actividad.cronograma[4].May,
          },
          {
            mes: "Jun",
            peso: actividad.cronograma[5].Jun,
          },
          {
            mes: "Jul",
            peso: actividad.cronograma[6].Jul,
          },
          {
            mes: "Ago",
            peso: actividad.cronograma[7].Ago,
          },
          {
            mes: "Sept",
            peso: actividad.cronograma[8].Sept,
          },
          {
            mes: "Oct",
            peso: actividad.cronograma[9].Oct,
          },
          {
            mes: "Nov",
            peso: actividad.cronograma[10].Nov,
          },
          {
            mes: "Dic",
            peso: actividad.cronograma[11].Dic,
          },
        ],
      })),
    ),

    product_data: {
      producto: evento.productos.map((producto) => ({
        problematica: producto.problematica_priorizada,
        descripcion_producto: producto.descripcion,
        indicadores: producto.indicadores.map((indicador) => ({
          cantidad: indicador.cantidad,
          indicador_linea_base: indicador.indicador_linea_base,
          meta_producto: indicador.meta_producto,
        })),
      })),
    },
  };
};
