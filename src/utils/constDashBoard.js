const extractLabelsAndValues = (result, labelsField, valuesField) => {
  if (!result) return { labels: [], values: [] };

  // Objeto de tipo Key-Value { Enero: 10, Febrero: 15 }
  if (!Array.isArray(result) && typeof result === "object") {
    return {
      labels: Object.keys(result),
      values: Object.values(result),
    };
  }

  //Array de objetos ([{ mes: 'Enero', cantidad: 10 }, ...])
  if (Array.isArray(result)) {
    return {
      labels: result.map((item) =>
        labelsField ? item[labelsField] : item.mes || item.nombre_mes,
      ),
      values: result.map((item) =>
        valuesField
          ? item[valuesField]
          : item.eventos || item.cantidad || item.total,
      ),
    };
  }

  return { labels: [], values: [] };
};

export const mapToChartData = (data, config = {}) => {
  const {
    labelsField,
    valuesField,
    color = "#0D9488",
    type = "bar",
    datasetLabel = "Cantidad",
    datasetsConfig = [],
  } = config;

  if (!data?.result) {
    return { labels: [], datasets: [] };
  }

  const isLine = type === "line";

  if (datasetsConfig.length > 0) {
    const labels = data.result.map((item) => item[labelsField] ?? "");

    const datasets = datasetsConfig.map((ds) => {
      const dsColor = ds.color || color;
      const values = data.result.map(
        (item) => Number(item[ds.valuesField]) || 0,
      );

      return {
        label: ds.datasetLabel || datasetLabel,
        data: values,
        backgroundColor: isLine ? `${dsColor}22` : dsColor,
        borderColor: isLine ? dsColor : undefined,
        fill: isLine ? (ds.fill ?? false) : false,
        tension: 0,
        borderRadius: type === "bar" ? 4 : undefined,
        barThickness: type === "bar" ? 10 : undefined,
        pointBackgroundColor: isLine ? dsColor : undefined,
        pointBorderColor: isLine ? "#ffffff" : undefined,
        pointBorderWidth: isLine ? 2 : undefined,
        pointRadius: isLine ? 5 : undefined,
        pointHoverRadius: isLine ? 7 : undefined,
      };
    });

    return { labels, datasets };
  }

  const { labels, values } = extractLabelsAndValues(
    data.result,
    labelsField,
    valuesField,
  );

  const singleDataset = {
    label: datasetLabel,
    data: values,
    backgroundColor: isLine ? `${color}22` : color,
    borderColor: isLine ? color : undefined,
    fill: isLine,
    tension: 0,
    borderRadius: type === "bar" ? 4 : undefined,
    barThickness: type === "bar" ? 10 : undefined,
    pointBackgroundColor: isLine ? color : undefined,
    pointBorderColor: isLine ? "#ffffff" : undefined,
    pointBorderWidth: isLine ? 2 : undefined,
    pointRadius: isLine ? 5 : undefined,
    pointHoverRadius: isLine ? 7 : undefined,
  };

  return {
    labels,
    datasets: [singleDataset],
  };
};

export const filtersDashboard = (options, filterState) => {
  return [
    {
      key: "project",
      label: "Proyecto",
      text: "Todos los proyectos",
      optionsList: options.proyectos,
      value: filterState.project,
    },
    {
      key: "municipality",
      label: "Municipio",
      text: "Todos los municipios",
      optionsList: options.municipios,
      value: filterState.municipality,
    },
    {
      key: "anio",
      label: "Año",
      text: "Todos los años",
      optionsList: options.anios,
      value: filterState.anio,
    },

    {
      key: "operator",
      label: "Operador",
      text: "Todos los operadores",
      optionsList: options.operadores,
      value: filterState.operator,
    },
    {
      key: "estado",
      label: "Estado",
      text: "Todos los estados",
      optionsList: options.estados,
      value: filterState.estado,
    },
  ];
};

export const FILTERS = {
  municipios: [],
  operadores: [],
  proyectos: [],
  anios: [],
  estados: [],
};
