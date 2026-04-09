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

      for (const ev of evidencias) {
        if (!ev.region) {
          Swal.showValidationMessage("Todos los soportes deben tener una región seleccionada.");
          return false;
        }

        if (ev.tipo === "link") {
          if (!ev.file_name?.trim()) {
            Swal.showValidationMessage("El nombre del archivo es obligatorio para soportes tipo enlace.");
            return false;
          }
          if (!ev.evidencia_link?.trim()) {
            Swal.showValidationMessage("El enlace de la evidencia es obligatorio.");
            return false;
          }
          try {
            new URL(ev.evidencia_link.trim());
          } catch {
            Swal.showValidationMessage("El enlace proporcionado no es una URL válida.");
            return false;
          }
        } else {
          if (!ev.archivo) {
            Swal.showValidationMessage("Todos los soportes tipo archivo deben tener un archivo adjunto.");
            return false;
          }
          if (ev.archivo.size > MAX_FILE_SIZE_BYTES) {
            Swal.showValidationMessage(
              `Uno de los archivos excede ${MAX_FILE_SIZE_MB} MB.`,
            );
            return false;
          }
        }
      }

      return evidencias;
    },
  });

  return result;
};
