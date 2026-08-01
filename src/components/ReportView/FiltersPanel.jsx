import React from "react";
import Select from "react-select";
import styles from "./ReporView.module.css";

const FiltersPanel = ({ filters, onChange, onApply, loading , onClear}) => {
  return (
    <div className="bg-app-card mb-3 mx-7 py-3 pb-4 px-6 border rounded-lg shadow-sm">
      <p className="font-semibold text-sm text-navy uppercase pt-1 pb-3">Filtros de búsqueda</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3 items-end">
        {filters.map((filter) => (
          <div key={filter.key}>
            <label className="block text-xs text-app-muted mb-1">{filter.label}</label>
            <select
              value={filter.value || ""}
              className="w-full p-2 pr-10 border border-app-border rounded-md text-sm cursor-pointer hover:bg-gray-200 bg-no-repeat bg-[position:right_10px_center] focus:outline-none focus:border-green-brand focus:ring-1 focus:ring-green-brand"
              onChange={(e) => onChange(filter.key, e.target.value || null)}
            >
              <option className="" value=""> {filter.text}</option>
              {filter.optionsList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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