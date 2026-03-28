const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_SIZE_MB = 10;

const buildExistingEvidenciasHTML = (evidencias) =>
  evidencias
    .map(
      (evidencia, index) => `
      <div id="evidencia-existente-${escapeHtml(evidencia.documentId)}" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc;
      border-radius: 5px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
        <div style="flex: 1; min-width: 200px;">
          <p><strong>Soporte ${index + 1}:</strong></p>
          <p><strong>Archivo:</strong> ${escapeHtml(evidencia.file_name)}</p>
          <p><strong>Región:</strong> ${escapeHtml(evidencia.municipio?.label)}</p>
        </div>
        <div>
          <button type="button" class="swal2-confirm btn-delete" data-evidencia-id="${escapeHtml(evidencia.documentId)}"
            style="background-color: red; color: white; padding: 5px 10px; border: none; border-radius:5px; cursor: pointer;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `,
    )
    .join("");

const buildNewEvidenciaHTML = (evidenciaId, municipiosOptions) => `
  <div id="${evidenciaId}" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ccc;
    border-radius: 5px; display: flex; justify-content: space-between; align-items: center; gap: 10px; width: 100%;">

    <div style="flex: 1; min-width: 200px;">
      <label for="region-${evidenciaId}" style="margin-top: 10px; margin-left:40px">Seleccionar Región:</label>
      <select id="region-${evidenciaId}" class="swal2-select" style="width: 100%; margin-top: 5px;">
        <option value="">Selecciona una región</option>
        ${municipiosOptions}
      </select>

      <label for="archivo-${evidenciaId}" style="margin-top: 10px; margin-left:40px;">Archivo Soporte:</label>
      <input type="file" hidden id="archivo-${evidenciaId}" class="swal2-file">
      <button type="button" id="botonpersonal-${evidenciaId}" style="margin-left:40px; background-color:rgb(84, 138, 196); color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">
        Adjuntar documento
      </button>
      <span id="tagsmall-${evidenciaId}"
        style="margin-left:40px; display: block; margin-top:20px;
        padding: 5px 10px; border: 1px solid #ccc; border-radius: 5px;
        color: #333; font-size: 18px;">
        No hay archivos adjuntos
      </span>
    </div>

    <div style="display: flex; align-items: center; justify-content: flex-end; min-width: 80px;">
      <button type="button" class="swal2-confirm btn-delete-evidencia" data-id="${evidenciaId}"
        style="background-color: red; color: white; padding: 10px; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 5px;">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>

  </div>
`;

export const openSoporteModal = async ({
  Swal,
  municipios,
  hasExistingData,
  existingEvidencias,
  onDeleteExisting,
}) => {
  let nuevasEvidencias = [];
  let evidenciaCounter = 0;

  const municipiosOptions = municipios
    .map(
      (muni) =>
        `<option value="${escapeHtml(muni.documentId)}">${escapeHtml(muni.label)}</option>`,
    )
    .join("");

  let evidenciasHTML = hasExistingData
    ? buildExistingEvidenciasHTML(existingEvidencias)
    : "";

  evidenciasHTML += `
    <button id="add-evidencia" type="button" class="swal2-confirm" style="background-color: green; color: white; margin-top: 10px; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;">
      Agregar Nuevo Soporte
    </button>
    <div id="extra-evidencias" style="margin-top: 10px;"></div>
  `;

  const result = await Swal.fire({
    title: hasExistingData ? "Soportes Actuales" : "Ingrese la Información",
    html: evidenciasHTML,
    showCancelButton: true,
    confirmButtonText: "Enviar",
    cancelButtonText: "Cancelar",
    didOpen: () => {
      const popup = Swal.getPopup();
      if (!popup) return;

      const extraEvidenciasDiv = popup.querySelector("#extra-evidencias");

      popup.addEventListener("click", async (event) => {
        const addButton = event.target.closest("#add-evidencia");
        if (addButton && extraEvidenciasDiv) {
          const evidenciaId = `evidencia-${Date.now()}-${evidenciaCounter++}`;
          extraEvidenciasDiv.insertAdjacentHTML(
            "beforeend",
            buildNewEvidenciaHTML(evidenciaId, municipiosOptions),
          );
          nuevasEvidencias.push(evidenciaId);
          return;
        }

        const deleteExistingButton = event.target.closest(".btn-delete");
        if (deleteExistingButton) {
          const evidenciaId = deleteExistingButton.getAttribute(
            "data-evidencia-id",
          );
          if (!evidenciaId) return;
          await onDeleteExisting(evidenciaId);
          return;
        }

        const fileTriggerButton = event.target.closest("[id^=botonpersonal-]");
        if (fileTriggerButton) {
          const evidenciaId = fileTriggerButton.id.replace("botonpersonal-", "");
          popup.querySelector(`#archivo-${evidenciaId}`)?.click();
          return;
        }

        const deleteNewButton = event.target.closest(".btn-delete-evidencia");
        if (deleteNewButton) {
          const id = deleteNewButton.getAttribute("data-id");
          if (!id) return;
          popup.querySelector(`#${id}`)?.remove();
          nuevasEvidencias = nuevasEvidencias.filter((e) => e !== id);
        }
      });

      popup.addEventListener("change", (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement)) return;
        if (!input.id.startsWith("archivo-")) return;

        const evidenciaId = input.id.replace("archivo-", "");
        const selectedFile = input.files?.[0];

        if (selectedFile && selectedFile.size > MAX_FILE_SIZE_BYTES) {
          input.value = "";
          const label = popup.querySelector(`#tagsmall-${evidenciaId}`);
          if (label) {
            label.textContent = "No hay archivos adjuntos";
          }
          Swal.showValidationMessage(
            `El archivo excede ${MAX_FILE_SIZE_MB} MB.`,
          );
          return;
        }

        const fileName = selectedFile?.name || "No hay archivos adjuntos";

        const label = popup.querySelector(`#tagsmall-${evidenciaId}`);
        if (label) {
          label.textContent = fileName;
        }

        // Remove stale validation message once the user picks a valid file.
        Swal.resetValidationMessage();
      });
    },
    preConfirm: async () => {
      if (nuevasEvidencias.length === 0) {
        Swal.showValidationMessage("Debes agregar al menos una evidencia.");
        return false;
      }

      const popup = Swal.getPopup();
      if (!popup) return false;

      const evidencias = nuevasEvidencias.map((id) => {
        const regionSelect = popup.querySelector(`#region-${id}`);
        const fileInput = popup.querySelector(`#archivo-${id}`);

        return {
          region: regionSelect?.value || "",
          archivo: fileInput?.files?.[0],
        };
      });

      const invalidFile = evidencias.find(
        (evidencia) => evidencia.archivo && evidencia.archivo.size > MAX_FILE_SIZE_BYTES,
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
