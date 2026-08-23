import React, { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

/* ============================================================
   TPM FMO · REFRIGERACIÓN — V2 (demo de presentación)
   CVG Ferrominera Orinoco · Servicios Industriales
   Novedades V2 (benchmarking CMMS/HVAC 2026):
   · Checklist de preventivo por tipo de equipo
   · Lecturas de temperatura con rango objetivo y alertas
   · Trazabilidad de refrigerante usado por atención
   · Ficha técnica ampliada (marca/modelo, gas, año)
   · Registro del técnico que atendió
   ============================================================ */

const T = {
  bg: "#F2F2F0", panel: "#FFFFFF", ink: "#141414", inkSoft: "#5C5C58",
  line: "#DAD9D4", steel: "#4A4A46", frio: "#B98600", orange: "#F2B705",
  ok: "#2E8B57", warn: "#D9A404", danger: "#C1272D",
};
const display = "'Barlow Condensed', 'Arial Narrow', sans-serif";
const body = "'IBM Plex Sans', system-ui, sans-serif";
const mono = "'IBM Plex Mono', Consolas, monospace";

const LOGO_LOCKUP = "data:image/png;base64,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";

/* ================= CONFIGURACIÓN DE SUPABASE =================
   Proyecto propio de TPM FMO. Pega los DOS valores:
   · Project URL  (barra de direcciones del panel: https://xxxx.supabase.co)
   · anon public key  (Settings → API Keys)
   ============================================================= */
const SUPABASE_URL = "https://irhmmilukjhwdrakwmuj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaG1taWx1a2pod2RyYWt3bXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMjYyODcsImV4cCI6MjEwMjkwMjI4N30.dYz1PSnI-_423dHizXd_JKPjDvj2nwbjMb1B7EtIEXw";

const supabase = SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.startsWith("eyJ")
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/* ---------- mapeo app (camelCase) ⇄ base de datos (snake_case) ---------- */
const numONulo = (v) => (v === "" || v == null ? null : +v);
const textoONulo = (v) => (v == null ? "" : String(v));
const aEquipoDB = (e, userId) => ({
  id: e.id, user_id: userId, nombre: e.nombre, tipo: e.tipo, gerencia: e.gerencia,
  ubicacion: e.ubicacion, marca_modelo: e.marcaModelo || "", serial: e.serial || "",
  refrigerante: e.refrigerante, anio: e.anio || "", capacidad: e.capacidad || "",
  criticidad: e.criticidad, intervalo_dias: +e.intervaloDias, ultimo_prev: e.ultimoPrev,
  temp_min: numONulo(e.tempMin), temp_max: numONulo(e.tempMax),
});
const deEquipoDB = (r) => ({
  id: r.id, nombre: r.nombre, tipo: r.tipo, gerencia: r.gerencia, ubicacion: r.ubicacion,
  marcaModelo: r.marca_modelo || "", serial: r.serial || "", refrigerante: r.refrigerante,
  anio: textoONulo(r.anio), capacidad: r.capacidad || "", criticidad: r.criticidad,
  intervaloDias: +r.intervalo_dias, ultimoPrev: r.ultimo_prev,
  tempMin: r.temp_min == null ? "" : String(r.temp_min),
  tempMax: r.temp_max == null ? "" : String(r.temp_max),
});
const aAtencionDB = (a, userId) => ({
  id: a.id, user_id: userId, equipo_id: a.equipoId, tipo: a.tipo, fecha: a.fecha,
  causa: a.causa || "", horas_fuera: +a.horasFuera || 0, kg_gas: +a.kgGas || 0,
  tecnico: a.tecnico || "", nota: a.nota || "", tareas: a.tareas || [],
});
const deAtencionDB = (r) => ({
  id: r.id, equipoId: r.equipo_id, tipo: r.tipo, fecha: r.fecha, causa: r.causa || "",
  horasFuera: +r.horas_fuera || 0, kgGas: +r.kg_gas || 0, tecnico: r.tecnico || "",
  nota: r.nota || "", tareas: Array.isArray(r.tareas) ? r.tareas : [],
});
const aLecturaDB = (l, userId) => ({
  id: l.id, user_id: userId, equipo_id: l.equipoId, fecha: l.fecha,
  valor: +l.valor, fuera: !!l.fuera, tecnico: l.tecnico || "",
});
const deLecturaDB = (r) => ({
  id: r.id, equipoId: r.equipo_id, fecha: r.fecha, valor: +r.valor, fuera: !!r.fuera, tecnico: r.tecnico || "",
}); /* CVG | Ferrominera Orinoco, lockup oficial en blanco */

const TIPOS_EQUIPO = ["Split", "A/A ventana", "Central / compacto", "Aire de precisión", "Cava / cuarto frío", "Chiller", "Nevera / congelador", "Bebedero", "Otro"];
const CRITICIDAD = ["A", "B", "C"];
const REFRIGERANTES = ["R-22", "R-410A", "R-134a", "R-404A", "R-407C", "Otro", "No determinado"];
const CAUSAS_FALLA = ["Fuga de refrigerante", "Falla de compresor", "Falla eléctrica / contactor", "Serpentín sucio / obstrucción", "Ventilador / motor", "Termostato / control", "Drenaje / condensado", "Otra"];

/* ---------- checklist de preventivo según tipo de equipo ---------- */
const CHECKLISTS = {
  "Split": ["Limpiar filtros de aire", "Limpiar serpentín evaporador", "Limpiar serpentín condensador", "Verificar carga de refrigerante y presiones", "Revisar conexiones eléctricas y contactor", "Medir amperaje del compresor", "Limpiar y verificar drenaje de condensado", "Verificar temperatura de suministro", "Revisar anclajes, ruido y vibración"],
  "A/A ventana": ["Limpiar filtro de aire", "Limpiar serpentines evaporador y condensador", "Verificar carga de refrigerante", "Revisar conexiones eléctricas y capacitor", "Verificar termostato y selector", "Limpiar bandeja y drenaje de condensado", "Revisar sello y montaje en la ventana", "Verificar ruido y vibración"],
  "Central / compacto": ["Limpiar filtros de aire", "Limpiar serpentines evaporador y condensador", "Verificar carga de refrigerante y presiones", "Revisar correas y poleas del ventilador", "Revisar conexiones eléctricas, contactores y relés", "Medir voltaje y amperaje de motores", "Limpiar drenaje de condensado", "Verificar temperaturas de suministro y retorno", "Revisar ruido y vibración"],
  "Aire de precisión": ["Limpiar/reemplazar filtros", "Limpiar serpentines", "Verificar carga de refrigerante y presiones", "Verificar control de temperatura y humedad", "Probar alarmas y controles de seguridad", "Revisar conexiones eléctricas", "Verificar resistencias y humidificador", "Registrar temperaturas de operación"],
  "Cava / cuarto frío": ["Limpiar serpentín condensador", "Verificar escarcha y sistema de deshielo", "Revisar empacaduras y cierre de puertas", "Verificar temperatura interna vs. objetivo", "Verificar carga de refrigerante y presiones", "Revisar conexiones eléctricas y controles", "Limpiar drenaje", "Revisar ventiladores del evaporador"],
  "Chiller": ["Registrar temperaturas y presiones de operación", "Inspeccionar fugas de refrigerante", "Limpiar serpentines / intercambiadores", "Verificar nivel y calidad de aceite del compresor", "Revisar conexiones eléctricas, arrancadores y contactores", "Probar controles de operación y seguridad (presostatos, alarmas)", "Revisar bombas y caudal de agua", "Verificar ruido, vibración y alineación"],
  "Nevera / congelador": ["Limpiar serpentín condensador", "Revisar empacaduras de puertas", "Verificar temperatura interna", "Verificar sistema de deshielo", "Revisar conexiones eléctricas", "Limpiar drenaje"],
  "Bebedero": ["Limpiar condensador", "Verificar temperatura del agua", "Sanitizar y revisar filtros de agua", "Revisar conexiones eléctricas", "Verificar fugas de agua y de gas"],
  "Otro": ["Inspección general del equipo", "Limpieza de componentes", "Verificar carga de refrigerante", "Revisar conexiones eléctricas", "Probar operación y controles"],
};

const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10));
const hoy = () => new Date().toISOString().slice(0, 10);
const fmt = (n, d = 1) => (Number.isFinite(n) ? n.toLocaleString("es-VE", { maximumFractionDigits: d, minimumFractionDigits: 0 }) : "—");
const pct = (n) => (Number.isFinite(n) ? (n * 100).toFixed(1) + " %" : "—");
const diasEntre = (a, b) => Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
const gerenciaDe = (e) => (e.gerencia && e.gerencia.trim() ? e.gerencia.trim() : "Sin área asignada");

function estadoEquipo(e) {
  const dias = diasEntre(e.ultimoPrev, hoy());
  const uso = e.intervaloDias > 0 ? dias / e.intervaloDias : 0;
  if (uso >= 0.9) return { nivel: "danger", color: T.danger, etiqueta: "URGENTE", uso, dias };
  if (uso >= 0.75) return { nivel: "warn", color: T.warn, etiqueta: "PRÓXIMO", uso, dias };
  return { nivel: "ok", color: T.ok, etiqueta: "OK", uso, dias };
}

/* lectura de temperatura vs. rango objetivo del equipo */
function evaluarLectura(eq, valor) {
  const min = eq.tempMin === "" || eq.tempMin == null ? null : +eq.tempMin;
  const max = eq.tempMax === "" || eq.tempMax == null ? null : +eq.tempMax;
  if (min == null && max == null) return { estado: "sin rango", fuera: false };
  const fuera = (min != null && valor < min) || (max != null && valor > max);
  return { estado: fuera ? "FUERA DE RANGO" : "en rango", fuera };
}

function indicadoresEquipo(eq, atenciones, lecturas) {
  const VENTANA = 90;
  const desde = new Date(Date.now() - VENTANA * 86400000).toISOString().slice(0, 10);
  const fallas = atenciones.filter((a) => a.equipoId === eq.id && a.tipo === "correctiva");
  const fallas90 = fallas.filter((a) => a.fecha >= desde);
  const horasFuera90 = fallas90.reduce((s, a) => s + (+a.horasFuera || 0), 0);
  const disp90 = 1 - horasFuera90 / (VENTANA * 24);
  const mtfs = fallas.length ? fallas.reduce((s, a) => s + (+a.horasFuera || 0), 0) / fallas.length : null;
  const gasTotal = atenciones.filter((a) => a.equipoId === eq.id).reduce((s, a) => s + (+a.kgGas || 0), 0);
  const lecturasEq = lecturas.filter((l) => l.equipoId === eq.id);
  const ultLectura = lecturasEq.length ? lecturasEq[0] : null;
  return { totalFallas: fallas.length, fallas90: fallas90.length, horasFuera90, disp90, mtfs, gasTotal, ultLectura };
}

function colorDisp(d) {
  if (!Number.isFinite(d)) return T.inkSoft;
  if (d >= 0.97) return T.ok;
  if (d >= 0.9) return T.warn;
  return T.danger;
}

/* ---------- componentes base ---------- */
const Franja = ({ color }) => (
  <div aria-hidden="true" style={{ width: 10, alignSelf: "stretch", borderRadius: "6px 0 0 6px", flexShrink: 0, background: `repeating-linear-gradient(135deg, ${color}, ${color} 8px, ${T.ink} 8px, ${T.ink} 16px)` }} />
);

function Ayuda({ texto }) {
  const [abierta, setAbierta] = useState(false);
  const ultimo = useRef("mouse");
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setAbierta(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setAbierta(false); }}>
      <button
        onPointerDown={(e) => { ultimo.current = e.pointerType; }}
        onClick={(e) => { e.stopPropagation(); if (ultimo.current !== "mouse") setAbierta((v) => !v); }}
        aria-label="Ayuda"
        style={{ width: 18, height: 18, borderRadius: 9, border: `1.5px solid ${T.steel}`, background: abierta ? T.steel : "transparent", color: abierta ? "#fff" : T.steel, fontSize: 11, fontWeight: 700, lineHeight: "15px", cursor: "pointer", marginLeft: 5, padding: 0, verticalAlign: "middle", fontFamily: body }}>
        i
      </button>
      {abierta && (
        <span onClick={() => setAbierta(false)} style={{ position: "absolute", zIndex: 40, top: 22, left: -90, width: 240, background: T.ink, color: "#fff", padding: "10px 12px", borderRadius: 8, fontSize: 12, fontWeight: 400, lineHeight: 1.45, fontFamily: body, textTransform: "none", letterSpacing: "normal", boxShadow: "0 4px 14px rgba(0,0,0,0.3)", borderLeft: `4px solid ${T.orange}`, cursor: "pointer", display: "block", textAlign: "left" }}>
          {texto}
        </span>
      )}
    </span>
  );
}

const Field = ({ label, ayuda, children, ancho }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: ancho || 130 }}>
    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: T.inkSoft }}>
      {label}{ayuda && <Ayuda texto={ayuda} />}
    </span>
    {children}
  </label>
);

