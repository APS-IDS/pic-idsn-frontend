import React, { useState } from "react";
import ActivityList from "../Activities/ActivityList";
import Swal from "sweetalert2";
import { NEW_INDICATOR, NEW_PRODUCT, NEW_ANEXO_DATE } from "../../utils/const_forms";
import { isSavedProduct } from "../../utils/saved_items";

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
  cursos_vida,
  anexoYear,
  isSuperUser,
}) => {
  const [isProductOpen, setIsProductOpen] = useState({});
  const toggleProduct = (productIndex) => {
    setIsProductOpen((prevState) => ({
      ...prevState,
      [productIndex]: !prevState[productIndex],
    }));
  };

  const handleInputChange = (productIndex, field, value) => {
    const updatedProducts = (
      product_data.producto || []
    ).map((product, index) => {
      if (index !== productIndex) {
        return product;
      }

      return {
        ...product,
        [field]: value,
      };
    });

    setProductData({
      ...product_data,
      producto: updatedProducts,
    });
  };

  const handleAddIndicator = (productIndex) => {
    // Crear indicador independiente
    const newIndicator = structuredClone(NEW_INDICATOR);

    const updatedProducts = (
      product_data.producto || []
    ).map((product, index) => {
      if (index !== productIndex) {
        return product;
      }

      return {
        ...product,
        indicadores: [
          ...(product.indicadores || []),
          newIndicator,
        ],
      };
    });

    setProductData({
      ...product_data,
      producto: updatedProducts,
    });
  };

  const handleUpdateIndicator = (
    productIndex,
    indicatorIndex,
    field,
    value,
  ) => {
    const updatedProducts = (
      product_data.producto || []
    ).map((product, pIndex) => {
      if (pIndex !== productIndex) {
        return product;
      }

      const updatedIndicators = (
        product.indicadores || []
      ).map((indicator, iIndex) => {
        if (iIndex !== indicatorIndex) {
          return indicator;
        }

        return {
          ...indicator,
          [field]: value,
        };
      });

      return {
        ...product,
        indicadores: updatedIndicators,
      };
    });

    setProductData({
      ...product_data,
      producto: updatedProducts,
    });
  };

  const handleRemoveIndicator = (
    productIndex,
    indicatorIndex
  ) => {
    const updatedProducts = (
      product_data.producto || []
    ).map((product, pIndex) => {
      if (pIndex !== productIndex) {
        return product;
      }

      return {
        ...product,
        indicadores: (
          product.indicadores || []
        ).filter(
          (_, iIndex) => iIndex !== indicatorIndex
        ),
      };
    });

    setProductData({
      ...product_data,
      producto: updatedProducts,
    });
  };

  const handleAddProduct = () => {
    // Crear una copia profunda para no compartir NEW_PRODUCT
    const newProduct = structuredClone(NEW_PRODUCT);

    const updatedProducts = [
      ...(product_data.producto || []),
      newProduct,
    ];

    setProductData({
      ...product_data,
      producto: updatedProducts,
    });

    // Crear el arreglo de actividades correspondiente
    // al nuevo producto
    const updatedActivities = [
      ...(activities || []),
      [],
    ];

    setActivities(updatedActivities);
  };

  const handleRemoveProduct = (productIndex) => {
    const updatedProducts = (
      product_data.producto || []
    ).filter(
      (_, index) => index !== productIndex
    );

    setProductData({
      ...product_data,
      producto: updatedProducts,
    });
    //  elimina las actividades de ese producto
    const updatedActivities = (
      activities || []
    ).filter(
      (_, index) => index !== productIndex
    );

    setActivities(updatedActivities);

    // Reorganizar acordeones
    setIsProductOpen((prev) => {
      const newState = {};

      Object.keys(prev).forEach((key) => {
        const oldIndex = Number(key);

        if (oldIndex < productIndex) {
          newState[oldIndex] = prev[key];
        }

        if (oldIndex > productIndex) {
          newState[oldIndex - 1] = prev[key];
        }
      });

      return newState;
    });
  };

  const handle_remove_indicador = (
    productIndex,
    indicatorIndex
  ) => {
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
    <div className="col-span-3">
      <div className="grid-cols-3 flex gap-4 items-start justify-between">
        <h2 className="text-lg font-semibold text-navy col-span-3 text-start ">Productos</h2>
        <button
          type="button"
          className="flex items-center gap-2 bg-green-brand text-white border-0 py-2 pl-4 pr-3 rounded-3xl border-bg-teal-900 text-sm cursor-pointer hover:bg-teal"
          onClick={handleAddProduct}
        >
          <span>+</span> Agregar productos
        </button>
      </div>

      <div className="mt-2">
        {(product_data.producto || []).map(
          (product, productIndex) => (
            <div
              key={productIndex}
              className="bg-app-card border border-app-border rounded-xl mb-4 overflow-hidden shadow-sm"
            >
              {/* HEADER PRODUCTO */}
              <div
                onClick={() =>
                  toggleProduct(productIndex)
                }
                className="bg-teal text-app-card py-3 px-4 flex justify-between items-center font-semibold cursor-pointer"
              >
                Producto #{productIndex + 1}

                <div className="flex items-center gap-4">
                  {(isSuperUser ||
                    !isSavedProduct(product, activities?.[productIndex])) && (
                    <span
                      className="inline-block transform transition-transform duration-200 cursor-pointer hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handle_remove_producto(
                          productIndex
                        );
                      }}
                    >
                      &#10005;
                    </span>
                  )}

                  <span
                    className={`inline-block transform transition-transform duration-200 cursor-pointer ${isProductOpen[
                      productIndex
                    ] === true
                      ? "rotate-180"
                      : "rotate-0"
                      }`}
                  >
                    &#9660;
                  </span>
                </div>
              </div>

              {isProductOpen[productIndex] && (
                <div className="bg-app-card py-3 pb-4 px-6">
                  {anexoYear == NEW_ANEXO_DATE && (
                    <div className="mb-4">
                      <label className="block text-xs text-app-muted mb-1 uppercase">
                        PROBLEMÁTICA PRIORIZADA
                      </label>

                      <textarea
                        maxLength={2000}
                        value={
                          product.problematica || ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            productIndex,
                            "problematica",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border border-app-border rounded-md text-sm"
                      />

                      <p className="text-xs text-app-muted">
                        {product.problematica
                          ?.length || 0}{" "}
                        / 2000 caracteres
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-app-muted mb-1 uppercase">
                      DESCRIPCIÓN DEL PRODUCTO
                    </label>

                    <textarea
                      maxLength={2000}
                      value={
                        product.descripcion_producto ||
                        ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          productIndex,
                          "descripcion_producto",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border border-app-border rounded-md text-sm"
                    />

                    <p className="text-xs text-app-muted">
                      {product.descripcion_producto
                        ?.length || 0}{" "}
                      / 2000 caracteres
                    </p>
                  </div>

                  <div className="grid-cols-3 flex gap-4 items-start justify-between my-6">
                    <h2 className="text-lg font-semibold text-navy col-span-3 text-start">
                      Indicadores
                    </h2>

                    <button
                      type="button"
                      className="flex items-center gap-2 bg-green-brand text-white border-0 py-2 pl-4 pr-3 rounded-3xl border-bg-teal-900 text-sm cursor-pointer hover:bg-teal"
                      onClick={() =>
                        handleAddIndicator(
                          productIndex
                        )
                      }
                    >
                      <span>+</span>
                      Agregar indicador
                    </button>
                  </div>

                  {(product.indicadores || []).map(
                    (
                      indicator,
                      indicatorIndex
                    ) => (
                      <div
                        className="grid gap-3 items-end bg-teal-light border rounded-lg px-3 py-3 grid-cols-10 my-3"
                        key={indicatorIndex}
                      >
                        <div className="col-span-5">
                          <label className="block text-xs text-app-muted mb-1 uppercase">
                            Indicador de Producto
                          </label>

                          <input
                            type="text"
                            value={
                              indicator.meta_producto ||
                              ""
                            }
                            onChange={(e) =>
                              handleUpdateIndicator(
                                productIndex,
                                indicatorIndex,
                                "meta_producto",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-app-border rounded-md text-sm"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs text-app-muted mb-1 uppercase">
                            Cantidad
                          </label>

                          <input
                            type="number"
                            value={
                              indicator.cantidad || 0
                            }
                            onChange={(e) =>
                              handleUpdateIndicator(
                                productIndex,
                                indicatorIndex,
                                "cantidad",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-app-border rounded-md text-sm"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="block text-xs text-app-muted mb-1 uppercase">
                            Indicador de Línea Base
                          </label>

                          <input
                            type="text"
                            value={
                              indicator.indicador_linea_base ||
                              ""
                            }
                            onChange={(e) =>
                              handleUpdateIndicator(
                                productIndex,
                                indicatorIndex,
                                "indicador_linea_base",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-app-border rounded-md text-sm"
                          />
                        </div>

                        <div className="col-span-1 flex items-start justify-center pb-2">
                          <span
                            className="inline-block cursor-pointer hover:text-red-600"
                            onClick={() =>
                              handle_remove_indicador(
                                productIndex,
                                indicatorIndex
                              )
                            }
                          >
                            &#10005;
                          </span>
                        </div>
                      </div>
                    )
                  )}
                  <ActivityList
                    entornos={entornos}
                    anexoYear={anexoYear}
                    isSuperUser={isSuperUser}
                    tecnologias={tecnologias}
                    poblaciones={poblaciones}
                    soportes={soportes}
                    cups={cups}
                    cursos_vida={cursos_vida}
                    activities={
                      activities[productIndex] || []
                    }
                    setActivities={(updatedActivities) => {
                      const newActivities = [
                        ...activities,
                      ];
                      newActivities[productIndex] = updatedActivities;
                      setActivities(newActivities);
                    }}
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Product;