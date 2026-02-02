//
import React, { useState, useEffect } from "react";
import styles from "./Spinner.module.css";

const Spinner = ({ envio = "Enviando..." }) => {
  const [dots, setDots] = useState("");
  const [visible, setVisible] = useState(true);
  const [displayText, setDisplayText] = useState(envio);

  // Cuando cambia envio, hacer fade out → cambiar texto → fade in
  useEffect(() => {
    setVisible(false);
    const timeout = setTimeout(() => {
      setDisplayText(envio);
      setVisible(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [envio]);

  // Resetear dots cada vez que cambie envio
  useEffect(() => {
    setDots("");
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [envio]);

  return (
    <div className={styles.spinnerContainer}>
      {/* Fondo decorativo */}
      <div className={styles.bgOrb1}></div>
      <div className={styles.bgOrb2}></div>

      {/* Spinner visual */}
      <div className={styles.spinnerWrapper}>
        <div className={styles.ring1}></div>
        <div className={styles.ring2}></div>
        <div className={styles.ring3}></div>
        <div className={styles.centerDot}></div>
      </div>

      {/* Texto con fade */}
      <p
        className={`${styles.text} ${visible ? styles.textVisible : styles.textHidden}`}
      >
        {displayText}
        <span className={styles.dots}>{dots}</span>
      </p>
    </div>
  );
};

export default Spinner;
