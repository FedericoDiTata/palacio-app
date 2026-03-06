import { useState, useEffect, useRef } from "react";

const LOGO_B64 = "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAA==";

// Colors
const C = {
  onix: "#070707",
  grafito_oscuro: "#111111",
  grafito: "#383838",
  perla: "#e4e4e4",
  oro: "#c6a453",
  oro_dim: "#c6a45344",
  oro_light: "#e8c97a",
  danger: "#8b2020",
  success: "#2a5c3f",
};

const WEEKS = ["Sem 2-8", "Sem 9-15", "Sem 16-22", "Sem 23-1"];
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAY_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const USERS = ["Vos", "Socio"];
const STATUSES = ["pendiente", "en curso", "listo"];

const TODAY_DAY = (() => {
  const d = new Date().getDay();
  // Sun=0 -> 6, Mon=1->0...
  return d === 0 ? 6 : d - 1;
})();

let _taskId = 200;
let _subId = 2000;

const SEED_TASKS = [
  { id: 1, title: "Contenido eficiente con poco esfuerzo", week: "Sem 2-8", day: "Lun", assignee: "Vos", status: "listo", subtasks: [{ id: 11, title: "Definir formato", done: true }, { id: 12, title: "Crear plantillas", done: true }], decayDays: 0 },
  { id: 2, title: "Listas semanales a vendedores", week: "Sem 2-8", day: "Mar", assignee: "Socio", status: "en curso", subtasks: [{ id: 21, title: "Armar lista de productos", done: true }], decayDays: 1 },
  { id: 3, title: "Cross-upselling + Camino cliente", week: "Sem 2-8", day: "Mié", assignee: "Vos", status: "pendiente", subtasks: [], decayDays: 2 },
  { id: 4, title: "Gamificación", week: "Sem 9-15", day: "Lun", assignee: "Socio", status: "pendiente", subtasks: [], decayDays: 0 },
  { id: 5, title: "Automatizaciones post-venta y calendar de entregas", week: "Sem 9-15", day: "Mar", assignee: "Vos", status: "pendiente", subtasks: [{ id: 51, title: "Mapear flujo post-venta", done: false }, { id: 52, title: "Configurar calendar", done: false }], decayDays: 0 },
  { id: 6, title: "Rediseño documentos", week: "Sem 9-15", day: "Jue", assignee: "Socio", status: "pendiente", subtasks: [], decayDays: 0 },
  { id: 7, title: "Asociarnos con 15 Locales B2B", week: "Sem 16-22", day: "Lun", assignee: "Vos", status: "pendiente", subtasks: [], decayDays: 0 },
  { id: 8, title: "3 Empresas B2B como Factor", week: "Sem 16-22", day: "Mié", assignee: "Socio", status: "pendiente", subtasks: [], decayDays: 0 },
  { id: 9, title: "Comunidad WPP Activa", week: "Sem 16-22", day: "Vie", assignee: "Vos", status: "pendiente", subtasks: [], decayDays: 0 },
  { id: 10, title: "Liquidar stock usados", week: "Sem 16-22", day: "Sáb", assignee: "Socio", status: "pendiente", subtasks: [], decayDays: 0 },
  { id: 13, title: "Rifas iPhones", week: "Sem 16-22", day: "Dom", assignee: "Socio", status: "pendiente", subtasks: [], decayDays: 0 },
  { id: 14, title: "Sitio web", week: "Sem 23-1", day: "Lun", assignee: "Vos", status: "pendiente", subtasks: [{ id: 141, title: "Estructura del sitio", done: false }, { id: 142, title: "Diseño visual", done: false }, { id: 143, title: "Subir productos", done: false }], decayDays: 0 },
  { id: 15, title: "Matar a piñas al vato estafador", week: "Sem 23-1", day: "Mar", assignee: "Socio", status: "pendiente", subtasks: [], decayDays: 0 },
];

function loadTasks() {
  try {
    const s = localStorage.getItem("pa_tasks_v3");
    if (s) return JSON.parse(s);
  } catch {}
  return SEED_TASKS;
}

function saveTasks(tasks) {
  try { localStorage.setItem("pa_tasks_v3", JSON.stringify(tasks)); } catch {}
}

function loadStreak() {
  try {
    const s = localStorage.getItem("pa_streak_v1");
    if (s) return JSON.parse(s);
  } catch {}
  return { vos: 0, socio: 0, lastDate: null };
}

