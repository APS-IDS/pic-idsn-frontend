import Header from "../Header/Header";
import Event from "../Event/Event";





const ReportForm = () => {




  return (
    <div className="bg-app-bg">
      <Header />
      <div className="max-w-6xl mx-auto min-h-dvh bg-app-bg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="">
            <h2 className="text-2xl font-bold text-navy m-0 text-start">Registrar Anexo Técnico</h2>
            <p className="text-sm text-app-muted text-start">
              Un anexo puede tener varios eventos · cada evento varios productos ·
              cada producto varios indicadores y actividades · cada actividad
              varios soportes.
            </p>
          </div>
        </div>


        <Event />



      </div>
      <div>

      </div>
    </div>
  );
};

export default ReportForm;
