import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Search, Plus, UtensilsCrossed } from "lucide-react";
import type { Ingredient } from "../../inventory/services/inventory.service";

interface IngredientPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: Ingredient[];
  onSelectIngredient: (ingredient: Ingredient) => void;
}

export const IngredientPickerModal: React.FC<IngredientPickerModalProps> = ({
  isOpen,
  onClose,
  availableIngredients,
  onSelectIngredient,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    return availableIngredients.filter((i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [availableIngredients, searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[90vw] md:max-w-5xl lg:max-w-6xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2 border-b border-gray-100 flex-none bg-white z-10">
          <DialogTitle className="text-xl font-bold flex flex-col gap-1.5 text-[#111827]">
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-gray-500" />
              Seleccionar Ingrediente
            </span>
            <span className="text-sm font-normal text-gray-500">
              Busca y añade ingredientes a tu receta.
            </span>
          </DialogTitle>
          <div className="relative mt-4 mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar ingrediente por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-base bg-gray-50 border-gray-200 rounded-xl focus-visible:ring-gray-300 transition-all border outline-none w-full"
            />
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1 bg-[#F9FAFB]">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 auto-rows-max">
              {filtered.map((ing) => (
                <div
                  key={ing.id}
                  onClick={() => {
                    onSelectIngredient(ing);
                    onClose();
                  }}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-400 hover:shadow-md cursor-pointer transition-all flex flex-col gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold text-gray-900 group-hover:text-black line-clamp-2 leading-tight">
                      {ing.name}
                    </span>
                    <div className="h-8 w-8 bg-gray-50 text-gray-400 group-hover:bg-gray-900 group-hover:text-white rounded-full flex items-center justify-center shrink-0 transition-colors">
                      <Plus className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-auto">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      Unidad: {ing.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
              <Search className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="text-base font-medium text-gray-900">
                No se encontraron ingredientes.
              </p>
              <p className="text-sm">Prueba buscando con otro término.</p>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t border-gray-100 bg-white flex-none">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-8"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
