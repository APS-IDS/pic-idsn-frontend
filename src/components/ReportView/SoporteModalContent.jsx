import React, { useState, useRef, useCallback } from "react";
import styles from "./SoporteModal.module.css";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILE_SIZE_MB = 10;

/* ── Sub-component: a single existing evidencia ── */
const ExistingEvidencia = ({ evidencia, index, onDelete }) => (
  <div className={styles.evidenciaCard}>
    <div className={styles.evidenciaInfo}>
      <p>
        <strong>Soporte {index + 1}:</strong>
      </p>
      <p>
        <strong>Archivo:</strong> {evidencia.file_name}
      </p>
      <p>
        <strong>Región:</strong> {evidencia.municipio?.label}
      </p>
    </div>
    <div>
      <button
        type="button"
        className={styles.btnDelete}
        onClick={() => onDelete(evidencia.documentId)}
      >
        <i className="fa-solid fa-trash" />
      </button>
    </div>
  </div>
);

/* ── Sub-component: a single new evidencia form ── */
const NewEvidencia = ({ id, municipios, onRemove, onUpdate, onValidationError, onClearValidation }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No hay archivos adjuntos");
  const [tipo, setTipo] = useState("file");

  const handleTipoChange = (e) => {
    const newTipo = e.target.value;
    setTipo(newTipo);
    // Reset fields when switching type
    if (newTipo === "link") {
      setFileName("No hay archivos adjuntos");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onUpdate(id, { tipo: "link", archivo: null, file_name: "", evidencia_link: "" });
    } else {
      onUpdate(id, { tipo: "file", file_name: null, evidencia_link: null, archivo: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > MAX_FILE_SIZE_BYTES) {
      e.target.value = "";
      setFileName("No hay archivos adjuntos");
      onValidationError(`El archivo excede ${MAX_FILE_SIZE_MB} MB.`);
      onUpdate(id, { archivo: null });
      return;
    }
    setFileName(file?.name || "No hay archivos adjuntos");
    onUpdate(id, { archivo: file || null });
    onClearValidation();
  };

  const handleRegionChange = (e) => {
    onUpdate(id, { region: e.target.value });
  };

  return (
    <div className={styles.newEvidenciaCard}>
      <div className={styles.newEvidenciaInfo}>
        <label className={styles.label}>Tipo de evidencia:</label>
        <select
          className={`swal2-select ${styles.regionSelect}`}
          value={tipo}
          onChange={handleTipoChange}
        >
          <option value="file">Archivo</option>
          <option value="link">Enlace</option>
        </select>

        <label className={styles.label}>Seleccionar Región:</label>
        <select
          className={`swal2-select ${styles.regionSelect}`}
          defaultValue=""
          onChange={handleRegionChange}
        >
          <option value="">Selecciona una región</option>
          {municipios.map((muni) => (
            <option key={muni.documentId} value={muni.documentId}>
              {muni.label}
            </option>
          ))}
        </select>

        {tipo === "file" ? (
          <>
            <label className={styles.label}>Archivo Soporte:</label>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className={styles.btnAttach}
              onClick={() => fileInputRef.current?.click()}
            >
              Adjuntar documento
            </button>
            <span className={styles.fileTag}>{fileName}</span>
          </>
        ) : (
          <>
            <label className={styles.label}>Nombre del archivo:</label>
            <input
              type="text"
              className={styles.textInput}
              placeholder="Ej: Mi documento"
              onChange={(e) => onUpdate(id, { file_name: e.target.value })}
            />
            <label className={styles.label}>Enlace de la evidencia:</label>
            <input
              type="url"
              className={styles.textInput}
              placeholder="https://ejemplo.com/recurso"
              onChange={(e) => onUpdate(id, { evidencia_link: e.target.value })}
            />
          </>
        )}
      </div>

      <div className={styles.deleteCol}>
        <button
          type="button"
          className={styles.btnDeleteNew}
          onClick={() => onRemove(id)}
        >
          <i className="fa-solid fa-trash" />
        </button>
      </div>
    </div>
  );
};

/* ── Main modal content component ── */
const SoporteModalContent = ({
  municipios,
  hasExistingData,
  existingEvidencias,
  onDeleteExisting,
  evidenciasRef,
  onValidationError,
  onClearValidation,
}) => {
  const [nuevas, setNuevas] = useState([]);
  const dataMap = useRef(new Map());
  let counter = useRef(0);

  const addEvidencia = useCallback(() => {
    const id = `evidencia-${Date.now()}-${counter.current++}`;
    dataMap.current.set(id, { tipo: "file", region: "", archivo: null, file_name: null, evidencia_link: null });
    setNuevas((prev) => [...prev, id]);
  }, []);

  const removeEvidencia = useCallback((id) => {
    dataMap.current.delete(id);
    setNuevas((prev) => prev.filter((eid) => eid !== id));
  }, []);

  const updateEvidencia = useCallback((id, partial) => {
    const current = dataMap.current.get(id) || { region: "", archivo: null };
    dataMap.current.set(id, { ...current, ...partial });
  }, []);

  // Expose data to the parent (preConfirm) via ref
  evidenciasRef.current = {
    getData: () =>
      nuevas.map((id) => dataMap.current.get(id) || { tipo: "file", region: "", archivo: null, file_name: null, evidencia_link: null }),
    count: () => nuevas.length,
  };

  return (
    <div>
      {hasExistingData &&
        existingEvidencias.map((ev, i) => (
          <ExistingEvidencia
            key={ev.documentId}
            evidencia={ev}
            index={i}
            onDelete={onDeleteExisting}
          />
        ))}

      <button
        type="button"
        className={`swal2-confirm ${styles.btnAdd}`}
        onClick={addEvidencia}
      >
        Agregar Nuevo Soporte
      </button>

      <div style={{ marginTop: 10 }}>
        {nuevas.map((id) => (
          <NewEvidencia
            key={id}
            id={id}
            municipios={municipios}
            onRemove={removeEvidencia}
            onUpdate={updateEvidencia}
            onValidationError={onValidationError}
            onClearValidation={onClearValidation}
          />
        ))}
      </div>
    </div>
  );
};

export default SoporteModalContent;
