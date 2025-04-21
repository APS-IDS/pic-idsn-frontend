import React, { useState, useEffect } from "react";
import styles from "./Product.module.css";
import ActivityList from "../Activities/ActivityList";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

const Product = ({
  product_data,
  setProductData,
  activities,
  setActivities,
  entornos,
  tecnologias,
  poblaciones,
  soportes,
  cups,
}) => {
  const [isIndicatorOpen, setIsIndicatorOpen] = useState({}); // Estado para gestionar los acordeones

  const toggleIndicator = (productIndex, indicatorIndex) => {
    console.log("productIndex", productIndex);

    setIsIndicatorOpen((prevState) => ({
      ...prevState,
      [`${productIndex}-${indicatorIndex}`]:
        !prevState[`${productIndex}-${indicatorIndex}`],
    }));
  };

  const [isProductOpen, setIsProductOpen] = useState({}); // Estado para acordeones de productos

  const toggleProduct = (productIndex) => {
    setIsProductOpen((prevState) => ({
      ...prevState,
      [productIndex]: !prevState[productIndex],
    }));
  };

  const handleInputChange = (productIndex, field, value) => {
    const updatedProducts = [...product_data.producto];
    updatedProducts[productIndex][field] = value;
    setProductData({ ...product_data, producto: updatedProducts });
  };

  const handleAddIndicator = (productIndex) => {
    const newIndicator = {
      cantidad: "",
      meta_producto: "",
      indicador_linea_base: "",
    };
    const updatedProducts = [...product_data.producto];
    updatedProducts[productIndex].indicadores = [
      ...(updatedProducts[productIndex].indicadores || []),
      newIndicator,
    ];
    setProductData({ ...product_data, producto: updatedProducts });
  };

  const handleUpdateIndicator = (
    productIndex,
    indicatorIndex,
    field,
    value
  ) => {
    const updatedProducts = [...product_data.producto];
    const indicators = updatedProducts[productIndex].indicadores || [];
    indicators[indicatorIndex][field] = value;
    updatedProducts[productIndex].indicadores = indicators;
    setProductData({ ...product_data, producto: updatedProducts });
  };

  const handleRemoveIndicator = (productIndex, indicatorIndex) => {
    const updatedProducts = [...product_data.producto];
    const indicators = updatedProducts[productIndex].indicadores || [];
    indicators.splice(indicatorIndex, 1);
    updatedProducts[productIndex].indicadores = indicators;
    setProductData({ ...product_data, producto: updatedProducts });
  };

  const handleAddProduct = () => {
    const newProduct = {
      descripcion_producto: "",
      indicadores: [
        {
          cantidad: "",
          meta_producto: "",
          indicador_linea_base: "",
        },
      ],
      // nombre_entidad: "",
      // descripcion_operador: "",
    };
    const updatedProducts = [...(product_data.producto || []), newProduct];
    setProductData({ ...product_data, producto: updatedProducts });
    const updatedActivities = [...activities, []];
    setActivities(updatedActivities);
  };

  const handleRemoveProduct = (productIndex) => {
    const updatedProducts = product_data.producto.filter(
      (_, index) => index !== productIndex
    );
    setProductData({ ...product_data, producto: updatedProducts });
  };

  const handle_remove_indicador = (productIndex, indicatorIndex) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el indicador",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveIndicator(productIndex, indicatorIndex);
        Swal.fire("Eliminado", "El indicador ha sido eliminado.", "success");
      }
    });
  };

  const handle_remove_producto = (index) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveProduct(index);
        Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
      }
    });
  };

  return (
    <div className={styles.productContainer}>
      {(product_data.producto || []).map((product, productIndex) => (
        <div key={productIndex} className={styles.product}>
          <div className={styles.contenedor_title_product}>
            <div className={styles.titleAndIcon}>
              <h4>Producto {productIndex + 1}</h4>
              <FaEye
                className={styles.eye}
                onClick={() => toggleProduct(productIndex)}
              />
            </div>
            <div className={styles.buttons}>
              {productIndex > 0 && (
                <button
                  type="button"
                  onClick={() => handle_remove_producto(productIndex)}
                  className={styles.removeButton_añadir}
                >
                  -
                </button>
              )}
              <button
                type="button"
                onClick={handleAddProduct}
                className={styles.buttonMain_añadir}
              >
                +
              </button>
            </div>
          </div>
          {/* Contenido del acordeón */}
          {isProductOpen[productIndex] && (
            <div className={styles.productContent}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Descripción del Producto</th>
                    <th>Indicadores</th>
                    <th>Actividades</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className={styles.cellWrapper}>
                        <textarea
                          className={styles.textarea}
                          type="text"
                          placeholder="Máximo numero de caracteres 600"
                          maxLength={600}
                          value={product.descripcion_producto || ""}
                          onChange={(e) =>
                            handleInputChange(
                              productIndex,
                              "descripcion_producto",
                              e.target.value
                            )
                          }
                        />
                        <p>
                          {product.descripcion_producto?.length || 0} / 600
                          caracteres
                        </p>
                      </div>
                    </td>
                    <td>
                      {(product.indicadores || []).map(
                        (indicator, indicatorIndex) => (
                          <div
                            key={indicatorIndex}
                            className={styles.indicator}
                          >
                            <div className={styles.indicatorHeader}>
                              <strong
                                onClick={() =>
                                  toggleIndicator(productIndex, indicatorIndex)
                                }
                                className={styles.accordeonTitle}
                              >
                                Indicador {indicatorIndex + 1}
                              </strong>
                              {indicatorIndex > 0 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    // handleRemoveIndicator(
                                    //   productIndex,
                                    //   indicatorIndex
                                    // )
                                    handle_remove_indicador(
                                      productIndex,
                                      indicatorIndex
                                    )
                                  }
                                  className={styles.removeButton_añadir}
                                >
                                  -
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleAddIndicator(productIndex)}
                                className={styles.buttonMain_añadir}
                              >
                                +
                              </button>
                            </div>
                            {isIndicatorOpen[
                              `${productIndex}-${indicatorIndex}`
                            ] && (
                              <div className={styles.indicatorContent}>
                                <label>Indicador de Producto</label>
                                <input
                                  type="text"
                                  value={indicator.meta_producto}
                                  onChange={(e) =>
                                    handleUpdateIndicator(
                                      productIndex,
                                      indicatorIndex,
                                      "meta_producto",
                                      e.target.value
                                    )
                                  }
                                />
                                <label>Cantidad</label>
                                <input
                                  type="number"
                                  value={indicator.cantidad}
                                  min="0"
                                  onChange={(e) =>
                                    handleUpdateIndicator(
                                      productIndex,
                                      indicatorIndex,
                                      "cantidad",
                                      e.target.value
                                    )
                                  }
                                />
                                <label>Indicador Línea Base</label>
                                <input
                                  type="text"
                                  value={indicator.indicador_linea_base}
                                  onChange={(e) =>
                                    handleUpdateIndicator(
                                      productIndex,
                                      indicatorIndex,
                                      "indicador_linea_base",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </td>

                    <td>
                      <ActivityList
                        entornos={entornos}
                        tecnologias={tecnologias}
                        poblaciones={poblaciones}
                        soportes={soportes}
                        cups={cups}
                        activities={activities[productIndex] || []}
                        setActivities={(updatedActivities) => {
                          const newActivities = [...activities];
                          newActivities[productIndex] = updatedActivities;
                          setActivities(newActivities);
                        }}
                      />
                    </td>
                    <td>
                      {productIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => handle_remove_producto(productIndex)}
                          className={styles.removeButton_añadir}
                        >
                          -
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
      {/* 
      <button
        type="button"
        onClick={handleAddProduct}
        className={styles.buttonMain}
      >
        Agregar Producto
      </button> */}
    </div>
  );
};

export default Product;
