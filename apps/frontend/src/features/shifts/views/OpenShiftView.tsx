import { useState } from "react";
import { useShiftStore } from "../slices/shiftStore";
import { shiftService } from "../services/shift.service";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";

export const OpenShiftView = () => {
  const { setActiveShift } = useShiftStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenShift = async () => {
    try {
      setLoading(true);
      setError(null);

      const newShift = await shiftService.openShift();
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
