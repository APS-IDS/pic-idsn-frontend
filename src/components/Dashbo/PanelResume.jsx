import React from "react";
import { Calendar, Activity, Box, File } from "lucide-react";

const PanelResume = ({ data }) => {
  const styletext = "text-teal-600";
  const sections = [
    {
      title: "Eventos",
      value: data?.events || 0,
      icon: <Calendar className={styletext} />,
    },
    {
      title: "Actividades",
      value: data?.activities || 0,
      icon: <Activity className={styletext} />,
    },
    {
      title: "Productos",
      value: data?.products || 0,
      icon: <Box className={styletext} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {sections.map((card, index) => (
        <div
          key={index}
          className="bg-app-card border border-app-border rounded-lg px-4 py-3 flex items-center gap-3.5 shadow-sm relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-teal-600" />
          <div className="w-12 h-12 rounded-lg bg-teal-light flex items-center justify-center flex-shrink-0 ml-2">
            {card?.icon}
          </div>
          <div>
            <div className="text-3xl text-navy font-extrabold">
              {card?.value}
            </div>
            <div className="text-sm text-muted">{card?.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default PanelResume;
