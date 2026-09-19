import React, { useEffect, useState } from "react";
import ActivityItem from "../ActivityEditor/ActivityItem";
import { NEW_ACTIVITY } from "../../utils/const_forms";

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

  // Siempre crear una actividad completamente independiente
  const createNewActivity = () => structuredClone(NEW_ACTIVITY);

  // Si el producto no tiene actividades, crear una actividad inicial
  useEffect(() => {
    if (!Array.isArray(activities)) {
      console.error("ActivityList recibió activities inválido:", activities);
      return;
    }

    if (activities.length === 0) {
      setActivities([createNewActivity()]);
    }
  }, [activities.length, setActivities]);

  const handleActivityChange = (
    e,
    activityIndex,
    soporteIndex
  ) => {
    const { name, value } = e.target;

    const updatedActivities = activities.map(
      (activity, index) => {
        if (index !== activityIndex) {
          return activity;
        }

        // Cambio dentro de array_soportes
        if (soporteIndex !== undefined) {
          return {
            ...activity,
            array_soportes: (
              activity.array_soportes || []
            ).map((soporte, indexSoporte) => {
              if (indexSoporte !== soporteIndex) {
                return soporte;
              }

              return {
                ...soporte,
                [name]: value,
              };
            }),
          };
        }

        return {
          ...activity,
          [name]: value,
        };
      }
    );
    setActivities(updatedActivities);
  };

  const handleRemoveActivity = (index) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    setActivities(updatedActivities);

    // Ajustar acordeón
    setExpandedIndex((prev) => {
      if (prev === null) {
        return null;
      }

      if (prev === index) {
        return null;
      }

      if (prev > index) {
        return prev - 1;
      }

      return prev;
    });
  };

  const toggleExpanded = (index) => {
    setExpandedIndex((prev) =>
      prev === index ? null : index
    );
  };

  const handleAddActivity = () => {
    const newActivity = createNewActivity();

    const updatedActivities = [
      ...activities,
      newActivity,
    ];

    setActivities(updatedActivities);
    setExpandedIndex(null);
  };

  return (
    <div>
      <div className="grid-cols-3 flex gap-4 items-start justify-between my-6">
        <h2 className="text-lg font-semibold text-navy col-span-3 text-start ">Actividad</h2>
        <button
          type="button"
          className="flex items-center gap-2 bg-green-brand text-white border-0 py-2 pl-4 pr-3 rounded-3xl border-bg-teal-900 text-sm cursor-pointer hover:bg-teal"
          onClick={handleAddActivity}
        >
          <span>+</span>
          Agregar actividad
        </button>
      </div>

      {activities.map((activity, index) => (
        <ActivityItem
          key={index}
          activity={activity}
          index={index}
          expanded={expandedIndex === index}
          toggleExpanded={toggleExpanded}
          handleActivityChange={handleActivityChange}
          handleRemoveActivity={handleRemoveActivity}
          entornos={entornos}
          tecnologias={tecnologias}
          poblaciones={poblaciones}
          soportes={soportes}
          cups={cups}
          cursos_vida={cursos_vida}
          anexoYear={anexoYear}
        />
      ))}
    </div>
  );
};

export default ActivityList;
