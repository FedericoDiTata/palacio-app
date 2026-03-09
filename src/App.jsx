import { useState } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const GOLD = "#C9A84C";
const GOLD_DIM = "#C9A84C55";
const GOLD_GLOW = "#C9A84C22";
const LIGHT = "#e4e4e4";
const LIGHT_DIM = "#e4e4e420";
const LIGHT_MID = "#e4e4e488";
const BG = "#0b0b0b";
const PANEL = "#0f0f0f";
const BORDER = "#1e1e1e";
const BORDER2 = "#2a2a2a";
const MUTED = "#555";
const MUTED2 = "#333";

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL_TASKS = {
  fede: [
    { id: 1, text: "Lanzar campaña Marzo", done: false, day: "LUN", project: "Marketing" },
    { id: 2, text: "Revisar métricas Q1", done: false, day: "MIÉ", project: "Análisis" },
    { id: 3, text: "Llamada con cliente", done: true, day: "LUN", project: "Clientes" },
  ],
  zikiel: [
    { id: 4, text: "Reunión con proveedor", done: false, day: "MIÉ", project: "Ops" },
    { id: 5, text: "Actualizar landing page", done: false, day: "JUE", project: "Web" },
    { id: 6, text: "Enviar propuesta", done: false, day: "VIE", project: "Clientes" },
    { id: 7, text: "Review de diseño", done: true, day: "LUN", project: "Web" },
  ],
};

const DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

// ─── TINY COMPONENTS ──────────────────────────────────────────────────────────
function Avatar({ label, photo, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: photo ? "transparent" : `radial-gradient(circle at 35% 35%, ${GOLD}33, ${GOLD}11)`,
      border: `1.5px solid ${GOLD_DIM}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.4, fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 700, color: GOLD, flexShrink: 0, overflow: "hidden",
      boxShadow: `0 0 12px ${GOLD}18`,
    }}>
      {photo
        ? <img src={photo} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : label}
    </div>
  );
}

function Checkbox({ checked, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 16, height: 16, borderRadius: 2, flexShrink: 0,
      border: checked ? `1.5px solid ${GOLD}` : `1.5px solid ${BORDER2}`,
      background: checked ? GOLD_GLOW : "transparent",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 0, transition: "all 0.2s",
    }}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3 5.5L8 1" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function Bar({ value, total, dim = false }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div style={{ height: 2, background: BORDER2, borderRadius: 1, overflow: "hidden", width: "100%" }}>
      <div style={{
        height: "100%", width: `${pct}%`,
        background: dim
          ? `linear-gradient(90deg, ${LIGHT_DIM}, ${LIGHT_MID})`
          : `linear-gradient(90deg, ${GOLD}66, ${GOLD})`,
        borderRadius: 1, transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}

function Tag({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? GOLD_GLOW : "transparent",
      border: `1px solid ${active ? GOLD_DIM : BORDER2}`,
      color: active ? GOLD : MUTED,
      fontSize: 9, fontWeight: 600, letterSpacing: "2px",
      textTransform: "uppercase", padding: "4px 10px", borderRadius: 2,
      cursor: "pointer", transition: "all 0.18s", fontFamily: "'Raleway', sans-serif",
      whiteSpace: "nowrap",
    }}>{children}</button>
  );
}

function SectionLabel({ children, light = false }) {
  return (
    <div style={{
      fontSize: 8, fontWeight: 700, letterSpacing: "3.5px",
      textTransform: "uppercase", color: light ? LIGHT_MID : MUTED,
      display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${light ? LIGHT_DIM : BORDER2}, transparent)` }} />
    </div>
  );
}

