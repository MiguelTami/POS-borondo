import { LoginForm } from "../components/LoginForm";
import { Store } from "lucide-react";

export function LoginView() {
    return (
        <div className="flex h-screen bg-gray-50">
        {/* Lado izquierdo - IlustraciÃ³n/Branding */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 justify-center items-center flex-col text-white p-12 relative overflow-hidden">
            <div className="z-10 text-center">
            <Store className="w-24 h-24 mx-auto mb-6 opacity-90" />
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-white">Borondo POS</h1>
            <p className="text-blue-100 text-lg max-w-md mx-auto leading-relaxed">
                Sistema Ágil de Punto de Venta para restaurantes, bares y delis. 
                Mejora tus ventas y controla tu inventario al instante.
            </p>
            </div>
            
            {/* DecoraciÃ³n SVG rÃ¡pida simulando ondas (Tailwind + CSS puro) */}
            <div className="absolute inset-0 z-0 opacity-10" 
                style={{ 
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.5) 0%, transparent 50%)`
                }} 
            />
        </div>

        {/* Lado derecho - Formulario Login */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8">
            <LoginForm />
        </div>
        </div>
    );
}
