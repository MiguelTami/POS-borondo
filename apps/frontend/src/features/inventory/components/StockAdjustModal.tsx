import { formatUnit } from "../../../lib/utils";
import { useState } from "react";
import { X, ArrowRightLeft, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import {
  inventoryService,
  type Ingredient,
  type AdjustStockDTO,
} from "../services/inventory.service";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  ingredient: Ingredient;
}

export function StockAdjustModal({ onClose, onSuccess, ingredient }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<AdjustStockDTO>({
    ingredientId: ingredient.id,
    type: "RESTOCK",
    quantity: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.quantity === 0) {
      setError("La cantidad no puede ser cero.");
      return;
    }

    let stockChange = formData.quantity;
    if (formData.type === "WASTE") {
      stockChange = -Math.abs(formData.quantity);
    } else if (formData.type === "RESTOCK") {
      stockChange = Math.abs(formData.quantity);
    }

    if (Number(ingredient.stock) + stockChange < 0) {
      setError("El stock no puede ser menor a 0. Ajuste inválido.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await inventoryService.adjustStock(formData);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error al ajustar el inventario",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">
            Ajustar Disponibilidad
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-gray-100 rounded-full transition-colors text-gray-500 border border-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Ingrediente:{" "}
            <span className="text-gray-900 font-bold">{ingredient.name}</span> (
            {formatUnit(ingredient.unit)})
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="mb-2 bg-red-50 border-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Ajuste</Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="RESTOCK">Añadir Stock (Restock)</option>
              <option value="WASTE">Mermar / Descontar (Waste)</option>
              <option value="MANUAL_ADJUSTMENT">Ajuste Manual Expreso</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {formData.type === "MANUAL_ADJUSTMENT"
                ? "Variación Exacta (+/-)"
                : "Cantidad"}
            </Label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity === 0 ? "" : formData.quantity}
              onChange={handleChange}
              placeholder={
                formData.type === "MANUAL_ADJUSTMENT" ? "Ej. 5 o -2" : "Ej. 10"
              }
              min={formData.type === "MANUAL_ADJUSTMENT" ? undefined : 0}
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
                "Ajustando..."
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4 mr-2" /> Aplicar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
