import {useMemo} from "react";
import Select from "react-select";
import styles from "./ReporView.module.css";

const FiltersPanel = ({ filters, onChange, onApply, loading , onClear}) => {
  const filtersOrdenados= useMemo(()=>{
    if (!filters) return "";
     return filters.map((filter)=>{
      if (filter.key==="municipality") {
        const municipiosOrdenados= [...filter.optionsList].sort((a, b) =>
            a.label.localeCompare(b.label))
        return {...filter, optionsList: municipiosOrdenados}
      }
      return filter
     })
  },[filters])
  return (
    <div className="bg-app-card mb-3 mx-7 py-3 pb-4 px-6 border rounded-lg shadow-sm">
      <p className="font-semibold text-sm text-navy uppercase pt-1 pb-3">Filtros de búsqueda</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-end">
        {filtersOrdenados.map((filter) => (
          <div key={filter.key}>
            <label className="block text-xs text-app-muted mb-1">{filter.label}</label>

            <Select
                      name={filter.label}
                      //options={filter.optionsList}
                      options={[
                       { value: "", label: filter.text },
                        ...filter.optionsList
                      ]}
                      value={filter.value
                        ? {
                          value: filter.value,
                          label: filter.optionsList.find((option) => option.value === filter.value)?.label || filter.value,
                        }
                        : null
                      }
                      onChange={(e) => onChange(filter.key, e.value || null)}
                      placeholder={filter.text}
                      menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }), placeholder:(base) => ({...base, fontSize: "0.75rem", lineHeight: "1rem" }) }}
                    />

          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-3">


        <button onClick={onApply} disabled={loading} className="bg-teal text-white py-2 px-6 text-sm cursor-pointer border rounded-md hover:bg-teal-dark font-semibold" >
          {loading ? "Aplicando..." : "Aplicar filtros"}
        </button>
        <button className="py-2 px-6 text-sm cursor-pointer border rounded-md hover:bg-gray-200 font-semibold" onClick={onClear}>Limpiar</button>
      </div>
    </div>
  );
};

export default FiltersPanel;