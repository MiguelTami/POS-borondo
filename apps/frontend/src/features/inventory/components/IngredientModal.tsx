import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  inventoryService,
  type Ingredient,
  type CreateIngredientDTO,
} from "../services/inventory.service";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  ingredientToEdit?: Ingredient;
}

export function IngredientModal({
  onClose,
  onSuccess,
  ingredientToEdit,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateIngredientDTO>({
    name: "",
    unit: "UNIT",
    minStockAlert: 0,
  });

  useEffect(() => {
    if (ingredientToEdit) {
      setFormData({
        name: ingredientToEdit.name,
        unit: ingredientToEdit.unit,
        minStockAlert: ingredientToEdit.minStockAlert,
      });
    }
  }, [ingredientToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "minStockAlert" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (ingredientToEdit) {
        await inventoryService.updateIngredient(ingredientToEdit.id, formData);
      } else {
        await inventoryService.createIngredient(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error al guardar el ingrediente",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">
            {ingredientToEdit ? "Editar Ingrediente" : "Nuevo Ingrediente"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors text-gray-500 border border-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Harina de trigo"
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unidad de Medida</Label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="UNIT">Unidad (U)</option>
              <option value="GRAM">Gramos (g)</option>
              <option value="KILOGRAM">Kilogramos (Kg)</option>
              <option value="MILLILITER">Mililitros (ml)</option>
              <option value="LITER">Litros (L)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="minStockAlert">Alerta Stock Bajo (Umbral)</Label>
            <Input
              type="number"
              id="minStockAlert"
              name="minStockAlert"
              value={
                formData.minStockAlert === 0 && !ingredientToEdit
                  ? ""
                  : formData.minStockAlert
              }
              onChange={handleChange}
              placeholder="Ej. 10"
              min={0}
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold"
            >
              {isLoading ? (
                "Guardando..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Guardar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
