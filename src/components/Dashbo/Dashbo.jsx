// import React, { useState, useEffect } from "react";
// import Header from "../Header/Header";
// import Sidebar from "../Sidebar/Sidebar";
// import styles from "./Dashboard.module.css";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// const eventos_municipio = [
//   { mes: "LA UNION", cantidad: 10 },
//   { mes: "BUESACO", cantidad: 20 },
//   { mes: "EL TABLON", cantidad: 15 },
//   { mes: "BELEN", cantidad: 30 },
//   { mes: "SAN BERNARDO", cantidad: 25 },
//   { mes: "TANGUA", cantidad: 35 },
//   { mes: "YACUANQUER", cantidad: 40 },
// ];

// const productos_proyecto = [
//   {
//     mes: "Medicamentos-Prestación de servicios de salud con calidad para la paz",
//     cantidad: 10,
//   },
//   {
//     mes: "Salud para Población de Especial Protección para la paz",
//     cantidad: 20,
//   },
//   {
//     mes: "PAI -Prevención de enfermedades transmisibles para la paz",
//     cantidad: 15,
//   },
//   {
//     mes: "Garantía de derechos sexuales y reproductivos para la paz",
//     cantidad: 30,
//   },
//   { mes: "Atención Primaria En Salud", cantidad: 25 },
//   { mes: "Emergencias-Salud Ambiental para la Paz", cantidad: 35 },
//   { mes: "Nutrición y alimentación saludable para la Paz", cantidad: 40 },
// ];

// const operador_evento = [
//   {
//     mes: "E.S.E. Hospital San Andrés - Tumaco",
//     cantidad: 10,
//   },
//   {
//     mes: "E.S.E. Hospital el Buen Samaritano - La Cruz",
//     cantidad: 20,
//   },
//   {
//     mes: "E.S.E. Hospital Departamental de Nariño",
//     cantidad: 15,
//   },
//   {
//     mes: "E.S.E. Centro de Salud de Puerres",
//     cantidad: 30,
//   },
//   { mes: "E.S.E. Hospital Clarita Santos - Sandoná", cantidad: 25 },
//   { mes: "E.S.E. Centro de Salud de Ancuyá - Nariñoz", cantidad: 35 },
//   { mes: "E.S.E. Centro de Salud - Consacá", cantidad: 40 },
// ];

// const producto_indicador = [
//   {
//     mes: "Menos de 2 indicadores",
//     cantidad: 10,
//   },
//   {
//     mes: "Igual a 2 y menor o igual a 3 indicadores",
//     cantidad: 20,
//   },
//   {
//     mes: "Mas de tres indicadores",
//     cantidad: 30,
//   },
// ];

// const tecnologia_actividad = [
//   {
//     mes: "Redes Familiares",
//     cantidad: 10,
//   },
//   {
//     mes: "Zonas de Escucha",
//     cantidad: 12,
//   },
//   {
//     mes: "Rehabilitación",
//     cantidad: 14,
//   },
//   {
//     mes: "Tamizaje",
//     cantidad: 14,
//   },
//   {
//     mes: "Jornadas de Salud",
//     cantidad: 14,
//   },
//   {
//     mes: "Vacunación",
//     cantidad: 14,
//   },
//   {
//     mes: "Medicamentos",
//     cantidad: 14,
//   },
// ];

// const entorno_actividad = [
//   {
//     mes: "Hogar",
//     cantidad: 10,
//   },
//   {
//     mes: "Comunitario",
//     cantidad: 12,
//   },
//   {
//     mes: "Educativo",
//     cantidad: 14,
//   },
//   {
//     mes: "Laboral-Informal",
//     cantidad: 14,
//   },
//   {
//     mes: "Insitucional",
//     cantidad: 14,
//   },
// ];

// const poblacion_actividad = [
//   {
//     mes: "Familias",
//     cantidad: 10,
//   },
//   {
//     mes: "Comunidad",
//     cantidad: 12,
//   },
//   {
//     mes: "Personas",
//     cantidad: 14,
//   },
//   {
//     mes: "Estudiantes",
//     cantidad: 14,
//   },
//   {
//     mes: "Comunidad Educativa",
//     cantidad: 14,
//   },
//   {
//     mes: "Trabajadores",
//     cantidad: 14,
//   },
// ];

