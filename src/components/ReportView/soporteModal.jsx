import React, { createRef } from "react";
import withReactContent from "sweetalert2-react-content";
import SoporteModalContent from "./SoporteModalContent";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_SIZE_MB = 10;

export const openSoporteModal = async ({
  Swal,
  municipios,
  hasExistingData,
  existingEvidencias,
  onDeleteExisting,
}) => {
  const ReactSwal = withReactContent(Swal);
  const evidenciasRef = createRef();
  evidenciasRef.current = { getData: () => [], count: () => 0 };

  const result = await ReactSwal.fire({
    title: hasExistingData ? "Soportes Actuales" : "Ingrese la Información",
    html: (
      <SoporteModalContent
        municipios={municipios}
        hasExistingData={hasExistingData}
        existingEvidencias={existingEvidencias}
        onDeleteExisting={onDeleteExisting}
        evidenciasRef={evidenciasRef}
        onValidationError={(msg) => Swal.showValidationMessage(msg)}
        onClearValidation={() => Swal.resetValidationMessage()}
      />
    ),
    showCancelButton: true,
    confirmButtonText: "Enviar",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      if (evidenciasRef.current.count() === 0) {
        Swal.showValidationMessage("Debes agregar al menos una evidencia.");
        return false;
      }

      const evidencias = evidenciasRef.current.getData();

      const invalidFile = evidencias.find(
        (ev) => ev.archivo && ev.archivo.size > MAX_FILE_SIZE_BYTES,
      );

      if (invalidFile) {
        Swal.showValidationMessage(
          `Uno de los archivos excede ${MAX_FILE_SIZE_MB} MB.`,
        );
        return false;
      }

      return evidencias;
    },
  });

  return result;
};
