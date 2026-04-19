import { useState } from "react";
import { useShiftStore } from "../slices/shiftStore";
import { shiftService } from "../services/shift.service";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export const OpenShiftView = () => {
  const { setActiveShift } = useShiftStore();
  const navigate = useNavigate();
  const [pettyCash, setPettyCash] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenShift = async () => {
    try {
      setLoading(true);
      setError(null);

      const newShift = await shiftService.openShift({
        pettyCash: parseFloat(pettyCash) || 0,
      });
      setActiveShift(newShift);

      // Si funciona, ir a la vista de mesas/POS root
      navigate("/pos/tables");
    } catch (err: any) {
      console.error("Error abriendo el turno:", err);
      setError(err?.response?.data?.error || "Error al abrir la caja");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Bienvenido a Caja
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Antes de poder tomar pedidos o procesar pagos, debes realizar la
          apertura de turno.
        </p>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2 mb-6">
          <Label
            htmlFor="pettyCash"
            className="text-sm font-bold text-gray-700"
          >
            Caja Menor Inicial
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="pettyCash"
              type="number"
              placeholder="0.00"
              value={pettyCash}
              onChange={(e) => setPettyCash(e.target.value)}
              className="pl-8 !text-lg h-12"
            />
          </div>
        </div>

        <Button
          onClick={handleOpenShift}
          disabled={loading}
          className="w-full h-12 text-md"
        >
          {loading ? "Abriendo caja..." : "Abrir Turno Ahora"}
        </Button>
      </div>
    </div>
  );
};
