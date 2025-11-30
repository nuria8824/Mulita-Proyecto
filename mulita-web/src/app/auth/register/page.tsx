"use client";

import React, { useState, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import PhoneInputWithCountry from "@/components/PhoneInputWithCountry";
import { Country, State, City, IState, ICity } from "country-state-city";
import Select from "react-select";

export default function RegisterPage() {
  const [esDocente, setEsDocente] = useState(false);
  const [loading, setLoading] = useState(false);
  const [telefono, setTelefono] = useState("");

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [ListaProvincias, setListaProvincias] = useState<IState[]>([]);
  const [ListaCiudades, setListaCiudades] = useState<ICity[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      formRef.current?.requestSubmit();
    }
  }
  const countryList = Country.getAllCountries();

  const countryOptions = countryList.map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const isoCode = e.target.value;
    const country = countryList.find(c => c.isoCode === isoCode);

    if (!country) return;
    setSelectedCountry(isoCode);

    // Cargar provincias/estados del país
    const states = State.getStatesOfCountry(isoCode);
    setListaProvincias(states);
  };

  // Manejar el cambio de provincia
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const country = countryList.find(c => c.name === selectedCountry);
    if (!country) return;

    // Obtener todas las ciudades del país y estado seleccionado
    const cities = City.getCitiesOfState(country.isoCode, stateName);
    setListaCiudades(cities);
  };

  const onContinuarClick = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const rol: "usuario" | "docente" = esDocente ? "docente" : "usuario";

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre")?.toString() ?? "";
    const apellido = formData.get("apellido")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const contrasena = formData.get("contrasena")?.toString() ?? "";
    
    // Validar nombre - no debe contener números
    if (/\d/.test(nombre)) {
      toast.error("El nombre no puede contener números");
      setLoading(false);
      return;
    }

    // Validar apellido - no debe contener números
    if (/\d/.test(apellido)) {
      toast.error("El apellido no puede contener números");
      setLoading(false);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("El email no es válido");
      setLoading(false);
      return;
    }

    // Validar teléfono - debe tener mínimo 7 y máximo 30 dígitos
    const phoneDigits = telefono.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      toast.error("El teléfono es muy corto");
      setLoading(false);
      return;
    }
    if (phoneDigits.length > 30) {
      toast.error("El teléfono no puede tener más de 30 dígitos");
      setLoading(false);
      return;
    }

    // Validar contraseña - debe tener mínimo 6 caracteres
    if (contrasena.length < 6) {
      toast.error("La contraseña es muy corta");
      setLoading(false);
      return;
    }

    const data = {
      nombre,
      apellido,
      email,
      telefono,
      contrasena,
      rol,
      institucion: formData.get("institucion")?.toString() ?? "",
      pais: formData.get("pais")?.toString() ?? "",
      provincia: formData.get("provincia")?.toString() ?? "",
      ciudad: formData.get("ciudad")?.toString() ?? "",
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json();

      if (!result.success) throw new Error(result.message || "Error al registrar usuario");

      toast.success("Usuario registrado. Revisa tu email para confirmar tu cuenta.");

      formRef.current?.reset();
      setEsDocente(false);
      setTelefono("");
    } catch (err: any) {
      console.error(err);
      toast.error("Error al registrar usuario: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [esDocente, telefono]);

  const inputClass =
    "w-full shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-lg border border-gray-300 h-10 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600";

  const buttonClass =
    "w-full bg-[#003c71] text-white rounded-lg h-10 flex items-center justify-center cursor-pointer hover:bg-blue-800";

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white p-4">
      <form
        ref={formRef}
        className="w-full max-w-md flex flex-col gap-6"
        onSubmit={onContinuarClick}
      >
        {/* Títulos */}
        <div className="flex flex-col items-center gap-1 text-center text-black">
          <h1 className="text-2xl font-semibold">Crea una cuenta</h1>
          <p className="text-base text-[#003c71]">Introduce tus datos</p>
        </div>

        {/* Formulario */}
        <div className="flex flex-col gap-4 text-left text-lg">
          <input name="nombre" type="text" placeholder="Nombre" className={inputClass} onKeyPress={handleKeyPress} required />
          <input name="apellido" type="text" placeholder="Apellido" className={inputClass} onKeyPress={handleKeyPress} required />
          <input name="email" type="email" placeholder="Email" className={inputClass} onKeyPress={handleKeyPress} required />
          <PhoneInputWithCountry
            value={telefono}
            onChange={(value) => setTelefono(value)}
            placeholder="Teléfono"
          />
          <input name="contrasena" type="password" placeholder="Contraseña" className={inputClass} onKeyPress={handleKeyPress} required />

          <label className="flex items-center gap-2">
            <span>Docente:</span>
            <input
              type="checkbox"
              name="docente"
              className="w-5 h-5 cursor-pointer"
              checked={esDocente}
              onChange={() => setEsDocente(!esDocente)}
            />
          </label>

          {esDocente && (
            <>
              {/* Seleccionar país */}
              <Select
                options={countryOptions}
                value={countryOptions.find((o) => o.value === selectedCountry)}
                onChange={(option: any) => handleCountryChange({ target: { value: option.value } } as any)}
              />

              {/* Seleccionar provincia según país */}
              {ListaProvincias.length > 0 ? (
                <Select
                  options={ListaProvincias.map(p => ({ value: p.name, label: p.name }))}
                  onChange={(option: any) => handleStateChange(option.value)}
                  value={selectedState ? { value: selectedState, label: selectedState } : null}
                  placeholder="Selecciona una provincia"
                />
              ) : (
                <input
                  name="provincia"
                  type="text"
                  placeholder="Provincia"
                  className={inputClass}
                  onKeyPress={handleKeyPress}
                  required
                />
              )}

              {/* Seleccionar ciudad según provincia */}
              {ListaCiudades.length > 0 ? (
                <Select
                  options={ListaCiudades.map(c => ({ value: c.name, label: c.name }))}
                  onChange={(option: any) => {
                    // Guardamos la ciudad en un hidden input para FormData
                    const hiddenInput = document.querySelector<HTMLInputElement>('input[name="ciudad"]');
                    if (hiddenInput) hiddenInput.value = option.value;
                  }}
                  placeholder="Selecciona una ciudad"
                />
              ) : (
                <input name="ciudad" type="text" placeholder="Ciudad" className={inputClass} onKeyPress={handleKeyPress} required/>
              )}

              <input name="institucion" type="text" placeholder="Institución" className={inputClass} onKeyPress={handleKeyPress} required />

              {/* Hidden inputs para FormData */}
              <input type="hidden" name="pais" value={selectedCountry} />
              <input type="hidden" name="provincia" value={selectedState} />
            </>
          )}

          <button type="submit" className={buttonClass} disabled={loading}>
            {loading ? "Enviando..." : "Continuar"}
          </button>
        </div>

        <p className="text-sm">
          Al hacer clic en continuar, acepta nuestros{" "}
          <span className="text-black font-semibold">Términos de servicio y Política de privacidad</span>.
        </p>
      </form>
    </div>
  );
}
