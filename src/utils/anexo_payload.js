// Al editar hay que reenviar el uuid de eventos, productos, actividades y
// soportes: Strapi recrea los componentes en cada guardado y el backend usa el
// uuid para saber qué se eliminó (y borrar los seguimientos y observaciones
// que apuntan a soportes y actividades). Sin uuid el lifecycle genera uno
// nuevo y el anterior cuenta como eliminado. Al crear no se envía porque la
// política uuid-validation rechaza anexos nuevos con uuid.
const keepUuid = (item, isEdit) => (isEdit && item.uuid ? { uuid: item.uuid } : {});

// Cuerpo del POST/PUT de un anexo a partir del estado del formulario de eventos.
export const buildAnexoPayload = (
  events,
  { anexoYear, isEdit = false, version, confirmRemoval = false } = {},
) => ({
  data: {
    anexo_tecnico_date: anexoYear || null,
    ...(isEdit && { version }),
    // El usuario aceptó eliminar soportes/actividades que tienen registros.
    ...(isEdit && confirmRemoval && { confirmar_borrado: true }),

    eventos: events.map((event) => ({
      ...keepUuid(event, isEdit),
      // operador_pic: {
      //   connect: [{ documentId: event.operador_pic }] || null,
      // },

      operador_pic: event.operador_pic
        ? {
            connect: [{ documentId: event.operador_pic }],
          }
        : null,
      equipo: event.equipo_operativo || null,
      perfiles_profesional: event.perfil_profesional || null,
      perfil_operativo: event.perfil_operativo || null,

      territorializacion:
        event.total_hogares ||
        (Array.isArray(event.subregion) && event.subregion.length > 0) ||
        event.codigo_nombre_territorio ||
        event.codigo_micro_territorio
          ? {
              // numero_hogares: parseInt(event.total_hogares, 10) || null,
              numero_hogares: event.total_hogares || null,
              numero_pobalcion_intervenir: event.poblacion || null,
              municipios:
                Array.isArray(event.subregion) &&
                event.subregion.length > 0
                  ? {
                      connect: (event.subregion || []).map((region) => ({
                        documentId: region || null,
                      })),
                    }
                  : [],
              territorio: event.codigo_nombre_territorio || null,
              microterritorio: event.codigo_micro_territorio || null,
            }
          : null,

      descripcion: event.description_event || null,
      indicador_evento: event.indicator_name || null,
      meta_indicador_evento: event.meta_indicator || null,

      ejes_estrategicos: (event.eje_estrategico || []).map((eje) => ({
        nombre: eje || null,
      })),

      lineas_operativa: { nombre: event.linea_operativa || null },

      productos: event.product_data.producto.map((producto, index) => ({
        ...keepUuid(producto, isEdit),
        descripcion: producto.descripcion_producto || null,
        problematica_priorizada: producto.problematica || null,
        actividades: (event.activities[index] || []).map((activity) => ({
          ...keepUuid(activity, isEdit),
          descripcion: activity.descripcion_actividad || null,
          cantidad_a_ejecutar: activity.cantidad || null,
          unidad_medida: activity.unidad_medida || null,
          valor_unitario: activity.valor_unitario || null,
          costos_directos: activity.costo_directo || null,
          costos_indirectos: activity.costo_indirecto || null,
          valor_total: activity.valor_total || null,
          entornos: activity.entorno.map((entorno) => ({
            nombre: entorno || null,
          })),

          tecnologias: activity.tecnologia.map((tecno) => ({
            nombre: tecno || null,
          })),
          curso_de_vida: activity.cursos_vida.map((curso) => ({
            nombre: curso || null,
          })),

          // curso_de_vida: activity.cursos_vida[0] || null,

          poblaciones: activity.poblacion_sujeto.map((poblacion) => ({
            nombre: poblacion || null,
          })),
          cups: { codigo: activity.codigo_cups } || null,
          soportes: activity.array_soportes.map((soporte) => ({
            ...keepUuid(soporte, isEdit),
            tipo: soporte.tipo_soporte || null,
            descripcion: soporte.descripcion_soporte || null,
            cantidad: soporte.cantidad_soporte || null,
          })),
          cronograma: activity.cronograma.map((item) => ({
            [item.mes]: parseInt(item.peso, 10),
          })),
        })),

        indicadores: (producto.indicadores || []).map((indicador) => ({
          meta_producto: indicador.meta_producto || null,
          cantidad: indicador.cantidad || null,
          indicador_linea_base: indicador.indicador_linea_base || null,
        })),
      })),
      proyectos_idsn: event.proyecto
        ? {
            connect: [{ documentId: event.proyecto }] || null,
          }
        : null,
    })),
  },
});
