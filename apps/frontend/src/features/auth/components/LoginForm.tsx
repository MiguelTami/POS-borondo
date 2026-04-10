import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../slices/authStore";
import { loginUsuario } from "../api/login";
import type { LoginPayload } from "../api/login";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Esquema de validaciÃ³n igual al backend
const loginSchema = z.object({
    name: z.string().min(1, "El usuario es requerido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

export function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      setError(null);
      setLoading(true);
      const res = await loginUsuario(data);
      setAuth(res.user, res.token);
      
      // Redirigir basado en el rol
      if (res.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/pos/tables");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Credenciales incorrectas o error en el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Borondo POS</h2>
        <p className="text-gray-500 mt-2">Inicia sesión para continuar</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Usuario</Label>
          <Input
            id="name"
            {...register("name")}
            type="text"
            autoComplete="username"
            placeholder="Introduce tu usuario"
            disabled={loading}
            className={errors.name ? "border-red-500 focus-visible:ring-red-200" : ""}
          />
          {errors.name && (
            <span className="text-red-500 text-xs block">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            {...register("password")}
            type="password"
            autoComplete="current-password"
            placeholder="Introduce tu contraseña"
            disabled={loading}
            className={errors.password ? "border-red-500 focus-visible:ring-red-200" : ""}
          />
          {errors.password && (
            <span className="text-red-500 text-xs block">
              {errors.password.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Entrando...
            </>
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>
    </div>
  );
}
