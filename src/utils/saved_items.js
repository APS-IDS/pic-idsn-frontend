// Lo que ya está guardado en el anexo (tiene uuid) solo lo puede eliminar un
// superusuario; lo agregado en esta edición se puede quitar libremente. Un
// evento o producto guardado antes de tener uuid se reconoce por lo que
// contiene.

export const isSavedSoporte = (soporte) => Boolean(soporte?.uuid);

export const isSavedActivity = (activity) =>
  Boolean(activity?.uuid) || (activity?.array_soportes ?? []).some(isSavedSoporte);

export const isSavedProduct = (product, activities = []) =>
  Boolean(product?.uuid) || (activities ?? []).some(isSavedActivity);

export const isSavedEvent = (event) =>
  Boolean(event?.uuid) ||
  (event?.product_data?.producto ?? []).some((product, index) =>
    isSavedProduct(product, event.activities?.[index]),
  );