// const mes_actividad = [
//   { mes: "Enero", cantidad: 10 },
//   { mes: "Febrero", cantidad: 12 },
//   { mes: "Marzo", cantidad: 14 },
//   { mes: "Abril", cantidad: 16 },
//   { mes: "Mayo", cantidad: 18 },
//   { mes: "Junio", cantidad: 20 },
//   { mes: "Julio", cantidad: 22 },
//   { mes: "Agosto", cantidad: 24 },
//   { mes: "Septiembre", cantidad: 26 },
//   { mes: "Octubre", cantidad: 28 },
//   { mes: "Noviembre", cantidad: 30 },
//   { mes: "Diciembre", cantidad: 32 },
// ];

// const check_soporte = [
//   {
//     mes: "Aprobado",
//     cantidad: 10,
//   },
//   {
//     mes: "No aprobado",
//     cantidad: 12,
//   },
//   {
//     mes: "Aprobado Soporte Físico",
//     cantidad: 14,
//   },
//   {
//     mes: "No Aprobado Soporte Físico",
//     cantidad: 14,
//   },
// ];

// const Dashbo = () => {
//   const back = import.meta.env.VITE_APP_BACK;
//   const url_usuarios = `${back}/api/users/me?pLevel=2`;
//   const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
//   const token = token_object.token;

//   const [usuario_dos, setUsuario_dos] = useState(null);
//   const [super_usuario, setSuper] = useState(null);
//   // let super_usuario = false;
//   const colors = [
//     "#6652dc", // Azul violeta
//     "#1cb36a", // Verde lima
//     "#ca6820", // Naranja rojizo
//     "#267b52", // Verde lima
//     "#156784", // Azul dodger
//     "#7727b8", // Rosa fuerte
//     "#c2a42b", // Dorado
//   ];

//   useEffect(() => {
//     const fetch_user = async () => {
//       try {
//         const response = await fetch(`${url_usuarios}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) throw new Error("Error al obtener usuarios.");

//         const data = await response.json();
//         const datos = {
//           usuario: data.custom_roles[0].name,
//         };

//         if (data.custom_roles.length > 1) {
//           setSuper(true);
//         }

//         console.log("data_usuario", data);
//         console.log("datos", datos);
//         sessionStorage.setItem("usuario", JSON.stringify(datos));
//         setUsuario_dos(datos.usuario);
//         console.log("super_user", super_usuario);
//         //setSubregions(data.data);
//         // setMunicipios(data.data);
//       } catch (error) {
//         console.error("Error fetching subregions:", error);
//       }
//     };

//     fetch_user();
//   }, [token]);

//   const usuario_object = JSON.parse(sessionStorage.getItem("usuario")) || {};

//   const usuario = usuario_object.usuario;

//   console.log("usuario_rol", usuario);

//   return (
//     <div className={styles.dashboard}>
//       <Header />
//       <div className={styles.main}>
//         <Sidebar usuario_dos={usuario_dos} super_usuario={super_usuario} />
//         {/* <div className={styles.content}> */}

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(2, 1fr)", // 2 columnas
//             gap: "10px",
//             justifyContent: "center",
//             width: "100%",
//             background: "#ecf0f1",
//           }}
//         >
//           {/* Contenedor para la gráfica */}
//           <div style={{ width: "100%", height: 300, marginBottom: "40px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               {/* <BarChart width={800} height={300} data={eventos_municipio}> */}
//               <BarChart data={eventos_municipio}>
//                 <defs>
//                   <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
//                     <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <text
//                   x="48%"
//                   y={15}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Cantidad de Eventos Según Municipio
//                 </text>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="mes" angle={-15} textAnchor="end" />
//                 <YAxis />
//                 <Tooltip />
//                 {/* <Bar dataKey="cantidad" fill="#8884d8" barSize={60} /> */}
//                 <Bar dataKey="cantidad" fill="url(#colorUv)" barSize={50} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ width: "100%", height: 400, marginTop: "30px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               {/* <PieChart width={800} height={300}> */}
//               <PieChart>
//                 <Pie
//                   data={productos_proyecto}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="cantidad"
//                   label={({ cantidad }) => cantidad} // Muestra el nombre del producto
//                 >
//                   {productos_proyecto.map((entry, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={colors[index % colors.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <text
//                   x="50%"
//                   y={10}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Cantidad de Productos Según Proyecto
//                 </text>