const inputStyle = { padding: "9px 10px", border: `1.5px solid ${T.line}`, borderRadius: 6, fontFamily: mono, fontSize: 14, color: T.ink, background: "#FAFBFC", outline: "none", width: "100%", boxSizing: "border-box" };
const btn = (bg, small) => ({ padding: small ? "6px 12px" : "10px 18px", background: bg, color: bg === T.orange || bg === T.warn ? "#141414" : "#fff", border: "none", borderRadius: 6, fontFamily: display, fontWeight: 600, fontSize: small ? 14 : 17, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer" });
const btnGhost = (color) => ({ padding: "6px 12px", background: "transparent", color, border: `1.5px solid ${color}`, borderRadius: 6, fontFamily: display, fontWeight: 600, fontSize: 14, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer" });
const h2Style = { fontFamily: display, fontSize: 22, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 10px", borderBottom: `3px solid ${T.orange}`, display: "inline-block", paddingBottom: 2 };
const Dato = ({ etiqueta, valor, color }) => (
  <div>
    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: T.inkSoft, fontFamily: body }}>{etiqueta}</div>
    <div style={{ fontWeight: 600, color: color || T.ink }}>{valor}</div>
  </div>
);
const CritBadge = ({ c }) => (
  <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 4, background: c === "A" ? "rgba(193,39,45,0.12)" : c === "B" ? "rgba(217,164,4,0.15)" : "rgba(84,104,122,0.12)", color: c === "A" ? T.danger : c === "B" ? "#9A7503" : T.inkSoft, border: `1px solid ${c === "A" ? T.danger : c === "B" ? T.warn : T.line}` }}>
    CRIT. {c}
  </span>
);

/* ============================================================ */

/* ---------- datos de ejemplo para la demostración ---------- */
function datosDeEjemplo() {
  const d = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
  const eq = (o) => ({ id: uid(), marcaModelo: "", capacidad: "", anio: "", tempMin: "", tempMax: "", ...o });
  const equipos = [
    eq({ nombre: "AA-SEDE-001", tipo: "Central / compacto", gerencia: "Edif. Administrativo Sede", ubicacion: "Piso 1 · ala norte", refrigerante: "R-410A", criticidad: "B", intervaloDias: 90, ultimoPrev: d(30), anio: "2018" }),
    eq({ nombre: "AA-SEDE-014", tipo: "Split", gerencia: "Edif. Administrativo Sede", ubicacion: "Piso 2 · oficina de planificación", refrigerante: "R-22", criticidad: "C", intervaloDias: 90, ultimoPrev: d(84), anio: "2009" }),
    eq({ nombre: "AA-SEDE-022", tipo: "Split", gerencia: "Edif. Administrativo Sede", ubicacion: "Piso 3 · sala de reuniones", refrigerante: "R-410A", criticidad: "C", intervaloDias: 90, ultimoPrev: d(55), anio: "2020" }),
    eq({ nombre: "AP-SE-01", tipo: "Aire de precisión", gerencia: "Sala Eléctrica Principal", ubicacion: "Sala de control", refrigerante: "R-407C", criticidad: "A", intervaloDias: 45, ultimoPrev: d(43), anio: "2016", tempMin: "18", tempMax: "24" }),
    eq({ nombre: "AP-SE-02", tipo: "Aire de precisión", gerencia: "Sala Eléctrica Principal", ubicacion: "Sala de servidores", refrigerante: "R-407C", criticidad: "A", intervaloDias: 45, ultimoPrev: d(12), anio: "2016", tempMin: "18", tempMax: "24" }),
    eq({ nombre: "CAVA-COM-01", tipo: "Cava / cuarto frío", gerencia: "Comedor Principal", ubicacion: "Cocina · cámara de carnes", refrigerante: "R-404A", criticidad: "A", intervaloDias: 60, ultimoPrev: d(20), anio: "2012", tempMin: "-2", tempMax: "4" }),
    eq({ nombre: "NEV-COM-03", tipo: "Nevera / congelador", gerencia: "Comedor Principal", ubicacion: "Cocina · lácteos", refrigerante: "R-134a", criticidad: "B", intervaloDias: 90, ultimoPrev: d(35), anio: "2019", tempMin: "2", tempMax: "6" }),
    eq({ nombre: "BEB-TC-05", tipo: "Bebedero", gerencia: "Taller Central", ubicacion: "Nave 2 · entrada", refrigerante: "R-134a", criticidad: "C", intervaloDias: 120, ultimoPrev: d(60), anio: "2021" }),
    eq({ nombre: "AA-TC-08", tipo: "Central / compacto", gerencia: "Taller Central", ubicacion: "Oficinas de supervisión", refrigerante: "R-410A", criticidad: "B", intervaloDias: 90, ultimoPrev: d(82), anio: "2014" }),
  ];
  const id = (n) => equipos.find((e) => e.nombre === n).id;
  const atenciones = [
    { id: uid(), equipoId: id("AA-SEDE-014"), tipo: "correctiva", fecha: d(9), causa: "Fuga de refrigerante", horasFuera: 30, kgGas: 1.4, tecnico: "J. Pérez", nota: "Fuga en conexión de válvula; se recargó gas", tareas: [] },
    { id: uid(), equipoId: id("AA-SEDE-014"), tipo: "correctiva", fecha: d(52), causa: "Fuga de refrigerante", horasFuera: 26, kgGas: 1.2, tecnico: "J. Pérez", nota: "Recarga; fuga no ubicada", tareas: [] },
    { id: uid(), equipoId: id("CAVA-COM-01"), tipo: "correctiva", fecha: d(15), causa: "Falla eléctrica / contactor", horasFuera: 7, kgGas: 0, tecnico: "M. Rodríguez", nota: "Contactor del compresor reemplazado", tareas: [] },
    { id: uid(), equipoId: id("AA-TC-08"), tipo: "correctiva", fecha: d(25), causa: "Serpentín sucio / obstrucción", horasFuera: 5, kgGas: 0, tecnico: "L. García", nota: "Limpieza profunda de serpentines", tareas: [] },
    { id: uid(), equipoId: id("AP-SE-02"), tipo: "preventiva", fecha: d(12), causa: "", horasFuera: 0, kgGas: 0.3, tecnico: "M. Rodríguez", nota: "", tareas: CHECKLISTS["Aire de precisión"].slice(0, 7) },
    { id: uid(), equipoId: id("CAVA-COM-01"), tipo: "preventiva", fecha: d(20), causa: "", horasFuera: 0, kgGas: 0, tecnico: "J. Pérez", nota: "", tareas: CHECKLISTS["Cava / cuarto frío"] },
  ];
  const lecturas = [
    { id: uid(), equipoId: id("CAVA-COM-01"), fecha: d(1), valor: 7.5, fuera: true, tecnico: "M. Rodríguez" },
    { id: uid(), equipoId: id("AP-SE-01"), fecha: d(2), valor: 21, fuera: false, tecnico: "M. Rodríguez" },
    { id: uid(), equipoId: id("NEV-COM-03"), fecha: d(3), valor: 4, fuera: false, tecnico: "J. Pérez" },
  ];
  return { equipos, atenciones, lecturas };
}

/* Inventario real: Programa de Mantenimiento 2026 (FERRO-5479), taller de Refrigeración. */
const INVENTARIO_FMO = [[1,"DESARROLLO ENDOGENO","OFIC.PLANIFICACIÓN Y CONTROL , 5 TR (1)","Otro","5 TR","8732406159207612400211",null,90,"2026-07-15","B"],[2,"DESARROLLO ENDOGENO","SALA DE FORMACIÓN SPLIT 5 TR","Split","5 TR","159216201061000146",null,90,"2026-07-15","B"],[3,"CENTRO CIVICO","OFIC. JTPSV SPLIT. 5 TR (3)","Split","5 TR","E5342439132X",null,90,"2026-07-15","B"],[4,"CENTRO CIVICO","OFIC. SECCIÓN RECREACIÓN SPLIT. 5TR (4)","Split","5 TR","501416088060900069",null,90,"2026-07-15","B"],[null,"CENTRO CIVICO","ATENCION AL CIUDADANO EQUIPO DE VENTANA KEYSTONE 18000 BTU","A/A ventana","18000 BTU",null,null,90,"2026-07-15","B"],[5,"CENTRO CIVICO","SALA ADMINISTRATIVO SPLIT. 36000 BTU (6)","Split","36000 BTU","158610088060900198",null,90,"2026-08-15","B"],[6,"CENTRO CIVICO","DPTO. RECREACIÓN/CULTURA SPLIT 36000 BTU (7)","Split","36000 BTU","158610088060900166",null,90,"2026-08-15","B"],[7,"CENTRO CIVICO","GCIA. CONTROL PROPIEDAD SPLIT 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","B"],[8,"ESCUELA DIEGO DE ORDAZ I","AULA 4. SECTOR 4. SPLIT 5 TR. (9)","Split","5 TR","5804K05926",null,90,"2026-07-15","B"],[null,"ESCUELA DIEGO DE ORDAZ I","SALON B EDUCACION INICIAL SPLITS HIUNDAY 5 TON","Split","5 TR",null,null,90,"2026-07-15","B"],[9,"ESCUELA DIEGO DE ORDAZ I","AULA 5. SECTOR 4. SPLIT 5 TR. (10)","Split","5 TR","5804K07704",null,90,"2026-07-15","B"],[10,"ESCUELA DIEGO DE ORDAZ I","AULA 6. SECTOR 4. SPLIT 5 TR. (11)","Split","5 TR","5804K07701",null,90,"2026-07-15","B"],[11,"ESCUELA DIEGO DE ORDAZ I","AULA 7. SECTOR 4. SPLIT 5 TR. (12)","Split","5 TR","5804K05927",null,90,"2026-08-15","B"],[12,"ESCUELA DIEGO DE ORDAZ I","AULA 8. SECTOR 4. SPLIT 5 TR. (13)","Split","5 TR","5804K05922",null,90,"2026-08-15","B"],[13,"ESCUELA DIEGO DE ORDAZ I","AULA 12. SECTOR 2. SPLIT 5 TR. (14)","Split","5 TR","10L38851H",null,90,"2026-08-15","B"],[14,"ESCUELA DIEGO DE ORDAZ I","AULA 12. SECTOR 2. SPLIT 5 TR. (15)","Split","5 TR","0027",null,90,"2026-06-15","B"],[15,"ESCUELA DIEGO DE ORDAZ I","AULA 13. SECTOR 2. SPLIT 5 TR. (16)","Split","5 TR","1603K19833",null,90,"2026-06-15","B"],[16,"ESCUELA DIEGO DE ORDAZ I","AULA 14. SECTOR 2.SPLIT 5 TR. (17)","Split","5 TR","1603K23575",null,90,"2026-06-15","B"],[17,"ESCUELA DIEGO DE ORDAZ I","AULA 15. SECTOR 2. SPLIT 5 TR. (18)","Split","5 TR","5804K07703",null,90,"2026-06-15","B"],[18,"ESCUELA DIEGO DE ORDAZ I","BIBLIOTECA SPLIT 5 TR. (19)","Split","5 TR","5804H36061",null,90,"2026-07-15","B"],[19,"ESCUELA DIEGO DE ORDAZ I","BIBLIOTECA SPLIT 5 TR. (20)","Split","5 TR","5804J33605",null,90,"2026-07-15","B"],[20,"ESCUELA DIEGO DE ORDAZ I","DIRECCION SPLIT 12000 BTU (21)","Split","12000 BTU",null,null,90,"2026-07-15","B"],[21,"ESCUELA DIEGO DE ORDAZ I","DIRECCION SPLIT 18000 BTU (22)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[22,"ESCUELA DIEGO DE ORDAZ I","DIRECCION A/A VENTANA 36000 BTU (23)","A/A ventana","36000 BTU",null,null,90,"2026-08-15","B"],[23,"ESCUELA DIEGO DE ORDAZ I","SALA DE MANUALIDADES SPLIT DE 5 TR FMO 4162089 (24)","Split","5 TR",null,"4162089",90,"2026-08-15","B"],[24,"ESCUELA DIEGO DE ORDAZ I","OFIC. DE DEPORTE SPLIT 18000 BTU (25)","Split","18000 BTU","340F203440222100830378",null,90,"2026-08-15","B"],[25,"ESCUELA DIEGO DE ORDAZ I","DEFENSORIA ESTUDIANTIL SPLIT 12000 BTU (26)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[26,"ESCUELA DIEGO DE ORDAZ I","SALA DE INFORMATICA. SPLIT 5 TR. FMO/4162551 (27)","Split","5 TR",null,null,90,"2026-07-15","B"],[27,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 3. SPLIT. 5 TR. (28)","Split","5 TR","WUJM016604",null,90,"2026-07-15","B"],[28,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 2. SPLIT. 5 TR. FMO/416-2389 (29)","Split","5 TR",null,null,90,"2026-07-15","B"],[29,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 1. SPLIT. 5 TR. (30)","Split","5 TR","WAKM001140",null,90,"2026-07-15","B"],[30,"ESCUELA DIEGO DE ORDAZ I","PREESCOLAR. SPLIT. 3 TR (31)","Split","3 TR",null,null,90,"2026-08-15","B"],[31,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 10. SPLIT. 5 TR. FMO/4162466 (32)","Split","5 TR",null,null,90,"2026-08-15","B"],[32,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 11. SPLIT. 5 TR. FMO/4162464 (33)","Split","5 TR",null,null,90,"2026-08-15","B"],[33,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 15. SPLIT. 5 TR. (34)","Split","5 TR","20021501-8612",null,90,"2026-06-15","B"],[34,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 15. SPLIT. 5 TR. (35)","Split","5 TR","2002200233429",null,90,"2026-06-15","B"],[35,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 16. SPLIT.12 BTU. (36)","Split","","22002200254060029",null,90,"2026-06-15","B"],[36,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 16. SPLIT. 5 TR. (37)","Split","5 TR","0029",null,90,"2026-07-15","B"],[37,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 17. SPLIT. 5 TR. (38)","Split","5 TR","0030",null,90,"2026-07-15","B"],[38,"ESCUELA DIEGO DE ORDAZ I","AULA Nº 17. SPLIT. 5 TR. (39)","Split","5 TR","0031",null,90,"2026-07-15","B"],[39,"ESCUELA DIEGO DE ORDAZ I","OFIC. COORDINACION GENERALES SPLIT 24000BTU (40)","Split","24000 BTU",null,null,90,"2026-07-15","B"],[40,"ESCUELA DIEGO DE ORDAZ I","OFIC. COORDINACION GENERALES SPLIT 24000BTU (41)","Split","24000 BTU",null,null,90,"2026-07-15","B"],[41,"ESCUELA DIEGO DE ORDAZ I","OFIC. COORDINACION GENERALES VENTANA 12000 BTU (42)","A/A ventana","12000 BTU",null,null,90,"2026-07-15","B"],[42,"ESCUELA DIEGO DE ORDAZ I","COORDINACIÓN SPLIT. 5 TR. (43)","Split","5 TR","JR107588547",null,90,"2026-07-15","B"],[43,"ESCUELA DIEGO DE ORDAZ I","OFIC. ADMON DE ESCUELAS. SPLIT. 5 TR. FMO/4162511 (44)","Split","5 TR",null,null,90,"2026-07-15","B"],[44,"ESCUELA DIEGO DE ORDAZ I","SERVICIOS EDUCATIVOS SPLIT. 18000 BTU. FMO/4162525 (45)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[45,"ESTADIO","PROTECCION VIAL SPLITS 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","B"],[46,"ESTADIO","PROTECCION VIAL SPLITS 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","B"],[47,"ESTADIO","JEFATURA DE DEPORTES SPLITS 5 TON (1)","Split","5 TR","340F129690222200150031",null,90,"2026-08-15","B"],[48,"ESTADIO","DEFENSORIA ESTUDIANTIL A/A VENTANA 18000BTU FMO/1203791(144)","A/A ventana","18000 BTU",null,null,90,"2026-08-15","B"],[49,"ESTADIO","SALA DE PRENSA SPLITS 5 TON","Split","5 TR","340F1296902222201500001",null,90,"2026-08-15","B"],[50,"ESTADIO","PACO DE NARRADOR ESTADIO SPLITS 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","B"],[51,"ESTADIO","SALA VIP SPLITS 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","B"],[52,"ESTADIO","EQUIPO DE SALA ARTES MARCIALES 5 TON","Otro","5 TR",null,null,90,"2026-08-15","B"],[53,"ESTADIO","RECEPCION SALA VIP SPLITS 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","B"],[54,"ESCUELA PALUA","DIRECCION EQUIPO SPLITS DE 5 TON","Split","5 TR","540J15226013317170160654",null,120,"2026-05-15","B"],[55,"ESCUELA PALUA","DEPOSITO AL LADO DE DIRECCION EQUIPO DE VENTANA 24000 BTU","A/A ventana","24000 BTU",null,null,120,"2026-05-15","B"],[56,"ESCUELA PALUA","AULA Nº 1. SPLIT. 5 TR. FMO/1203580 (52)","Split","5 TR",null,null,90,"2026-07-15","B"],[57,"ESCUELA PALUA","AULA Nº 1. SPLIT. 5 TR. (53)","Split","5 TR","WCKMO16186",null,90,"2026-07-15","B"],[58,"ESCUELA PALUA","AULA Nº 2. SPLIT. 5 TR. HIUNDAY","Split","5 TR",null,null,120,"2026-05-15","B"],[59,"ESCUELA PALUA","AULA Nº 3. SPLIT. 5 TR HIUNDAY","Split","5 TR",null,null,120,"2026-05-15","B"],[60,"ESCUELA PALUA","AULA Nº4. SPLIT. 5 TR. FMO HIUNDAY","Split","5 TR",null,null,120,"2026-05-15","B"],[61,"ESCUELA PALUA","AULA Nº5. SPLIT. 5 TR. FMO HIUNDAY","Split","5 TR",null,null,120,"2026-05-15","B"],[62,"ESCUELA PALUA","AULA Nº 6. SPLIT. 5 TR. HIUNDAY","Split","5 TR",null,null,120,"2026-05-15","B"],[63,"ESCUELA PALUA","AULA Nº 7 PREESCOLOR SPLIT. 5 TR. FMO/ 1203518 (59)","Split","5 TR",null,null,90,"2026-08-15","B"],[64,"ESCUELA PALUA","AULA Nº 7 A/A VENTANA 36000BTU (60)","A/A ventana","36000 BTU",null,null,90,"2026-08-15","B"],[65,"ESCUELA PALUA","AULA Nº 8. SPLIT. 5 TR.HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[66,"ESCUELA PALUA","AULA Nº 9. SPLIT. 5 TR. HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[67,"ESCUELA PALUA","AULA Nº 10. SPLIT. 5 TR. HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[68,"ESCUELA PALUA","AULA Nº 11. SPLIT. 5 TR HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[69,"ESCUELA PALUA","AULA Nº 12. SPLIT. 5 TR. HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[70,"ESCUELA PALUA","AULA Nº 13. SPLIT. 5 TR. HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[71,"ESCUELA PALUA","AULA Nº 14. SPLIT. 5 TR. HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[72,"ESCUELA PALUA","AULA Nº 15. SPLIT. 5 TR. HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[73,"ESCUELA PALUA","AULA Nº 16. SPLIT. 5 TR. FMO HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[74,"ESCUELA PALUA","AULA Nº 17. SPLIT. 5 TR. FMO HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[75,"ESCUELA PALUA","BIBLIOTECA Nº 19. SPLIT 5 TON HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[76,"ESCUELA PALUA","AULA Nº 20. SPLITS DE 5 TON HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[77,"ESCUELA PALUA","AULA Nº 21. SPLITS DE 5 TON HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[78,"ESCUELA PALUA","AULA Nº 22. SPLITS DE 5 TON HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[79,"ESCUELA PALUA","AULA Nº 23.SPLITS DE 5 TON HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[80,"ESCUELA PALUA","AULA Nº 24. SPLITS DE 5 TON HIUNDAY","Split","5 TR",null,null,120,"2026-06-15","B"],[81,"ESCUELA PALUA","AULA Nº 1. SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[82,"ESCUELA PALUA","AULA Nº 2. SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[83,"ESCUELA PALUA","AULA Nº 3. SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[84,"ESCUELA PALUA","AULA Nº 4. SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[85,"ESCUELA PALUA","AULA Nº 5 SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[86,"ESCUELA PALUA","AULA Nº 6. SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[87,"ESCUELA PALUA","AULA Nº 7 SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[88,"ESCUELA PALUA","AULA Nº 8 SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[89,"ESCUELA PALUA","AULA Nº 9 SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[90,"ESCUELA PALUA","AULA Nº 10 SPLIT HIUNDAY DE 24000BTU ANEXO","Split","24000 BTU",null,null,120,"2026-06-15","B"],[91,"ESCUELA PALUA","AULA INTEGRALT HIUNDAY DE 24000BTU ANEXO","Otro","24000 BTU",null,null,120,"2026-06-15","B"],[92,"ESCUELA PALUA","COORDINACION ANEXO. SPLIT HIUNDAY DE 18000BTU ANEXO","Split","18000 BTU",null,null,120,"2026-06-15","B"],[93,"CLINICA PALÚA","CONSULTORIO DE PEDIATRIA #2, SPLIT 18000BTU (99)","Split","18000 BTU",null,null,90,"2026-06-15","A"],[94,"CLINICA PALÚA","OBSERVACION DE NIÑOS, SPLIT 18000BTU (101)","Split","18000 BTU",null,null,90,"2026-06-15","A"],[95,"CLINICA PALÚA","LABORATORIO SPLIT 18000 BTU (102)","Split","18000 BTU",null,null,90,"2026-06-15","A"],[96,"CLINICA PALÚA","SALA DE EMERGENCIA SPLIT 24000 BTU. (103)","Split","24000 BTU",null,null,90,"2026-06-15","A"],[97,"CLINICA PALÚA","CONSULTORIO RESIDENTE, SPLIT 18000BTU (104)","Split","18000 BTU",null,null,90,"2026-06-15","A"],[98,"CLINICA PALÚA","CONSULTORIO GINECOLOGIA, SPLIT 12000BTU (105)","Split","12000 BTU",null,null,90,"2026-06-15","A"],[99,"CLINICA PALÚA","MEDICINA INTERNA, SPLIT 12000BTU (106)","Split","12000 BTU",null,null,90,"2026-06-15","A"],[100,"CLINICA PALÚA","CONSULTORIO DE ODODNTOLOGIA, SPLIT 18000BTU(107)","Split","18000 BTU",null,null,90,"2026-06-15","A"],[101,"CLINICA PALÚA","DIRECCION DEL DISPENSARIO, SPLIT 18000BTU (108)","Split","18000 BTU",null,null,90,"2026-06-15","A"],[102,"CLINICA PALÚA","MEDICINA FAMILIAR SPLIT 18000BTU. (109)","Split","18000 BTU",null,null,90,"2026-06-15","A"],[103,"CLINICA PALÚA","SALA DE USOS MULTIPLES, 5TON CARRIER (110)","Otro","5 TR",null,null,90,"2026-06-15","A"],[104,"CLINICA PALÚA","OBSERVACION DE HOMBRES, SPLIT 24000BTU (111)","Split","24000 BTU",null,null,90,"2026-06-15","A"],[105,"CLINICA PALÚA","OBSERVACION DE MUJERES, SPLIT 24000BTU (112)","Split","24000 BTU",null,null,90,"2026-06-15","A"],[106,"CLINICA PALÚA","CASETA DE PALUA VIGILANCIA, SPLITS HIUNDAY 18000 BTU","Split","18000 BTU",null,null,90,"2026-06-15","A"],[107,"ADMINISTRATIVO II","GESTIÓN BANCARIA A/A 5 TR. (114)","Otro","5 TR","360SE20778",null,120,"2026-05-15","B"],[108,"ADMINISTRATIVO II","AIRE CENTRAL CHILLER. A/A 110 TR. (117)","Central / compacto","110 TR","3006Q81057",null,120,"2026-05-15","B"],[109,"ADMINISTRATIVO II","UMA ADMINISTRATIVO II (1) 30 TR (118)","Otro","30 TR","WOH6817707",null,120,"2026-05-15","B"],[110,"ADMINISTRATIVO II","UMA ADMINISTRATIVO II (2) 50 TR. (119)","Otro","50 TR",null,null,120,"2026-05-15","B"],[111,"ADMINISTRATIVO II","CONSULTORIA JURIDICA OFICINA GERENTE SONEVIEW SPLITS DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-05-15","B"],[112,"ADMINISTRATIVO II","ASUNTOS LEGALES CONDESA FAN COIL DE 5 TON","Otro","5 TR",null,null,120,"2026-05-15","B"],[113,"ADMINISTRATIVO II","SERVICIOS LEGALES CONDESA FAN COIL DE 5 TON","Otro","5 TR",null,null,120,"2026-05-15","B"],[114,"ADMINISTRATIVO II","JEFATURA DE INSTITUCIONALES DAMASCO FAN COIL DE 5 TON","Otro","5 TR",null,null,120,"2026-05-15","B"],[115,"ADMINISTRATIVO II","GERENCIA DE INSTITUCIONALES GCHV FAN COIL DE 3 TON","Otro","3 TR",null,null,120,"2026-05-15","B"],[116,"ADMINISTRATIVO II","LABORALES PLANTA BAJA DAMASCO FAN COIL DE 5 TON","Otro","5 TR",null,null,120,"2026-05-15","B"],[117,"ADMINISTRATIVO II","SERVICIOS AL PERSONAL CONDESA FAN COIL DE 5 TON","Otro","5 TR",null,null,120,"2026-05-15","B"],[118,"ADMINISTRATIVO II","NOMINA SPLITS 5 TON (1)","Split","5 TR",null,null,120,"2026-05-15","B"],[119,"ADMINISTRATIVO II","NOMINA SPLITS HIUNDAY 5 TON (2)","Split","5 TR",null,null,120,"2026-05-15","B"],[120,"ADMINISTRATIVO II","JAFATURA DE COMUNICACIÓN SOCIAL HIUNDAY SPLITS DE 5 TON","Split","5 TR",null,null,120,"2026-05-15","B"],[121,"ADMINISTRATIVO II","CONSULTORIA JURIDICA SPLIT DE 5 TR. (124)","Split","5 TR",null,null,120,"2026-05-15","B"],[122,"MARIO LEZAMA ESQUIVEL","DEPOSITO MATERIAL A/A VENTANA 36000BTU. FMO/4162488 (125)","A/A ventana","36000 BTU",null,null,120,"2026-08-15","B"],[123,"MARIO LEZAMA ESQUIVEL","BIBLIOTECA SPLIT. 5 TR FMO/4162566 (126)","Split","5 TR",null,null,120,"2026-08-15","B"],[124,"MARIO LEZAMA ESQUIVEL","AULA Nº 1. NORVAIR SPLIT 5 TON","Split","5 TR",null,null,120,"2026-08-15","B"],[125,"MARIO LEZAMA ESQUIVEL","AULA Nº 2. NORVAIR SPLIT 5 TON","Split","5 TR",null,null,120,"2026-08-15","B"],[126,"MARIO LEZAMA ESQUIVEL","AULA Nº 3. NORVAIR SPLIT 5 TON","Split","5 TR",null,null,120,"2026-08-15","B"],[127,"MARIO LEZAMA ESQUIVEL","AULA Nº 4. NORVAIR SPLIT 5 TON","Split","5 TR",null,null,120,"2026-08-15","B"],[128,"MARIO LEZAMA ESQUIVEL","AULA Nº 7 (BIOLOGIA) SPLIT 5 TR. FMO/4162391 (128)","Split","5 TR",null,null,120,"2026-08-15","B"],[129,"MARIO LEZAMA ESQUIVEL","AULA Nº 6 (CIENCIAS) A/A VENTANA3 TONELADAS (129)","A/A ventana","3 TR","900647022184",null,120,"2026-08-15","B"],[130,"MARIO LEZAMA ESQUIVEL","AULA Nº 8. SPLIT 5 TR. (149)","Split","5 TR",null,null,120,"2026-08-15","B"],[131,"MARIO LEZAMA ESQUIVEL","AULA Nº 8 5 TR. (131)","Otro","5 TR",null,null,120,"2026-08-15","B"],[132,"MARIO LEZAMA ESQUIVEL","AULA Nº 9 SPLIT 5 TR. FMO/4162548 (132)","Split","5 TR",null,null,120,"2026-07-15","B"],[133,"MARIO LEZAMA ESQUIVEL","AULA Nº 11 SPLIT 5 TR. FMO/4162571 (133)","Split","5 TR",null,null,120,"2026-07-15","B"],[134,"MARIO LEZAMA ESQUIVEL","AULA Nº 14 SPLIT HIUNDAY DE 5TON","Split","5 TR",null,null,120,"2026-05-15","B"],[135,"MARIO LEZAMA ESQUIVEL","AULA Nº 15 SPLIT HIUNDAY DE 5TON","Split","5 TR",null,null,120,"2026-05-15","B"],[136,"MARIO LEZAMA ESQUIVEL","AULA Nº 16 SPLIT HIUNDAY DE 5TON","Split","5 TR",null,null,120,"2026-05-15","B"],[137,"MARIO LEZAMA ESQUIVEL","AULA Nº 17 SPLIT HIUNDAY DE 5TON","Split","5 TR",null,null,120,"2026-05-15","B"],[138,"MARIO LEZAMA ESQUIVEL","AULA Nº 18 SPLIT HIUNDAY DE 5TON","Split","5 TR",null,null,120,"2026-05-15","B"],[139,"MARIO LEZAMA ESQUIVEL","AULA Nº 23 SPLIT HIUNDAY DE 5TON","Split","5 TR",null,null,120,"2026-05-15","B"],[140,"MARIO LEZAMA ESQUIVEL","AULA Nº 24 SPLIT HIUNDAY DE 5TON","Split","5 TR",null,null,120,"2026-05-15","B"],[141,"MARIO LEZAMA ESQUIVEL","AULA Nº25 A/A COMPACTO 5 TR FMO/416995 (137)","Central / compacto","5 TR",null,null,120,"2026-06-15","B"],[142,"MARIO LEZAMA ESQUIVEL","OFIC. EVALUACIÓN SPLIT. 36000 BTU FMO/1205021(138)","Split","36000 BTU",null,null,120,"2026-06-15","B"],[143,"MARIO LEZAMA ESQUIVEL","AULA Nº 19 SPLIT. 5 TR FMO/1203748 (141)","Split","5 TR",null,null,120,"2026-06-15","B"],[144,"MARIO LEZAMA ESQUIVEL","DIRECCIÓN SPLIT. 5 TR. FMO/1203921(142)","Split","5 TR",null,null,120,"2026-06-15","B"],[145,"MARIO LEZAMA ESQUIVEL","OFIC. DIRECTORA A/A VENTANA. 24000BTU FMO/4162376 (143)","A/A ventana","24000 BTU",null,null,120,"2026-06-15","B"],[146,"MARIO LEZAMA ESQUIVEL","DEFENSORIA ESTUDIANTIL A/A VENTANA 18000BTU FMO/1203791(144)","A/A ventana","18000 BTU",null,null,120,"2026-06-15","B"],[147,"ADMINISTRATIVO III","CULTURA (SALA ALTERNA) SPLIT 5 TR (145)","Split","5 TR","C101258221110A18130083",null,120,"2026-07-15","B"],[148,"ADMINISTRATIVO III","DPTO. PROYECTO. 5 TR. (147)","Otro","5 TR","159216201061000052",null,120,"2026-07-15","B"],[149,"ADMINISTRATIVO III","OFIC. SOCIAL COMUNITARIA SPLIT. 5 TR. (148)","Split","5 TR","159216201061000067",null,120,"2026-07-15","B"],[150,"ADMINISTRATIVO III","PLANIFICACION SPLIT. 5 TR (149)","Split","5 TR","159216202061000022",null,120,"2026-07-15","B"],[151,"ADMINISTRATIVO III","BIENES INMUEBLES SPLIT 3 TON. (151)","Split","3 TR","158610088060900172",null,120,"2026-08-15","B"],[152,"ADMINISTRATIVO III","OFIC. ATENCION AL PUBLICO SPLIT. 24000BTU (153)","Split","24000 BTU","900345044537",null,120,"2026-08-15","B"],[154,"GERENCIA DE CALIDAD","GERENCIA DE CALIDAD HIUNDAY DE 3 TON PASILLO","Otro","3 TR",null,null,90,"2026-07-15","B"],[155,"GERENCIA DE CALIDAD","OFICINA DE GERENTE SPLIT SIRAGON DE 24000 BTU","Split","24000 BTU",null,null,90,"2026-07-15","B"],[156,"GERENCIA DE CALIDAD","GERECNIA DE CALIDAD OFICINAS HIUNDAY DE 3 TON","Otro","3 TR",null,null,90,"2026-07-15","B"],[157,"GERENCIA DE CALIDAD","CUARTO DE BALANZA A/A VENTANA 18000 BTU FMO/4162604 (163)","A/A ventana","18000 BTU",null,null,90,"2026-07-15","B"],[158,"HOSPITAL AMERICO BABO","ODONTOLOGIA I SPLIT 18000 BTU Y ODONTOLOGÍA II SPLIT 24000BTU FMO/1204126 (165)","Split","18000 BTU",null,null,90,"2026-07-15","A"],[159,"HOSPITAL AMERICO BABO","CONSULTORIO 5. 1 SPLIT DE 12000 BTU.-(166)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[160,"HOSPITAL AMERICO BABO","CONSULTORIO 4. SPLIT DE 12000 BTU (167)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[161,"HOSPITAL AMERICO BABO","AREA DE PARTO HUMANIZADO 4 SPLIT DE 24 BTU Y 1 SPLIT 12 BTU (168)","Split","",null,null,90,"2026-07-15","A"],[162,"HOSPITAL AMERICO BABO","CONSULTORIO URL I SPLIT DE 12000 BTU (206) (169)","Split","12000 BTU",null,null,90,"2026-08-15","A"],[163,"HOSPITAL AMERICO BABO","CONSULTORIO DE GINECOLOGIA SPLIT 24000BTU FMO/1203340 A/A VENTANA 24000BTU FMO/1203331 (170)","A/A ventana","24000 BTU",null,null,90,"2026-08-15","A"],[164,"HOSPITAL AMERICO BABO","SALA DE ESPERA GINECOLOGIA SPLIT D 24000 BTU FMO/1203537 (171)","Split","24000 BTU",null,null,90,"2026-08-15","A"],[165,"HOSPITAL AMERICO BABO","CONSULTORIO 9. ( MEDICINA INTERNA.) 1- SPLLIT DE 12000 BTU Y SPLIT DE 18000 BTU (172)","Split","12000 BTU",null,null,90,"2026-08-15","A"],[166,"HOSPITAL AMERICO BABO","RECEPCION HOSPITAL SPLIT 5 TN. FMO/1203827 (173)","Split","",null,null,90,"2026-08-15","A"],[167,"HOSPITAL AMERICO BABO","COCINA SPLIT 5 TN CARRYER (174)","Split","",null,null,90,"2026-08-15","A"],[168,"HOSPITAL AMERICO BABO","CENTRAL DE SUMINISTROS SPLIT DE 24000 BTU (176)","Split","24000 BTU",null,null,90,"2026-07-15","A"],[169,"HOSPITAL AMERICO BABO","COMEDOR SPLIT 5 TR (178)","Split","5 TR","C703038070709218800160",null,90,"2026-06-15","A"],[170,"HOSPITAL AMERICO BABO","CONSULTORIO 16 ( NECROLOGIA) 1- SPLIT DE 12000 BTU. (181)","Split","12000 BTU",null,null,90,"2026-06-15","A"],[171,"HOSPITAL AMERICO BABO","CONSULTORIO PEDIATRIA SPLIT 18000BTU (182)","Split","18000 BTU","400450824B510459",null,90,"2026-06-15","A"],[172,"HOSPITAL AMERICO BABO","AREA DE RETEN SPLIT 12000 BTU (183)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[173,"HOSPITAL AMERICO BABO","OFICINA DEL JEFE DE ADMINISTRACION SPLIT DE 12000 BTU (184)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[174,"HOSPITAL AMERICO BABO","CONSULTORIO DE VACUNACION 1 SPLIT 12000 BTU (185)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[175,"HOSPITAL AMERICO BABO","FARMACIA SPLIT 5 TON. TIPO CARRIER (186)","Split","5 TR",null,null,90,"2026-07-15","A"],[176,"HOSPITAL AMERICO BABO","CONSULTORIO NEUFROLOGO SPLIT 18000 BTU (188)","Split","18000 BTU",null,null,90,"2026-07-15","A"],[177,"HOSPITAL AMERICO BABO","CONSULTORIO DEL GASTROENTEROLOGO SPLIT 18000 BTU (189)","Split","18000 BTU",null,null,90,"2026-07-15","A"],[178,"HOSPITAL AMERICO BABO","CONSULTORIO DERMATOLOGIA SPLIT 18000 BTU (190)","Split","18000 BTU",null,null,90,"2026-07-15","A"],[179,"HOSPITAL AMERICO BABO","CONSULTORIO UROLOGIA SPLIT 12000 BTU (191)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[180,"HOSPITAL AMERICO BABO","CONSULTORIO DE MEDICINA GENERAL SPLIT 18000 BTU (192)","Split","18000 BTU",null,null,90,"2026-07-15","A"],[181,"HOSPITAL AMERICO BABO","CONSULTORIO DE CARDIOLOGIA SPLIT 12000 BTU (193)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[182,"HOSPITAL AMERICO BABO","CONSULTORIO DE TRAUMATOLIGIA SPLIT 12000BTU (194)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[183,"HOSPITAL AMERICO BABO","CONSULTORIO MEDICINA OOCUPACIONAL SPLIT 18000 BTU (196)","Split","18000 BTU",null,null,90,"2026-07-15","A"],[184,"HOSPITAL AMERICO BABO","ARCHIVO HISTORIAS MEDICAS SPLIT 24000 BTU (197)","Split","24000 BTU",null,null,90,"2026-07-15","A"],[185,"HOSPITAL AMERICO BABO","CONSULTORIO DE CIRUJIA SPLIT 12000 BTU (198)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[186,"HOSPITAL AMERICO BABO","SALA DE PEDRIATIA SPLIT DE 24000 BTU (199)","Split","24000 BTU",null,null,90,"2026-07-15","A"],[187,"HOSPITAL AMERICO BABO","JEFE DE ENFERMERA 12000 BTU NUEVO (200)","Otro","12000 BTU",null,null,90,"2026-07-15","A"],[188,"HOSPITAL AMERICO BABO","SALA DE QUIMIOTERAPIA 12000BTU (201)","Otro","12000 BTU",null,null,90,"2026-07-15","A"],[189,"HOSPITAL AMERICO BABO","SALA DE QUIROFANO 5TON TIPO CARRIER (202)","Otro","5 TR",null,null,90,"2026-07-15","A"],[190,"HOSPITAL AMERICO BABO","RECEPCION DE CITAS MEDICAS EQUIPO BM SPLITS DE 18000 BTU","Split","18000 BTU","540H40116012B280830804",null,120,"2026-05-15","A"],[191,"HOSPITAL AMERICO BABO","RAYOS X EQUIPO HIUNDAY SPLITS DE 5 TON","Split","5 TR",null,null,120,"2026-05-15","A"],[192,"HOSPITAL AMERICO BABO","SALA DE STAR DE ENFERMERIA EQUIPO HIUNDAY SPLITS DE 12000 BTU","Split","12000 BTU",null,null,120,"2026-05-15","A"],[193,"HOSPITAL AMERICO BABO","SALA DE QUIMIOTERAPIA EQUIPO DE 5 TON HIUNDAY","Otro","5 TR",null,null,120,"2026-05-15","A"],[194,"HOSPITAL AMERICO BABO","QUIMIOTERAPIA SALA DE ESPERA EQUIPO HIUNDAY SPLITS DE 18000 BTU","Split","18000 BTU",null,null,120,"2026-05-15","A"],[195,"HOSPITAL AMERICO BABO","BANCO DE SANGRE 1 EQUIPO HIUNDAY SPLITS DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-05-15","A"],[196,"HOSPITAL AMERICO BABO","BANCO DE SANGRE EQYUIPO HIUNDAY SPLITS DE 12000 BTU","Split","12000 BTU",null,null,120,"2026-05-15","A"],[197,"HOSPITAL AMERICO BABO","EMERGENCIA EQUIPO SPLITS HIUNDAY DE 5 TON","Split","5 TR",null,null,120,"2026-05-15","A"],[198,"HOSPITAL AMERICO BABO","ADMINISTRACION DEL HOPSITAL, EQUIPO DE 5 TON TIPO GABINETE","Otro","5 TR",null,null,120,"2026-05-15","A"],[199,"HOSPITAL AMERICO BABO","PASILLO DE CONSULTA 1 EQUIPO DE 5 TON HIUNDAY","Otro","5 TR",null,null,120,"2026-05-15","A"],[200,"HOSPITAL AMERICO BABO","PASILLOS DE RECEPCION EQUIPO DE 5 TON MILLER","Otro","5 TR",null,null,120,"2026-05-15","A"],[201,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 1 SPLIT 12000 BTU","Split","12000 BTU",null,null,120,"2026-05-15","A"],[202,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 2 SPLIT 12000 BTU","Split","12000 BTU",null,null,120,"2026-05-15","A"],[203,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 3 SPLIT 12000 BTU (203)","Split","12000 BTU",null,null,120,"2026-05-15","A"],[204,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 4 THL EQ","Otro","",null,null,90,"2026-08-15","A"],[205,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 5 SPLIT 24000 BTU","Split","24000 BTU",null,null,90,"2026-08-15","A"],[206,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 6 CHIGO SPLIT 12000 BTU","Split","12000 BTU",null,null,90,"2026-08-15","A"],[207,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 7 CHIGO SPLIT 12000 BTU","Split","12000 BTU",null,null,90,"2026-08-15","A"],[208,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 8 CHIGO SPLIT 24000 BTU","Split","24000 BTU",null,null,90,"2026-08-15","A"],[209,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 9 CHIGO SPLIT 24000 BTU","Split","24000 BTU",null,null,90,"2026-08-15","A"],[210,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 10 CHIGO SPLIT 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","A"],[211,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 11 CHIGO SPLIT 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","A"],[212,"HOSPITAL AMERICO BABO","HOSPITALIZACION HABITACION N.º 5 SPLIT 24000 BTU","Split","24000 BTU",null,null,90,"2026-08-15","A"],[213,"HOSPITAL AMERICO BABO","CASETA DE VIGILANCIA ENTRADA HOSPITAL SPLITS SONEVIEW 12000 BTU","Split","12000 BTU",null,null,90,"2026-07-15","A"],[214,"HOSPITAL AMERICO BABO","ARCHIVO DE RAYOS X, SPLIT 12000 BTU. (205)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[215,"HOSPITAL AMERICO BABO","GERENCIA DEL HOSPITAL, SPLIT 24000BTU (206)","Split","24000 BTU",null,null,90,"2026-07-15","A"],[216,"HOSPITAL AMERICO BABO","CONSULTORIO DE MEDICINA INTERNA. SPLIT 12000BTU (207)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[217,"HOSPITAL AMERICO BABO","CONSULTORIO 8, SIQUIATRIA, SPLIT 12000BTU (208)","Split","12000 BTU",null,null,90,"2026-07-15","A"],[218,"CASONA","CASETA DE VIGILANCIA SPLIT 24000 BTU (209)","Split","24000 BTU",null,null,90,"2026-08-15","B"],[219,"CASONA","SALA PRINCIPAL SPLIT 5 TR VM08041570 (210)","Split","5 TR",null,null,90,"2026-08-15","B"],[220,"CASONA","SALA PRINCIPAL SPLIT 5 TR VM080550036 (211)","Split","5 TR",null,null,90,"2026-08-15","B"],[221,"CASONA","SWITH DOBLE SPLIT 24000 BTU (212)","Split","24000 BTU","C101219911510602130197",null,90,"2026-08-15","B"],[222,"CASONA","SWITH DEL MINISTRO SPLIT 24000 BTU C101219911510602130258 (213)","Split","24000 BTU",null,null,90,"2026-08-15","B"],[223,"CASONA","SALA DEL MINISTRO SPLIT 18000BTU (214)","Split","18000 BTU","C101219911210609150048",null,90,"2026-06-15","B"],[224,"CASONA","SALA DE CONFERENCIA SPLIT 24000BTU (215)","Split","24000 BTU","042663336050800109",null,90,"2026-06-15","B"],[225,"CASONA","DEPOSITO SPLIT 18000BTU (216)","Split","18000 BTU","0026",null,90,"2026-06-15","B"],[226,"CASONA","HAB. AMA DE LLAVES SPLIT 18000BTU C101219911210609150031(217)","Split","18000 BTU",null,null,90,"2026-06-15","B"],[227,"CASONA","HAB. (1) 24000BTU (218)","Otro","24000 BTU","011TANS00527",null,90,"2026-06-15","B"],[228,"CASONA","HAB. (3) 24000 BTU (219)","Otro","24000 BTU","C101219911510602130052",null,90,"2026-07-15","B"],[229,"CASONA","HAB. (4) 24000 BTU (220)","Otro","24000 BTU","C101219911510602130144",null,90,"2026-07-15","B"],[230,"CASONA","HAB. (5) 24000 BTU (221)","Otro","24000 BTU","C101219911510602130078",null,90,"2026-07-15","B"],[231,"CASONA","HAB. (6) 24000 BTU (222)","Otro","24000 BTU","011TAHQ00681",null,90,"2026-07-15","B"],[232,"CASONA","EQUIPO COMPACTO COCINA DE 5 TON","Central / compacto","5 TR",null,null,90,"2026-07-15","B"],[233,"CASONA","HAB. (7) 24000 BTU (223)","Otro","24000 BTU","C101219911510602130259",null,90,"2026-07-15","B"],[234,"CASONA","CASETA VIGILANCIA SPLIT 12000 BTU (233)","Split","12000 BTU","004TATG03129",null,90,"2026-07-15","B"],[235,"TALENTO HUMANO","OFIC. JEFE DPTO. GESTION ORGANIZACIONAL SPLIT 12000 (234)","Split","",null,null,90,"2026-07-15","B"],[236,"TALENTO HUMANO","DPTO GESTIÓN ORGANIZACIONAL SPLIT 12000 BTU (235)","Split","12000 BTU",null,null,90,"2026-07-15","B"],[237,"TALENTO HUMANO","DPTO GESTIÓN ORGANIZACIONAL SPLIT 5 TON HIUNDAY","Split","5 TR",null,null,120,"2026-07-15","B"],[238,"TALENTO HUMANO","PLANIFICACION EQUIPO HIUNDAY DE 5 TON","Otro","5 TR",null,null,120,"2026-07-15","B"],[239,"TALENTO HUMANO","SALA DE PROYECTOS SPLITS DE 3 TON HIUNDAY","Split","3 TR",null,null,120,"2026-07-15","B"],[240,"TALENTO HUMANO","APRENDIZAJE Y BECAS SPLIT 5 TON HIUNDAY","Split","5 TR",null,null,120,"2026-07-15","B"],[241,"TALENTO HUMANO","PLANIFICACION DE LA GERENCIA SPLIT SIRAGON DE 18000 BTU","Split","18000 BTU",null,null,120,"2026-07-15","B"],[242,"TALENTO HUMANO","OFICINA JEFA DE REMUNERACION Y EMPLEO SIRAGON SPLITS DE 24000 BTU","Split","24000 BTU",null,null,90,"2026-08-15","B"],[243,"TALENTO HUMANO","OFIC. ASISTENTE GERENCIA GENERAL DE TALENTO HUMANO (239)","Otro","",null,null,90,"2026-08-15","B"],[244,"TALENTO HUMANO","DPTO EMPLEO Y REMUNERACIÓN SPLIT 5 TR FMO/1204175 (240)","Split","5 TR",null,null,90,"2026-08-15","B"],[245,"TALENTO HUMANO","OFIC. JEFE EMPLEO Y REMUN. SPLIT 24000 BTU (241)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[246,"TALENTO HUMANO","OFIC. GERENTE TALENTO HUMANO (242)","Otro","",null,null,90,"2026-06-15","B"],[247,"TALENTO HUMANO","OFIC. SECRETARIA GCIA. GRAL. TALENTO HUMANO SPLIT 24000 BTU FMO/4162531 (243)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[248,"TALENTO HUMANO","OFIC. GCIA. GRAL PERSONAL SPLIT 12000 BTU (244)","Split","12000 BTU","163500300600174",null,90,"2026-07-15","B"],[249,"TALENTO HUMANO","SALA DE ENTRENAMIENTO 3 SPLIT 5 TR (246)","Split","5 TR","9266410001652",null,90,"2026-07-15","B"],[250,"TALENTO HUMANO","SALA DE ENTRENAMIENTO 4 SPLIT 5 TR (247)","Split","5 TR","9266410001580",null,90,"2026-07-15","B"],[251,"TALENTO HUMANO","GESTIÓN HUMANA COMEDOR SPLIT 12000 BTU (249)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[252,"TALENTO HUMANO","GESTIÓN HUMANA SPLIT 24000 BTU (250)","Split","24000 BTU","0035",null,90,"2026-06-15","B"],[253,"TALENTO HUMANO","GESTIÓN HUMANA SPLIT 12000 BTU (251)","Split","12000 BTU","0034",null,90,"2026-06-15","B"],[254,"TALENTO HUMANO","OFIC. PLANIFICACION GCIA. PERSONAL 5 TR. (252)","Otro","5 TR","0032",null,90,"2026-06-15","B"],[255,"TALENTO HUMANO","OFIC. ENTRENAMIENTO 5 TR B73X91500607331400051- (255)","Otro","5 TR",null,null,90,"2026-07-15","B"],[256,"TALENTO HUMANO","SALA CONFERENCIA SPLIT 5 TR (256)","Split","5 TR",null,null,90,"2026-07-15","B"],[257,"TALENTO HUMANO","SALA ENTRENAMIENTO 1 SPLIT DE 5 TR (257)","Split","5 TR",null,null,90,"2026-07-15","B"],[258,"TALENTO HUMANO","SALA DE ENTRENAMIENTO 2 SPLIT DE 5 TR (258)","Split","5 TR",null,null,90,"2026-07-15","B"],[259,"TALENTO HUMANO","SALA DE PROYECTOS SPLIT 3 TR (290)","Split","3 TR",null,null,90,"2026-07-15","B"],[260,"TALENTO HUMANO","GERENCIA GENERAL DE TALENTO HUMANO 5 TR. (261)","Otro","5 TR",null,null,90,"2026-08-15","B"],[261,"TALENTO HUMANO","OFICINA EQUIPO TECNICO (262)","Otro","",null,null,90,"2026-07-15","B"],[262,"PORTON I","OFIC. PROTECCIÓN INDUSTRIAL SPLIT 24000 BTU. (263)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[263,"PORTON I","SALA DE CONTROL CAMARAS SPLITS DE 3 TON HIUNDAY","Split","3 TR",null,null,120,"2026-05-15","B"],[264,"PORTON I","ROMANA EQUIPO DE VENTANA DE 18000 BTU HIUNDAY","A/A ventana","18000 BTU",null,null,120,"2026-05-15","B"],[265,"PORTON I","SALA DE SUPERVISORES DE VIGILANCIA EQUIPO HIUNDAY DE 5 TON","Otro","5 TR",null,null,120,"2026-05-15","B"],[266,"PORTON I","CONTROL DE ACCESO SPLIT 24000 BTU FMO/4162459 (266)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[267,"PORTON I","OFIC. SECRETARIA PROTECCIÓN INDUSTRIAL SPLIT 240000 BTU (267)","Split","240000 BTU",null,null,90,"2026-06-15","B"],[268,"PORTON I","OFIC. DPTO. PROTECCIÓN INDUSTRIAL 18000BTU (268)","Otro","18000 BTU","031000120",null,90,"2026-06-15","B"],[269,"PORTON I","OFIC. DPTO. PROTECCIÓN INDUSTRIAL 36000BTU (269)","Otro","36000 BTU","MR295009361X",null,90,"2026-06-15","B"],[270,"PORTON I","OFIC. IDENTIFICACIÓN SPLIT 9000 BTU FMO/4162459. (270)","Split","9000 BTU","200310101",null,90,"2026-06-15","B"],[271,"PORTON I","CONTROL DE ACCESO SPLIT 18000 BTU FMO/4162524 (271)","Split","18000 BTU",null,null,90,"2026-06-15","B"],[272,"C-13","CUARTO CAMAREROS A/A VENTANA 18000BTU (284)","A/A ventana","18000 BTU",null,null,90,"2026-07-15","B"],[273,"C-13","CUARTO CAMAREROS A/A VENTANA 18000BTU (285)","A/A ventana","18000 BTU",null,null,90,"2026-07-15","B"],[274,"C-13","COCINA SPLIT 5 TR. FMO/1204174 (287)","Split","5 TR",null,null,90,"2026-07-15","B"],[275,"C-13","SALA COMEDOR SPLIT 5 TR FMO/120542 (288)","Split","5 TR",null,null,90,"2026-07-15","B"],[276,"C-13","SALA COMEDOR SPLIT 5 TR (289)","Split","5 TR",null,null,90,"2026-07-15","B"],[277,"C-13","HAB. 1 SPLIT 24000BTU FMO/4162475 (290)","Split","24000 BTU",null,null,90,"2026-07-15","B"],[278,"C-13","HAB. 1 SPLIT 24000BTU FMO/4162428 (291)","Split","24000 BTU",null,null,90,"2026-07-15","B"],[279,"C-13","SALA DE ESPERA SPLIT 18000 BTU FMO/1203847 (292)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[280,"C-13","SALA DE STAR A/A COMPACTO 5 TR. (293)","Central / compacto","5 TR","P3F080604238",null,90,"2026-07-15","B"],[281,"C-13","RECIBO 5 TR. FMO/0045 (294)","Otro","5 TR",null,null,90,"2026-08-15","B"],[282,"C-13","SALA DE DESCANSO SPLIT 5 TR. (295)","Split","5 TR","95CF09P-0019",null,90,"2026-08-15","B"],[283,"C-13","HAB. N 3 SPLIT. 5 TON","Split","5 TR",null,null,90,"2026-08-15","B"],[284,"C-13","FERRO 10 EQUIPO ROYAL SPLITS DE 12000 BTU","Split","12000 BTU",null,null,120,"2026-07-15","B"],[285,"C-13","HABITACION EQUIPO SONEVIEW DE 12000 BTU","Otro","12000 BTU",null,null,120,"2026-07-15","B"],[286,"C-13","HABITACION EQUIPO HIUNDAY SPLIT DE 3 TON","Split","3 TR",null,null,120,"2026-07-15","B"],[287,"C-13","HABITACION EQUIPO HIUNDAY SPLIT DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-07-15","B"],[288,"C-13","SALA SPLIT 36000BTU FMO/0041. (297)","Split","36000 BTU","4997E056111",null,90,"2026-08-15","B"],[289,"C-13","SALON PRINCIPAL A/A. 5 TR. FMO/0042 (298)","Otro","5 TR",null,null,90,"2026-08-15","B"],[290,"C-13","SALON CENTRAL 5 TR (299)","Central / compacto","5 TR","4997641708",null,90,"2026-08-15","B"],[291,"C-13","SALON CENTRAL 5 TR /0046 (300)","Central / compacto","5 TR","FMO",null,90,"2026-08-15","B"],[292,"C-13","CUARTO DE CHOFERES A/A VENTANA 18000BTU (301)","A/A ventana","18000 BTU","140761438027101872",null,90,"2026-08-15","B"],[293,"C-13","CASILLA DE VIGILANCIA SPLIT MARCA BM 12000 BTU","Split","12000 BTU",null,null,120,"2026-07-15","B"],[294,"C-13","HAB. HUESPEDES SPLIT 24000 BTU (303)","Split","24000 BTU",null,null,90,"2026-08-15","B"],[295,"JUBILADO","SALA PPAL JUBILADOS SPLIT 5 TR. (304)","Split","5 TR",null,null,90,"2026-08-15","B"],[297,"JUBILADO","OFICINA DE LA GERENCIA GENERAL DE OPERACIONES MINERAS SPLTS DE 12000 BTU SONEVIEW","Otro","12000 BTU",null,null,120,"2026-07-15","B"],[298,"JUBILADO","CASITA DE SERVICIOS ADM 1 EQUIPO DAEWOO SPLITS 12 MIL BTU","Split","",null,null,120,"2026-07-15","B"],[299,"JUBILADO","SALA DE REUNIONES PRESID. SPLIT 5 TR (308)","Split","5 TR",null,null,90,"2026-07-15","B"],[300,"JUBILADO","OFIC. PRESIDENTE SPLIT 18000 BTU","Split","18000 BTU",null,null,120,"2026-05-15","B"],[301,"JUBILADO","DTO DE CONTABILIDAD 1 EQUIPO HIUNDAY DE 18000 BTU","Otro","18000 BTU",null,null,120,"2026-05-15","B"],[302,"JUBILADO","DTO DE CONTABILIDAD 2 EQUIPO HIUNDAY DE 18000 BTU","Otro","18000 BTU",null,null,120,"2026-05-15","B"],[303,"JUBILADO","PRESIDENCIA SECRETARIA SIRAGON SPLITS DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-05-15","B"],[304,"JUBILADO","PRESIDENCIA JUNTA DIRECTIVA SIRAGON SPLITS DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-05-15","B"],[305,"JUBILADO","GCIA. GRAL PLANIF. ESTRATEGICA SPLIT 18000 BTU (313)","Split","18000 BTU","B119637047407621150574",null,90,"2026-06-15","B"],[306,"JUBILADO","GCIA COMERCIALIZACIÒN SPLIT 12000 BTU (316)","Split","12000 BTU","C1011219911010612120405",null,90,"2026-06-15","B"],[307,"JUBILADO","DPTO IMPUESTOS SPLIT 12000 BTU (317)","Split","12000 BTU","C1013132007115171220237",null,90,"2026-06-15","B"],[308,"JUBILADO","OFIC. CONTABILIDAD A/A SPLIT 18000 BTU (318)","Split","18000 BTU","5T0708G00230",null,90,"2026-06-15","B"],[309,"JUBILADO","OFIC. CONTABILIDAD SPLIT 18000 BTU (319)","Split","18000 BTU","5T0801G90292",null,90,"2026-06-15","B"],[310,"JUBILADO","ADMINISTRACION DE FINANZAS DAEWOO SPLITS DE 18000 BTU","Split","18000 BTU",null,null,120,"2026-08-15","B"],[311,"JUBILADO","OFIC. PLANIF. FINANCIERA SPLIT 18000 BTU (322)","Split","18000 BTU","5T081G01013",null,90,"2026-06-15","B"],[312,"JUBILADO","OFIC. JEFE PLANIF. FINANCIERA SPLIT 12000BTU (323)","Split","12000 BTU","C101313200711517120120",null,90,"2026-07-15","B"],[313,"JUBILADO","OFIC. GTE COMERC, Y VENTAS DE 24000 BTU (326)","Otro","24000 BTU",null,null,90,"2026-07-15","B"],[314,"JUBILADO","CONTABILIDAD SPLIT DE 18000 BTU (327)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[315,"JUBILADO","OFIC. SEC, DE CONTABILIDAD SPLIT 18000 BTU (329)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[316,"JUBILADO","OFIC. DE ADM. (JEFE DE FINANZA) SPLIT DE 12000 BTU (330","Split","12000 BTU",null,null,90,"2026-07-15","B"],[317,"JUBILADO","OFIC. DE PLANIFICACION E IMPUESTO SPLIT 5 TR (331)","Split","5 TR",null,null,90,"2026-07-15","B"],[318,"JUBILADO","OFIC. DE ADM. FINANCIERA SPLIT DE 18000 BTU (332)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[319,"JUBILADO","PLANIFICACION FINANCIERA SPLIT DE 240000 BTU (333)","Split","240000 BTU",null,null,90,"2026-07-15","B"],[320,"JUBILADO","PLANIFICACION FINANCIERA SPLIT DE 5 TR. (334)","Split","5 TR",null,null,90,"2026-07-15","B"],[321,"JUBILADO","IMPUESTO SPLIT DE 12000 BTU (335)","Split","12000 BTU",null,null,90,"2026-07-15","B"],[322,"JUBILADO","GCIA DE PLANIFICACION DE 24000 BTU. (336)","Otro","24000 BTU",null,null,90,"2026-07-15","B"],[323,"PLANTA DE BRIQUETAS","PLANTA ALTA MANTTO MECANICO A/A COMPACTO 10 TR FMO-1204280 (337)","Central / compacto","10 TR",null,null,90,"2026-08-15","B"],[324,"PLANTA DE BRIQUETAS","PLANTA ALTA MANTTO MECANICO SPLIT 5 TR (338)","Split","5 TR",null,null,90,"2026-08-15","B"],[325,"PLANTA DE BRIQUETAS","PLANTA BAJA MANTTO MEC. SALA SUPERV. A/A COMPACTO 15 TR FMO-1204281(339)","Central / compacto","15 TR",null,null,90,"2026-08-15","B"],[326,"PLANTA DE BRIQUETAS","GCIA. MANTTO MEC. SALA AJUSTE A/A VENTANA 18000 BTU. S:D2014177704123021200 (340)","A/A ventana","18000 BTU",null,null,90,"2026-08-15","B"],[327,"PLANTA DE BRIQUETAS","GCIA. MANTTO MEC. SALA AJUSTE A/A VENTANA 24000 BTU. FMO/1203778 (341)","A/A ventana","24000 BTU",null,null,90,"2026-08-15","B"],[328,"PLANTA DE BRIQUETAS","COMEDOR A/A COMPACTO 15 TR. FMO/1204279 (342)","Central / compacto","15 TR",null,null,90,"2026-08-15","B"],[329,"PLANTA DE BRIQUETAS","COMEDOR SPLIT. 5 TR FMO/1203881 (342)","Split","5 TR",null,null,90,"2026-08-15","B"],[330,"PLANTA DE BRIQUETAS","MANTTO ELECTRICO. A/A COMPACTO 15 TR. S:4904G40573 (343)","Central / compacto","15 TR",null,null,90,"2026-08-15","B"],[331,"PLANTA DE BRIQUETAS","MANTTO ELECTRICO. A/A COMPACTO 15 TR. S:4905G20878 (344)","Central / compacto","15 TR",null,null,90,"2026-06-15","B"],[332,"PLANTA DE BRIQUETAS","AREA TALLER MANTTO ELEC. A/A COMPACTO 15 TR. S:1806007728 (345)","Central / compacto","15 TR",null,null,90,"2026-06-15","B"],[333,"PLANTA DE BRIQUETAS","SALA ANALISIS DE GASES SPLIT 36000 BTU FMO/1204282 (346)","Split","36000 BTU",null,null,90,"2026-07-15","B"],[334,"PLANTA DE BRIQUETAS","OFIC. AREA DE PRODUCCION SPLIT 5 TR. (347)","Split","5 TR",null,null,90,"2026-07-15","B"],[335,"PLANTA DE BRIQUETAS","OFIC. AREA DE PRODUCCION A/A VENTANA 24000 BTU (348)","A/A ventana","24000 BTU",null,null,90,"2026-07-15","B"],[336,"PLANTA DE BRIQUETAS","SALA DE CONTROLES SPLIT. 5 TR (349)","Split","5 TR",null,null,90,"2026-07-15","B"],[337,"PLANTA DE BRIQUETAS","OFIC. SEGURIDAD PATRIMONIAL SPLIT 36000 BTU (350)","Split","36000 BTU",null,null,90,"2026-07-15","B"],[338,"PLANTA DE BRIQUETAS","MANTTO ELECTRICO SPLIT 36000BTU FMO/1203784 (351)","Split","36000 BTU",null,null,90,"2026-06-15","B"],[339,"PLANTA DE BRIQUETAS","PROTECCION INDUSTRIAL SPLIT 24000BTU (352)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[340,"PLANTA DE BRIQUETAS","MANTENIMIENTO MECANICO SALA DE AJUSTES DE 18000 BTU (353)","Otro","18000 BTU",null,null,90,"2026-06-15","B"],[341,"PLANTA DE BRIQUETAS","TAYLOR MODICOM EQUIPO HIUNDAY SPLIT DE 3 TON","Split","3 TR",null,null,90,"2026-06-15","B"],[342,"PLANTA DE BRIQUETAS","PROCESOS ASEGURAMIENTO DE CALIDAD 5 TR. (355)","Otro","5 TR",null,null,90,"2026-06-15","B"],[343,"PLANTA DE BRIQUETAS","ANALISIS DE AGUAS LABORATORIOS SPLIT 240000 BTU (356)","Split","240000 BTU",null,null,90,"2026-06-15","B"],[344,"PMH","JEF. AREAS OPERACIONALES EQUIP.PESADOS A/A VENTANA 18000 BTU (357)","A/A ventana","18000 BTU","C1013794506119223120355",null,90,"2026-07-15","B"],[345,"PMH","AUTOMATIZACIÓN E INSTRUMENTACIÓN A/A COMPACTO 15 TR.(358)","Central / compacto","15 TR",null,null,90,"2026-08-15","B"],[346,"PMH","EDIF. GERENCIA P.M.H SPLIT 18000 BTU S/ 100002690110600258 (359)","Split","18000 BTU",null,null,90,"2026-06-15","B"],[347,"PMH","EDIF. GERENCIA SPLIT 3 TR. FMO/416/2622 (400)","Split","3 TR",null,null,90,"2026-07-15","B"],[348,"PMH","EDIF. GERENCIA SPLIT 3 TR. S/VMO8041540 (401)","Split","3 TR",null,null,90,"2026-07-15","B"],[349,"PMH","EDIF. GERENCIA A/A VENTANA 24000 BTU (402)","A/A ventana","24000 BTU",null,null,90,"2026-07-15","B"],[350,"PMH","SALA B GERENCIA PMH SPLIT 5 TR. FMO/416-2482 (403)","Split","5 TR",null,null,90,"2026-07-15","B"],[351,"PMH","EDIF. GERENCIA SPLIT 24000 BTU. FMO/1254213 (404)","Split","24000 BTU",null,null,90,"2026-07-15","B"],[352,"PMH","EDIF. GERENCIA SPLIT 18000 BTU. (405)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[353,"PMH","EDIF. GERENCIA SPLIT 5 TR (406)","Split","5 TR",null,null,90,"2026-08-15","B"],[354,"PMH","EDIF. GERENCIA SPLIT 18000 BTU. (407)","Split","18000 BTU",null,null,90,"2026-08-15","B"],[355,"PMH","OFIC. SUPERV. SISTEMA OPERACIONES A/A VENTANA 18000BTU FMO/4162627 (408)","A/A ventana","18000 BTU",null,null,90,"2026-08-15","B"],[356,"PMH","ACERO POR KILO DAMASCO DE VENTANA 18000 BTU","A/A ventana","18000 BTU",null,null,60,"2026-07-15","B"],[357,"PMH","SALA ELECTRICA SCADA EQUIPO HIUNDAY DE 5 TON","Otro","5 TR",null,null,60,"2026-07-15","B"],[358,"PMH","SALA DE ESTAR MECANICOS PANEL 10 EQUIPO HIUNDAY DE VENTANA 24000 BTU","A/A ventana","24000 BTU",null,null,60,"2026-07-15","B"],[359,"PMH","TALLER DE LUBRICACION PMH EQUIPO HIUNDAY DE 18000 BTU","Otro","18000 BTU",null,null,60,"2026-07-15","B"],[360,"PMH","OFICNA DEL TURNO TALLER CENTRAL EQUIPO CLARK SPLITS DE 18000 BTU","Split","18000 BTU",null,null,60,"2026-07-15","B"],[361,"PMH","PLANIFICACION EDIFICIO DE PMH PLANTA BAJA HIUNDAY DE 5 TON","Otro","5 TR",null,null,60,"2026-07-15","B"],[362,"PMH","TERCIARIO SOLDADURA KEYSTONE VENTANA DE 18000 BTU","A/A ventana","18000 BTU",null,null,60,"2026-07-15","B"],[363,"PMH","PLANTA DE SECADO ELECTRICOS EQUIPO DE VENTANA DAMASCO DE 5000 BTU","A/A ventana","5000 BTU",null,null,60,"2026-07-15","B"],[364,"PMH","CABOOS PATIO DE VACIO PMH EQUIPO DE VENTANA HIUNDAY DE 24000 BTU","A/A ventana","24000 BTU",null,null,60,"2026-07-15","B"],[365,"PMH","TALLEER DE LUBRICACION SPLITS HIUNDAY DE 12 MIL BTU","Split","",null,null,60,"2026-07-15","B"],[366,"PMH","SALA POLITICA DE PMH KEYSTONE VENTANA DE 18000 BTU","A/A ventana","18000 BTU",null,null,60,"2026-07-15","B"],[367,"PMH","TALLER DE SOLDADURA PMH EQUIPO DE VENTANA HIUNDAY DE 12000 BTU","A/A ventana","12000 BTU",null,null,60,"2026-07-15","B"],[368,"PMH","SUPERVISION DE TURNO TALLER DE CINTAS SPLTS HIUNDAY DE 24000 BTU","Otro","24000 BTU",null,null,60,"2026-07-15","B"],[369,"PMH","SALA ELECTRICA DRAVO EQUIPO HIUNDAY DE 5 TON","Otro","5 TR",null,null,60,"2026-07-15","B"],[370,"PMH","CASA CONTROL 1 SPLIT DE 3 TON HIUNDAY","Split","3 TR",null,null,60,"2026-07-15","B"],[371,"PMH","TALLER DE PMH OFICINA DE SUPERVISION VENTANA MARCA AMANA DE 18000 BTU","A/A ventana","18000 BTU",null,null,60,"2026-07-15","B"],[372,"PMH","OFICINA DEL GERENTE SPLITS DAMASCO DE 12000 BTU","Split","12000 BTU",null,null,60,"2026-07-15","B"],[373,"PMH","OFICINA DE SEGUNDO MOLINO KEYSTONE DE VENTANA DE 18000 BTU","A/A ventana","18000 BTU",null,null,60,"2026-07-15","B"],[374,"PMH","AREA 18 COMEDOR EQUIPO TIPO SPLITS SIRAGON DE 5 TON","Split","5 TR",null,null,60,"2026-07-15","B"],[375,"PMH","SALA DE SUP OMCS VENTANA MARCA AMANA DE 18000 BTU","A/A ventana","18000 BTU",null,null,60,"2026-07-15","B"],[376,"PMH","SALA DE DESCANSO PANEL 10 SPLIT HIUNDAY DE 18000 BTU","Split","18000 BTU",null,null,60,"2026-07-15","B"],[377,"PMH","RETARDADOR DE VAGONES SPLIT 18000BTU (411)","Split","18000 BTU","540N326090143050150849",null,90,"2026-07-15","B"],[378,"DESPACHO INTERNACIONAL","SUPERVISORES DEL AREA DE DESPACHO VENTANA 18000 BTU FMO 1203298 (412)","A/A ventana","18000 BTU",null,"1203298",90,"2026-07-15","B"],[379,"AGENCIA DE BUQUES (MUELLE)","OFICINA PBIP VENTANA DE 18000 BTU (413)","A/A ventana","18000 BTU","PAF071002676",null,90,"2026-08-15","B"],[380,"AGENCIA DE BUQUES (MUELLE)","CASETA PBIP SPLIT 24000 BTU (414)","Split","24000 BTU",null,null,90,"2026-08-15","B"],[381,"AGENCIA DE BUQUES (MUELLE)","OFICINAS GERENCIA DE MUELLE EQUIPO SPLITS HIUNDAY DE 5 TON","Split","5 TR",null,null,90,"2026-08-15","B"],[382,"AGENCIA DE BUQUES (MUELLE)","OFICINAS GERENCIA DE MUELLE 2 EQUIPO SPLITS HIUNDAY DE 5 TON","Split","5 TR",null,null,90,"2026-08-15","B"],[383,"AGENCIA DE BUQUES (MUELLE)","OFICINA DEL GERENTE EQUIPO SPLITS NORVAIR DE 18000 BTU","Split","18000 BTU",null,null,90,"2026-08-15","B"],[384,"AGENCIA DE BUQUES (MUELLE)","CASETA PBIP VENTANA 18000BTU (415)","A/A ventana","18000 BTU",null,null,90,"2026-08-15","B"],[385,"AGENCIA DE BUQUES (MUELLE)","OFIC. RADIO MARINA SPLIT 24000 BTU FMO 416-0272 (416)","Split","24000 BTU",null,null,90,"2026-08-15","B"],[386,"AGENCIA DE BUQUES (MUELLE)","GCIA MUELLE Y TRANSPORTE FLUVIALES SPLIT DE 12000 BTU FMO 1203319 (417)","Split","12000 BTU",null,"1203319",90,"2026-08-15","B"],[387,"AGENCIA DE BUQUES (MUELLE)","OFIC. MUELLE 12000 BTU. (418)","Otro","12000 BTU",null,null,90,"2026-08-15","B"],[388,"AGENCIA DE BUQUES (MUELLE)","OFICINA DE AGENCIA DE BUQUE SPLIT DE 5 TR (419)","Split","5 TR",null,null,90,"2026-08-15","B"],[389,"AGENCIA DE BUQUES (MUELLE)","OFICINA DE AGENCIA DE BUQUE SPLIT DE 5 TR (420)","Split","5 TR",null,null,90,"2026-08-15","B"],[390,"AGENCIA DE BUQUES (MUELLE)","Oficina del Jefe de Agencia de Buque SPLIT DE 12000 BTU (421)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[391,"AGENCIA DE BUQUES (MUELLE)","SALA DE CONFERENCIA DE AGENC. BUQUE SPLIT DE 12000 BTU (422)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[392,"FERROCARRIL","COMEDOR OPERACIONES FFCC 5 TR FMO 1203282 (423)","Otro","5 TR",null,"1203282",90,"2026-06-15","B"],[393,"FERROCARRIL","OFIC. SUPERVISORES 12000 BTU (425)","Otro","12000 BTU","C10101349010842151769",null,90,"2026-06-15","B"],[394,"FERROCARRIL","OFIC SUPERV. OPERACIONES FERROVIARIAS 5 TR FMO 4162549 (426)","Otro","5 TR",null,"4162549",90,"2026-06-15","B"],[395,"FERROCARRIL","OFIC SUPERV. OPERACIONES FERROVIARIAS 5 TR FMO 4162550 (427)","Otro","5 TR",null,"4162550",90,"2026-06-15","B"],[396,"FERROCARRIL","UNIDAD INST. FERROVIARIAS 5 TR FMO 1203743 (428)","Otro","5 TR",null,"1203743",90,"2026-06-15","B"],[397,"FERROCARRIL","DESPACHO A/A SPLIT 12000 BTU (429)","Split","12000 BTU",null,null,90,"2026-06-15","B"],[398,"FERROCARRIL","PLANIFICACIÓN SPLIT 24000 BTU FMO/0075 (430)","Split","24000 BTU",null,null,90,"2026-08-15","B"],[399,"FERROCARRIL","OPERACIONES FERROVIARIAS A/A COMPACTO 5 TR. (431)","Central / compacto","5 TR",null,null,90,"2026-08-15","B"],[400,"FERROCARRIL","OFIC. OPERACIONES FERROVIARIAS A/A VENTANA 18000 BTU FMO/4162534 (432)","A/A ventana","18000 BTU",null,null,90,"2026-08-15","B"],[401,"FERROCARRIL","DESPACHO DE TRENES SPLIT 5 TR FMO/4160353 (434)","Split","5 TR",null,null,90,"2026-06-15","B"],[402,"FERROCARRIL","MANTTO MECANICO DE LOCOMOTORAS SPLITS SIRAGON DE 24000 BTU","Split","24000 BTU",null,null,60,"2026-07-15","B"],[403,"FERROCARRIL","SALA DE STAR DE FFCC EQUIPO HIUNDAY DE 3 TON","Otro","3 TR",null,null,60,"2026-07-15","B"],[404,"FERROCARRIL","COMEDOR DE TALLER SOLDADURA EQUIPO SPLITS SIRAGON DE 24000 BTU","Split","24000 BTU",null,null,60,"2026-07-15","B"],[405,"FERROCARRIL","OFICINA DE LA JEFATURA DE TURNO OPERACIONES HIUNDAY DE 5 TON","Otro","5 TR",null,null,60,"2026-07-15","B"],[406,"FERROCARRIL","LINEA DE SERVICIO HYUNDAI VENTANA DE 24000 BTU","A/A ventana","24000 BTU",null,null,60,"2026-07-15","B"],[407,"FERROCARRIL","CABINA DE FRENADO DE VAGONES SPLITS 18000 BTU","Split","18000 BTU",null,null,60,"2026-07-15","B"],[408,"FERROCARRIL","SUP DE OPERACIONES DAMASCO VENTANA DE 18000 BTU","A/A ventana","18000 BTU",null,null,60,"2026-07-15","B"],[409,"FERROCARRIL","CUARTO DE RUEDAS VENTANA DAMASCO 18OOO BTU","A/A ventana","",null,null,60,"2026-07-15","B"],[410,"FERROCARRIL","S.I.A FFCC CONDESA VENTANA 12000 BTU","A/A ventana","12000 BTU",null,null,60,"2026-07-15","B"],[411,"FERROCARRIL","LINEA DE SERVICIO VAGONES HIUNDAY 3 TON","Otro","3 TR",null,null,60,"2026-07-15","B"],[412,"FERROCARRIL","CTC EQUIPO DE 5 TON HIUNDAY PISO TECHO","Otro","5 TR",null,null,60,"2026-07-15","B"],[413,"ALMACÉN","DEPÓSITO SPLIT 5 TR. FMO/4162626 (437)","Split","5 TR",null,null,90,"2026-07-15","B"],[414,"ALMACÉN","ADUANA Y TRAFICO GAVETA 5 TR (438)","Otro","5 TR",null,null,90,"2026-08-15","B"],[415,"ALMACÉN","OFIC. ALMACEN TEMPORAL DE ADUANA. A/A VENTANA 18000 BTU S/LH354273 (439)","A/A ventana","18000 BTU",null,null,90,"2026-08-15","B"],[416,"ALMACÉN","OFICINAS DE ALMACEN SPLIT 5 TR. (440)","Split","5 TR",null,null,90,"2026-08-15","B"],[417,"ALMACÉN","AREA PATIO A/A SPLIT 18000 BTU (441)","Split","18000 BTU",null,null,90,"2026-08-15","B"],[418,"ALMACÉN","OFICNA DE DESPACHO SUPERVISION EQUIPO DE VENTANA 18000 BTU","A/A ventana","18000 BTU",null,null,90,"2026-08-15","B"],[419,"ALMACÉN","COMEDOR DE ALMACEN EQUIPO HIUNDAY DE 3 TON","Otro","3 TR",null,null,90,"2026-08-15","B"],[420,"ALMACÉN","PLANIFICACION PTO ORDAZ HIUNDAY 3 TON PISO TECHO","Otro","3 TR",null,null,90,"2026-08-15","B"],[421,"ALMACÉN","ADUANA Y TRAFICO GAVETA 5 TR (442)","Otro","5 TR",null,null,90,"2026-08-15","B"],[423,"TELEMÁTICA","SALA DE COMPUTO SPLIT 15 TR FMO/1203888 (444)","Split","15 TR",null,null,90,"2026-08-15","A"],[424,"TELEMÁTICA","SERVICIO TÉCNICO DE CAMARAS OFICINA EQUIPO DE VENTANA HIUNDAY 18000 BTU","A/A ventana","18000 BTU",null,null,120,"2026-05-15","A"],[425,"TELEMÁTICA","CENTRAL DEL TUNEL EQUIPO HIUNDAY SPLITS DE 5 TON","Split","5 TR",null,null,120,"2026-05-15","A"],[426,"TELEMÁTICA","OFICINA DE ADMINISTRACIÓN DE TELEMÁTICA EQUIPO HIUNDAY DE 5 TON SPLITS","Split","5 TR",null,null,120,"2026-05-15","A"],[427,"TELEMÁTICA","SOPORTE TÉCNICO EQUIPO HYUNDAY DE 5 TON SPLITS","Split","5 TR",null,null,120,"2026-05-15","A"],[428,"TELEMÁTICA","CASETA DE REDES ADM 1 HIUNDAY 3 TON","Otro","3 TR",null,null,120,"2026-05-15","A"],[429,"TELEMÁTICA","TALLER DE RADIO HYUNDAI DE 3 TON","Otro","3 TR",null,null,120,"2026-05-15","A"],[430,"TELEMÁTICA","SALA DE OPERACIONES SPLIT 15 TR FMO/1203887 (445)","Split","15 TR",null,null,90,"2026-08-15","A"],[431,"CONTROL CENTRAL","OFICINA JEFATURA DE INSTRUMENTACION CONTROL CENTRAL SPLITS HIUNDAY 24000 BTU","Split","24000 BTU",null,null,90,"2026-07-15","A"],[432,"CONTROL CENTRAL","TALLER DE COMPONENTES ELECTRONICOS SPLIT 3 TR. S/3TIJSA070806784 (446)","Split","3 TR",null,null,90,"2026-07-15","A"],[433,"PROCURA","JEFE DPTO DE COMPRAS NACIONALES SPLIT DE 12000 BTU (447)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[434,"PROCURA","DPTO. CONTRATOS Y SERVICIOS SPLIT 5 TR. FMO/4162483 (448)","Split","5 TR",null,null,90,"2026-08-15","B"],[435,"PROCURA","COMPRAS INTERNACIONALES SPLIT 5 TR. FMO/1203814 (449)","Split","5 TR",null,null,90,"2026-08-15","B"],[436,"PROCURA","PLANIFICACIÓN A/A COMPACTO 5 TR S/P3F070301404 (450)","Central / compacto","5 TR",null,null,90,"2026-06-15","B"],[437,"PROCURA","COORD. GRAL . PLANES ESPECIALES 32000 BTU FMO/1203309 (451)","Otro","32000 BTU",null,null,90,"2026-06-15","B"],[438,"PROCURA","SALA DE COMISIOS SPLIT HIUNDAY 24000 BTU","Split","24000 BTU",null,null,120,"2026-06-15","B"],[439,"PROCURA","COORD. GRAL PLANES ESPECIALES DE COMPRAS SPLIT 5 TR. FMO/4162467 (452)","Split","5 TR",null,null,90,"2026-06-15","B"],[440,"PROCURA","SALA DE REUNIONES COORD. PLANES ESP. COMPRAS EDO. SPLIT 5 TR S/0408402587 (453)","Split","5 TR",null,null,90,"2026-06-15","B"],[441,"PROCURA","OFIC. DE IDENTIFICACIÓN PORTON IV SPLIT 18000 BTU S/C101313200711519120842 (454)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[442,"BOMBEROS","OFIC. SECCIÓN CONTROL DE EMERGENCIAS SPLIT 12000BTU S/094911690700017 (457)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[443,"BOMBEROS","SISOA A/A COMPACTO CENTRAL 10 TR S/644100864D (458)","Central / compacto","10 TR",null,null,90,"2026-06-15","B"],[444,"BOMBEROS","GTE DE SISOA Y OF SEC, DE GTE SPLIT DE 24000 BTU (459)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[445,"BOMBEROS","DPTO. DE GESTION AMBIENTAL SPLIT DE 24000 BTU (460)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[446,"BOMBEROS","OFICINA UNIDAD ASISTENTE ADMINISTRATIVO SPLIT DE 12000 BTU (461)","Split","12000 BTU",null,null,90,"2026-06-15","B"],[447,"BOMBEROS","OFIC. PLANIFINICACION DE GCIA SISOA 18000 BTU (462)","Otro","18000 BTU",null,null,90,"2026-06-15","B"],[448,"BOMBEROS","SALA DE CHARLA SPLIT DE 24000 BTU (463)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[449,"BOMBEROS","PLANIFICACION SISOA SIRAGON SPLITS DE 18000 BTU","Split","18000 BTU",null,null,90,"2026-06-15","B"],[450,"BOMBEROS","OFICINA GESTION AMBIENTAL SPLIT DE 24000 BTU (465)","Split","24000 BTU",null,null,90,"2026-06-15","B"],[451,"BOMBEROS","OFICINA DPTO. AMBIENTE SPLIT DE 18000 BTU (466)","Split","18000 BTU",null,null,90,"2026-06-15","B"],[452,"BOMBEROS","OFICINA BOMBERO VENTANA 180000 BTU (467)","A/A ventana","180000 BTU",null,null,90,"2026-06-15","B"],[453,"TRANSPORTACIÓN","DPTO. EQUIPOS PESADOS SPLIT 18000BTU S/C101056120308711130005 (468)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[454,"TRANSPORTACIÓN","JEFE DPTO. EQUIPOS LIVIANOS SPLIT 18000BTU S/C1010561203087111130017 (469)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[455,"TRANSPORTACIÓN","OFIC. SUP. EQUIPOS LIVIANOS A/A VENTANA 18000BTU S/1418950000900 (470)","A/A ventana","18000 BTU",null,null,90,"2026-07-15","B"],[456,"TRANSPORTACIÓN","OFIC. JEFES DE SECCIÓN A/A VENTANA 18000BTU S/STO801F02790 (471)","A/A ventana","18000 BTU",null,null,90,"2026-07-15","B"],[457,"TRANSPORTACIÓN","OFIC. TALLER ELÉCTRICO A/A VENTANA 18000BTU FMO/4162652 (472)","A/A ventana","18000 BTU",null,null,90,"2026-07-15","B"],[458,"TRANSPORTACIÓN","PLANIFICACIÓN DE TRANSPORTE SPLIT 5 TR (DP) (473)","Split","5 TR",null,null,90,"2026-08-15","B"],[459,"TRANSPORTACIÓN","ESTACION DE SERVICIO BOMBA EQUIPO DE VENTANA HIUNDAY DE 12000 BTU","A/A ventana","12000 BTU",null,null,90,"2026-07-15","B"],[460,"TRANSPORTACIÓN","TRANSPORTE SUPERVISION EQUIPO DE VENTANA HIUNDAY DE 24000 BTU","A/A ventana","24000 BTU",null,null,90,"2026-07-15","B"],[461,"TRANSPORTACIÓN","TOOL ROOM EQUIPO DE VENTANA HIUNDAY DE 24000 BTU","A/A ventana","24000 BTU",null,null,90,"2026-07-15","B"],[462,"TRANSPORTACIÓN","COMEDOR DE LIVIANOS EQUIPO DE 5 TON HIUNDAY","Otro","5 TR",null,null,90,"2026-07-15","B"],[463,"TRANSPORTACIÓN","JEFE DE SECCION DE FLOTA SPLITS SIRAGON DE 18000 BTU","Split","18000 BTU",null,null,90,"2026-07-15","B"],[464,"TRANSPORTACIÓN","OFICINA DE DESPACHO DE FLOTA SPLITS SIRAGON 12000 BTU","Split","12000 BTU",null,null,90,"2026-07-15","B"],[465,"TRANSPORTACIÓN","GERENCIA OFICINAS SPLITS HIUNDAY DE 5 TON","Split","5 TR",null,null,90,"2026-07-15","B"],[466,"TRANSPORTACIÓN","SALA DE DESCANSO CHOFERES HIUNDAY SPLITS DE 3 TON","Split","3 TR",null,null,90,"2026-07-15","B"],[467,"TRANSPORTACIÓN","CONTRATOS DE LA GERENCIA DE TRANSPÓRTE HIUNDAY DE 5 TON PISO TECHO","Otro","5 TR",null,null,90,"2026-07-15","B"],[468,"TRANSPORTACIÓN","ALMACEN DE REPUESTOS SPLIT 5 TR S/900637019081 (474)","Split","5 TR",null,null,90,"2026-08-15","B"],[469,"TRANSPORTACIÓN","OFIC. DE CAUCHO SPLIT 12000BTU S/STO712501925 (475)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[470,"GERENCIA DE SERVICIOS","TALLER MANTTO. HIDRAULICOS A/A VENTANA 36000BTU FMO/0053 (478)","A/A ventana","36000 BTU",null,null,90,"2026-07-15","B"],[471,"GERENCIA DE SERVICIOS","SALA DE REUNIONES SPLIT 5 TR S/6938M4205123406 (479","Split","5 TR",null,null,90,"2026-07-15","B"],[472,"GERENCIA DE SERVICIOS","SECRETARIA GERENTE SPLIT 18000BTU S/STO71200524 (500)","Split","18000 BTU",null,null,90,"2026-07-15","B"],[473,"GERENCIA DE SERVICIOS","DPTO. SERVICIOS GENERALES SPLIT 5 TR FMO/1204054 (501)","Split","5 TR",null,null,90,"2026-07-15","B"],[474,"GERENCIA DE SERVICIOS","OFIC. JEFE SECCIÓN AREAS EXTERNAS VENTANA 18000BTU FMO/1203851(502)","A/A ventana","18000 BTU",null,null,90,"2026-07-15","B"],[475,"GERENCIA DE SERVICIOS","PAPELERIA EQUIPO DE 5 TON HIUNDAY","Otro","5 TR",null,null,120,"2026-05-15","B"],[476,"GERENCIA DE SERVICIOS","OFICINA DEL JEFE DE DPTO SERVICIOS GENERALES, EQUIPO SPLITS HIUNDAY DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-05-15","B"],[477,"GERENCIA DE SERVICIOS","COMEDOR DE SERVICIOS LIMPIEZA EQUIPO DE VENTANA DE 18000 BTU","A/A ventana","18000 BTU",null,null,120,"2026-05-15","B"],[478,"GERENCIA DE SERVICIOS","OFICNA DE GERENTE SERVICIOS SPLIT SIRAGON DE 18000 BTU","Split","18000 BTU",null,null,120,"2026-05-15","B"],[479,"GERENCIA DE SERVICIOS","DPTO DE PLANIFICACION DE SERVICIOS EQUIPO HIUNDAY DE 5 TON","Otro","5 TR",null,null,120,"2026-05-15","B"],[480,"GERENCIA DE SERVICIOS","OFICINA DE SOLDADORES DAMASCO DE VENTANA DE 5000 BTU","A/A ventana","5000 BTU",null,null,120,"2026-05-15","B"],[481,"GERENCIA DE SERVICIOS","OFICINA DE LA GERENCIA GENERAL DE TRANSPORTE Y SERV SONEVIEW SPLITS DE 24000 BTU","Split","24000 BTU",null,null,90,"2026-06-15","B"],[482,"AUDITORIA INTERNA","OFICINAS 3 TON PISO TECHO HIUNDAY 1","Otro","3 TR",null,null,120,"2026-06-15","B"],[483,"AUDITORIA INTERNA","SALA DE CONFERECNIAS HIUNDAY SPLITS DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-06-15","B"],[484,"AUDITORIA INTERNA","OFICINAS 3 TON PISO TECHO HIUNDAY 2","Otro","3 TR",null,null,120,"2026-06-15","B"],[485,"AUDITORIA INTERNA","AUDITORIA OFICNA DE GERENTE EQUIPO SONEVIEW SPLITS DE 12000 BTU","Split","12000 BTU",null,null,120,"2026-06-15","B"],[486,"AUDITORIA INTERNA","OFICINAS EQUIPO HIUNDAY SPLITS DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-06-15","B"],[487,"PARQUE ECOLÓGICO","MILICIA NUEVA OFICINA EQUIPO HIUNDAY DE 3 TON","Otro","3 TR",null,null,120,"2026-06-15","B"],[488,"SERVICIOS INDUSTRIALES","JEFE DPTO. SERVICIOS INDUSTRIALES 5 TR (509)","Otro","5 TR",null,null,90,"2026-08-15","B"],[489,"SERVICIOS INDUSTRIALES","SALA DE ESTAR REFRIGERACION INDUSTRIALES SONEVIEW SPLITS DE 12000 BTU","Split","12000 BTU",null,null,120,"2026-05-15","B"],[490,"SERVICIOS INDUSTRIALES","SALA DE ESTAR ELECTRICOS INDUSTRIALES SONEVIEW SPLITS DE 12000 BTU","Split","12000 BTU",null,null,120,"2026-05-15","B"],[491,"SERVICIOS INDUSTRIALES","OFICINA DE SUP DE REFRIGERACION SIRAGO SPLITS DE 24000 BTU","Split","24000 BTU",null,null,120,"2026-05-15","B"],[492,"SERVICIOS INDUSTRIALES","COMEDOR DE SERVICIOS INDUSTRIALES SPLIT 5 TR (511)","Split","5 TR","90039029296",null,90,"2026-08-15","B"],[493,"SERVICIOS INDUSTRIALES","OFIC. JEFE DPTO DE TELECOMUNICACIONES SPLIT 12000 BTU (513)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[494,"C-11","GERENTE DE SISTEMA DE GESTION A/A DE 5 TR FMO 416-2662 (516)","Otro","5 TR",null,null,90,"2026-07-15","B"],[495,"C-11","OFIC. SISTEMA GESTION A/A VENTANA 12.000 BTU F M O- 416 2657 (517)","A/A ventana","",null,null,90,"2026-07-15","B"],[496,"C-11","OFIC. SISTEMA GESTION A/A SPLIT 24.000 BTU F M O- 1203339 (518)","Split","",null,null,90,"2026-07-15","B"],[497,"C-11","OFIC. SISTEMA GESTION A/A SPLIT 24.000 BTU F M O- 4162639 (519)","Split","",null,null,90,"2026-07-15","B"],[498,"C-11","OFIC. PRINCIPAL DPTO SISTEMA GESTION A/A SPLIT 5 TR FMO 4162512 (520)","Split","5 TR",null,"4162512",90,"2026-07-15","B"],[499,"C-11","OFIC. PRINCIPAL A/A SPLIT 5 TR FMO 4162513 (521)","Split","5 TR",null,"4162513",90,"2026-07-15","B"],[500,"C-11","SALA CONFERENCIA A/A SPLIT 24000 BTU FMO 4162594 (522)","Split","24000 BTU",null,"4162594",90,"2026-07-15","B"],[501,"C-11","OFIC. SISTEMA GESTION A/A VENTANA DE 18000 BTU FMO 1203335 (523)","A/A ventana","18000 BTU",null,"1203335",90,"2026-07-15","B"],[502,"COMISARIATO","OFICINA JEFATURA AREA COMISARIATO SPLIT 12000 BTU (524)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[503,"COMISARIATO","OFIC. RECIBO DE MERCANCIA SPLIT DE 12000 BTU (525)","Split","12000 BTU",null,null,90,"2026-08-15","B"],[504,"COMISARIATO","COMISARIATO SPLIT 5 TR. (526)","Split","5 TR",null,null,90,"2026-08-15","B"],[505,"COMISARIATO","COMISARIATO SPLIT 5 TR. (527)","Split","5 TR",null,null,90,"2026-08-15","B"],[506,"COMISARIATO","COMISARIATO SPLIT 5 TR. (528)","Split","5 TR",null,null,90,"2026-08-15","B"],[507,"COMISARIATO","COMISARIATO SPLIT 5 TR. (529)","Split","5 TR",null,null,90,"2026-08-15","B"],[508,"COMISARIATO","SECCION DE OPERACIÓN Y ABORDO SPLIT DE 5 TR. (530)","Split","5 TR",null,null,90,"2026-08-15","B"],[509,"COMISARIATO","DPTO. PREV. Y CONTROL DE PERDIDA SPLIT DE 5 TR (531)","Split","5 TR",null,null,90,"2026-08-15","B"],[510,"COMISARIATO","COMISARIATO SPLIT 5 TR. (532)","Split","5 TR",null,null,90,"2026-08-15","B"],[511,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","GERENCIA GENERAL DE PROYECTOS SPLIT DE 15 TR. (533)","Split","15 TR",null,null,90,"2026-08-15","B"],[512,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","GESTION DEL CONOCIMIENTO EQUIPO GCHV 3 TON SPLITS","Split","3 TR",null,null,90,"2026-08-15","B"],[513,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","PLANOTECA EUIPO GCHV 3 TON SPLITS","Split","3 TR",null,null,90,"2026-08-15","B"],[514,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","JEFATURA DE PROYECTOS DE 24000 BTU (534)","Otro","24000 BTU",null,null,90,"2026-08-15","B"],[515,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","JEFATURA DE PROYECTOS SPLIT DE 18000 BTU (535)","Split","18000 BTU",null,null,90,"2026-08-15","B"],[516,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","JEFATURA DE PROYECTOS DE 24000 BTU (536)","Otro","24000 BTU",null,null,90,"2026-08-15","B"],[517,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","GCIA DE PROYECTO SPLIT 5 TR. (537)","Split","5 TR",null,null,90,"2026-08-15","B"],[518,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","OFIC. DE TRANSPORTACION SPLIT 5 TR (538)","Split","5 TR",null,null,90,"2026-08-15","B"],[519,"GERENCIA GENERAL DE JEFATURA DE PROYECTOS","OFIC. DE TRANSPORTACION SPLIT 5 TR (539)","Split","5 TR",null,null,90,"2026-08-15","B"],[521,"PLANTA DE AGUA Y HIELO","SUPERVISION DE AGUA Y HIELO EQUUIPO DE VENTA DE 18000 BTU","Otro","18000 BTU",null,null,120,"2026-05-15","B"],[522,"PLANTA DE AGUA Y HIELO","DPTO DE AGUA Y HIELO HIUNDAY SPLITS DE 3 TON","Split","3 TR",null,null,120,"2026-05-15","B"]];

function cargarInventarioFMO() {
  let seq = 0;
  return INVENTARIO_FMO.map((r) => {
    seq += 1;
    const [n, area, ubic, tipo, cap, serial, fmo, freq, ult, crit] = r;
    return {
      id: uid(),
      nombre: fmo ? "FMO-" + fmo : "REF-" + String(n || seq).padStart(3, "0"),
      tipo, gerencia: area, ubicacion: ubic, marcaModelo: "",
      serial: serial || "", refrigerante: "No determinado", anio: "", capacidad: cap || "",
      criticidad: crit, intervaloDias: freq, ultimoPrev: ult, tempMin: "", tempMax: "",
    };
  });
}

export default function TPMFMO() {
  const [usuario, setUsuario] = useState(null);
  const [autListo, setAutListo] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [atenciones, setAtenciones] = useState([]);
  const [lecturas, setLecturas] = useState([]);
  const [tab, setTab] = useState("tablero");
  const [aviso, setAviso] = useState(null);
  const [cargado, setCargado] = useState(false);
  const [enLinea, setEnLinea] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [pendientes, setPendientes] = useState(0);
  const sincronizando = useRef(false);

  const claveCache = usuario ? `tpm-fmo-cache-${usuario.id}` : null;
  const claveOutbox = usuario ? `tpm-fmo-pendientes-${usuario.id}` : null;

  /* ---- sesión ---- */
  useEffect(() => {
    if (!supabase) { setAutListo(true); return; }
    supabase.auth.getSession().then(({ data }) => {
      setUsuario(data.session?.user || null);
      setAutListo(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUsuario(session?.user || null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  /* ---- conexión ---- */
  useEffect(() => {
    const on = () => setEnLinea(true);
    const off = () => setEnLinea(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  /* ---- cola de cambios pendientes (registrar sin internet) ---- */
  const leerOutbox = () => { try { return JSON.parse(localStorage.getItem(claveOutbox)) || []; } catch (e) { return []; } };
  const escribirOutbox = (xs) => {
    try { localStorage.setItem(claveOutbox, JSON.stringify(xs)); } catch (e) { /* sin espacio */ }
    setPendientes(xs.length);
  };

  const sincronizar = async () => {
    if (!supabase || !usuario || sincronizando.current) return;
    sincronizando.current = true;
    let cola = leerOutbox();
    while (cola.length) {
      const op = cola[0];
      try {
        let q;
        if (op.op === "delete") q = await supabase.from(op.tabla).delete().eq("id", op.id);
        else q = await supabase.from(op.tabla).upsert(op.datos);
        if (q.error) throw q.error;
        cola = cola.slice(1);
        escribirOutbox(cola);
      } catch (e) { break; }
    }
    sincronizando.current = false;
  };

  const persistir = (ops) => {
    escribirOutbox([...leerOutbox(), ...ops]);
    sincronizar();
  };

  useEffect(() => { if (enLinea && usuario) sincronizar(); }, [enLinea, usuario]);
  useEffect(() => {
    if (!usuario) return;
    const t = setInterval(sincronizar, 30000);
    return () => clearInterval(t);
  }, [usuario]);

  /* ---- carga inicial: nube primero, caché local sin conexión ---- */
  useEffect(() => {
    if (!usuario || !supabase) return;
    setCargado(false);
    (async () => {
      try {
        const [eq, at, le] = await Promise.all([
          supabase.from("equipos").select("*").order("gerencia").order("nombre"),
          supabase.from("atenciones").select("*").order("creado", { ascending: false }),
          supabase.from("lecturas").select("*").order("creado", { ascending: false }),
        ]);
        if (eq.error || at.error || le.error) throw (eq.error || at.error || le.error);
        setEquipos(eq.data.map(deEquipoDB));
        setAtenciones(at.data.map(deAtencionDB));
        setLecturas(le.data.map(deLecturaDB));
      } catch (e) {
        try {
          const c = JSON.parse(localStorage.getItem(claveCache));
          if (c) { setEquipos(c.equipos || []); setAtenciones(c.atenciones || []); setLecturas(c.lecturas || []); }
        } catch (e2) { /* sin caché */ }
      }
      setPendientes(leerOutbox().length);
      setCargado(true);
      sincronizar();
    })();
  }, [usuario]);

  /* ---- caché local ---- */
  useEffect(() => {
    if (!cargado || !claveCache) return;
    try { localStorage.setItem(claveCache, JSON.stringify({ equipos, atenciones, lecturas })); } catch (e) { /* lleno */ }
  }, [equipos, atenciones, lecturas, cargado, claveCache]);

  const notificar = (m) => { setAviso(m); setTimeout(() => setAviso(null), 2600); };

  /* confirmación propia (las ventanas nativas del navegador pueden estar bloqueadas) */
  const [confirmacion, setConfirmacion] = useState(null);
  const pedirConfirmacion = (mensaje, alConfirmar) => setConfirmacion({ mensaje, alConfirmar });

  const agregarEquipo = (e) => {
    const nuevo = { id: uid(), ...e };
    setEquipos((xs) => [...xs, nuevo]);
    persistir([{ tabla: "equipos", op: "upsert", datos: aEquipoDB(nuevo, usuario.id) }]);
    notificar("Equipo agregado al inventario");
  };
  const eliminarEquipo = (id) => {
    const eq = equipos.find((e) => e.id === id);
    pedirConfirmacion(`¿Eliminar ${eq ? eq.nombre : "el equipo"} y todo su historial?`, () => {
      setEquipos((xs) => xs.filter((e) => e.id !== id));
      setAtenciones((as) => as.filter((a) => a.equipoId !== id));
      setLecturas((ls) => ls.filter((l) => l.equipoId !== id));
      persistir([{ tabla: "equipos", op: "delete", id }]); /* la BD borra en cascada atenciones y lecturas */
      notificar("Equipo eliminado");
    });
  };
  const registrarAtencion = (a) => {
    const nueva = { id: uid(), ...a };
    setAtenciones((as) => [nueva, ...as]);
    const ops = [{ tabla: "atenciones", op: "upsert", datos: aAtencionDB(nueva, usuario.id) }];
    if (a.tipo === "preventiva") {
      const eq = equipos.find((e) => e.id === a.equipoId);
      if (eq) {
        const act = { ...eq, ultimoPrev: a.fecha };
        setEquipos((xs) => xs.map((e) => (e.id === a.equipoId ? act : e)));
        ops.push({ tabla: "equipos", op: "upsert", datos: aEquipoDB(act, usuario.id) });
      }
      notificar("Preventivo registrado · semáforo reiniciado");
    } else notificar("Falla registrada");
    persistir(ops);
  };
  const registrarLectura = (l) => {
    const nueva = { id: uid(), ...l };
    setLecturas((ls) => [nueva, ...ls]);
    persistir([{ tabla: "lecturas", op: "upsert", datos: aLecturaDB(nueva, usuario.id) }]);
    notificar(l.fuera ? "Lectura registrada · ¡FUERA DE RANGO!" : "Lectura de temperatura registrada");
  };
  const cargarEjemplo = () => {
    const d = datosDeEjemplo();
    setEquipos(d.equipos); setAtenciones(d.atenciones); setLecturas(d.lecturas);
    notificar("Datos de ejemplo cargados (demostración)");
  };
  const cargarReal = () => {
    const ejecutar = async () => {
      if (!enLinea) { notificar("Se necesita internet para la carga masiva inicial"); return; }
      notificar("Cargando Programa 2026 a la nube…");
      const lote = cargarInventarioFMO().map((e) => aEquipoDB(e, usuario.id));
      try {
        for (let i = 0; i < lote.length; i += 100) {
          const { error } = await supabase.from("equipos").upsert(lote.slice(i, i + 100));
          if (error) throw error;
        }
        const { data, error } = await supabase.from("equipos").select("*").order("gerencia").order("nombre");
        if (error) throw error;
        setEquipos(data.map(deEquipoDB));
        setTab("tablero");
        notificar("Programa 2026 cargado en la nube · " + lote.length + " equipos");
      } catch (e) {
        notificar("Error al cargar: revisa la conexión e intenta de nuevo");
      }
    };
    if (equipos.length) pedirConfirmacion("Esto reemplazará los datos actuales por el inventario del Programa 2026 (" + INVENTARIO_FMO.length + " equipos).", ejecutar);
    else ejecutar();
  };

  const vaciarTodo = () => {
    pedirConfirmacion("¿Borrar TODOS los equipos, atenciones y lecturas de la cuenta (en la nube y en este dispositivo)? Esta acción no se puede deshacer.", async () => {
      if (!enLinea) { notificar("Se necesita internet para vaciar la nube"); return; }
      try {
        await supabase.from("equipos").delete().not("id", "is", null); /* cascada borra atenciones y lecturas */
        escribirOutbox([]);
        setEquipos([]); setAtenciones([]); setLecturas([]); setTab("tablero");
        notificar("Sistema reiniciado · datos borrados");
      } catch (e) { notificar("Error al vaciar: intenta de nuevo"); }
    });
  };

  const cerrarSesion = async () => {
    try { await supabase.auth.signOut(); } catch (e) { /* sin conexión */ }
    setEquipos([]); setAtenciones([]); setLecturas([]); setTab("tablero");
  };

  const alertasPrev = useMemo(
    () => equipos.map((e) => ({ e, s: estadoEquipo(e) })).filter((x) => x.s.nivel !== "ok")
      .sort((a, b) => (a.e.criticidad === b.e.criticidad ? b.s.uso - a.s.uso : a.e.criticidad.localeCompare(b.e.criticidad))),
    [equipos]
  );
  const alertasTemp = useMemo(
    () => equipos.map((e) => {
      const ls = lecturas.filter((l) => l.equipoId === e.id);
      return ls.length && ls[0].fuera ? { e, l: ls[0] } : null;
    }).filter(Boolean),
    [equipos, lecturas]
  );
  const nAlertas = alertasPrev.length + alertasTemp.length;

  const tabs = [["tablero", "Tablero"], ["equipos", "Equipos"], ["atencion", "Registrar"], ["analisis", "Análisis"], ["guia", "Guía"]];

  if (!supabase) return <PantallaMensaje titulo="Falta configurar" texto="Abre src/App.jsx y pega el Project URL y la anon key del proyecto de Supabase en las dos líneas marcadas al inicio del archivo." />;
  if (!autListo) return <PantallaMensaje titulo="TPM FMO" texto="Iniciando…" />;
  if (!usuario) return <Login />;
  if (!cargado) return <PantallaMensaje titulo="TPM FMO" texto="Cargando los datos del área…" />;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: body, color: T.ink }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        input:focus, select:focus { border-color: ${T.steel} !important; }\n        @media (max-width: 640px) { .logo-fmo { height: 44px !important; } }`}</style>

      <header style={{ background: "#0D0D0D", color: "#fff", padding: "16px 16px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span>
                <h1 style={{ fontFamily: display, fontWeight: 700, fontSize: 32, margin: 0, letterSpacing: "0.02em", textTransform: "uppercase", lineHeight: 1 }}>
                  TPM FMO <span style={{ color: T.orange }}>· Refrigeración</span>
                </h1>
                <span style={{ fontFamily: mono, fontSize: 12, color: "#B5B5B0", display: "block", marginTop: 4 }}>
                  Servicios Industriales
                </span>
              </span>
              <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <span
                  title={enLinea ? "Conectado a la nube" : "Los registros se guardan en el dispositivo y subirán al volver la conexión"}
                  style={{ fontFamily: mono, fontSize: 11, padding: "3px 8px", borderRadius: 4,
                    background: enLinea ? "rgba(46,139,87,0.3)" : "rgba(193,39,45,0.35)",
                    color: enLinea ? "#7FD9A4" : "#F5A3A6" }}>
                  {enLinea ? (pendientes ? `En línea · subiendo ${pendientes}…` : "En línea · sincronizado") : `Sin conexión · ${pendientes} por subir`}
                </span>
                <button onClick={cerrarSesion}
                  style={{ background: "transparent", border: "1px solid #5C5C58", color: "#B5B5B0", borderRadius: 4, padding: "3px 10px", fontFamily: display, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer" }}>
                  Salir
                </button>
                <img src={LOGO_LOCKUP} alt="CVG · Ferrominera Orinoco" className="logo-fmo" style={{ height: 64, width: "auto", display: "block" }} />
              </span>
            </div>
          </div>
          <p style={{ margin: "10px 0 14px", fontSize: 13, color: "#B5B5B0", maxWidth: 640 }}>
            Inventario de equipos de frío, preventivos por calendario con checklist guiado, control de temperaturas
            y de refrigerante, y registro de fallas con indicadores de disponibilidad.
          </p>
          <nav style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {tabs.map(([k, lbl]) => (
              <button key={k} onClick={() => setTab(k)}
                style={{ padding: "10px 14px", background: tab === k ? T.bg : "transparent", color: tab === k ? T.ink : "#B5B5B0", border: "none", borderRadius: "8px 8px 0 0", fontFamily: display, fontWeight: 600, fontSize: 16, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer" }}>
                {lbl}
                {k === "tablero" && nAlertas > 0 && (
                  <span style={{ marginLeft: 6, background: T.danger, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 12, fontFamily: mono }}>{nAlertas}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <div aria-hidden="true" style={{ height: 6, background: "linear-gradient(90deg, #F2B705 0%, #C8901A 45%, #8C6014 100%)" }} />

      {aviso && (
        <div style={{ position: "fixed", top: 12, right: 12, zIndex: 50, background: T.ink, color: "#fff", padding: "10px 16px", borderRadius: 6, fontFamily: mono, fontSize: 13, borderLeft: `5px solid ${T.orange}` }}>{aviso}</div>
      )}

      {confirmacion && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(13,13,13,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setConfirmacion(null)}>
          <div style={{ background: T.panel, borderRadius: 10, padding: 22, maxWidth: 420, width: "100%", borderTop: `6px solid ${T.orange}`, boxShadow: "0 10px 40px rgba(0,0,0,0.35)" }} onClick={(e) => e.stopPropagation()}>
            <strong style={{ fontFamily: display, fontSize: 20, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Confirmar acción</strong>
            <p style={{ fontSize: 14, color: T.ink, margin: "0 0 16px", lineHeight: 1.5 }}>{confirmacion.mensaje}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button style={btnGhost(T.inkSoft)} onClick={() => setConfirmacion(null)}>Cancelar</button>
              <button style={btn(T.danger, true)} onClick={() => { const f = confirmacion.alConfirmar; setConfirmacion(null); f(); }}>Sí, continuar</button>
            </div>
          </div>
        </div>
      )}

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 60px" }}>
        {tab === "tablero" && <Tablero equipos={equipos} atenciones={atenciones} lecturas={lecturas} alertasPrev={alertasPrev} alertasTemp={alertasTemp} irA={setTab} onEjemplo={cargarEjemplo} onReal={cargarReal} />}
        {tab === "equipos" && <Equipos equipos={equipos} atenciones={atenciones} lecturas={lecturas} onAgregar={agregarEquipo} onEliminar={eliminarEquipo} />}
        {tab === "atencion" && <Registrar equipos={equipos} onAtencion={registrarAtencion} onLectura={registrarLectura} />}
        {tab === "analisis" && <Analisis equipos={equipos} atenciones={atenciones} lecturas={lecturas} />}
        {tab === "guia" && <Guia onVaciar={vaciarTodo} onReal={cargarReal} />}
      </main>
    </div>
  );
}

/* ============================================================ ACCESO */
function PantallaMensaje({ titulo, texto }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: body, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`}</style>
      <div style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 10, padding: 28, maxWidth: 420, textAlign: "center", borderTop: `6px solid ${T.orange}` }}>
        <h1 style={{ fontFamily: display, fontSize: 26, margin: "0 0 8px", textTransform: "uppercase", color: T.ink }}>{titulo}</h1>
        <p style={{ margin: 0, color: T.inkSoft, fontSize: 14, lineHeight: 1.5 }}>{texto}</p>
      </div>
    </div>
  );
}

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const entrar = async () => {
    if (!correo.trim() || !clave) { setError("Escribe el correo y la contraseña."); return; }
    setError(null);
    setCargando(true);
    const { error: e } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: clave });
    setCargando(false);
    if (e) setError("Correo o contraseña incorrectos, o no hay conexión a internet.");
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: body, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');`}</style>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ background: "#0D0D0D", borderRadius: "10px 10px 0 0", padding: "20px 22px 16px", color: "#fff" }}>
          <img src={LOGO_LOCKUP} alt="CVG · Ferrominera Orinoco" style={{ height: 46, width: "auto", display: "block", marginBottom: 12 }} />
          <h1 style={{ fontFamily: display, fontSize: 28, margin: 0, textTransform: "uppercase", letterSpacing: "0.02em" }}>
            TPM FMO <span style={{ color: T.orange }}>· Refrigeración</span>
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#B5B5B0" }}>Servicios Industriales · Gestión del mantenimiento</p>
        </div>
        <div aria-hidden="true" style={{ height: 5, background: "linear-gradient(90deg, #F2B705 0%, #C8901A 45%, #8C6014 100%)" }} />
        <div style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
          <Field label="Correo">
            <input style={inputStyle} type="email" autoComplete="username" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="usuario@correo.com" />
          </Field>
          <Field label="Contraseña">
            <input style={inputStyle} type="password" autoComplete="current-password" value={clave} onChange={(e) => setClave(e.target.value)} onKeyDown={(e) => e.key === "Enter" && entrar()} />
          </Field>
          {error && <p style={{ color: T.danger, fontSize: 13, margin: 0 }}>{error}</p>}
          <button style={{ ...btn(T.orange), opacity: cargando ? 0.6 : 1 }} disabled={cargando} onClick={entrar}>
            {cargando ? "Entrando…" : "Entrar"}
          </button>
          <p style={{ fontSize: 12, color: T.inkSoft, margin: 0, lineHeight: 1.5 }}>
            El acceso lo entrega el administrador del sistema. Tras iniciar sesión una vez, la app recuerda al usuario
            y puede registrar datos sin conexión: se sincronizan al volver el internet.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ TABLERO */
function Tablero({ equipos, atenciones, lecturas, alertasPrev, alertasTemp, irA, onEjemplo, onReal }) {
  const [busqueda, setBusqueda] = useState("");
  const [abiertas, setAbiertas] = useState({});
  const [filtroAlerta, setFiltroAlerta] = useState("danger");
  const [gruposAbiertos, setGruposAbiertos] = useState({});
  if (!equipos.length)
    return (
      <div style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: "28px 24px" }}>
        <p style={{ fontFamily: display, fontSize: 26, fontWeight: 700, margin: "0 0 6px", textTransform: "uppercase" }}>TPM FMO · Área de Refrigeración</p>
        <p style={{ color: T.inkSoft, margin: "0 0 18px", maxWidth: 620 }}>
          Sistema de gestión del mantenimiento de los equipos de frío: inventario con ficha técnica y criticidad,
          preventivos por calendario con checklist guiado, control de temperaturas y consumo de refrigerante,
          y registro de fallas con indicadores de disponibilidad.
        </p>
        {[
          ["1", "Levanta el inventario", "En EQUIPOS registra cada aire, cava o chiller indicando su área o gerencia, ubicación exacta, criticidad, refrigerante y frecuencia de preventivo."],
          ["2", "Registra el trabajo del área", "En REGISTRAR se anota cada falla atendida (con causa, técnico y gas usado), cada preventivo ejecutado (con su checklist) y las lecturas de temperatura."],
          ["3", "Gestiona con datos", "El TABLERO agrupa los equipos por área con su resumen de alertas, prioriza los preventivos por vencer y avisa temperaturas fuera de rango; ANÁLISIS muestra el Pareto de causas y el consumo de refrigerante."],
        ].map(([n, t, d]) => (
          <div key={n} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
            <div style={{ width: 30, height: 30, borderRadius: 15, background: T.orange, color: "#fff", fontFamily: display, fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
            <div>
              <strong style={{ fontFamily: display, fontSize: 17, textTransform: "uppercase" }}>{t}</strong>
              <div style={{ fontSize: 13, color: T.inkSoft }}>{d}</div>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          <button style={btn(T.orange)} onClick={() => irA("equipos")}>Empezar: agregar equipo</button>
          <button style={btnGhost(T.steel)} onClick={onEjemplo}>Cargar datos de ejemplo (demo)</button>
          <button style={btn("#141414")} onClick={onReal}>Cargar Programa 2026 · inventario real</button>
        </div>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section>
        <h2 style={h2Style}>
          Centro de alertas
          <Ayuda texto="Resúmen de todo lo que requiere acción. Los filtros separan lo URGENTE (90% o más del plazo de preventivo), lo PRÓXIMO (75–90%, para planificar) y las TEMPERATURAS fuera de rango. Dentro de cada filtro, las alertas se agrupan por área: toca un área para ver el detalle compacto de sus equipos." />
        </h2>
        {(() => {
          const urgentes = alertasPrev.filter((x) => x.s.nivel === "danger");
          const proximos = alertasPrev.filter((x) => x.s.nivel === "warn");
          const total = urgentes.length + proximos.length + alertasTemp.length;
          if (!total)
            return (
              <div style={{ display: "flex", background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, overflow: "hidden" }}>
                <Franja color={T.ok} />
                <p style={{ padding: 14, margin: 0, color: T.inkSoft }}>Todo al día: sin preventivos por vencer ni temperaturas fuera de rango.</p>
              </div>
            );

          const filtros = [
            ["danger", "Urgentes", urgentes.length, T.danger, "#fff"],
            ["warn", "Próximos", proximos.length, T.warn, "#141414"],
            ["temp", "Temperatura", alertasTemp.length, T.orange, "#141414"],
          ];
          const seleccion = filtroAlerta === "danger" ? urgentes.map((x) => ({ tipo: "prev", e: x.e, s: x.s }))
            : filtroAlerta === "warn" ? proximos.map((x) => ({ tipo: "prev", e: x.e, s: x.s }))
            : alertasTemp.map((x) => ({ tipo: "temp", e: x.e, l: x.l }));

          /* agrupar por área */
          const grupos = {};
          seleccion.forEach((it) => {
            const g = gerenciaDe(it.e);
            if (!grupos[g]) grupos[g] = [];
            grupos[g].push(it);
          });
          const nombres = Object.keys(grupos).sort((a, b) => grupos[b].length - grupos[a].length || a.localeCompare(b));
          const abrirPorDefecto = seleccion.length <= 8;

          return (
            <>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {filtros.map(([k, lbl, n, bg, fg]) => (
                  <button key={k} onClick={() => { setFiltroAlerta(k); setGruposAbiertos({}); }}
                    style={{
                      padding: "7px 14px", borderRadius: 20, cursor: "pointer", fontFamily: display, fontWeight: 700,
                      fontSize: 15, letterSpacing: "0.04em", textTransform: "uppercase",
                      background: filtroAlerta === k ? bg : "transparent", color: filtroAlerta === k ? fg : T.inkSoft,
                      border: `2px solid ${n > 0 ? bg : T.line}`, opacity: n > 0 || filtroAlerta === k ? 1 : 0.55,
                    }}>
                    {lbl} · {n}
                  </button>
                ))}
              </div>

              {!seleccion.length ? (
                <p style={{ color: T.inkSoft, fontSize: 13.5, margin: "4px 0 0" }}>Sin alertas en esta categoría. ✓</p>
              ) : (
                nombres.map((g) => {
                  const abierto = gruposAbiertos[g] != null ? gruposAbiertos[g] : abrirPorDefecto;
                  return (
                    <div key={g} style={{ marginBottom: 6, border: `1.5px solid ${T.line}`, borderRadius: 8, background: T.panel, overflow: "hidden" }}>
                      <button onClick={() => setGruposAbiertos({ ...gruposAbiertos, [g]: !abierto })}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: body }}>
                        <span style={{ fontFamily: mono, fontSize: 13, color: T.inkSoft, width: 14, flexShrink: 0 }}>{abierto ? "▼" : "▶"}</span>
                        <strong style={{ fontFamily: display, fontSize: 16.5, textTransform: "uppercase", color: T.ink, flex: 1 }}>{g}</strong>
                        <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: "#fff", background: filtroAlerta === "warn" ? T.warn : filtroAlerta === "temp" ? T.orange : T.danger, borderRadius: 10, padding: "1px 9px", ...(filtroAlerta !== "danger" ? { color: "#141414" } : {}) }}>{grupos[g].length}</span>
                      </button>
                      {abierto && (
                        <div style={{ borderTop: `1px solid ${T.line}` }}>
                          {grupos[g].map((it) => (
                            <div key={it.e.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", borderBottom: `1px solid ${T.bg}`, fontSize: 13 }}>
                              <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: 5, background: it.tipo === "temp" ? T.orange : it.s.color, flexShrink: 0 }} />
                              <strong style={{ fontFamily: mono, fontSize: 12.5, whiteSpace: "nowrap" }}>{it.e.nombre}</strong>
                              <CritBadge c={it.e.criticidad} />
                              <span style={{ color: T.inkSoft, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.e.ubicacion}</span>
                              {it.tipo === "prev" ? (
                                <span style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 700, color: it.s.color, whiteSpace: "nowrap" }}>
                                  {it.s.dias}/{it.e.intervaloDias} d · {(it.s.uso * 100).toFixed(0)}%
                                </span>
                              ) : (
                                <span style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 700, color: T.danger, whiteSpace: "nowrap" }}>
                                  {fmt(+it.l.valor)} °C (rango {it.e.tempMin !== "" && it.e.tempMin != null ? it.e.tempMin : "—"} a {it.e.tempMax !== "" && it.e.tempMax != null ? it.e.tempMax : "—"})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <p style={{ fontSize: 12, color: T.inkSoft, margin: "8px 0 0" }}>
                Las áreas se ordenan por cantidad de alertas. Dentro de cada filtro, los equipos criticidad A tienen prioridad de atención.
              </p>
            </>
          );
        })()}
      </section>

      <section>
        <h2 style={h2Style}>
          Equipos por área / gerencia
          <Ayuda texto="Los equipos se agrupan por el área o gerencia donde están instalados. Toca un área para desplegar o esconder sus equipos. El resumen de cada área muestra cuántos equipos tiene y cuántas alertas de preventivo o de temperatura acumula — así se ubica de un vistazo dónde hay que actuar." />
        </h2>
        <input
          style={{ ...inputStyle, maxWidth: 380, marginBottom: 12 }}
          placeholder="Buscar área, gerencia o equipo…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {(() => {
          const q = busqueda.trim().toLowerCase();
          const grupos = {};
          equipos.forEach((e) => {
            const g = gerenciaDe(e);
            if (!grupos[g]) grupos[g] = [];
            grupos[g].push(e);
          });
          const nombresArea = Object.keys(grupos).sort((a, b) => a.localeCompare(b));
          const visibles = nombresArea.filter((g) => {
            if (!q) return true;
            if (g.toLowerCase().includes(q)) return true;
            return grupos[g].some((e) => (e.nombre + " " + e.ubicacion + " " + e.tipo).toLowerCase().includes(q));
          });
          if (!visibles.length)
            return <p style={{ color: T.inkSoft }}>Ninguna área ni equipo coincide con “{busqueda}”.</p>;
          return visibles.map((g) => {
            const lista = grupos[g].filter((e) => !q || g.toLowerCase().includes(q) || (e.nombre + " " + e.ubicacion + " " + e.tipo).toLowerCase().includes(q));
            const nRojo = grupos[g].filter((e) => estadoEquipo(e).nivel === "danger").length;
            const nAmar = grupos[g].filter((e) => estadoEquipo(e).nivel === "warn").length;
            const nTemp = grupos[g].filter((e) => {
              const ls = lecturas.filter((l) => l.equipoId === e.id);
              return ls.length && ls[0].fuera;
            }).length;
            const abierta = q ? true : !!abiertas[g];
            return (
              <div key={g} style={{ marginBottom: 10, border: `1.5px solid ${T.line}`, borderRadius: 8, background: T.panel, overflow: "hidden" }}>
                <button
                  onClick={() => setAbiertas({ ...abiertas, [g]: !abiertas[g] })}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: nRojo + nTemp > 0 ? "rgba(193,39,45,0.05)" : nAmar > 0 ? "rgba(217,164,4,0.06)" : T.panel, border: "none", cursor: "pointer", textAlign: "left", fontFamily: body }}
                >
                  <span style={{ fontFamily: mono, fontSize: 15, color: T.steel, width: 16, flexShrink: 0 }}>{abierta ? "▼" : "▶"}</span>
                  <strong style={{ fontFamily: display, fontSize: 19, textTransform: "uppercase", color: T.ink, flex: 1 }}>{g}</strong>
                  <span style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <span style={{ fontFamily: mono, fontSize: 12, color: T.inkSoft }}>{grupos[g].length} equipo{grupos[g].length === 1 ? "" : "s"}</span>
                    {nRojo > 0 && <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: "#fff", background: T.danger, borderRadius: 10, padding: "1px 8px" }}>{nRojo} urgente{nRojo === 1 ? "" : "s"}</span>}
                    {nAmar > 0 && <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: T.ink, background: T.warn, borderRadius: 10, padding: "1px 8px" }}>{nAmar} próximo{nAmar === 1 ? "" : "s"}</span>}
                    {nTemp > 0 && <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: "#141414", background: T.orange, borderRadius: 10, padding: "1px 8px" }}>{nTemp} temp</span>}
                    {nRojo + nAmar + nTemp === 0 && <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: T.ok }}>al día</span>}
                  </span>
                </button>
                {abierta && (
                  <div style={{ padding: "4px 12px 12px", display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", borderTop: `1px solid ${T.line}` }}>
                    {lista.map((e) => {
                      const s = estadoEquipo(e);
                      const ind = indicadoresEquipo(e, atenciones, lecturas);
                      const lect = ind.ultLectura;
                      return (
                        <div key={e.id} style={{ display: "flex", background: "#FAFBFC", border: `1.5px solid ${T.line}`, borderRadius: 8, overflow: "hidden", marginTop: 8 }}>
                          <Franja color={s.color} />
                          <div style={{ padding: "12px 14px", flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                              <strong style={{ fontFamily: display, fontSize: 18, textTransform: "uppercase" }}>{e.nombre}</strong>
                              <CritBadge c={e.criticidad} />
                            </div>
                            <div style={{ fontSize: 12, color: T.inkSoft }}>{e.tipo} · {e.ubicacion}</div>
                            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontFamily: mono, fontSize: 13 }}>
                              <Dato etiqueta="Disp. 90d" valor={pct(ind.disp90)} color={colorDisp(ind.disp90)} />
                              <Dato etiqueta="Fallas 90d" valor={`${ind.fallas90}`} color={ind.fallas90 > 2 ? T.danger : T.ink} />
                              <Dato etiqueta="Próx. prev." valor={`${Math.max(0, e.intervaloDias - s.dias)} d`} color={s.color} />
                              <Dato etiqueta="TMFS" valor={ind.mtfs != null ? fmt(ind.mtfs) + " h" : "—"} />
                              <Dato etiqueta="Gas total" valor={ind.gasTotal > 0 ? fmt(ind.gasTotal, 2) + " kg" : "—"} color={ind.gasTotal > 2 ? T.warn : T.ink} />
                              <Dato etiqueta="Últ. temp" valor={lect ? fmt(+lect.valor) + " °C" : "—"} color={lect ? (lect.fuera ? T.danger : T.ok) : T.inkSoft} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          });
        })()}
        <p style={{ fontSize: 12, color: T.inkSoft, marginTop: 10 }}>
          Criticidad: A = afecta operaciones o áreas sensibles · B = afecta confort de áreas de trabajo · C = respaldo disponible o impacto menor.
        </p>
      </section>
    </div>
  );
}

/* ============================================================ EQUIPOS */
function Equipos({ equipos, atenciones, lecturas, onAgregar, onEliminar }) {
  const [f, setF] = useState({ nombre: "", tipo: TIPOS_EQUIPO[0], gerencia: "", ubicacion: "", marcaModelo: "", serial: "", refrigerante: REFRIGERANTES[0], anio: "", capacidad: "", criticidad: "B", intervaloDias: "90", ultimoPrev: hoy(), tempMin: "", tempMax: "" });
  const gerenciasExistentes = [...new Set(equipos.map(gerenciaDe))].sort();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const agregar = () => {
    if (!f.nombre.trim() || !f.gerencia.trim() || !f.ubicacion.trim() || !(+f.intervaloDias > 0)) return;
    onAgregar({ ...f, nombre: f.nombre.trim(), gerencia: f.gerencia.trim(), ubicacion: f.ubicacion.trim(), marcaModelo: f.marcaModelo.trim(), serial: f.serial.trim(), capacidad: f.capacidad.trim(), intervaloDias: +f.intervaloDias });
    setF({ ...f, nombre: "", ubicacion: "", marcaModelo: "", serial: "", capacidad: "", anio: "", tempMin: "", tempMax: "" });
  };

  const edad = (anio) => {
    const a = +anio;
    return a > 1950 ? new Date().getFullYear() - a : null;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: 16 }}>
        <h2 style={h2Style}>Nuevo equipo · ficha técnica</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          <Field label="Código / nombre" ayuda="Identificador del equipo. Si la empresa maneja códigos de activo, úsalo (ej: AA-EDF2-014).">
            <input style={inputStyle} value={f.nombre} onChange={set("nombre")} placeholder="AA-EDF2-014" />
          </Field>
          <Field label="Tipo">
            <select style={inputStyle} value={f.tipo} onChange={set("tipo")}>{TIPOS_EQUIPO.map((t) => <option key={t}>{t}</option>)}</select>
          </Field>
          <Field label="Área / Gerencia" ayuda="La gerencia o área de Ferrominera donde está el equipo. El tablero agrupa los equipos por este campo. Escribe el nombre o elige uno ya usado en la lista para mantener los nombres uniformes.">
            <>
              <input style={inputStyle} list="lista-gerencias" value={f.gerencia} onChange={set("gerencia")} placeholder="Edif. Administrativo Sede" />
              <datalist id="lista-gerencias">
                {gerenciasExistentes.map((g) => <option key={g} value={g} />)}
              </datalist>
            </>
          </Field>
          <Field label="Ubicación específica" ayuda="El punto exacto dentro del área: piso, sala, nave. Permite que el técnico encuentre el equipo sin preguntar.">
            <input style={inputStyle} value={f.ubicacion} onChange={set("ubicacion")} placeholder="Piso 2 · oficina de planificación" />
          </Field>
          <Field label="Marca / modelo (opcional)">
            <input style={inputStyle} value={f.marcaModelo} onChange={set("marcaModelo")} placeholder="Carrier 38QRF24" />
          </Field>
          <Field label="Serial (opcional)" ayuda="Número de serie de fábrica que aparece en la placa del equipo. Útil para garantías y pedidos de repuestos. No todos los equipos lo tienen registrado — se puede completar después al visitarlos.">
            <input style={inputStyle} value={f.serial} onChange={set("serial")} placeholder="5804K05926" />
          </Field>
          <Field label="Refrigerante" ayuda="Tipo de gas que usa el equipo. Permite saber qué comprar, controlar el consumo y planificar la transición de gases descontinuados como el R-22.">
            <select style={inputStyle} value={f.refrigerante} onChange={set("refrigerante")}>{REFRIGERANTES.map((r) => <option key={r}>{r}</option>)}</select>
          </Field>
          <Field label="Año instalación (opcional)" ayuda="Permite calcular la edad del equipo. Un equipo viejo con fallas repetidas es un candidato documentado a reemplazo.">
            <input style={inputStyle} type="number" min="1960" max="2030" value={f.anio} onChange={set("anio")} placeholder="2015" />
          </Field>
          <Field label="Capacidad (opcional)">
            <input style={inputStyle} value={f.capacidad} onChange={set("capacidad")} placeholder="24.000 BTU" />
          </Field>
          <Field label="Criticidad" ayuda="A: su falla afecta operaciones o áreas sensibles (sala eléctrica, servidores, comedor). B: afecta confort. C: hay respaldo o impacto menor.">
            <select style={inputStyle} value={f.criticidad} onChange={set("criticidad")}>{CRITICIDAD.map((c) => <option key={c}>{c}</option>)}</select>
          </Field>
          <Field label="Preventivo cada (días)" ayuda="Frecuencia del preventivo en días calendario. Referencias: splits y centrales 90 días; precisión y cavas críticas 30–60.">
            <input style={inputStyle} type="number" min="1" value={f.intervaloDias} onChange={set("intervaloDias")} />
          </Field>
          <Field label="Último preventivo">
            <input style={inputStyle} type="date" value={f.ultimoPrev} onChange={set("ultimoPrev")} />
          </Field>
          <Field label="Temp. objetivo mín (°C)" ayuda="Rango de temperatura esperado del equipo (opcional). Si una lectura sale del rango, el tablero lo alerta. Ej: cava de alimentos 2 a 6 °C; oficina climatizada 22 a 26 °C.">
            <input style={inputStyle} type="number" step="0.5" value={f.tempMin} onChange={set("tempMin")} placeholder="2" />
          </Field>
          <Field label="Temp. objetivo máx (°C)">
            <input style={inputStyle} type="number" step="0.5" value={f.tempMax} onChange={set("tempMax")} placeholder="6" />
          </Field>
        </div>
        <button style={{ ...btn(T.orange), marginTop: 12 }} onClick={agregar}>Agregar equipo</button>
      </section>

      {equipos.map((e) => {
        const s = estadoEquipo(e);
        const ind = indicadoresEquipo(e, atenciones, lecturas);
        const ed = edad(e.anio);
        return (
          <div key={e.id} style={{ display: "flex", background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, overflow: "hidden" }}>
            <Franja color={s.color} />
            <div style={{ padding: 14, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <strong style={{ fontFamily: display, fontSize: 20, textTransform: "uppercase" }}>{e.nombre}</strong>
                  <CritBadge c={e.criticidad} />
                </span>
                <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 600, color: s.color }}>{s.etiqueta}</span>
              </div>
              <div style={{ fontFamily: mono, fontSize: 13, color: T.inkSoft, margin: "4px 0 2px" }}>
                {e.tipo}{e.marcaModelo ? ` · ${e.marcaModelo}` : ""}{e.capacidad ? ` · ${e.capacidad}` : ""} · {gerenciaDe(e)} · {e.ubicacion}
              </div>
              <div style={{ fontFamily: mono, fontSize: 13, color: T.inkSoft }}>
                Gas: {e.refrigerante}{e.serial ? ` · S/N ${e.serial}` : ""}{ed != null ? ` · ${ed} años de servicio` : ""} · último preventivo {e.ultimoPrev} · próximo en {Math.max(0, e.intervaloDias - s.dias)} días · {ind.totalFallas} falla{ind.totalFallas === 1 ? "" : "s"}
              </div>
              <div style={{ marginTop: 8 }}>
                <button style={btnGhost(T.inkSoft)} onClick={() => onEliminar(e.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================ REGISTRAR (atenciones + lecturas) */
function Registrar({ equipos, onAtencion, onLectura }) {
  const [modo, setModo] = useState("correctiva");
  const [f, setF] = useState({ equipoId: "", fecha: hoy(), causa: "", horasFuera: "", kgGas: "", tecnico: "", nota: "", valor: "" });
  const [checks, setChecks] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const eq = equipos.find((x) => x.id === f.equipoId);
  const tareas = eq ? (CHECKLISTS[eq.tipo] || CHECKLISTS["Otro"]) : [];
  const nHechas = tareas.filter((t) => checks[t]).length;

  const esFalla = modo === "correctiva";
  const esPrev = modo === "preventiva";
  const esLectura = modo === "lectura";

  const listo = f.equipoId && f.fecha && (
    (esFalla && f.causa && f.horasFuera !== "") ||
    (esPrev && nHechas > 0) ||
    (esLectura && f.valor !== "")
  );

  const guardar = () => {
    if (!listo) return;
    if (esLectura) {
      const ev = evaluarLectura(eq, +f.valor);
      onLectura({ equipoId: f.equipoId, fecha: f.fecha, valor: +f.valor, fuera: ev.fuera, tecnico: f.tecnico.trim() });
      setF({ ...f, valor: "" });
      return;
    }
    onAtencion({
      equipoId: f.equipoId, tipo: modo, fecha: f.fecha,
      causa: esFalla ? f.causa : "", horasFuera: esFalla ? +f.horasFuera : 0,
      kgGas: f.kgGas === "" ? 0 : +f.kgGas, tecnico: f.tecnico.trim(), nota: f.nota.trim(),
      tareas: esPrev ? tareas.filter((t) => checks[t]) : [],
    });
    setF({ ...f, causa: "", horasFuera: "", kgGas: "", nota: "" });
    setChecks({});
  };

  if (!equipos.length) return <p style={{ color: T.inkSoft }}>Primero registra un equipo en la pestaña <strong>Equipos</strong>.</p>;

  const modos = [["correctiva", "Falla (correctiva)"], ["preventiva", "Preventivo"], ["lectura", "Lectura de temperatura"]];

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {modos.map(([k, lbl]) => (
          <button key={k} onClick={() => setModo(k)}
            style={{ ...(modo === k ? btn(k === "correctiva" ? T.danger : k === "preventiva" ? T.ok : T.frio, true) : btnGhost(T.inkSoft)) }}>
            {lbl}
          </button>
        ))}
      </div>

      <section style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: 16 }}>
        <h2 style={h2Style}>
          {esFalla ? "Registrar falla atendida" : esPrev ? "Registrar preventivo ejecutado" : "Registrar lectura de temperatura"}
          <Ayuda texto={esFalla
            ? "El equipo falló y se reparó: registra la causa raíz, las horas que estuvo fuera de servicio, el técnico y el gas usado si hubo recarga. Alimenta la disponibilidad, el Pareto y el control de refrigerante."
            : esPrev
            ? "Mantenimiento programado ejecutado: marca las tareas del checklist que se realizaron. Al guardar, el semáforo del equipo se reinicia y las tareas quedan en el historial como evidencia del trabajo."
            : "Toma rápida de temperatura del equipo (termómetro o display). Si está fuera del rango objetivo definido en la ficha, el tablero lo alertará — detectar la desviación es anticiparse a la falla."} />
        </h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
          <Field label="Equipo" ancho={220}>
            <select style={inputStyle} value={f.equipoId} onChange={(e) => { setF({ ...f, equipoId: e.target.value }); setChecks({}); }}>
              <option value="">Selecciona…</option>
              {equipos.map((e) => <option key={e.id} value={e.id}>{e.nombre} · {gerenciaDe(e)} · {e.ubicacion}</option>)}
            </select>
          </Field>
          <Field label="Fecha">
            <input style={inputStyle} type="date" value={f.fecha} onChange={set("fecha")} />
          </Field>
          <Field label="Técnico" ayuda="Quién ejecutó la atención o tomó la lectura. Da trazabilidad al trabajo del área.">
            <input style={inputStyle} value={f.tecnico} onChange={set("tecnico")} placeholder="J. Pérez" />
          </Field>

          {esFalla && (
            <>
              <Field label="Causa de la falla" ancho={200}>
                <select style={inputStyle} value={f.causa} onChange={set("causa")}>
                  <option value="">Selecciona…</option>
                  {CAUSAS_FALLA.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Horas fuera de servicio" ayuda="Desde que dejó de funcionar (o se reportó) hasta quedar operativo. Si duró dos días, son 48.">
                <input style={inputStyle} type="number" min="0" step="0.5" value={f.horasFuera} onChange={set("horasFuera")} placeholder="4" />
              </Field>
            </>
          )}

          {esLectura && (
            <Field label="Temperatura medida (°C)">
              <input style={inputStyle} type="number" step="0.1" value={f.valor} onChange={set("valor")} placeholder="4.5" />
            </Field>
          )}

          {!esLectura && (
            <Field label="Refrigerante cargado (kg)" ayuda="Si se recargó gas, anota los kilos. El sistema acumula el consumo por equipo: un equipo que pide gas todos los meses tiene una fuga crónica — dato clave para justificar su reparación de fondo o reemplazo.">
              <input style={inputStyle} type="number" min="0" step="0.1" value={f.kgGas} onChange={set("kgGas")} placeholder="0" />
            </Field>
          )}

          {!esLectura && (
            <Field label="Observaciones (opcional)" ancho={240}>
              <input style={inputStyle} value={f.nota} onChange={set("nota")} placeholder={esFalla ? "Se reemplazó capacitor del ventilador" : "Sin novedades"} />
            </Field>
          )}
        </div>

        {esPrev && eq && (
          <div style={{ marginTop: 14, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: 14, background: "#FAFBFC" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              <strong style={{ fontFamily: display, fontSize: 17, textTransform: "uppercase" }}>
                Checklist · {eq.tipo}
              </strong>
              <span style={{ fontFamily: mono, fontSize: 13, color: nHechas === tareas.length ? T.ok : T.inkSoft }}>
                {nHechas} / {tareas.length} tareas
              </span>
            </div>
            {tareas.map((t) => (
              <label key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderBottom: `1px solid ${T.line}`, cursor: "pointer", fontSize: 14 }}>
                <input type="checkbox" checked={!!checks[t]} onChange={() => setChecks({ ...checks, [t]: !checks[t] })} style={{ width: 17, height: 17, marginTop: 2, accentColor: T.ok, flexShrink: 0 }} />
                <span style={{ color: checks[t] ? T.ink : T.inkSoft, textDecoration: checks[t] ? "none" : "none" }}>{t}</span>
              </label>
            ))}
            <p style={{ fontSize: 12, color: T.inkSoft, margin: "8px 0 0" }}>
              Marca las tareas ejecutadas. Quedan guardadas en el historial como evidencia del preventivo.
            </p>
          </div>
        )}

        {esPrev && !eq && <p style={{ fontSize: 13, color: T.inkSoft, marginTop: 10 }}>Selecciona el equipo para ver su checklist de preventivo.</p>}

        {esLectura && eq && (
          <p style={{ fontSize: 13, color: T.inkSoft, marginTop: 10 }}>
            Rango objetivo de {eq.nombre}: {eq.tempMin !== "" && eq.tempMin != null ? `${eq.tempMin} °C` : "—"} a {eq.tempMax !== "" && eq.tempMax != null ? `${eq.tempMax} °C` : "—"}{(eq.tempMin === "" || eq.tempMin == null) && (eq.tempMax === "" || eq.tempMax == null) ? " (sin rango definido en la ficha — la lectura se guarda sin evaluación)" : ""}.
          </p>
        )}

        <button style={{ ...btn(T.orange), marginTop: 14, opacity: listo ? 1 : 0.5 }} disabled={!listo} onClick={guardar}>
          Guardar registro
        </button>
      </section>
    </div>
  );
}

/* ============================================================ ANÁLISIS */
function Analisis({ equipos, atenciones, lecturas }) {
  const nombre = (id) => equipos.find((e) => e.id === id)?.nombre || "—";
  const equipoDe = (id) => equipos.find((e) => e.id === id);

  /* ---- período de análisis ---- */
  const [periodo, setPeriodo] = useState("90");
  const PERIODOS = [["30", "Últimos 30 días"], ["90", "Últimos 90 días"], ["anio", "Este año"], ["todo", "Todo el historial"]];
  const desde = useMemo(() => {
    if (periodo === "todo") return null;
    if (periodo === "anio") return new Date().getFullYear() + "-01-01";
    return new Date(Date.now() - (+periodo) * 86400000).toISOString().slice(0, 10);
  }, [periodo]);
  const atFiltradas = useMemo(
    () => (desde ? atenciones.filter((a) => a.fecha >= desde) : atenciones),
    [atenciones, desde]
  );
  const etiquetaPeriodo = PERIODOS.find(([k]) => k === periodo)[1].toLowerCase();

  const fallas = atFiltradas.filter((a) => a.tipo === "correctiva");
  const preventivas = atFiltradas.filter((a) => a.tipo === "preventiva");

  /* ---- resumen ejecutivo ---- */
  const horasFueraTotal = fallas.reduce((s, a) => s + (+a.horasFuera || 0), 0);
  const gasTotal = atFiltradas.reduce((s, a) => s + (+a.kgGas || 0), 0);
  const disps = equipos.map((e) => indicadoresEquipo(e, atenciones, lecturas || []).disp90).filter(Number.isFinite);
  const dispProm = disps.length ? disps.reduce((s, d) => s + d, 0) / disps.length : NaN;

  /* ---- Pareto ---- */
  const pareto = useMemo(() => {
    const acc = {};
    fallas.forEach((a) => {
      const c = a.causa || "(sin causa)";
      if (!acc[c]) acc[c] = { n: 0, horas: 0 };
      acc[c].n += 1;
      acc[c].horas += +a.horasFuera || 0;
    });
    const items = Object.entries(acc).sort((a, b) => b[1].horas - a[1].horas);
    const totalH = items.reduce((s, [, v]) => s + v.horas, 0);
    let acum = 0;
    return { totalH, items: items.map(([causa, v]) => { acum += v.horas; return { causa, ...v, pctH: totalH ? v.horas / totalH : 0, pctAcum: totalH ? acum / totalH : 0 }; }) };
  }, [atFiltradas]);

  /* causas que concentran el ~80 % (principio de Pareto) */
  const corte80 = useMemo(() => {
    let k = 0;
    for (let i = 0; i < pareto.items.length; i++) { k = i + 1; if (pareto.items[i].pctAcum >= 0.8) break; }
    return k;
  }, [pareto]);
  const vitales = pareto.items.slice(0, corte80);

  /* ---- consumo de refrigerante ---- */
  const consumoGas = useMemo(() => {
    const acc = {};
    atFiltradas.forEach((a) => {
      const kg = +a.kgGas || 0;
      if (kg > 0) {
        if (!acc[a.equipoId]) acc[a.equipoId] = { kg: 0, recargas: 0 };
        acc[a.equipoId].kg += kg;
        acc[a.equipoId].recargas += 1;
      }
    });
    return Object.entries(acc).map(([id, v]) => ({ id, ...v })).sort((a, b) => b.kg - a.kg);
  }, [atFiltradas]);
  const maxGas = consumoGas.length ? consumoGas[0].kg : 0;
  const porTipoGas = useMemo(() => {
    const acc = {};
    consumoGas.forEach(({ id, kg }) => {
      const e = equipoDe(id);
      const t = e ? e.refrigerante : "No determinado";
      acc[t] = (acc[t] || 0) + kg;
    });
    return Object.entries(acc).sort((a, b) => b[1] - a[1]);
  }, [consumoGas, equipos]);
  const sospechososFuga = consumoGas.filter((c) => c.recargas >= 2);

  if (!atenciones.length)
    return (
      <div style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: 24 }}>
        <p style={{ fontFamily: display, fontSize: 22, fontWeight: 600, margin: "0 0 8px", textTransform: "uppercase" }}>Aún no hay atenciones registradas</p>
        <p style={{ color: T.inkSoft, margin: 0 }}>Cuando registres fallas y preventivos, aquí verás el resumen del área, el diagrama de Pareto de causas, el análisis de consumo de refrigerante y el historial completo.</p>
      </div>
    );

  /* ---- gráfico de Pareto en SVG: barras + curva acumulada ---- */
  const items = pareto.items;
  const W = 660, H = 300, PAD = { l: 46, r: 46, t: 16, b: 78 };
  const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b;
  const maxH = items.length ? items[0].horas : 1;
  const bw = items.length ? Math.min(70, (plotW / items.length) * 0.62) : 0;
  const xc = (i) => PAD.l + (items.length === 1 ? plotW / 2 : (i + 0.5) * (plotW / items.length));
  const yBar = (h) => PAD.t + (1 - h / maxH) * plotH;
  const yPct = (p) => PAD.t + (1 - p) * plotH;
  const curva = items.map((it, i) => `${i ? "L" : "M"}${xc(i).toFixed(1)},${yPct(it.pctAcum).toFixed(1)}`).join(" ");
  const abreviar = (s) => (s.length > 14 ? s.slice(0, 13) + "…" : s);

  const KPI = ({ etiqueta, valor, color, detalle }) => (
    <div style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: "12px 16px", flex: 1, minWidth: 150 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: T.inkSoft }}>{etiqueta}</div>
      <div style={{ fontFamily: mono, fontSize: 26, fontWeight: 700, color: color || T.ink, lineHeight: 1.2 }}>{valor}</div>
      {detalle && <div style={{ fontSize: 11, color: T.inkSoft }}>{detalle}</div>}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ------- resumen ejecutivo ------- */}
      <section>
        <h2 style={h2Style}>
          Resumen del área
          <Ayuda texto="Vista gerencial de un vistazo: cuántas fallas ha habido, cuánto tiempo de equipos caídos costaron, cómo está la disponibilidad promedio del parque (últimos 90 días) y cuánto refrigerante se ha consumido en total." />
        </h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: T.inkSoft }}>Período de análisis:</span>
          <select style={{ ...inputStyle, width: "auto", minWidth: 170 }} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            {PERIODOS.map(([k, lbl]) => <option key={k} value={k}>{lbl}</option>)}
          </select>
          <Ayuda texto="Todos los gráficos e indicadores de esta pestaña se calculan solo con las atenciones del período elegido. Analizar por períodos evita que los problemas viejos ya resueltos escondan los patrones actuales: el Pareto de este trimestre puede ser distinto al del año completo — y ambos cuentan una historia útil." />
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <KPI etiqueta="Fallas registradas" valor={fallas.length} color={fallas.length > 0 ? T.danger : T.ok} detalle={`${preventivas.length} preventivo${preventivas.length === 1 ? "" : "s"} ejecutado${preventivas.length === 1 ? "" : "s"}`} />
          <KPI etiqueta="Horas fuera de servicio" valor={fmt(horasFueraTotal) + " h"} color={T.orange} detalle={"por fallas · " + etiquetaPeriodo} />
          <KPI etiqueta="Disponibilidad promedio" valor={pct(dispProm)} color={colorDisp(dispProm)} detalle="parque completo · 90 días" />
          <KPI etiqueta="Refrigerante consumido" valor={fmt(gasTotal, 2) + " kg"} color={gasTotal > 0 ? "#9A7503" : T.ink} detalle={`${etiquetaPeriodo} · ${consumoGas.reduce((s, c) => s + c.recargas, 0)} recarga${consumoGas.reduce((s, c) => s + c.recargas, 0) === 1 ? "" : "s"}`} />
        </div>
      </section>

      {/* ------- Pareto ------- */}
      <section style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: 16 }}>
        <h2 style={h2Style}>
          Diagrama de Pareto · causas de falla
          <Ayuda texto="Diagrama de Pareto clásico: las barras son las horas fuera de servicio por causa (ordenadas de mayor a menor) y la línea naranja es el porcentaje acumulado. El principio 80/20 dice que pocas causas (las 'vitales') concentran la mayor parte del daño: donde la línea cruza el 80 % está la frontera entre lo vital y lo trivial." />
        </h2>
        {!items.length ? (
          <p style={{ color: T.inkSoft, margin: 0 }}>Sin fallas en el período seleccionado — solo preventivos o ninguna atención. Buena señal (o amplía el período).</p>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 500, display: "block" }} role="img" aria-label="Diagrama de Pareto de causas de falla">
                {/* rejilla y eje izquierdo (horas) */}
                {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                  <g key={f}>
                    <line x1={PAD.l} y1={PAD.t + (1 - f) * plotH} x2={W - PAD.r} y2={PAD.t + (1 - f) * plotH} stroke={T.line} strokeWidth="1" />
                    <text x={PAD.l - 6} y={PAD.t + (1 - f) * plotH + 4} textAnchor="end" fontSize="11" fontFamily={mono} fill={T.inkSoft}>{fmt(maxH * f, 0)}</text>
                  </g>
                ))}
                <text x={12} y={PAD.t + plotH / 2} fontSize="11" fontFamily={body} fill={T.inkSoft} transform={`rotate(-90 12 ${PAD.t + plotH / 2})`} textAnchor="middle">Horas fuera</text>
                {/* eje derecho (% acumulado) */}
                {[0, 0.5, 0.8, 1].map((f) => (
                  <text key={f} x={W - PAD.r + 6} y={yPct(f) + 4} textAnchor="start" fontSize="11" fontFamily={mono} fill={f === 0.8 ? T.orange : T.inkSoft} fontWeight={f === 0.8 ? "700" : "400"}>{(f * 100).toFixed(0)}%</text>
                ))}
                {/* línea 80 % */}
                <line x1={PAD.l} y1={yPct(0.8)} x2={W - PAD.r} y2={yPct(0.8)} stroke={T.orange} strokeWidth="1.5" strokeDasharray="6 4" opacity="0.7" />
                {/* barras */}
                {items.map((it, i) => (
                  <g key={it.causa}>
                    <rect x={xc(i) - bw / 2} y={yBar(it.horas)} width={bw} height={PAD.t + plotH - yBar(it.horas)} rx="3"
                      fill={i < corte80 ? T.danger : T.steel} opacity={i < corte80 ? 0.9 : 0.55} />
                    <text x={xc(i)} y={yBar(it.horas) - 5} textAnchor="middle" fontSize="11" fontFamily={mono} fill={T.ink} fontWeight="600">{fmt(it.horas, 0)}</text>
                    <text x={xc(i)} y={PAD.t + plotH + 16} textAnchor="middle" fontSize="10.5" fontFamily={body} fill={T.inkSoft} transform={`rotate(-28 ${xc(i)} ${PAD.t + plotH + 16})`}>{abreviar(it.causa)}</text>
                  </g>
                ))}
                {/* curva acumulada */}
                <path d={curva} fill="none" stroke={T.orange} strokeWidth="2.5" />
                {items.map((it, i) => (
                  <g key={"p" + i}>
                    <circle cx={xc(i)} cy={yPct(it.pctAcum)} r="4.5" fill={T.orange} stroke="#fff" strokeWidth="1.5" />
                    <text x={xc(i)} y={yPct(it.pctAcum) - 8} textAnchor="middle" fontSize="10.5" fontFamily={mono} fill={T.orange} fontWeight="700">{(it.pctAcum * 100).toFixed(0)}%</text>
                  </g>
                ))}
              </svg>
            </div>

            {/* interpretación automática */}
            <div style={{ borderLeft: `4px solid ${T.orange}`, background: "rgba(232,93,4,0.06)", borderRadius: "0 8px 8px 0", padding: "10px 14px", margin: "10px 0 14px", fontSize: 13.5, lineHeight: 1.55 }}>
              <strong>Lectura del diagrama:</strong>{" "}
              {items.length === 1
                ? `Toda la pérdida registrada (${fmt(pareto.totalH)} h fuera de servicio) proviene de una sola causa: ${items[0].causa}. Es el foco único de mejora del área.`
                : `${corte80} de ${items.length} causas (el ${((corte80 / items.length) * 100).toFixed(0)} % de los tipos de falla) concentran el ${(vitales[vitales.length - 1].pctAcum * 100).toFixed(0)} % del tiempo perdido — las “pocas vitales” en rojo: ${vitales.map((v) => v.causa).join(", ")}. Atacar esas causas primero produce la mayor recuperación de disponibilidad con el menor esfuerzo; las demás (en azul) son las “muchas triviales”.`}
            </div>

            {/* tabla de detalle */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: mono, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: T.ink, color: "#fff", fontFamily: display, fontSize: 13, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    {["#", "Causa", "Fallas", "Horas fuera", "% del total", "% acumulado"].map((h) => (
                      <th key={h} style={{ padding: "7px 12px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr key={it.causa} style={{ background: i < corte80 ? "rgba(193,39,45,0.06)" : i % 2 ? "#F5F7F9" : "#fff" }}>
                      <td style={td}>{i + 1}</td>
                      <td style={{ ...td, fontFamily: body, fontWeight: i < corte80 ? 600 : 400 }}>{it.causa}{i < corte80 ? " ★" : ""}</td>
                      <td style={td}>{it.n}</td>
                      <td style={td}>{fmt(it.horas)} h</td>
                      <td style={td}>{(it.pctH * 100).toFixed(1)} %</td>
                      <td style={{ ...td, fontWeight: 600, color: it.pctAcum <= 0.8 ? T.danger : T.inkSoft }}>{(it.pctAcum * 100).toFixed(1)} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: T.inkSoft, margin: "8px 0 0" }}>★ = causas vitales (concentran ~80 % del tiempo perdido). Total: {fmt(pareto.totalH)} h fuera de servicio en {fallas.length} falla{fallas.length === 1 ? "" : "s"}.</p>
          </>
        )}
      </section>

      {/* ------- consumo de refrigerante ------- */}
      {consumoGas.length > 0 && (
        <section style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: 16 }}>
          <h2 style={h2Style}>
            Consumo de refrigerante
            <Ayuda texto="Un equipo bien sellado NO debería consumir gas: cada recarga es señal de una fuga. Un equipo con recargas repetidas tiene una fuga crónica — el gasto acumulado en gas suele superar el costo de la reparación de fondo, y esa comparación es el argumento para autorizarla." />
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {consumoGas.map(({ id, kg, recargas }, i) => {
              const e = equipoDe(id);
              const cronica = recargas >= 2;
              return (
                <div key={id} style={{ border: `1.5px solid ${cronica ? T.warn : T.line}`, borderRadius: 8, padding: "10px 14px", background: cronica ? "rgba(217,164,4,0.05)" : "#FAFBFC" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                    <span style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <strong style={{ fontFamily: display, fontSize: 17, textTransform: "uppercase" }}>{nombre(id)}</strong>
                      {e && <span style={{ fontFamily: mono, fontSize: 12, color: T.inkSoft }}>{e.refrigerante} · {gerenciaDe(e)}</span>}
                      {cronica && (
                        <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, padding: "1px 8px", borderRadius: 4, background: T.warn, color: T.ink }}>
                          ⚠ POSIBLE FUGA CRÓNICA
                        </span>
                      )}
                    </span>
                    <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 700, color: "#9A7503" }}>{fmt(kg, 2)} kg · {recargas} recarga{recargas === 1 ? "" : "s"}</span>
                  </div>
                  <div style={{ height: 14, background: T.bg, borderRadius: 4, border: `1px solid ${T.line}` }}>
                    <div style={{ height: "100%", width: `${(kg / maxGas) * 100}%`, background: cronica ? T.warn : T.frio, borderRadius: 4, minWidth: 2 }} />
                  </div>
                  {cronica && (
                    <p style={{ fontSize: 12.5, color: T.inkSoft, margin: "6px 0 0" }}>
                      {recargas} recargas acumuladas: el gas se está escapando en algún punto. Recomendación: prueba de fugas
                      con detector electrónico y reparación de fondo{e && e.refrigerante === "R-22" ? " — con el agravante de que el R-22 está descontinuado y cada kilo es más caro y difícil de conseguir" : ""}.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {porTipoGas.length > 0 && (
            <div style={{ marginTop: 14, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
              <strong style={{ fontFamily: display, fontSize: 15, textTransform: "uppercase", color: T.inkSoft }}>Consumo por tipo de gas</strong>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
                {porTipoGas.map(([tipo, kg]) => (
                  <span key={tipo} style={{ fontFamily: mono, fontSize: 13, padding: "5px 12px", borderRadius: 6, background: T.bg, border: `1.5px solid ${T.line}` }}>
                    <strong>{tipo}</strong>: {fmt(kg, 2)} kg
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 12, color: T.inkSoft, margin: "8px 0 0" }}>
                Este desglose indica qué gases debe mantener en inventario el área y en qué cantidades — insumo directo para la planificación de compras.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ------- historial ------- */}
      <section>
        <h2 style={h2Style}>Historial de atenciones <span style={{ fontFamily: mono, fontSize: 13, color: T.inkSoft, textTransform: "none", letterSpacing: "normal" }}>({etiquetaPeriodo} · {atFiltradas.length})</span></h2>
        {!atFiltradas.length && <p style={{ color: T.inkSoft }}>Sin atenciones en el período seleccionado — amplía el período para ver registros anteriores.</p>}
        {atFiltradas.map((a) => (
          <div key={a.id} style={{ display: "flex", background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
            <Franja color={a.tipo === "correctiva" ? T.danger : T.ok} />
            <div style={{ padding: "10px 14px", fontSize: 13, flex: 1 }}>
              <span style={{ fontFamily: mono, color: T.inkSoft }}>{a.fecha}</span>{" "}
              <strong style={{ fontFamily: display, fontSize: 16, textTransform: "uppercase" }}>{nombre(a.equipoId)}</strong>{" "}
              <span style={{ color: a.tipo === "correctiva" ? T.danger : T.ok, fontWeight: 600 }}>{a.tipo === "correctiva" ? "CORRECTIVA" : "PREVENTIVA"}</span>
              {a.tecnico && <span style={{ fontFamily: mono, color: T.inkSoft }}> · {a.tecnico}</span>}
              {a.tipo === "correctiva" && <span style={{ fontFamily: mono, color: T.inkSoft }}> · {a.causa} · {fmt(+a.horasFuera)} h fuera</span>}
              {+a.kgGas > 0 && <span style={{ fontFamily: mono, color: "#9A7503" }}> · {fmt(+a.kgGas, 2)} kg de gas</span>}
              {a.tipo === "preventiva" && a.tareas && a.tareas.length > 0 && (
                <div style={{ color: T.inkSoft, marginTop: 3 }}>✓ {a.tareas.length} tarea{a.tareas.length === 1 ? "" : "s"} del checklist: {a.tareas.join(" · ")}</div>
              )}
              {a.nota && <div style={{ color: T.inkSoft }}>{a.nota}</div>}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

const td = { padding: "7px 12px", whiteSpace: "nowrap" };

/* ============================================================ GUÍA */
function Guia({ onVaciar, onReal }) {
  const S = ({ titulo, ayuda, children }) => (
    <section style={{ background: T.panel, border: `1.5px solid ${T.line}`, borderRadius: 8, padding: 16 }}>
      <h2 style={h2Style}>{titulo}{ayuda && <Ayuda texto={ayuda} />}</h2>
      <div style={{ fontSize: 14, lineHeight: 1.65 }}>{children}</div>
    </section>
  );

  const Chip = ({ color, texto, oscuro }) => (
    <span style={{ display: "inline-block", fontFamily: mono, fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 10, background: color, color: oscuro ? "#141414" : "#fff", marginRight: 6, verticalAlign: "middle" }}>{texto}</span>
  );

  const Paso = ({ n, titulo, texto }) => (
    <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
      <div style={{ width: 30, height: 30, borderRadius: 15, background: T.orange, color: "#141414", fontFamily: display, fontWeight: 700, fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</div>
      <div>
        <strong style={{ fontFamily: display, fontSize: 16.5, textTransform: "uppercase" }}>{titulo}</strong>
        <div style={{ fontSize: 13.5, color: T.inkSoft }}>{texto}</div>
      </div>
    </div>
  );

  const Tarjeta = ({ color, titulo, children }) => (
    <div style={{ display: "flex", border: `1.5px solid ${T.line}`, borderRadius: 8, overflow: "hidden", marginBottom: 10, background: "#FAFBFC" }}>
      <Franja color={color} />
      <div style={{ padding: "10px 14px" }}>
        <strong style={{ fontFamily: display, fontSize: 16, textTransform: "uppercase", color }}>{titulo}</strong>
        <div style={{ fontSize: 13.5, color: T.ink, marginTop: 2 }}>{children}</div>
      </div>
    </div>
  );

  const Def = ({ termino, children }) => (
    <div style={{ padding: "8px 0", borderBottom: `1px solid ${T.line}` }}>
      <strong style={{ fontFamily: display, fontSize: 15.5, textTransform: "uppercase", letterSpacing: "0.03em" }}>{termino}</strong>
      <div style={{ fontSize: 13.5, color: T.inkSoft }}>{children}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 800 }}>

      <S titulo="¿Qué es TPM FMO?">
        <p style={{ margin: "6px 0" }}>
          <strong>TPM</strong> son las siglas de <strong>Mantenimiento Productivo Total</strong> (Total Productive
          Maintenance), la metodología de gestión que busca cero fallas y cero pérdidas en los equipos; y
          <strong> FMO</strong> son las siglas de <strong>Ferrominera Orinoco</strong>. TPM FMO es, entonces, el sistema
          de gestión del mantenimiento de los <strong>equipos de refrigeración</strong> del área de
          Servicios Industriales: el inventario completo con su ficha técnica, el calendario de preventivos con
          alertas automáticas, el registro de cada falla atendida y los indicadores que muestran cómo se está
          desempeñando el parque de equipos.
        </p>
        <p style={{ margin: "6px 0" }}>
          Su objetivo es apoyar el paso del mantenimiento <strong style={{ color: T.danger }}>correctivo</strong> (reparar
          cuando el equipo ya falló) al <strong style={{ color: T.ok }}>preventivo</strong> (intervenir antes de la falla).
          La diferencia es dinero y servicio: una cava que se daña pierde alimentos, un aire de sala eléctrica que se
          detiene compromete equipos críticos, y una reparación de emergencia siempre cuesta más que un mantenimiento
          programado. Además, un equipo con mantenimiento al día consume menos energía y dura más años.
        </p>
      </S>

      <S titulo="Cómo empezar (una sola vez)">
        <Paso n="1" titulo="Levanta el inventario" texto="En EQUIPOS registra cada aire, cava, chiller o bebedero con su área/gerencia, ubicación exacta, tipo de gas, criticidad y frecuencia de preventivo en días. Si no se conoce la fecha del último preventivo, usa una estimada: el sistema empieza a contar desde ahí." />
        <Paso n="2" titulo="Define los rangos de temperatura" texto="En los equipos donde la temperatura es crítica (cavas, neveras, aires de precisión), define el rango objetivo en la ficha — así el sistema podrá avisar cuando una lectura salga de rango." />
        <Paso n="3" titulo="Registra el trabajo diario" texto="Desde ese momento, cada falla atendida, cada preventivo ejecutado y cada lectura de temperatura se anota en REGISTRAR. Con eso, el sistema hace el resto solo." />
      </S>

      <S titulo="Los tres tipos de registro">
        <Tarjeta color={T.danger} titulo="Falla (correctiva)">
          El equipo falló y se atendió. Se registra la <strong>causa raíz</strong>, las <strong>horas fuera de
          servicio</strong>, el técnico y el gas usado si hubo recarga. Alimenta la disponibilidad, el Pareto de causas
          y el control de refrigerante.
        </Tarjeta>
        <Tarjeta color={T.ok} titulo="Preventivo (programado)">
          Mantenimiento planificado ejecutado. El sistema muestra el <strong>checklist de tareas según el tipo de
          equipo</strong> (un chiller no se atiende igual que un split): se marcan las tareas realizadas y quedan
          guardadas como evidencia. Al guardar, el semáforo del equipo vuelve a cero.
        </Tarjeta>
        <Tarjeta color={T.frio} titulo="Lectura de temperatura">
          Toma rápida del valor actual del equipo en las rondas por las áreas. Si sale del rango objetivo, el tablero
          lo alerta de inmediato: <strong>la desviación de temperatura es el primer síntoma de una falla en
          desarrollo</strong> — detectarla a tiempo es la esencia de lo preventivo.
        </Tarjeta>
      </S>

      <S titulo="El semáforo de preventivos">
        <p style={{ margin: "6px 0" }}>
          Cada equipo tiene una <strong>frecuencia de preventivo en días calendario</strong> (ej.: cada 90 días).
          El sistema cuenta automáticamente los días desde el último preventivo y avisa:
        </p>
        <p style={{ margin: "10px 0 4px" }}>
          <Chip color={T.ok} texto="VERDE" /> Menos del 75 % del plazo consumido. Todo en orden.
        </p>
        <p style={{ margin: "4px 0" }}>
          <Chip color={T.warn} texto="PRÓXIMO" oscuro /> Entre 75 % y 90 %. Planificar: materiales, personal y fecha.
        </p>
        <p style={{ margin: "4px 0 10px" }}>
          <Chip color={T.danger} texto="URGENTE" /> 90 % o más. Ejecutar cuanto antes: cada día extra aumenta el riesgo
          de falla en pleno servicio.
        </p>
        <p style={{ margin: "6px 0" }}>
          Las alertas priorizan automáticamente a los equipos de <strong>criticidad A</strong> — los que afectan
          operaciones o áreas sensibles (salas eléctricas, servidores, comedores). B afecta el confort de áreas de
          trabajo, y C tiene respaldo o impacto menor.
        </p>
      </S>

      <S titulo="El tablero por áreas">
        <p style={{ margin: "6px 0" }}>
          Los equipos se agrupan por <strong>área o gerencia</strong>. Cada área es una franja desplegable: cerrada
          muestra su resumen (cuántos equipos y cuántas alertas de cada tipo), y al tocarla se abren sus equipos con
          todos los indicadores. El <strong>buscador</strong> ubica al instante un área o un equipo específico por su
          código. Así, aunque el parque tenga cientos de equipos repartidos por toda la empresa, el estado de cada
          zona se lee en segundos: <em>dónde hay que actuar hoy</em>.
        </p>
      </S>

      <S titulo="Diccionario de indicadores">
        <Def termino="Disponibilidad (90 días)">Porcentaje del tiempo que el equipo estuvo operativo en los últimos 90 días, descontando las horas fuera de servicio por fallas. Meta razonable: sobre 97 % en equipos críticos.</Def>
        <Def termino="TMFS — tiempo medio fuera de servicio">Horas promedio que un equipo pasa detenido por cada falla. Refleja la rapidez de la atención y la logística de repuestos: si sube, algo está frenando al área.</Def>
        <Def termino="Diagrama de Pareto">Ordena las causas de falla por las horas que costaron y marca las “pocas vitales” que concentran ~80 % del tiempo perdido. Atacarlas primero produce la mayor mejora con el menor esfuerzo.</Def>
        <Def termino="Consumo de refrigerante">Kilos de gas cargados por equipo. Un equipo sellado no consume gas: cada recarga delata una fuga, y las recargas repetidas (⚠ fuga crónica) justifican una reparación de fondo — el gasto acumulado en gas suele superar el costo de repararla.</Def>
        <Def termino="Criticidad A / B / C">Clasificación del impacto de la falla del equipo: A = operaciones o áreas sensibles, B = confort de áreas de trabajo, C = respaldo disponible o impacto menor.</Def>
      </S>

      <S titulo="Rutina recomendada del área">
        <Paso n="1" titulo="Cada día" texto="Registrar las atenciones ejecutadas (con su técnico) el mismo día. Revisar el tablero: amarillos se planifican, rojos se ejecutan, temperaturas fuera de rango se inspeccionan." />
        <Paso n="2" titulo="En cada ronda" texto="Tomar lecturas de temperatura de los equipos críticos (cavas, precisión) y registrarlas — toma segundos y es la alerta más temprana que existe." />
        <Paso n="3" titulo="Cada semana" texto="Revisar ANÁLISIS: la causa dominante del Pareto y el mayor consumidor de gas definen las acciones de mejora de la semana." />
        <Paso n="4" titulo="Cada mes" texto="Presentar el resumen del área (fallas, horas fuera, disponibilidad, gas) a la supervisión — los indicadores salen listos del sistema." />
      </S>

      <section style={{ background: T.panel, border: `1.5px dashed ${T.line}`, borderRadius: 8, padding: 16 }}>
        <strong style={{ fontFamily: display, fontSize: 16, textTransform: "uppercase", color: T.inkSoft }}>Mantenimiento del sistema</strong>
        <p style={{ fontSize: 13, color: T.inkSoft, margin: "6px 0 10px" }}>
          Borra todos los equipos, atenciones y lecturas guardados en este dispositivo y devuelve la aplicación a su
          estado inicial. Útil para reiniciar una demostración o empezar el levantamiento real desde cero.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={btn("#141414", true)} onClick={onReal}>Cargar Programa 2026 · inventario real</button>
          <button style={btnGhost(T.danger)} onClick={onVaciar}>Vaciar todos los datos</button>
        </div>
        <p style={{ fontSize: 12, color: T.inkSoft, margin: "8px 0 0" }}>
          "Cargar Programa 2026" reemplaza los datos actuales por los 520 equipos del programa FERRO-5479 del taller
          (pide confirmación si hay datos). Útil para demostraciones y para iniciar la operación real.
        </p>
      </section>

      <p style={{ fontSize: 12, color: T.inkSoft, textAlign: "center", margin: "4px 0 0" }}>
        TPM FMO · Módulo Refrigeración · CVG Ferrominera Orinoco · Servicios Industriales
      </p>
    </div>
  );
}
