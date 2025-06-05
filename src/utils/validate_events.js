import Swal from "sweetalert2";
const validateEventsData = (events) => {
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    // event.subregion.length > 0

    if (!event.subregion.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `"Nodo-Municipio-Priorizado" está vacío en el Evento ${i + 1}.`,
      });
      return false;
    }

    if (!event.operador_pic) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Operador PIC" está vacío en el evento ${i + 1}.`,
      });
      return false;
    }

    if (!event.equipo_operativo) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Equipo Operativo" está vacío en el evento ${i + 1}.`,
      });
      return false;
    }

    if (!event.perfil_profesional) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Perfil Profesional" está vacío en el evento ${i + 1}.`,
      });
      return false;
    }

    if (!event.perfil_operativo) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Perfil Operativo" está vacío en el evento ${i + 1}.`,
      });
      return false;
    }

    if (!event.proyecto) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Proyecto IDSN Responsable" está vacío en el evento ${
          i + 1
        }.`,
      });
      return false;
    }

    if (!event.description_event) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Descripción Evento" está vacío en el evento ${i + 1}.`,
      });
      return false;
    }

    if (!event.indicator_name) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Nombre del indicador" está vacío en el evento ${
          i + 1
        }.`,
      });
      return false;
    }

    if (!event.meta_indicator) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Meta Indicador" está vacío en el evento ${i + 1}.`,
      });
      return false;
    }

    if (!event.eje_estrategico.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Ejes Estratégicos" está vacío en el evento ${i + 1}.`,
      });
      return false;
    }

    if (!event.linea_operativa) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `El campo "Lineas Operativas" está vacío en el evento ${i + 1}.`,
      });
      return false;
    }

    //*********************************/

    if (!event.product_data?.producto?.length) {
      Swal.fire({
        icon: "warning",
        title: "Campo incompleto",
        text: `Debe agregar al menos un producto en el evento ${i + 1}.`,
      });
      return false;
    }

    for (let j = 0; j < event.product_data.producto.length; j++) {
      const producto = event.product_data.producto[j];

      if (!producto.descripcion_producto) {
        Swal.fire({
          icon: "warning",
          title: "Campo incompleto",
          text: `Falta el campo "Descripción del Producto" en producto ${
            j + 1
          } en el evento ${i + 1}.`,
        });
        return false;
      }

      const indicadores = producto.indicadores || [];

      if (!indicadores.length) {
        Swal.fire({
          icon: "warning",
          title: "Indicadores requeridos",
          text: `Debe agregar al menos un indicador para el producto ${
            j + 1
          } en el evento ${i + 1}.`,
        });
        return false;
      }

      for (let l = 0; l < indicadores.length; l++) {
        const indicador = indicadores[l];

        if (!indicador.meta_producto) {
          Swal.fire({
            icon: "warning",
            title: "Campo incompleto",
            text: `Falta el campo "Indicador de producto"  en el indicador ${
              l + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }
      }
      //**************** */

      const actividades = event.activities?.[j] || [];

      if (!actividades.length) {
        Swal.fire({
          icon: "warning",
          title: "Campo incompleto",
          text: `Debe agregar al menos una actividad para el producto ${
            j + 1
          } en el evento ${i + 1}.`,
        });
        return false;
      }

      for (let k = 0; k < actividades.length; k++) {
        const actividad = actividades[k];

        if (!actividad.descripcion_actividad) {
          Swal.fire({
            icon: "warning",
            title: "Campo incompleto",
            text: `Falta el campo "Descripción Actividad" de la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        if (!actividad.cantidad) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Falta el campo "Cantidad" de la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}`,
          });
          return false;
        }

        if (!actividad.unidad_medida) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Falta el campo "Unidad de Medida" de la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        if (!actividad.entorno?.length) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Debe agregar al menos un "Entorno" para la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        if (!actividad.tecnologia?.length) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Debe agregar al menos una "Tecnología" para la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        if (!actividad.poblacion_sujeto?.length) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Debe agregar al menos una "Población Sujeto" para la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        console.log("Soporte", actividad.array_soportes[0].tipo_soporte);

        if (!actividad.array_soportes[0].tipo_soporte) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Debe agregar el campo "Tipo Soporte"  de la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        if (!actividad.array_soportes[0].descripcion_soporte) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Debe agregar el campo "Descripción Soporte" para la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        if (!actividad.array_soportes[0].cantidad_soporte) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Debe agregar el campo "Cantidad" en soportes, para la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        if (!actividad.codigo_cups) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Debe ingresar el "Código CUPS" para la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }

        if (!actividad.valor_unitario) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Falta el campo "Valor Unitario" de la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}`,
          });
          return false;
        }

        if (!actividad.valor_total) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Falta el campo "Valor Total" de la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}`,
          });
          return false;
        }

        const cronogramaValido = actividad.cronograma?.some(
          (item) => item.peso > 0
        );

        if (!cronogramaValido) {
          Swal.fire({
            icon: "warning",
            title: "Campo Incompleto",
            text: `Debe asignar al menos un porcentaje en el cronograma de la actividad ${
              k + 1
            } del producto ${j + 1} en el evento ${i + 1}.`,
          });
          return false;
        }
      }
    }
  }

  return true;
};

export default validateEventsData;
