import React, { useState, useEffect } from "react";
import type {
  Table as TableType,
  UpdateTablePayload,
} from "../types/table.types";
import { tableService } from "../services/table.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Loader2 } from "lucide-react";

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  table?: TableType;
}

export const TableModal: React.FC<TableModalProps> = ({
  isOpen,
  onClose,
  onSave,
  table,
}) => {
  const [number, setNumber] = useState<string>("");
  const [_status, setStatus] = useState<
    "AVAILABLE" | "OCCUPIED" | "RESERVED" | "OUT_OF_SERVICE"
  >("AVAILABLE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!table;

  useEffect(() => {
    if (isOpen) {
      if (table) {
        setNumber(table.number.toString());
        setStatus(table.status);
      } else {
        setNumber("");
        setStatus("AVAILABLE");
      }
      setError(null);
    }
  }, [isOpen, table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!number || isNaN(Number(number))) {
      setError("Por favor, ingresa un número de mesa válido");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        const payload: UpdateTablePayload = {
          number: Number(number),
        };
        await tableService.updateTable(table.id, payload);
      } else {
        await tableService.createTable({
          number: Number(number),
        });
      }
      onSave();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Error al guardar la mesa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[95vw] rounded-2xl bg-white p-0 overflow-hidden border-0 shadow-2xl">
        <DialogHeader className="p-6 pb-2 border-b border-gray-100 bg-gray-50/50">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEditing ? "Editar Mesa" : "Nueva Mesa"}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            {isEditing
              ? "Modifica los datos de la mesa."
              : "Crea una nueva mesa en el restaurante."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-xl border border-rose-100 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Número de Mesa
            </label>
            <Input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Ej: 1"
              min="1"
              className="rounded-xl border-gray-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100 flex gap-3 sm:justify-end mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-semibold border-gray-200 hover:bg-gray-50 flex-1 sm:flex-none"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm flex-1 sm:flex-none"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
