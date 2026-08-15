import React from "react";
import styles from "./Seguimiento.module.css";

const CronogramaTable = ({ cronograma }) => {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden shadow-sm">
      <div className="bg-teal text-app-card py-3 px-4 flex  justify-between items-center  font-semibold cursor-pointer" onClick={() => setOpen(!open)}>
        Cronograma
        <span className={`inline-block transform transition-transform duration-200 ${open ? 'rotate-180' : 'rotate-0'}`}>
          &#9660;
        </span>
      </div>
      {open && (
        <div className="flex flex-wrap gap-3 p-4">
          {cronograma.map((crono, index) =>
            Object.entries(crono).map(([mes, porcentaje]) =>
              porcentaje > 0 ? (
                <div key={`${index}-${mes}`} className="flex flex-col items-center bg-teal-light bordeer rounded-lg py-2 px-4 min-w-16">
                  <span className="text-xs text-teal-dark uppercase font-bold">{mes}</span>
                  <span className="text-lg text-teal-dark">{porcentaje}%</span>
                </div>
              ) : null,
            ),
          )}
        </div>
      )}

    </div>



  )
};

export default CronogramaTable;