// ─── DESK ─────────────────────────────────────────────────────────────────────
function Desk({ member, name, tasks, onToggle, onAdd, avatar }) {
  const [activeDay, setActiveDay] = useState("LUN");
  const [tab, setTab] = useState("dia");
  const [input, setInput] = useState("");
  const [newProject, setNewProject] = useState("");
  const [projectInput, setProjectInput] = useState("");

  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const projects = [...new Set(tasks.map(t => t.project))];
  const dayTasks = tasks.filter(t => t.day === activeDay);

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    onAdd(member, { text, day: activeDay, project: newProject.trim() || "General" });
    setInput("");
    setNewProject("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: PANEL }}>

      {/* Header */}
      <div style={{
        padding: "18px 20px 14px", flexShrink: 0,
        borderBottom: `1px solid ${BORDER}`,
        background: `linear-gradient(180deg, #131313, ${PANEL})`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <Avatar label={name[0]} photo={avatar} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22, fontWeight: 700, color: GOLD,
              letterSpacing: "4px", textTransform: "uppercase", lineHeight: 1,
            }}>{name}</div>
            <div style={{ fontSize: 9, color: MUTED, letterSpacing: "2px", marginTop: 3 }}>
              {done}/{total} completadas
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 42, lineHeight: 1, fontWeight: 300,
              color: done === total && total > 0 ? GOLD : LIGHT,
              textShadow: done === total && total > 0 ? `0 0 20px ${GOLD}44` : "none",
              transition: "all 0.4s",
            }}>{total - done}</div>
            <div style={{ fontSize: 8, color: MUTED, letterSpacing: "2px" }}>PENDIENTES</div>
          </div>
        </div>
        <Bar value={done} total={total} />
      </div>

      {/* Tabs + days */}
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: tab === "dia" ? 8 : 0 }}>
          <Tag active={tab === "dia"} onClick={() => setTab("dia")}>Día</Tag>
          <Tag active={tab === "proyectos"} onClick={() => setTab("proyectos")}>Proyectos</Tag>
        </div>
        {tab === "dia" && (
          <div style={{ display: "flex", gap: 3 }}>
            {DAYS.map(d => (
              <button key={d} onClick={() => setActiveDay(d)} style={{
                background: activeDay === d ? GOLD_GLOW : "transparent",
                border: `1px solid ${activeDay === d ? GOLD_DIM : "transparent"}`,
                color: activeDay === d ? GOLD : MUTED,
                fontSize: 8, fontWeight: 600, letterSpacing: "1.5px",
                textTransform: "uppercase", padding: "3px 6px", borderRadius: 2,
                cursor: "pointer", transition: "all 0.15s", fontFamily: "'Raleway', sans-serif",
              }}>{d}</button>
            ))}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div style={{ flex: 1, overflow: "auto", padding: "14px 20px" }}>
        {tab === "dia" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {dayTasks.length === 0 && (
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                color: MUTED2, fontSize: 13, textAlign: "center", padding: "24px 0",
              }}>Sin tareas para este día</div>
            )}
            {dayTasks.map(task => (
              <div key={task.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 3,
                background: task.done ? "transparent" : "#141414",
                border: `1px solid ${task.done ? BORDER : "#242424"}`,
                transition: "all 0.2s",
              }}>
                <Checkbox checked={task.done} onChange={() => onToggle(member, task.id)} />
                <span style={{
                  fontSize: 12, color: task.done ? MUTED : LIGHT,
                  textDecoration: task.done ? "line-through" : "none",
                  flex: 1, letterSpacing: "0.2px", transition: "all 0.2s",
                }}>{task.text}</span>
                <span style={{
                  fontSize: 8, color: MUTED2, letterSpacing: "1.5px",
                  textTransform: "uppercase", border: `1px solid ${BORDER2}`,
                  padding: "2px 6px", borderRadius: 2,
                }}>{task.project}</span>
              </div>
            ))}
            {/* Add row */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px", marginTop: 4,
              border: `1px dashed ${BORDER2}`, borderRadius: 3,
            }}>
              <span style={{ color: MUTED2, fontSize: 16, lineHeight: 1 }}>+</span>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="Nueva tarea..."
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: LIGHT, fontSize: 12, fontFamily: "'Raleway', sans-serif",
                }}
              />
              <input
                value={newProject}
                onChange={e => setNewProject(e.target.value)}
                placeholder="proyecto"
                style={{
                  width: 72, background: "transparent", border: "none",
                  borderLeft: `1px solid ${BORDER2}`, outline: "none",
                  color: MUTED, fontSize: 10, fontFamily: "'Raleway', sans-serif",
                  paddingLeft: 8, letterSpacing: "0.5px",
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {projects.map(proj => {
              const pt = tasks.filter(t => t.project === proj);
              const pd = pt.filter(t => t.done).length;
              return (
                <div key={proj}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 9, color: LIGHT_MID, letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600 }}>{proj}</span>
                    <span style={{ fontSize: 9, color: MUTED }}>{pd}/{pt.length}</span>
                  </div>
                  <Bar value={pd} total={pt.length} dim />
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    {pt.map(task => (
                      <div key={task.id} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "8px 10px", borderRadius: 3,
                        background: "#111", border: `1px solid ${BORDER}`,
                      }}>
                        <Checkbox checked={task.done} onChange={() => onToggle(member, task.id)} />
                        <span style={{
                          fontSize: 11.5, flex: 1,
                          color: task.done ? MUTED : LIGHT,
                          textDecoration: task.done ? "line-through" : "none",
                        }}>{task.text}</span>
                        <span style={{ fontSize: 8, color: MUTED2, letterSpacing: "1px" }}>{task.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {/* Add in project view */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 12px",
              border: `1px dashed ${BORDER2}`, borderRadius: 3,
            }}>
              <span style={{ color: MUTED2, fontSize: 16, lineHeight: 1 }}>+</span>
              <input
                value={projectInput}
                onChange={e => setProjectInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && projectInput.trim()) {
                    onAdd(member, { text: projectInput.trim(), day: "LUN", project: "General" });
                    setProjectInput("");
                  }
                }}
                placeholder="Nueva tarea..."
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: LIGHT, fontSize: 12, fontFamily: "'Raleway', sans-serif",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CENTER PANEL ─────────────────────────────────────────────────────────────
function CenterPanel({ tasks }) {
  const all = [...tasks.fede, ...tasks.zikiel];
  const done = all.filter(t => t.done).length;
  const total = all.length;
  const fedeDone = tasks.fede.filter(t => t.done).length;
  const zikielDone = tasks.zikiel.filter(t => t.done).length;

  const upcoming = [
    ...tasks.fede.filter(t => !t.done).map(t => ({ ...t, member: "Fede" })),
    ...tasks.zikiel.filter(t => !t.done).map(t => ({ ...t, member: "Zikiel" })),
  ].slice(0, 5);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "auto",
      borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`,
      background: BG,
    }}>
      <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* Progreso */}
        <div>
          <SectionLabel>Progreso</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Hoy", done, total },
              { label: "Semana", done, total },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: LIGHT }}>{s.label}</span>
                  <span style={{ fontSize: 11, color: MUTED, fontFamily: "'Cormorant Garamond', serif" }}>{s.done}/{s.total}</span>
                </div>
                <Bar value={s.done} total={s.total} />
                <div style={{ fontSize: 9, color: MUTED2, marginTop: 4 }}>{s.done} completadas de {s.total}</div>
              </div>
            ))}
            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${BORDER2}, transparent)` }} />
            {[
              { name: "Fede", done: fedeDone, total: tasks.fede.length },
              { name: "Zikiel", done: zikielDone, total: tasks.zikiel.length },
            ].map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar label={p.name[0]} size={26} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: LIGHT_MID }}>{p.name}</span>
                    <span style={{ fontSize: 10, color: MUTED }}>{p.done}/{p.total}</span>
                  </div>
                  <Bar value={p.done} total={p.total} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semana */}
        <div>
          <SectionLabel>Semana</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {DAYS.map(d => {
              const dt = all.filter(t => t.day === d);
              const dd = dt.filter(t => t.done).length;
              const full = dt.length > 0 && dd === dt.length;
              return (
                <div key={d} style={{
                  padding: "7px 3px", borderRadius: 3, textAlign: "center",
                  background: full ? GOLD_GLOW : "#111",
                  border: `1px solid ${full ? GOLD_DIM : BORDER}`,
                }}>
                  <div style={{ fontSize: 7, color: full ? GOLD : MUTED, letterSpacing: "1px", marginBottom: 3 }}>{d}</div>
                  {dt.length > 0 ? (
                    <>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: full ? GOLD : LIGHT, lineHeight: 1 }}>{dt.length}</div>
                      <div style={{ fontSize: 8, color: MUTED, marginTop: 2 }}>{dd}/{dt.length}</div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: MUTED2 }}>—</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Próximas */}
        <div>
          <SectionLabel>Próximas tareas</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {upcoming.length === 0 && (
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: MUTED2, fontSize: 13, textAlign: "center", padding: "16px 0" }}>
                Todo al día ✦
              </div>
            )}
            {upcoming.map(t => (
              <div key={t.id} style={{
                padding: "10px 12px", borderRadius: 3,
                background: "#111",
                border: `1px solid ${BORDER}`,
                borderLeft: `2px solid ${GOLD_DIM}`,
              }}>
                <div style={{ fontSize: 11.5, color: LIGHT, marginBottom: 6 }}>{t.text}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Avatar label={t.member[0]} size={16} />
                  <span style={{ fontSize: 9, color: GOLD, letterSpacing: "1px" }}>{t.member}</span>
                  <span style={{ fontSize: 9, color: MUTED, marginLeft: "auto" }}>{t.day}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NOTES PANEL ─────────────────────────────────────────────────────────────
function NotesPanel({ notes, onAdd }) {
  const [tab, setTab] = useState("fede");
  const [input, setInput] = useState("");

  const submit = () => {
    if (!input.trim()) return;
    onAdd({ text: input.trim(), author: tab });
    setInput("");
  };

  const filtered = notes.filter(n => n.author === tab);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100%", overflow: "hidden",
      borderLeft: `1px solid ${BORDER}`,
      background: PANEL,
    }}>
      <div style={{ padding: "18px 18px 12px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <SectionLabel light>Notas del Equipo</SectionLabel>
        <div style={{ display: "flex", gap: 6 }}>
          {["fede", "zikiel"].map(m => (
            <Tag key={m} active={tab === m} onClick={() => setTab(m)}>
              {m === "fede" ? "Fede" : "Zikiel"}
            </Tag>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 18px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
          placeholder="Escribí una nota... (Enter para enviar)"
          rows={3}
          style={{
            width: "100%", background: "#111", border: `1px solid ${BORDER2}`,
            borderRadius: 3, outline: "none", resize: "none",
            color: LIGHT, fontSize: 12, fontFamily: "'Raleway', sans-serif",
            lineHeight: 1.6, padding: "10px 12px",
          }}
        />
        <button onClick={submit} style={{
          marginTop: 8, width: "100%", padding: "8px",
          background: GOLD_GLOW, border: `1px solid ${GOLD_DIM}`,
          color: GOLD, fontSize: 9, fontWeight: 700, letterSpacing: "3px",
          textTransform: "uppercase", borderRadius: 2, cursor: "pointer",
          fontFamily: "'Raleway', sans-serif", transition: "all 0.2s",
        }}>Agregar Nota</button>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "14px 18px" }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", paddingTop: 32,
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic", color: MUTED2, fontSize: 13, lineHeight: 1.8,
          }}>
            Sin notas aún —<br />sean los primeros en escribir
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(n => (
              <div key={n.id} style={{
                padding: "11px 14px", borderRadius: 3,
                background: "#111", border: `1px solid ${BORDER}`,
              }}>
                <div style={{ fontSize: 12, color: LIGHT, lineHeight: 1.6 }}>{n.text}</div>
                <div style={{ fontSize: 8, color: GOLD + "66", letterSpacing: "2px", textTransform: "uppercase", marginTop: 8 }}>
                  — {n.author === "fede" ? "Fede" : "Zikiel"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [notes, setNotes] = useState([]);

  const allTasks = [...tasks.fede, ...tasks.zikiel];
  const doneAll = allTasks.filter(t => t.done).length;
  const totalAll = allTasks.length;

  const toggleTask = (member, id) => {
    setTasks(prev => ({
      ...prev,
      [member]: prev[member].map(t => t.id === id ? { ...t, done: !t.done } : t),
    }));
  };

  const addTask = (member, { text, day, project }) => {
    setTasks(prev => ({
      ...prev,
      [member]: [...prev[member], { id: Date.now(), text, done: false, day, project }],
    }));
  };

  const addNote = (note) => {
    setNotes(prev => [...prev, { ...note, id: Date.now() }]);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Raleway:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; width: 100%; overflow: hidden; background: #0b0b0b; }
        body { font-family: 'Raleway', sans-serif; color: #e4e4e4; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        input::placeholder, textarea::placeholder { color: #333; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden" }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          display: "flex", alignItems: "center", padding: "0 24px",
          height: 50, flexShrink: 0,
          borderBottom: `1px solid ${BORDER}`,
          background: `linear-gradient(180deg, #131313, ${BG})`,
        }}>
          <div style={{ marginRight: 32 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 12, fontWeight: 700, color: GOLD,
              letterSpacing: "5px", textTransform: "uppercase",
            }}>Palacio Apple</div>
            <div style={{ fontSize: 7, letterSpacing: "3px", color: MUTED, textTransform: "uppercase" }}>
              Command Center · 2026
            </div>
          </div>

          {/* Ritual bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "5px 14px", borderRadius: 2,
            border: `1px solid ${BORDER2}`, background: "#111",
            marginRight: "auto",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, boxShadow: `0 0 8px ${GOLD}` }} />
            <span style={{ fontSize: 8, letterSpacing: "3px", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>
              Ritual Diario
            </span>
            <span style={{ color: BORDER2, fontSize: 10 }}>|</span>
            <span style={{ fontSize: 11, color: LIGHT_MID }}>
              {totalAll - doneAll === 0
                ? "¡Todo cerrado! ✦"
                : `Faltan ${totalAll - doneAll} tareas para cerrar el día`}
            </span>
            <div style={{ display: "flex", gap: 2, marginLeft: 4 }}>
              {Array.from({ length: Math.min(totalAll, 10) }).map((_, i) => (
                <div key={i} style={{
                  width: 16, height: 4, borderRadius: 1,
                  background: i < doneAll ? GOLD : BORDER2,
                  transition: "background 0.3s",
                }} />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 28, marginLeft: 28 }}>
            {[
              { n: `${doneAll}/${totalAll}`, l: "HOY" },
              { n: doneAll, l: "LISTOS" },
              { n: totalAll, l: "TOTAL" },
            ].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20, color: LIGHT, lineHeight: 1,
                }}>{s.n}</div>
                <div style={{ fontSize: 7, letterSpacing: "2.5px", color: MUTED, textTransform: "uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </nav>

        {/* ── 4 COLUMNS ── */}
        <div style={{
          flex: 1, overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 200px 1fr 260px",
        }}>
          <Desk member="fede" name="Fede" tasks={tasks.fede} onToggle={toggleTask} onAdd={addTask} avatar={null} />
          <CenterPanel tasks={tasks} />
          <Desk member="zikiel" name="Zikiel" tasks={tasks.zikiel} onToggle={toggleTask} onAdd={addTask} avatar={null} />
          <NotesPanel notes={notes} onAdd={addNote} />
        </div>
      </div>
    </>
  );
}
