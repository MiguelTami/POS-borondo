import React, { useState, useEffect } from "react";
import type { User, UpdateUserPayload } from "../types/user.types";
import { userService } from "../services/user.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  user?: User;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  user,
}) => {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "CASHIER" | "WAITER">("WAITER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!user;

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setName(user.name);
        setRole(user.role);
        setCurrentPassword("");
        setPassword("");
        setShowPassword(false);
      } else {
        setName("");
        setRole("WAITER");
        setCurrentPassword("");
        setPassword("");
        setShowPassword(false);
      }
      setError(null);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!isEditing && !password) {
      setError("La contraseña es requerida para nuevos usuarios");
      return;
    }
    if (isEditing && password && !currentPassword) {
      setError(
        "Para cambiar la contraseña, debes ingresar la contraseña actual",
      );
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        const payload: UpdateUserPayload = { name, role };
        if (password && currentPassword) {
          payload.password = password;
          payload.currentPassword = currentPassword;
        }
        await userService.updateUser(user.id, payload);
      } else {
        await userService.createUser({
          name,
          password,
          role,
        });
      }
      onSave();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Error al guardar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-[95vw] rounded-2xl bg-white p-0 overflow-hidden border-0 shadow-2xl">
        <DialogHeader className="p-6 pb-2 border-b border-gray-100 bg-gray-50/50">
          <DialogTitle className="text-xl font-bold text-gray-900">
            {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            {isEditing
              ? "Modifica los datos del usuario seleccionado."
              : "Completa los campos para registrar un nuevo usuario."}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-xl border border-rose-100 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Nombre</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="rounded-xl border-gray-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-y-4">
            {isEditing && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="********"
                    className="rounded-xl border-gray-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                {isEditing ? "Nueva Contraseña" : "Contraseña"}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="rounded-xl border-gray-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="flex w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="WAITER">Mesero</option>
              <option value="CASHIER">Cajero</option>
              <option value="ADMIN">Administrador</option>
            </select>
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
