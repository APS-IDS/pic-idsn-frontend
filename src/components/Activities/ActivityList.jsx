import React, { useState, useEffect } from "react";
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
  const initialActivity = NEW_ACTIVITY;

  useEffect(() => {
    if (activities.length === 0) {
      setActivities([initialActivity]);
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
    setExpandedIndex(null);
  };

  return (
    <div>
      <div className="grid-cols-3 flex gap-4 items-start justify-between my-6">
        <h2 className="text-lg font-semibold text-navy col-span-3 text-start ">Actividad</h2>
        <button
          type="button"
          className="flex items-center gap-2 bg-green-brand text-white border-0 py-2 pl-4 pr-3 rounded-3xl border-bg-teal-900 text-sm cursor-pointer hover:bg-teal"
          onClick={() => handleAddActivity()}
        >
          <span className="">+</span> Agregar actividad
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
   
    </div>
  );
};

export default ActivityList;
