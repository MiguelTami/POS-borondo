import { useState } from "react";
import { X, Receipt, AlertCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useShiftStore } from "../slices/shiftStore";
import { shiftService, type Shift } from "../services/shift.service";

interface Props {
  onClose: () => void;
}

export function CloseShiftModal({ onClose }: Props) {
  const { activeShift, setActiveShift } = useShiftStore();
  const [declaredCash, setDeclaredCash] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Shift | null>(null);

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
      const result = await shiftService.closeShift(activeShift.id, cashValue);
      // Al cerrar el turno exitosamente, lo limpiamos del estado local
      setActiveShift(null);
      setSummary(result);
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

  if (summary) {
    const diff = Number(summary.difference || 0);
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-red-50 p-6 text-center border-b border-red-100">
            <h2 className="text-2xl font-bold text-red-900">
              Resumen de Cierre de Caja
            </h2>
            <p className="text-red-700 mt-2">
              El turno ha sido cerrado exitosamente
            </p>
          </div>
          <div className="p-6 space-y-5">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center text-gray-700">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-green-600" />
                  <span>Subórdenes Pagadas:</span>
                </div>
                <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200">
                  {summary.summary?.paid || 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span>Subórdenes Canceladas:</span>
                </div>
                <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200">
                  {summary.summary?.cancelled || 0}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">
                  Caja Menor Inicial:
                </span>
                <span className="font-bold text-blue-900 text-lg">
                  $
                  {Number(summary.pettyCash || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">
                  Ingresos del Turno (Esperado):
                </span>
                <span className="font-bold text-blue-900 text-lg">
                  $
                  {Number(summary.expectedRevenue || 0).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-blue-200">
                <span className="text-blue-800 font-medium">
                  Efectivo Declarado:
                </span>
                <span className="font-bold text-blue-900 text-lg">
                  $
                  {Number(summary.declaredCash || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-gray-900 text-lg">
                  Diferencia:
                </span>
                <div
                  className={`px-4 py-2 rounded-lg font-bold text-lg ${diff === 0 ? "bg-green-100 text-green-700" : diff < 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                >
                  $
                  {diff.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button
                onClick={onClose}
                className="w-full max-w-[200px] h-12 bg-gray-900 hover:bg-black text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Cerrar Pantalla
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-full max-w-[150px] h-12 font-semibold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCloseShift}
              disabled={loading || !declaredCash}
              className="w-full max-w-[200px] h-12 bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {loading ? "Cerrando..." : "Confirmar Cierre"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