//                 <Tooltip
//                   formatter={(value, name, entry) => [`${entry.payload.mes}`]}
//                 />

//                 <Legend
//                   formatter={(value, entry) => {
//                     const { payload } = entry;
//                     return `${payload.cantidad}`; // Solo muestra la cantidad
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ width: "100%", height: 300 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={operador_evento}>
//                 <text
//                   x="50%"
//                   y={15}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Número de Eventos Según Operador
//                 </text>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="mes" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="cantidad" fill="#8884d8" barSize={60} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={producto_indicador}>
//                 <text
//                   x="50%"
//                   y={10}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Número de Productos Según Indicador
//                 </text>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="mes" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="cantidad" fill="#8884d8" barSize={60} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={tecnologia_actividad}>
//                 <text
//                   x="50%"
//                   y={10}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Número de Actividades Según Tecnología
//                 </text>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="mes" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="cantidad" fill="#8884d8" barSize={60} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={entorno_actividad}>
//                 <text
//                   x="50%"
//                   y={10}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Número de Actividades Según Entorno
//                 </text>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="mes" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="cantidad" fill="#8884d8" barSize={60} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={poblacion_actividad}>
//                 <text
//                   x="50%"
//                   y={10}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Número de Actividades Según Población
//                 </text>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="mes" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="cantidad" fill="#8884d8" barSize={60} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={mes_actividad}>
//                 <text
//                   x="50%"
//                   y={10}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Número de Actividades Cada Mes
//                 </text>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="mes" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="cantidad" fill="#8884d8" barSize={60} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div style={{ width: "100%", height: 300, marginTop: "30px" }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={check_soporte}>
//                 <text
//                   x="50%"
//                   y={10}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//                   fontSize={16}
//                   fontWeight="bold"
//                 >
//                   Número de Soportes Según Check
//                 </text>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="mes" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="cantidad" fill="#8884d8" barSize={60} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashbo;

