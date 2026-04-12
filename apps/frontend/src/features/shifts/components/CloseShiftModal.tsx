import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useShiftStore } from "../slices/shiftStore";
import { shiftService } from "../services/shift.service";

interface Props {
  onClose: () => void;
}

export function CloseShiftModal({ onClose }: Props) {
  const { activeShift, setActiveShift } = useShiftStore();
  const [declaredCash, setDeclaredCash] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseShift = async () => {
    if (!activeShift) return;

    const cashValue = Number(declaredCash);
    if (isNaN(cashValue) || cashValue < 0) {
      setError("Por favor ingresa un monto válido de efectivo.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await shiftService.closeShift(activeShift.id, cashValue);
      // Al cerrar el turno exitosamente, lo limpiamos del estado local
      setActiveShift(null);
      onClose();
    } catch (err: any) {
      console.error("Error cerrando turno", err);
      setError(
        err?.response?.data?.error ||
          "Ocurrió un error al intentar cerrar el turno.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Cerrar Turno Actual
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6">
            Para cerrar la caja es necesario declarar el saldo de efectivo
            actual. Al hacerlo, el sistema comparará con las ventas e indicará
            si hay descuadre.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2 mb-6">
            <Label
              htmlFor="declaredCash"
              className="text-sm font-bold text-gray-700"
            >
              Efectivo Declarado Cierre
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <Input
                id="declaredCash"
                type="number"
                placeholder="0.00"
                value={declaredCash}
                onChange={(e) => setDeclaredCash(e.target.value)}
                className="pl-8 !text-lg h-12"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-full h-12 font-semibold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCloseShift}
              disabled={loading || !declaredCash}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {loading ? "Cerrando..." : "Confirmar Cierre"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