function saveStreak(streak) {
  try { localStorage.setItem("pa_streak_v1", JSON.stringify(streak)); } catch {}
}

// Decay: how "urgent" a task looks based on days untouched
function decayClass(days) {
  if (days >= 3) return "decay-critical";
  if (days >= 1) return "decay-warn";
  return "";
}

// ---- MODAL ----
function TaskModal({ task, onClose, onSave, onDelete }) {
  const [t, setT] = useState({ ...task, subtasks: task.subtasks.map(s => ({ ...s })) });
  const [newSub, setNewSub] = useState("");

  function cycleStatus() {
    const idx = STATUSES.indexOf(t.status);
    setT(prev => ({ ...prev, status: STATUSES[(idx + 1) % STATUSES.length] }));
  }

  function addSub() {
    if (!newSub.trim()) return;
    setT(prev => ({ ...prev, subtasks: [...prev.subtasks, { id: _subId++, title: newSub.trim(), done: false }] }));
    setNewSub("");
  }

  const statusColor = { pendiente: "#555", "en curso": C.oro, listo: "#4a7c59" };
  const done = t.subtasks.filter(s => s.done).length;
  const total = t.subtasks.length;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.grafito_oscuro, border: `1px solid ${C.grafito}`,
        borderTop: `2px solid ${C.oro}`,
        borderRadius: 4, padding: "28px 24px", width: "100%", maxWidth: 500,
        maxHeight: "88vh", overflowY: "auto",
        boxShadow: `0 0 60px ${C.oro}18`,
        fontFamily: "'Cormorant Garamond', 'Palatino Linotype', Georgia, serif"
      }}>
        {/* Title */}
        <textarea value={t.title} onChange={e => setT(p => ({ ...p, title: e.target.value }))}
          style={{ background: "transparent", border: "none", borderBottom: `1px solid ${C.grafito}`, outline: "none", color: C.perla, fontSize: 20, fontWeight: 600, fontFamily: "inherit", width: "100%", resize: "none", lineHeight: 1.5, marginBottom: 20, paddingBottom: 8 }}
          rows={2} />

        {/* Meta row */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
          {[["SEMANA", "week", WEEKS], ["DÍA", "day", DAYS]].map(([label, key, opts]) => (
            <div key={key}>
              <div style={{ color: C.oro, fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>{label}</div>
              <select value={t[key]} onChange={e => setT(p => ({ ...p, [key]: e.target.value }))}
                style={{ background: C.grafito, border: "none", color: C.perla, borderRadius: 3, padding: "5px 8px", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div>
            <div style={{ color: C.oro, fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>RESPONSABLE</div>
            <select value={t.assignee} onChange={e => setT(p => ({ ...p, assignee: e.target.value }))}
              style={{ background: C.grafito, border: "none", color: C.perla, borderRadius: 3, padding: "5px 8px", fontFamily: "inherit", fontSize: 12, cursor: "pointer" }}>
              {USERS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <div style={{ color: C.oro, fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>ESTADO</div>
            <button onClick={cycleStatus} style={{
              background: `${statusColor[t.status]}22`,
              border: `1px solid ${statusColor[t.status]}`,
              color: statusColor[t.status],
              borderRadius: 3, padding: "5px 10px", cursor: "pointer",
              fontFamily: "inherit", fontSize: 11, letterSpacing: 1
            }}>
              {t.status.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Subtasks */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: C.oro, fontSize: 9, letterSpacing: 2, marginBottom: 10 }}>SUBTAREAS {total > 0 && `· ${done}/${total}`}</div>
          {t.subtasks.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.grafito}22`, padding: "6px 0" }}>
              <input type="checkbox" checked={s.done}
                onChange={() => setT(p => ({ ...p, subtasks: p.subtasks.map(x => x.id === s.id ? { ...x, done: !x.done } : x) }))}
                style={{ accentColor: C.oro, cursor: "pointer" }} />
              <span style={{ flex: 1, color: s.done ? C.grafito : C.perla, textDecoration: s.done ? "line-through" : "none", fontSize: 14 }}>{s.title}</span>
              <button onClick={() => setT(p => ({ ...p, subtasks: p.subtasks.filter(x => x.id !== s.id) }))}
                style={{ background: "none", border: "none", color: C.grafito, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => e.key === "Enter" && addSub()}
              placeholder="Agregar subtarea..." style={{ flex: 1, background: C.grafito, border: "none", color: C.perla, borderRadius: 3, padding: "6px 10px", fontFamily: "inherit", fontSize: 13, outline: "none" }} />
            <button onClick={addSub} style={{ background: C.oro_dim, border: `1px solid ${C.oro}55`, color: C.oro, borderRadius: 3, padding: "6px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>+</button>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: `1px solid ${C.grafito}` }}>
          <button onClick={() => onDelete(task.id)} style={{ background: "none", border: `1px solid ${C.danger}55`, color: "#a04040", borderRadius: 3, padding: "8px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, letterSpacing: 1 }}>ELIMINAR</button>
          <button onClick={() => onSave(t)} style={{ background: C.oro_dim, border: `1px solid ${C.oro}`, color: C.oro, borderRadius: 3, padding: "8px 24px", cursor: "pointer", fontFamily: "inherit", fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>GUARDAR</button>
        </div>
      </div>
    </div>
  );
}

// ---- TASK CARD ----
function TaskCard({ task, onOpen, compact }) {
  const [hover, setHover] = useState(false);
  const done = task.subtasks.filter(s => s.done).length;
  const total = task.subtasks.length;
  const decay = task.decayDays || 0;

  const borderColor = task.status === "listo" ? "#2a5c3f" : task.status === "en curso" ? C.oro : decay >= 3 ? "#8b2020" : decay >= 1 ? "#7a6020" : C.grafito;
  const glowColor = task.status === "listo" ? "#2a5c3f33" : task.status === "en curso" ? `${C.oro}22` : decay >= 3 ? "#8b202022" : "transparent";

  return (
    <div onClick={() => onOpen(task)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? "#1a1a1a" : C.grafito_oscuro,
        border: `1px solid ${borderColor}`,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 2,
        padding: compact ? "8px 10px" : "10px 12px",
        cursor: "pointer",
        boxShadow: hover ? `0 0 20px ${glowColor}` : "none",
        transition: "all 0.2s",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* Decay shimmer for critical */}
      {decay >= 3 && (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent 0%, #8b202011 50%, transparent 100%)", animation: "shimmer 2s infinite", pointerEvents: "none" }} />
      )}
      <div style={{ color: task.status === "listo" ? "#4a7c59" : C.perla, fontSize: compact ? 12 : 13, fontWeight: 500, lineHeight: 1.4, textDecoration: task.status === "listo" ? "line-through" : "none", marginBottom: 5, opacity: task.status === "listo" ? 0.6 : 1 }}>
        {task.title}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: task.assignee === "Vos" ? "#1a3a2a" : "#1a2a3a", border: `1px solid ${task.assignee === "Vos" ? "#2a7a4a" : "#2a4a7a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: task.assignee === "Vos" ? "#4a9a6a" : "#4a6a9a", fontWeight: 700, flexShrink: 0 }}>
          {task.assignee === "Vos" ? "V" : "S"}
        </div>
        {total > 0 && (
          <div style={{ flex: 1, height: 2, background: C.grafito, borderRadius: 1 }}>
            <div style={{ background: task.status === "listo" ? "#4a7c59" : C.oro, height: "100%", borderRadius: 1, width: `${(done / total) * 100}%`, transition: "width 0.3s" }} />
          </div>
        )}
        {decay >= 1 && task.status !== "listo" && (
          <div style={{ fontSize: 9, color: decay >= 3 ? "#c04040" : "#a08030", letterSpacing: 0.5 }}>{decay}d sin tocar</div>
        )}
      </div>
    </div>
  );
}

// ---- MAIN APP ----
export default function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [view, setView] = useState("dia"); // "dia" | "semana"
  const [activeWeek, setActiveWeek] = useState(WEEKS[0]);
  const [activeDay, setActiveDay] = useState(DAYS[TODAY_DAY] || DAYS[0]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterUser, setFilterUser] = useState("Todos");
  const [streak, setStreak] = useState(loadStreak);
  const [showCelebration, setShowCelebration] = useState(false);
  const [ritualDone, setRitualDone] = useState(false);

  useEffect(() => { saveTasks(tasks); }, [tasks]);
  useEffect(() => { saveStreak(streak); }, [streak]);

  // Cross-tab sync
  useEffect(() => {
    const h = e => { if (e.key === "pa_tasks_v3") { try { setTasks(JSON.parse(e.newValue)); } catch {} } };
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
  }, []);

  function saveTask(t) {
    setTasks(prev => prev.map(x => x.id === t.id ? { ...t, decayDays: 0 } : x));
    setSelectedTask(null);
    // Check if all day tasks done
    checkDayCompletion(tasks.map(x => x.id === t.id ? t : x));
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(x => x.id !== id));
    setSelectedTask(null);
  }

  function addTask(week, day) {
    const nt = { id: _taskId++, title: "Nueva tarea", week, day, assignee: "Vos", status: "pendiente", subtasks: [], decayDays: 0 };
    setTasks(prev => [...prev, nt]);
    setSelectedTask(nt);
  }

  function quickComplete(task) {
    const updated = { ...task, status: task.status === "listo" ? "pendiente" : "listo", decayDays: 0 };
    setTasks(prev => prev.map(x => x.id === task.id ? updated : x));
    checkDayCompletion(tasks.map(x => x.id === task.id ? updated : x));
  }

  function checkDayCompletion(currentTasks) {
    const dayTasks = currentTasks.filter(t => t.day === activeDay);
    if (dayTasks.length > 0 && dayTasks.every(t => t.status === "listo")) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }

  const filtered = tasks.filter(t => filterUser === "Todos" || t.assignee === filterUser);

  // Stats
  const allTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === "listo").length;
  const inProgress = tasks.filter(t => t.status === "en curso").length;
  const todayTasks = tasks.filter(t => t.day === activeDay);
  const todayDone = todayTasks.filter(t => t.status === "listo").length;

  const dayFilteredTasks = (day) => filtered.filter(t => t.week === activeWeek && t.day === day);
  const weekFilteredTasks = (week) => filtered.filter(t => t.week === week && t.day === activeDay);

  return (
    <div style={{ minHeight: "100vh", background: C.onix, color: C.perla, fontFamily: "'Cormorant Garamond', 'Palatino Linotype', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${C.onix}; }
        ::-webkit-scrollbar-thumb { background: ${C.grafito}; }
        input::placeholder, textarea::placeholder { color: ${C.grafito}; }
        select option { background: ${C.grafito_oscuro}; }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes celebrate { 0%{opacity:0;transform:scale(0.8)} 20%{opacity:1;transform:scale(1.05)} 80%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.95)} }
        .task-anim { animation: fadeIn 0.25s ease; }
        .btn-hover:hover { opacity: 0.8; }
      `}</style>

      {/* CELEBRATION */}
      {showCelebration && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ background: C.grafito_oscuro, border: `2px solid ${C.oro}`, borderRadius: 4, padding: "28px 48px", textAlign: "center", animation: "celebrate 3s ease forwards", boxShadow: `0 0 80px ${C.oro}44` }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
            <div style={{ fontSize: 22, color: C.oro, fontWeight: 700, letterSpacing: 2 }}>DÍA CERRADO</div>
            <div style={{ fontSize: 14, color: C.perla, marginTop: 6, opacity: 0.6 }}>Todas las tareas completadas</div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${C.grafito}`, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", background: C.grafito_oscuro }}>
        <img src={`data:image/jpeg;base64,${LOGO_B64}`} alt="Palacio Apple" style={{ height: 36, opacity: 0.9 }} onError={e => { e.target.style.display = 'none'; }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: C.oro, opacity: 0.7 }}>COMMAND CENTER</div>
          <div style={{ fontSize: 9, letterSpacing: 2, color: C.grafito, marginTop: 1 }}>FEBRERO · 2026</div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, color: C.oro, fontWeight: 700 }}>{todayDone}/{todayTasks.length}</div>
            <div style={{ fontSize: 8, color: C.grafito, letterSpacing: 1 }}>HOY</div>
          </div>
          <div style={{ width: 1, height: 32, background: C.grafito }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, color: "#4a7c59", fontWeight: 700 }}>{doneTasks}</div>
            <div style={{ fontSize: 8, color: C.grafito, letterSpacing: 1 }}>LISTOS</div>
          </div>
          <div style={{ width: 1, height: 32, background: C.grafito }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, color: C.perla, fontWeight: 700 }}>{allTasks}</div>
            <div style={{ fontSize: 8, color: C.grafito, letterSpacing: 1 }}>TOTAL</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Filter */}
          {["Todos", "Vos", "Socio"].map(u => (
            <button key={u} onClick={() => setFilterUser(u)} className="btn-hover" style={{
              background: filterUser === u ? C.oro_dim : "transparent",
              border: `1px solid ${filterUser === u ? C.oro : C.grafito}`,
              color: filterUser === u ? C.oro : "#555",
              borderRadius: 2, padding: "4px 10px", cursor: "pointer",
              fontFamily: "inherit", fontSize: 10, letterSpacing: 1, transition: "all 0.15s"
            }}>{u.toUpperCase()}</button>
          ))}
          <div style={{ width: 1, height: 24, background: C.grafito }} />
          {/* View toggle */}
          {[["dia", "DÍA"], ["semana", "SEMANA"]].map(([v, l]) => (
            <button key={v} onClick={() => setView(v)} className="btn-hover" style={{
              background: view === v ? C.oro_dim : "transparent",
              border: `1px solid ${view === v ? C.oro : C.grafito}`,
              color: view === v ? C.oro : "#555",
              borderRadius: 2, padding: "4px 12px", cursor: "pointer",
              fontFamily: "inherit", fontSize: 10, letterSpacing: 1, transition: "all 0.15s"
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* RITUAL BANNER — show daily focus */}
      {view === "dia" && (
        <div style={{ borderBottom: `1px solid ${C.grafito}22`, background: "#0d0d0d", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.oro, flexShrink: 0 }} />
          <div style={{ fontSize: 11, color: C.oro, letterSpacing: 3 }}>RITUAL DIARIO</div>
          <div style={{ width: 1, height: 16, background: C.grafito }} />
          <div style={{ fontSize: 12, color: "#666", letterSpacing: 1 }}>
            {todayTasks.length === 0 ? "Sin tareas para hoy — agregá una" : todayDone === todayTasks.length ? "✦ Todas las tareas de hoy completadas" : `Faltan ${todayTasks.length - todayDone} tareas para cerrar el día`}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {Array.from({ length: todayTasks.length }).map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: 1, background: i < todayDone ? C.oro : C.grafito, transition: "background 0.3s" }} />
            ))}
          </div>
        </div>
      )}

      {/* VISTA DÍA */}
      {view === "dia" && (
        <div style={{ padding: "20px 24px" }}>
          {/* Day tabs */}
          <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: `1px solid ${C.grafito}33`, paddingBottom: 0 }}>
            {DAYS.map((d, i) => {
              const hasTasks = tasks.filter(t => t.week === activeWeek && t.day === d).length > 0;
              const isToday = i === TODAY_DAY;
              const isActive = d === activeDay;
              return (
                <button key={d} onClick={() => setActiveDay(d)} style={{
                  background: isActive ? C.grafito_oscuro : "transparent",
                  border: "none", borderBottom: isActive ? `2px solid ${C.oro}` : "2px solid transparent",
                  color: isActive ? C.oro : hasTasks ? "#888" : "#333",
                  padding: "8px 14px", cursor: "pointer", fontFamily: "inherit",
                  fontSize: 11, letterSpacing: 2, transition: "all 0.15s",
                  position: "relative"
                }}>
                  {DAY_FULL[i].toUpperCase()}
                  {isToday && <div style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: C.oro }} />}
                  {hasTasks && !isActive && <div style={{ position: "absolute", top: 4, right: 4, width: 4, height: 4, borderRadius: "50%", background: C.grafito }} />}
                </button>
              );
            })}
          </div>

          {/* Week selector */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {WEEKS.map(w => (
              <button key={w} onClick={() => setActiveWeek(w)} className="btn-hover" style={{
                background: activeWeek === w ? C.oro_dim : "transparent",
                border: `1px solid ${activeWeek === w ? C.oro : C.grafito}`,
                color: activeWeek === w ? C.oro : "#555",
                borderRadius: 2, padding: "4px 12px", cursor: "pointer",
                fontFamily: "inherit", fontSize: 10, letterSpacing: 1
              }}>{w.toUpperCase()}</button>
            ))}
          </div>

          {/* Tasks for today */}
          <div style={{ maxWidth: 720 }}>
            {/* Vos section */}
            {["Vos", "Socio"].map(user => {
              if (filterUser !== "Todos" && filterUser !== user) return null;
              const uTasks = filtered.filter(t => t.week === activeWeek && t.day === activeDay && t.assignee === user);
              return (
                <div key={user} style={{ marginBottom: 28 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: user === "Vos" ? "#1a3a2a" : "#1a2a3a", border: `1px solid ${user === "Vos" ? "#2a7a4a" : "#2a4a7a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: user === "Vos" ? "#4a9a6a" : "#4a6a9a", fontWeight: 700 }}>
                      {user === "Vos" ? "V" : "S"}
                    </div>
                    <span style={{ fontSize: 10, letterSpacing: 3, color: "#444" }}>{user.toUpperCase()} · {uTasks.length} TAREA{uTasks.length !== 1 ? "S" : ""}</span>
                    <button onClick={() => addTask(activeWeek, activeDay)} style={{ marginLeft: "auto", background: "none", border: `1px solid ${C.grafito}`, color: C.grafito, borderRadius: 2, padding: "2px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 10, letterSpacing: 1 }}>+ AGREGAR</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {uTasks.length === 0 ? (
                      <div style={{ border: `1px dashed ${C.grafito}44`, borderRadius: 2, padding: 16, textAlign: "center", color: "#333", fontSize: 12 }}>Sin tareas asignadas hoy</div>
                    ) : uTasks.map(t => (
                      <div key={t.id} className="task-anim" style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                        <button onClick={e => { e.stopPropagation(); quickComplete(t); }} style={{
                          flexShrink: 0, width: 28, background: t.status === "listo" ? "#1a3a2a" : "transparent",
                          border: `1px solid ${t.status === "listo" ? "#2a7a4a" : C.grafito}`,
                          borderRadius: 2, cursor: "pointer", color: t.status === "listo" ? "#4a9a6a" : C.grafito,
                          fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s"
                        }}>{t.status === "listo" ? "✓" : ""}</button>
                        <div style={{ flex: 1 }}>
                          <TaskCard task={t} onOpen={setSelectedTask} compact={false} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VISTA SEMANA */}
      {view === "semana" && (
        <div style={{ padding: "20px 24px" }}>
          {/* Week tabs */}
          <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: `1px solid ${C.grafito}33` }}>
            {WEEKS.map(w => (
              <button key={w} onClick={() => setActiveWeek(w)} style={{
                background: activeWeek === w ? C.grafito_oscuro : "transparent",
                border: "none", borderBottom: activeWeek === w ? `2px solid ${C.oro}` : "2px solid transparent",
                color: activeWeek === w ? C.oro : "#555",
                padding: "8px 18px", cursor: "pointer", fontFamily: "inherit",
                fontSize: 10, letterSpacing: 2, transition: "all 0.15s"
              }}>{w.toUpperCase()}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {DAYS.map((day, i) => {
              const dayTasks = dayFilteredTasks(day);
              const allDone = dayTasks.length > 0 && dayTasks.every(t => t.status === "listo");
              const isToday = i === TODAY_DAY;
              return (
                <div key={day} style={{ borderTop: `1px solid ${isToday ? C.oro : allDone ? "#2a5c3f" : C.grafito}`, paddingTop: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 9, letterSpacing: 2, color: isToday ? C.oro : allDone ? "#4a7c59" : "#444" }}>
                      {DAY_FULL[i].toUpperCase()} {isToday && "·  HOY"}
                    </span>
                    <button onClick={() => addTask(activeWeek, day)} style={{ background: "none", border: "none", color: C.grafito, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "0 2px" }}>+</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {dayTasks.length === 0 ? (
                      <div style={{ border: `1px dashed ${C.grafito}22`, borderRadius: 2, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#222", fontSize: 11 }} onClick={() => addTask(activeWeek, day)}>vacío</div>
                    ) : dayTasks.map(t => <TaskCard key={t.id} task={t} onOpen={setSelectedTask} compact />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL */}
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={saveTask} onDelete={deleteTask} />}

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.grafito}22`, padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 9, color: "#333", letterSpacing: 2 }}>PALACIO APPLE · COMMAND CENTER</div>
        <div style={{ fontSize: 9, color: "#333", letterSpacing: 1 }}>{new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }).toUpperCase()}</div>
      </div>
    </div>
  );
}