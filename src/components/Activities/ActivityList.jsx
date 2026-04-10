import React, { useState, useEffect } from "react";
import ActivityItem from "../ActivityEditor/ActivityItem";
import styles from "./ActivityList.module.css";

const ActivityList = ({
  activities,
  setActivities,
  entornos,
  tecnologias,
  poblaciones,
  soportes,
  cups,
  cursos_vida,
  anexoYear,
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // console.log("actividades_en_activitylist", activities);
  // console.log("Prueba", cursos_vida);
  const initialActivity = {
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

  useEffect(() => {
    if (activities.length === 0) {
      setActivities([initialActivity]);
      //setExpandedIndex(0); // Expande la actividad inicial automáticamente
    }
  }, [activities, setActivities]);

  const handleActivityChange = (e, activityIndex, soporteIndex) => {
    const { name, value } = e.target;
    const updatedActivities = [...activities];

    if (soporteIndex !== undefined) {
      updatedActivities[activityIndex].array_soportes[soporteIndex][name] =
        value;
    } else {
      updatedActivities[activityIndex][name] = value;
    }

    setActivities(updatedActivities);
  };

  const handleRemoveActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleAddActivity = () => {
    setActivities([...activities, initialActivity]);
    //setExpandedIndex(activities.length);
    setExpandedIndex(null);
  };

  return (
    <div>
      <ul className={styles.activityList}>
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            activity={activity}
            index={index}
            expanded={expandedIndex === index}
            toggleExpanded={toggleExpanded}
            handleActivityChange={handleActivityChange}
            handleRemoveActivity={handleRemoveActivity}
            handleAddActivity={handleAddActivity}
            entornos={entornos}
            tecnologias={tecnologias}
            poblaciones={poblaciones}
            soportes={soportes}
            cups={cups}
            cursos_vida={cursos_vida}
            anexoYear={anexoYear}
          />
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
