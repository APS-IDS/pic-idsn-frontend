import React from "react";
import Select from "react-select";
import styles from "./ReporView.module.css";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "2px 5px",
    width: "1000px",
    fontSize: "16px",
    border: state.isFocused ? "1px solid #007bff" : "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "white",
    boxShadow: "none",
    cursor: "pointer",
    "&:hover": { borderColor: "#007bff" },
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    backgroundColor: state.isSelected
      ? "#007bff"
      : state.isFocused
        ? "#e6f0ff"
        : "white",
    color: state.isSelected ? "white" : "black",
  }),
  singleValue: (provided) => ({ ...provided, color: "black" }),
};

const FiltersPanel = ({
  proyectos,
  operadores,
  filterValue,
  operatorFilterValue,
  anexoDate,
  onProjectChange,
  onOperatorChange,
  onYearChange,
}) => {
  return (
    <>
      <div className={styles.filterContainer}>
        <div className={styles.container_label}>
          <label htmlFor="proyectoFilter">Filtrar por Proyecto IDSN:</label>
        </div>
        <Select
          name="proyecto"
          options={[
            { value: "", label: "Todos los proyectos" },
            ...proyectos.map((option) => ({
              value: option.proyecto,
              label: option.proyecto,
            })),
          ]}
          value={
            filterValue
              ? {
                  value: filterValue,
                  label:
                    proyectos.find((p) => p.proyecto === filterValue)
                      ?.proyecto || filterValue,
                }
              : { value: "", label: "Todos los proyectos" }
          }
          onChange={(selectedOption) =>
            onProjectChange(selectedOption?.value || "")
          }
          placeholder="Seleccionar proyecto"
          styles={customStyles}
        />
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.container_label}>
          <label htmlFor="operatorFilter">Filtrar por Operador:</label>
        </div>
        <Select
          name="operador"
          options={[
            { value: "", label: "Todos los operadores" },
            ...operadores.map((option) => ({
              value: option.operador_pic,
              label: option.operador_pic,
            })),
          ]}
          value={
            operatorFilterValue
              ? {
                  value: operatorFilterValue,
                  label:
                    operadores.find(
                      (o) => o.operador_pic === operatorFilterValue,
                    )?.operador_pic || operatorFilterValue,
                }
              : { value: "", label: "Todos los operadores" }
          }
          onChange={(selectedOption) =>
            onOperatorChange(selectedOption?.value || "")
          }
          placeholder="Seleccionar operador"
          styles={customStyles}
        />
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.container_label}>
          <label htmlFor="yearFilter">Filtrar por Año:</label>
        </div>
        <Select
          name="year"
          options={[
            { value: "", label: "Todos los años" },
            { value: "2025", label: "2025" },
            { value: "2026", label: "2026" },
          ]}
          value={
            anexoDate
              ? { value: anexoDate, label: anexoDate }
              : { value: "", label: "Todos los años" }
          }
          onChange={(selectedOption) =>
            onYearChange(selectedOption?.value || "")
          }
          placeholder="Seleccionar año"
          styles={customStyles}
        />
      </div>
    </>
  );
};

export default FiltersPanel;