import React, { useRef, useState, useEffect } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import styles from "./Dashboard.module.css";
import { Card, CardContent, Typography } from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { Bar, Pie, Doughnut, PolarArea, Chart, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

const eventos_municipio = [
  { mes: "LA UNION", cantidad: 10 },
  { mes: "BUESACO", cantidad: 20 },
  { mes: "EL TABLON", cantidad: 15 },
  { mes: "BELEN", cantidad: 30 },
  { mes: "SAN BERNARDO", cantidad: 25 },
  { mes: "TANGUA", cantidad: 35 },
  { mes: "YACUANQUER", cantidad: 40 },
];

const productos_proyecto = [
  {
    mes: "Medicamentos-Prestación de servicios de salud con calidad para la paz",
    cantidad: 10,
  },
  {
    mes: "Salud para Población de Especial Protección para la paz",
    cantidad: 20,
  },
  {
    mes: "PAI -Prevención de enfermedades transmisibles para la paz",
    cantidad: 15,
  },
  {
    mes: "Garantía de derechos sexuales y reproductivos para la paz",
    cantidad: 30,
  },
  { mes: "Atención Primaria En Salud", cantidad: 25 },
  { mes: "Emergencias-Salud Ambiental para la Paz", cantidad: 35 },
  { mes: "Nutrición y alimentación saludable para la Paz", cantidad: 40 },
];

const operador_evento = [
  {
    mes: "E.S.E. Hospital San Andrés - Tumaco",
    cantidad: 10,
  },
  {
    mes: "E.S.E. Hospital el Buen Samaritano - La Cruz",
    cantidad: 20,
  },
  {
    mes: "E.S.E. Hospital Departamental de Nariño",
    cantidad: 15,
  },
  {
    mes: "E.S.E. Centro de Salud de Puerres",
    cantidad: 30,
  },
  { mes: "E.S.E. Hospital Clarita Santos - Sandoná", cantidad: 25 },
  { mes: "E.S.E. Centro de Salud de Ancuyá - Nariñoz", cantidad: 35 },
  { mes: "E.S.E. Centro de Salud - Consacá", cantidad: 40 },
];

const producto_indicador = [
  {
    mes: "Menos de 2 indicadores",
    cantidad: 10,
  },
  {
    mes: "Igual a 2 y menor o igual a 3 indicadores",
    cantidad: 20,
  },
  {
    mes: "Mas de tres indicadores",
    cantidad: 30,
  },
];

const tecnologia_actividad = [
  {
    mes: "Redes Familiares",
    cantidad: 10,
  },
  {
    mes: "Zonas de Escucha",
    cantidad: 12,
  },
  {
    mes: "Rehabilitación",
    cantidad: 14,
  },
  {
    mes: "Tamizaje",
    cantidad: 8,
  },
  {
    mes: "Jornadas de Salud",
    cantidad: 7,
  },
  {
    mes: "Vacunación",
    cantidad: 5,
  },
  {
    mes: "Medicamentos",
    cantidad: 4,
  },
];

const entorno_actividad = [
  {
    mes: "Hogar",
    cantidad: 10,
  },
  {
    mes: "Comunitario",
    cantidad: 12,
  },
  {
    mes: "Educativo",
    cantidad: 14,
  },
  {
    mes: "Laboral-Informal",
    cantidad: 14,
  },
  {
    mes: "Insitucional",
    cantidad: 14,
  },
];

const poblacion_actividad = [
  {
    mes: "Familias",
    cantidad: 10,
  },
  {
    mes: "Comunidad",
    cantidad: 12,
  },
  {
    mes: "Personas",
    cantidad: 14,
  },
  {
    mes: "Estudiantes",
    cantidad: 14,
  },
  {
    mes: "Comunidad Educativa",
    cantidad: 14,
  },
  {
    mes: "Trabajadores",
    cantidad: 14,
  },
];

const mes_actividad = [
  { mes: "Enero", cantidad: 10 },
  { mes: "Febrero", cantidad: 12 },
  { mes: "Marzo", cantidad: 14 },
  { mes: "Abril", cantidad: 16 },
  { mes: "Mayo", cantidad: 18 },
  { mes: "Junio", cantidad: 20 },
  { mes: "Julio", cantidad: 22 },
  { mes: "Agosto", cantidad: 24 },
  { mes: "Septiembre", cantidad: 26 },
  { mes: "Octubre", cantidad: 28 },
  { mes: "Noviembre", cantidad: 40 },
  { mes: "Diciembre", cantidad: 32 },
];

const check_soporte = [
  {
    mes: "Aprobado",
    cantidad: 10,
  },
  {
    mes: "No aprobado",
    cantidad: 12,
  },
  {
    mes: "Aprobado Soporte Físico",
    cantidad: 14,
  },
  {
    mes: "No Aprobado Soporte Físico",
    cantidad: 14,
  },
];

const Dashbo = () => {
  const back = import.meta.env.VITE_APP_BACK;
  const url_usuarios = `${back}/api/users/me?pLevel=2`;
  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;

  const [usuario_dos, setUsuario_dos] = useState(null);
  const [super_usuario, setSuper] = useState(null);

  const [activeDataset, setActiveDataset] = useState("eventos");

  const labels_doble =
    activeDataset === "eventos"
      ? eventos_municipio.map((item) => item.mes)
      : tecnologia_actividad.map((item) => item.mes);

  // let super_usuario = false;

  useEffect(() => {
    const fetch_user = async () => {
      try {
        const response = await fetch(`${url_usuarios}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener usuarios.");

        const data = await response.json();
        const datos = {
          usuario: data.custom_roles[0].name,
        };

        if (data.custom_roles.length > 1) {
          setSuper(true);
        }

        console.log("data_usuario", data);
        console.log("datos", datos);
        sessionStorage.setItem("usuario", JSON.stringify(datos));
        setUsuario_dos(datos.usuario);
        console.log("super_user", super_usuario);
        //setSubregions(data.data);
        // setMunicipios(data.data);
      } catch (error) {
        console.error("Error fetching subregions:", error);
      }
    };

    fetch_user();
  }, [token]);

  const barData = {
    labels: eventos_municipio.map((item) => item.mes),
    datasets: [
      {
        label: "Cantidad",
        data: eventos_municipio.map((item) => item.cantidad),
        backgroundColor: "rgba(22, 111, 171, 0.5)",
        barPercentage: 0.7, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
    ],
  };

  const barOptions = {
    responsive: true,
    indexAxis: "y", // <-- Esto hace que el gráfico sea horizontal
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Cantidad de Eventos por Municipio",
      },
    },
  };

  const pieData = {
    labels: productos_proyecto.map((item) => item.mes),
    datasets: [
      {
        data: productos_proyecto.map((item) => item.cantidad),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
        hoverBackgroundColor: [
          "#FF6384CC",
          "#36A2EBCC",
          "#FFCE56CC",
          "#4BC0C0CC",
          "#9966FFCC",
          "#FF9F40CC",
          "#C9CBCFCC",
        ],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        align: "start", // Alinea los elementos del legend a la izquierda
      },
      title: {
        display: true,
        text: "Cantidad de Productos Según Proyecto",
        font: {
          size: 15, // Ajusta el tamaño del texto
          weight: "bold", // Opcional: hace el texto más grueso
        },
        padding: {
          top: 10,
          bottom: 8, // Espacio debajo del título
        },
      },
    },
  };

  const bar_operador_data = {
    labels: operador_evento.map((item) => item.mes),
    datasets: [
      {
        label: "Cantidad",
        data: operador_evento.map((item) => item.cantidad),
        backgroundColor: "rgba(22, 111, 171, 0.5)",
        barPercentage: 0.7, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
    ],
  };

  const bar_operador_options = {
    responsive: true,
    indexAxis: "y", // <-- Esto hace que el gráfico sea horizontal
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Cantidad de Eventos Según Operador",
      },
    },
  };

  const bar_producto_data = {
    labels: producto_indicador.map((item) => item.mes),
    datasets: [
      {
        label: "Cantidad Productos",
        data: producto_indicador.map((item) => item.cantidad),
        backgroundColor: "rgba(22, 111, 171, 0.5)",
        barPercentage: 0.5, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
    ],
  };

  const bar_producto_options = {
    responsive: true,
    // indexAxis: "y", // <-- Esto hace que el gráfico sea horizontal
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Cantidad de Productos por Indicador",
      },
    },
  };

  const doughnut_data = {
    labels: tecnologia_actividad.map((item) => item.mes),
    datasets: [
      {
        data: tecnologia_actividad.map((item) => item.cantidad),
        // backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        // hoverBackgroundColor: ["#FF6384CC", "#36A2EBCC", "#FFCE56CC"],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8DCD55",
        ],
        hoverBackgroundColor: [
          "#FF6384CC",
          "#36A2EBCC",
          "#FFCE56CC",
          "#4BC0C0CC",
          "#9966FFCC",
          "#FF9F40CC",
          "#8DCD55CC",
        ],
      },
    ],
  };

  const doughnut_options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Cantidad de Actividades por Tecnología",
      },
    },
  };

  // const colors_polar = [
  //   "#FF638499",
  //   "#36A2EB99",
  //   "#FFCE5699",
  //   "#4BC0C099",
  //   "#9966FF99",
  // ];

  const colors_polar = [
    "#FF638480",
    "#36A2EB80",
    "#FFCE5680",
    "#4BC0C080",
    "#9966FF80",
  ];

  const polar_data = {
    labels: entorno_actividad.map((item) => item.mes), // Extrae los nombres
    datasets: [
      {
        data: entorno_actividad.map((item) => item.cantidad), // Extrae las cantidades
        backgroundColor: colors_polar,
        // hoverBackgroundColor: colors_polar.map((color) => color + "CC"), // Versión con transparencia
      },
    ],
  };

  const polar_options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Distribución por Entorno de Actividad",
      },
    },
  };

  const labels = poblacion_actividad.map((item) => item.mes);
  const dataValues = poblacion_actividad.map((item) => item.cantidad);

  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#8A2BE2",
  ];

  function createGradient(ctx, area) {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[2]);
    gradient.addColorStop(1, colors[4]);
    return gradient;
  }

  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels,
    datasets: [],
  });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const updatedData = {
      labels,
      datasets: [
        {
          label: "Cantidad por población",
          data: dataValues,
          borderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: "white",
          tension: 0.4,
          borderColor: createGradient(chart.ctx, chart.chartArea),
        },
      ],
    };

    setChartData(updatedData);
  }, []);

  const data_mes = {
    labels: mes_actividad.map((item) => item.mes),
    datasets: [
      {
        label: "Actividad por Mes",
        data: mes_actividad.map((item) => item.cantidad),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options_mes = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cantidad de Actividades por Mes",
      },
    },
  };

  const doughnut_data_soporte = {
    labels: check_soporte.map((item) => item.mes),
    datasets: [
      {
        data: check_soporte.map((item) => item.cantidad),
        // backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        // hoverBackgroundColor: ["#FF6384CC", "#36A2EBCC", "#FFCE56CC"],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8DCD55",
        ],
        hoverBackgroundColor: [
          "#FF6384CC",
          "#36A2EBCC",
          "#FFCE56CC",
          "#4BC0C0CC",
          "#9966FFCC",
          "#FF9F40CC",
          "#8DCD55CC",
        ],
      },
    ],
  };

  const doughnut_options_soporte = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Cantidad de Soportes Según Check",
      },
    },
  };

  const data_doble_barra = {
    // labels: eventos_municipio.map((item) => item.mes),
    labels: labels_doble,
    datasets: [
      {
        label: "Cantidad de Eventos",
        data: eventos_municipio.map((item) => item.cantidad),
        backgroundColor: "rgba(40, 20, 153, 0.5)",
        hidden: activeDataset !== "eventos", // Oculta si no está activo
        barPercentage: 0.9, // Controla el ancho relativo de cada barra (1 = ancho completo, 0.1 = muy delgado)
        categoryPercentage: 0.8, // Controla el espacio entre barras (1 = juntas, 0.1 = mucho espacio)
      },
      {
        label: "Cantidad de Actividades",
        data: tecnologia_actividad.map((item) => item.cantidad),
        backgroundColor: "rgba(20, 140, 130, 0.5)",
        hidden: activeDataset !== "tecnologia", // Oculta si no está activo
      },
    ],
  };

  const doble_barra_options = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      // legend: {
      //   position: "top",
      // },
      legend: {
        position: "top",
        onClick: (e, legendItem, legend) => {
          // Obtiene el dataset index
          const datasetIndex = legendItem.datasetIndex;
          // Cambia el estado activo
          setActiveDataset(datasetIndex === 0 ? "eventos" : "tecnologia");
        },
      },
      title: {
        display: true,
        text:
          activeDataset === "eventos"
            ? "Cantidad de Eventos por Municipio"
            : "Cantidad de en Actividades Según Tecnologías ",
      },
    },
  };

  const usuario_object = JSON.parse(sessionStorage.getItem("usuario")) || {};

  const usuario = usuario_object.usuario;

  console.log("usuario_rol", usuario);

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className={styles.main}>
        <Sidebar usuario_dos={usuario_dos} super_usuario={super_usuario} />
        {/* <div className={styles.content}> */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)", // 3 columnas
            gap: "10px",
            justifyContent: "center",
            width: "100%",
            background: "#ecf0f1",
          }}
        >
          <div style={{ width: "600px" }}>
            <Card sx={{ minWidth: 200, textAlign: "center", p: 2 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  {"Total de Municipios con Eventos"}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {20}
                </Typography>
              </CardContent>
            </Card>
          </div>
          <div style={{ width: "600px" }}>
            <Card sx={{ minWidth: 200, textAlign: "center", p: 2 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  {"Total Municipios"}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {60}
                </Typography>
              </CardContent>
            </Card>
          </div>

          <div style={{ width: "600px" }}>
            <Bar data={data_doble_barra} options={doble_barra_options} />
          </div>
          <div style={{ width: "600px" }}>
            <Bar data={barData} options={barOptions} />
          </div>

          <div style={{ width: "450px", marginLeft: "20px" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>

          <div style={{ width: "600px" }}>
            <Bar data={bar_operador_data} options={bar_operador_options} />
          </div>

          <div style={{ width: "600px" }}>
            <Bar data={bar_producto_data} options={bar_producto_options} />
          </div>

          <div style={{ width: "450px", marginLeft: "20px" }}>
            <Doughnut data={doughnut_data} options={doughnut_options} />
          </div>

          <div style={{ width: "450px", marginLeft: "20px" }}>
            <PolarArea data={polar_data} options={polar_options} />
          </div>

          <div style={{ width: "450px", marginLeft: "20px" }}>
            <Chart ref={chartRef} type="line" data={chartData} />
          </div>
          <div style={{ width: "450px", marginLeft: "20px" }}>
            <Line data={data_mes} options={options_mes} />
          </div>
          <div style={{ width: "450px", marginLeft: "20px" }}>
            <Doughnut
              data={doughnut_data_soporte}
              options={doughnut_options_soporte}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashbo;
