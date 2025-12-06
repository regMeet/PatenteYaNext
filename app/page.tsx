import Link from "next/link";
import { SearchIcon, ShieldCheckIcon, MapPinIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
            Recuperá tu
            <span className="relative whitespace-nowrap text-blue-600">
              <span className="relative"> patente</span>
            </span>
            <br />rápidamente
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            La plataforma más rápida para reportar y encontrar patentes perdidas.
            Ayudamos a conectar personas que perdieron sus placas con quienes las encontraron.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Comenzar ahora
            </Link>
            <Link
              href="/login"
              className="group inline-flex ring-1 items-center justify-center rounded-full py-3 px-8 text-sm focus:outline-none ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300 transition-all duration-200"
            >
              Reportar patente
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 text-center">
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <SearchIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Búsqueda Rápida
              </h3>
              <p className="text-slate-600">
                Encuentra reportes de patentes perdidas en segundos con nuestra búsqueda inteligente.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Verificación Segura
              </h3>
              <p className="text-slate-600">
                Sistema de autenticación con Google para garantizar la seguridad de tus datos.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-purple-100 p-3">
                  <MapPinIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Ubicación GPS
              </h3>
              <p className="text-slate-600">
                Guarda la ubicación donde perdiste o encontraste la patente para facilitar su recuperación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
