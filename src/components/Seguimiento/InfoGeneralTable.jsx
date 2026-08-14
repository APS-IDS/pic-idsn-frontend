import React from 'react';

const InfoGeneralTable = ({ actividad }) => {
  const [open, setOpen] = React.useState(true);
  if (!actividad) return null;

  return (
    <div className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden shadow-sm">
      <div className="bg-teal text-app-card py-3 px-4 flex  justify-between items-center  font-semibold cursor-pointer" onClick={() => setOpen(!open)}>
        Información general de la actividad
        <span className={`inline-block transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}>
          &#9660;
        </span>
      </div>
      {open && (<div className="py-3 px-4">
        <div className="mb-4">
          <label className="uppercase font-normal">Descripción de actividad</label>
          <div className="font-semibold text-sm">{actividad.descripcion}</div>
        </div>
        <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
          <div>
            <label className="uppercase font-normal">Cantidad a ejecutar</label>
            <div className="font-semibold text-sm">{actividad.cantidad_a_ejecutar}</div>
          </div>
          <div>
            <label className="uppercase font-normal">Unidad de medida</label>
            <div className="font-semibold text-sm">{actividad.unidad_medida}</div>
          </div>
          <div>
            <label className="uppercase font-normal">Entornos</label>
            <div className="font-semibold text-sm">{actividad.entornos.map((entorno) => entorno.nombre).join(", ")}</div>
          </div>

          <div>
            <label className="uppercase font-normal">Tecnologías</label>
            <div className="font-semibold text-sm">{actividad.tecnologias.map((tecno) => tecno.nombre).join(", ")}</div>
          </div>

          <div>
            <label className="uppercase font-normal">Curso de vida</label>
            <div className="font-semibold text-sm">{actividad.curso_de_vida.map((curso) => curso.nombre).join(", ")}</div>
          </div>
          <div>
            <label className="uppercase font-normal">Población Sujeto</label>
            <div className="font-semibold text-sm">{actividad.poblaciones.map((poblacion) => poblacion.nombre).join(", ")}</div>
          </div>
          <div>
            <label className="uppercase font-normal">Código Cups</label>
            <div className="font-semibold text-sm">{actividad.cups.codigo}</div>
          </div>

          <div>
            <label className="uppercase font-normal">Valor total</label>
            <div className="font-semibold text-sm"> $ {actividad.valor_total
              ? new Intl.NumberFormat("es-ES").format(actividad.valor_total)
              : "S/D"}</div>
          </div>

          <div>
            <label className="uppercase font-normal">Costo directos</label>
            <div className="font-semibold text-sm"> $ {actividad.costos_directos
              ? new Intl.NumberFormat("es-ES").format(actividad.costos_directos)
              : " S/D"}</div>
          </div>

          <div>
            <label className="uppercase font-normal">Costo indirectos</label>
            <div className="font-semibold text-sm"> $ {actividad.costos_indirectos
              ? new Intl.NumberFormat("es-ES").format(actividad.costos_indirectos)
              : " S/D"}</div>
          </div>

        </div>
      </div>)}


    </div>
  );
};

export default InfoGeneralTable;
