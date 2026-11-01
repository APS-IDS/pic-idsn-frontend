export const SIN_DATO = "Sin información";

// Claves que Strapi agrega a los componentes y que no son meses del cronograma
const CLAVES_NO_MES = ["id", "documentId", "__component"];

export const formatMoney = (valor) =>
  valor || valor === 0
    ? `$ ${new Intl.NumberFormat("es-ES").format(valor)}`
    : SIN_DATO;

// [{ enero: 100, febrero: 0 }] -> "enero · 100%"
export const formatCronograma = (cronograma) => {
  const tramos = (cronograma ?? []).flatMap((tramo) =>
    Object.entries(tramo)
      .filter(([mes, porcentaje]) => !CLAVES_NO_MES.includes(mes) && Number(porcentaje) > 0)
      .map(([mes, porcentaje]) => `${mes} · ${porcentaje}%`),
  );

  return tramos.length > 0 ? tramos.join(" | ") : SIN_DATO;
};

export const listarNombres = (items) =>
  items?.length > 0 ? items.map((item) => item.nombre).join(", ") : SIN_DATO;
