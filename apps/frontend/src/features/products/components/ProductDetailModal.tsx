import { formatUnit } from "../../../lib/utils";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Package, UtensilsCrossed } from "lucide-react";
import type { Product } from "../services/product.service";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[90vw] md:max-w-5xl lg:max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </DialogTitle>
              <p className="text-sm font-medium text-gray-500 mt-1">
                {product.category?.name || "Sin Categoría"} •{" "}
                {product.isActive ? "Activo" : "Inactivo"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div
          className="mt-4 space-y-4"
          style={{ marginBottom: "0", marginTop: "0" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Precio Venta
              </p>
              <p className="text-xl font-black text-gray-900">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Total Ingredientes
              </p>
              <p className="text-xl font-black text-gray-900">
                {product.recipes?.length || 0}
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[40vh] min-h-[300px]">
            <div className="bg-[#f8f9fc] px-4 py-3 border-b border-gray-200 flex items-center gap-2 z-10 sticky top-0 shrink-0">
              <UtensilsCrossed className="h-4 w-4 text-gray-500" />
              <h3 className="font-bold text-sm text-gray-700 uppercase tracking-wider">
                Receta (Ingredientes)
              </h3>
            </div>
            {product.recipes && product.recipes.length > 0 ? (
              <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#f8f9fc]/50 text-xs uppercase text-gray-500 font-bold border-b border-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-5 py-3">Ingrediente</th>
                      <th className="px-5 py-3">Cantidad</th>
                      <th className="px-5 py-3">Unidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {product.recipes.map((r, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors odd:bg-white even:bg-gray-50/70"
                      >
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {r.ingredient?.name || "Desconocido"}
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {r.quantityRequired}
                        </td>
                        <td className="px-5 py-4 text-gray-500">
                          {formatUnit(r.ingredient?.unit) || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-400 py-8 bg-white">
                Este producto no tiene ingredientes configurados en su receta.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 border-t border-gray-100 pt-4">
          <Button
            onClick={onClose}
            className="w-full md:w-auto bg-gray-800 hover:bg-gray-900 text-white"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
