import { useState, useEffect, useRef } from "react";

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const GOLD       = "#C9A84C";
const GOLD_DIM   = "#C9A84C55";
const GOLD_GLOW  = "#C9A84C18";
const GOLD_MID   = "#C9A84C99";
const LIGHT      = "#e4e4e4";
const LIGHT_DIM  = "#e4e4e415";
const LIGHT_MID  = "#e4e4e470";
const BG         = "#0b0b0b";
const PANEL      = "#0e0e0e";
const PANEL2     = "#121212";
const BORDER     = "#1c1c1c";
const BORDER2    = "#282828";
const MUTED      = "#4e4e4e";
const MUTED2     = "#2e2e2e";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INITIAL_TASKS = {
  fede: [
    { id: 1, text: "Lanzar campaña Marzo", done: false, day: "LUN", project: "Marketing" },
    { id: 2, text: "Revisar métricas Q1",  done: false, day: "MIÉ", project: "Análisis"  },
    { id: 3, text: "Llamada con cliente",  done: true,  day: "LUN", project: "Clientes"  },
  ],
  zikiel: [
    { id: 4, text: "Reunión con proveedor",   done: false, day: "MIÉ", project: "Ops"      },
    { id: 5, text: "Actualizar landing page", done: false, day: "JUE", project: "Web"      },
    { id: 6, text: "Enviar propuesta",        done: false, day: "VIE", project: "Clientes" },
    { id: 7, text: "Review de diseño",        done: true,  day: "LUN", project: "Web"      },
  ],
};

const DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

// ─── CONFETTI BURST ───────────────────────────────────────────────────────────
function ConfettiBurst({ trigger }) {
  const [particles, setParticles] = useState([]);
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (trigger !== prevTrigger.current) {
      prevTrigger.current = trigger;
      if (!trigger) return;
      const burst = Array.from({ length: 18 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        delay: Math.random() * 300,
        size: 4 + Math.random() * 4,
        color: [GOLD, LIGHT, GOLD_MID, "#fff"][Math.floor(Math.random() * 4)],
        angle: Math.random() * 360,
      }));
      setParticles(burst);
      setTimeout(() => setParticles([]), 900);
    }
  }, [trigger]);

  if (!particles.length) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 10 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: "50%",
          width: p.size, height: p.size,
          borderRadius: 1,
          background: p.color,
          transform: `rotate(${p.angle}deg)`,
          animation: `burst 0.8s ${p.delay}ms ease-out forwards`,
        }} />
      ))}
    </div>
  );
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ label, photo, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `radial-gradient(circle at 30% 30%, ${GOLD}30, ${GOLD}0a)`,
      border: `1px solid ${GOLD_DIM}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 700, color: GOLD, overflow: "hidden",
      boxShadow: `0 0 16px ${GOLD}14, inset 0 0 8px ${GOLD}08`,
    }}>
      {photo
        ? <img src={photo} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : label}
    </div>
  );
}

// ─── CHECKBOX ─────────────────────────────────────────────────────────────────
function Checkbox({ checked, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 17, height: 17, borderRadius: 3, flexShrink: 0, padding: 0,
      border: checked ? `1.5px solid ${GOLD}` : `1.5px solid ${BORDER2}`,
      background: checked ? `${GOLD}22` : "transparent",
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
      boxShadow: checked ? `0 0 8px ${GOLD}44` : "none",
    }}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.2 5.7L8 1" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function Bar({ value, total, height = 3, dim = false, glow = false }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div style={{ height, background: BORDER2, borderRadius: height, overflow: "hidden", width: "100%", flexShrink: 0 }}>
      <div style={{
        height: "100%", width: `${pct}%`, borderRadius: height,
        background: dim
          ? `linear-gradient(90deg, ${LIGHT_DIM}, ${LIGHT_MID})`
          : `linear-gradient(90deg, ${GOLD}55, ${GOLD})`,
        transition: "width 0.7s cubic-bezier(.4,0,.2,1)",
        boxShadow: glow && pct > 0 ? `0 0 8px ${GOLD}66` : "none",
      }} />
    </div>
  );
}

// ─── VIEW TAB BUTTON ──────────────────────────────────────────────────────────
function ViewTab({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      position: "relative", padding: "7px 16px",
      background: "transparent", border: "none",
      color: active ? GOLD : MUTED,
      fontSize: 8, fontWeight: 700, letterSpacing: "3px",
      textTransform: "uppercase", cursor: "pointer",
      fontFamily: "'Raleway', sans-serif",
      transition: "color 0.2s",
      borderBottom: `2px solid ${active ? GOLD : "transparent"}`,
    }}>{children}</button>
  );
}

// ─── DAY PILL ─────────────────────────────────────────────────────────────────
function DayPill({ day, active, count, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 2, padding: "5px 7px", borderRadius: 3,
      background: active ? GOLD_GLOW : "transparent",
      border: `1px solid ${active ? GOLD_DIM : "transparent"}`,
      color: active ? GOLD : MUTED,
      fontSize: 8, fontWeight: 700, letterSpacing: "1.5px",
      textTransform: "uppercase", cursor: "pointer",
      transition: "all 0.15s", fontFamily: "'Raleway', sans-serif",
      minWidth: 28,
    }}>
      <span>{day}</span>
      {count > 0 && (
        <span style={{
          width: 4, height: 4, borderRadius: "50%",
          background: active ? GOLD : MUTED2, display: "block",
        }} />
      )}
    </button>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ children, accent = false }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
    }}>
      {accent && <div style={{ width: 2, height: 10, background: GOLD, borderRadius: 1, flexShrink: 0 }} />}
      <span style={{
        fontSize: 8, fontWeight: 700, letterSpacing: "3.5px",
        textTransform: "uppercase", color: accent ? GOLD_MID : MUTED,
        whiteSpace: "nowrap",
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent ? GOLD_DIM : BORDER2}, transparent)` }} />
    </div>
  );
}

// ─── TASK ROW ─────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggle }) {
  const [flash, setFlash] = useState(false);

  const handleToggle = () => {
    if (!task.done) {
      setFlash(true);
      setTimeout(() => setFlash(false), 700);
    }
    onToggle();
  };

  return (
    <div style={{
      position: "relative",
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 4,
      background: task.done ? "transparent" : PANEL2,
      border: `1px solid ${task.done ? BORDER : BORDER2}`,
      transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
      overflow: "hidden",
    }}>
      {flash && (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, transparent, ${GOLD}18, transparent)`,
          animation: "flashSlide 0.6s ease-out forwards",
          pointerEvents: "none",
        }} />
      )}
      <Checkbox checked={task.done} onChange={handleToggle} />
      <span style={{
        fontSize: 12, flex: 1, letterSpacing: "0.2px",
        color: task.done ? MUTED : LIGHT,
        textDecoration: task.done ? "line-through" : "none",
        transition: "all 0.3s",
      }}>{task.text}</span>
      <span style={{
        fontSize: 7.5, color: task.done ? MUTED2 : MUTED,
        letterSpacing: "1.5px", textTransform: "uppercase",
        border: `1px solid ${task.done ? MUTED2 : BORDER2}`,
        padding: "2px 6px", borderRadius: 2, whiteSpace: "nowrap",
        transition: "all 0.3s",
      }}>{task.project}</span>
    </div>
  );
}

// ─── ADD TASK ROW ─────────────────────────────────────────────────────────────
function AddTaskRow({ activeDay, onAdd }) {
  const [text, setText] = useState("");
  const [project, setProject] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    onAdd({ text: text.trim(), day: activeDay, project: project.trim() || "General" });
    setText(""); setProject("");
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "9px 12px", borderRadius: 4, marginTop: 6,
      border: `1px solid ${focused ? GOLD_DIM : BORDER2}`,
      background: focused ? GOLD_GLOW : "transparent",
      transition: "all 0.2s",
    }}>
      <span style={{ color: focused ? GOLD_MID : MUTED2, fontSize: 15, lineHeight: 1, flexShrink: 0 }}>+</span>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => e.key === "Enter" && submit()}
        placeholder="Agregar tarea..."
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          color: LIGHT, fontSize: 12, fontFamily: "'Raleway', sans-serif",
          letterSpacing: "0.2px",
        }}
      />
      {focused && (
        <>
          <div style={{ width: 1, height: 14, background: BORDER2 }} />
          <input
            value={project}
            onChange={e => setProject(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="proyecto"
            style={{
              width: 80, background: "transparent", border: "none", outline: "none",
              color: MUTED, fontSize: 10, fontFamily: "'Raleway', sans-serif",
              letterSpacing: "0.5px",
            }}
          />
          <button onClick={submit} style={{
            background: GOLD_GLOW, border: `1px solid ${GOLD_DIM}`,
            color: GOLD, fontSize: 9, letterSpacing: "2px", fontWeight: 700,
            padding: "3px 10px", borderRadius: 2, cursor: "pointer",
            fontFamily: "'Raleway', sans-serif", whiteSpace: "nowrap",
          }}>↵</button>
        </>
      )}
    </div>
  );
}

// ─── DESK ─────────────────────────────────────────────────────────────────────
function Desk({ member, name, tasks, onToggle, onAdd, avatar }) {
  const [activeDay, setActiveDay] = useState("LUN");
  const [tab, setTab]             = useState("dia");
  const [confetti, setConfetti]   = useState(0);

  const done     = tasks.filter(t => t.done).length;
  const total    = tasks.length;
  const projects = [...new Set(tasks.map(t => t.project))];
  const dayTasks = tasks.filter(t => t.day === activeDay);

  const handleToggle = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.done) setConfetti(c => c + 1);
    onToggle(member, id);
  };

  const allDone = total > 0 && done === total;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: PANEL, position: "relative" }}>
      <ConfettiBurst trigger={confetti} />

      {/* ── Desk Header ── */}
      <div style={{
        padding: "20px 22px 16px", flexShrink: 0,
        borderBottom: `1px solid ${BORDER}`,
        background: `linear-gradient(160deg, #161410 0%, ${PANEL} 100%)`,
      }}>
        {/* Name row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          <Avatar label={name[0]} photo={avatar} size={46} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 26, fontWeight: 700, color: GOLD,
              letterSpacing: "5px", textTransform: "uppercase", lineHeight: 1,
              textShadow: allDone ? `0 0 24px ${GOLD}55` : "none",
              transition: "text-shadow 0.5s",
            }}>{name}</div>
            <div style={{ fontSize: 9, color: MUTED, letterSpacing: "2px", marginTop: 4 }}>
              {done} de {total} completadas
            </div>
          </div>
          {/* Pending count */}
          <div style={{ textAlign: "right", lineHeight: 1 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 48, fontWeight: 300, lineHeight: 1,
              color: allDone ? GOLD : LIGHT,
              textShadow: allDone ? `0 0 30px ${GOLD}55` : "none",
              transition: "all 0.5s cubic-bezier(.4,0,.2,1)",
            }}>{total - done}</div>
            <div style={{ fontSize: 7, color: MUTED, letterSpacing: "3px", textTransform: "uppercase", marginTop: 2 }}>
              {allDone ? "✦ cerrado" : "pendientes"}
            </div>
          </div>
        </div>

        {/* Progress bar — bigger, with glow */}
        <div style={{ marginBottom: 6 }}>
          <Bar value={done} total={total} height={5} glow />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 8, color: MUTED, letterSpacing: "1px" }}>
            {total === 0 ? "—" : `${Math.round((done / total) * 100)}%`}
          </span>
          <span style={{ fontSize: 8, color: MUTED, letterSpacing: "1px" }}>
            {done}/{total}
          </span>
        </div>
      </div>

      {/* ── View Tabs ── */}
      <div style={{
        display: "flex", gap: 0, paddingLeft: 14,
        borderBottom: `1px solid ${BORDER}`, flexShrink: 0,
        background: PANEL,
      }}>
        <ViewTab active={tab === "dia"} onClick={() => setTab("dia")}>Día</ViewTab>
        <ViewTab active={tab === "proyectos"} onClick={() => setTab("proyectos")}>Proyectos</ViewTab>
      </div>

      {/* ── Day selector ── */}
      {tab === "dia" && (
        <div style={{
          display: "flex", gap: 2, padding: "8px 14px",
          borderBottom: `1px solid ${BORDER}`, flexShrink: 0,
          background: PANEL, overflowX: "hidden",
        }}>
          {DAYS.map(d => {
            const cnt = tasks.filter(t => t.day === d).length;
            return (
              <DayPill
                key={d} day={d} active={activeDay === d}
                count={cnt} onClick={() => setActiveDay(d)}
              />
            );
          })}
        </div>
      )}

      {/* ── Task content ── */}
      <div style={{ flex: 1, overflow: "auto", padding: "14px 20px" }}>
        {tab === "dia" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {dayTasks.length === 0 && (
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                color: MUTED2, fontSize: 14, textAlign: "center", padding: "28px 0",
              }}>
                Sin tareas para el {activeDay}
              </div>
            )}
            {dayTasks.map(task => (
              <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} />
            ))}
            <AddTaskRow activeDay={activeDay} onAdd={(data) => onAdd(member, data)} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {projects.length === 0 && (
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: MUTED2, fontSize: 14, textAlign: "center", padding: "28px 0" }}>
                Sin proyectos aún
              </div>
            )}
            {projects.map(proj => {
              const pt = tasks.filter(t => t.project === proj);
              const pd = pt.filter(t => t.done).length;
              return (
                <div key={proj}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 9, color: LIGHT_MID, letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 700 }}>
                      {proj}
                    </span>
                    <span style={{ fontSize: 9, color: MUTED }}>{pd}/{pt.length}</span>
                  </div>
                  <Bar value={pd} total={pt.length} dim />
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    {pt.map(task => (
                      <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CENTER PANEL ─────────────────────────────────────────────────────────────
function CenterPanel({ tasks }) {
  const all      = [...tasks.fede, ...tasks.zikiel];
  const done     = all.filter(t => t.done).length;
  const total    = all.length;
  const fedeDone = tasks.fede.filter(t => t.done).length;
  const zikDone  = tasks.zikiel.filter(t => t.done).length;
  const fedePct  = tasks.fede.length === 0 ? 0 : Math.round((fedeDone / tasks.fede.length) * 100);
  const zikPct   = tasks.zikiel.length === 0 ? 0 : Math.round((zikDone / tasks.zikiel.length) * 100);

  // Who has more load?
  const fedeLoad  = tasks.fede.filter(t => !t.done).length;
  const zikLoad   = tasks.zikiel.filter(t => !t.done).length;
  const maxLoad   = Math.max(fedeLoad, zikLoad, 1);

  const upcoming = [
    ...tasks.fede.filter(t => !t.done).map(t => ({ ...t, member: "Fede" })),
    ...tasks.zikiel.filter(t => !t.done).map(t => ({ ...t, member: "Zikiel" })),
  ].slice(0, 5);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", overflow: "auto",
      borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`,
      background: BG,
    }}>
      <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 22 }}>

        {/* Progreso */}
        <div>
          <SectionLabel accent>Progreso</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {[
              { label: "Hoy",    done, total },
              { label: "Semana", done, total },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: LIGHT }}>{s.label}</span>
                  <span style={{ fontSize: 10, color: MUTED, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                    {s.done}/{s.total}
                  </span>
                </div>
                <Bar value={s.done} total={s.total} height={4} />
                <div style={{ fontSize: 8.5, color: MUTED, marginTop: 4, letterSpacing: "0.3px" }}>
                  {s.done} completadas de {s.total}
                </div>
              </div>
            ))}

            <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${BORDER2}, transparent)`, margin: "2px 0" }} />

            {/* Per-person */}
            {[
              { name: "Fede",   done: fedeDone, total: tasks.fede.length,   pct: fedePct },
              { name: "Zikiel", done: zikDone,  total: tasks.zikiel.length, pct: zikPct  },
            ].map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar label={p.name[0]} size={26} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: LIGHT_MID, letterSpacing: "0.5px" }}>{p.name}</span>
                    <span style={{ fontSize: 9, color: MUTED }}>{p.pct}%</span>
                  </div>
                  <Bar value={p.done} total={p.total} height={3} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carga comparativa */}
        <div>
          <SectionLabel>Carga del día</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { name: "Fede",   load: fedeLoad },
              { name: "Zikiel", load: zikLoad  },
            ].map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, color: LIGHT_MID, width: 36, letterSpacing: "0.5px" }}>{p.name}</span>
                <div style={{ flex: 1, height: 20, background: BORDER, borderRadius: 3, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    height: "100%",
                    width: `${(p.load / maxLoad) * 100}%`,
                    background: p.load > 0
                      ? `linear-gradient(90deg, ${GOLD}33, ${GOLD}88)`
                      : "transparent",
                    borderRadius: 3,
                    transition: "width 0.7s cubic-bezier(.4,0,.2,1)",
                    display: "flex", alignItems: "center", paddingLeft: 8,
                  }}>
                    {p.load > 0 && (
                      <span style={{ fontSize: 9, color: GOLD, fontWeight: 600, letterSpacing: "1px", whiteSpace: "nowrap" }}>
                        {p.load} pendiente{p.load !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  {p.load === 0 && (
                    <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 9, color: MUTED2 }}>
                      ✦ al día
                    </span>
                  )}
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
              const dt   = all.filter(t => t.day === d);
              const dd   = dt.filter(t => t.done).length;
              const full = dt.length > 0 && dd === dt.length;
              return (
                <div key={d} style={{
                  padding: "7px 2px", borderRadius: 3, textAlign: "center",
                  background: full ? GOLD_GLOW : "#0f0f0f",
                  border: `1px solid ${full ? GOLD_DIM : BORDER}`,
                  transition: "all 0.3s",
                }}>
                  <div style={{ fontSize: 7, color: full ? GOLD_MID : MUTED, letterSpacing: "1px", marginBottom: 3 }}>{d}</div>
                  {dt.length > 0 ? (
                    <>
                      <div style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 18, color: full ? GOLD : LIGHT, lineHeight: 1,
                        textShadow: full ? `0 0 10px ${GOLD}55` : "none",
                      }}>{dt.length}</div>
                      <div style={{ fontSize: 7, color: MUTED, marginTop: 2 }}>{dd}/{dt.length}</div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: MUTED2, lineHeight: 2 }}>—</div>
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
            {upcoming.length === 0 ? (
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic",
                color: MUTED2, fontSize: 13, textAlign: "center", padding: "14px 0",
              }}>Todo al día ✦</div>
            ) : upcoming.map(t => (
              <div key={t.id} style={{
                padding: "10px 12px", borderRadius: 3,
                background: PANEL2, border: `1px solid ${BORDER}`,
                borderLeft: `2px solid ${GOLD_DIM}`,
              }}>
                <div style={{ fontSize: 11.5, color: LIGHT, marginBottom: 6 }}>{t.text}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Avatar label={t.member[0]} size={16} />
                  <span style={{ fontSize: 9, color: GOLD_MID, letterSpacing: "1px" }}>{t.member}</span>
                  <span style={{ fontSize: 9, color: MUTED, marginLeft: "auto", letterSpacing: "0.5px" }}>{t.day}</span>
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
  const [tab,   setTab]   = useState("fede");
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = () => {
    if (!input.trim()) return;
    onAdd({ text: input.trim(), author: tab, ts: Date.now() });
    setInput("");
  };

  const filtered = notes.filter(n => n.author === tab);

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", overflow: "hidden",
      borderLeft: `1px solid ${BORDER}`, background: PANEL,
    }}>

      {/* Header */}
      <div style={{
        padding: "20px 20px 14px", flexShrink: 0,
        borderBottom: `1px solid ${BORDER}`,
        background: `linear-gradient(160deg, #161410 0%, ${PANEL} 100%)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          {/* decorative line */}
          <div style={{ width: 18, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_DIM})` }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: GOLD, letterSpacing: "5px", textTransform: "uppercase", fontWeight: 600 }}>
            Notas
          </span>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${GOLD_DIM}, transparent)` }} />
        </div>

        {/* Author tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER2}` }}>
          {["fede", "zikiel"].map(m => (
            <button key={m} onClick={() => setTab(m)} style={{
              flex: 1, padding: "8px 4px", background: "transparent", border: "none",
              borderBottom: `2px solid ${tab === m ? GOLD : "transparent"}`,
              color: tab === m ? GOLD : MUTED,
              fontSize: 9, fontWeight: 700, letterSpacing: "3px",
              textTransform: "uppercase", cursor: "pointer",
              fontFamily: "'Raleway', sans-serif", transition: "all 0.2s",
            }}>
              {m === "fede" ? "Fede" : "Zikiel"}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{
          border: `1px solid ${focused ? GOLD_DIM : BORDER2}`,
          borderRadius: 4, overflow: "hidden",
          background: focused ? "#131008" : "#0d0d0d",
          transition: "all 0.2s",
        }}>
          {/* author indicator */}
          <div style={{
            padding: "7px 12px 0",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Avatar label={tab[0].toUpperCase()} size={16} />
            <span style={{ fontSize: 8, color: GOLD_MID, letterSpacing: "2px", textTransform: "uppercase" }}>
              {tab === "fede" ? "Fede" : "Zikiel"}
            </span>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            placeholder="Escribí una nota..."
            rows={3}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              resize: "none", color: LIGHT, fontSize: 12,
              fontFamily: "'Raleway', sans-serif", lineHeight: 1.65,
              padding: "8px 12px 10px",
            }}
          />
        </div>
        <button onClick={submit} style={{
          marginTop: 8, width: "100%", padding: "9px",
          background: "transparent",
          border: `1px solid ${GOLD_DIM}`,
          color: GOLD, fontSize: 8, fontWeight: 700, letterSpacing: "4px",
          textTransform: "uppercase", borderRadius: 3, cursor: "pointer",
          fontFamily: "'Raleway', sans-serif", transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <span style={{ display: "inline-block", width: 14, height: 1, background: GOLD_DIM }} />
          Agregar Nota
          <span style={{ display: "inline-block", width: 14, height: 1, background: GOLD_DIM }} />
        </button>
      </div>

      {/* Notes list */}
      <div style={{ flex: 1, overflow: "auto", padding: "14px 18px" }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center", paddingTop: 36,
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic", color: MUTED2, fontSize: 14, lineHeight: 2,
          }}>
            Sin notas aún —<br />sean los primeros en escribir
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(n => (
              <div key={n.id} style={{
                padding: "13px 14px", borderRadius: 4,
                background: PANEL2,
                border: `1px solid ${BORDER}`,
                borderTop: `1px solid ${BORDER2}`,
                position: "relative", overflow: "hidden",
              }}>
                {/* subtle gold top accent */}
                <div style={{
                  position: "absolute", top: 0, left: 16, right: 16,
                  height: 1, background: `linear-gradient(90deg, transparent, ${GOLD_DIM}, transparent)`,
                }} />
                <div style={{
                  fontSize: 12, color: LIGHT, lineHeight: 1.65,
                  fontFamily: "'Raleway', sans-serif",
                }}>{n.text}</div>
                <div style={{
                  marginTop: 10, display: "flex", alignItems: "center", gap: 6,
                  borderTop: `1px solid ${BORDER}`, paddingTop: 8,
                }}>
                  <Avatar label={n.author[0].toUpperCase()} size={14} />
                  <span style={{ fontSize: 8, color: GOLD_DIM, letterSpacing: "2px", textTransform: "uppercase" }}>
                    {n.author === "fede" ? "Fede" : "Zikiel"}
                  </span>
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
  const doneAll  = allTasks.filter(t => t.done).length;
  const totalAll = allTasks.length;
  const pctAll   = totalAll === 0 ? 0 : Math.round((doneAll / totalAll) * 100);

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
        body { font-family: 'Raleway', sans-serif; color: #e4e4e4; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        input::placeholder, textarea::placeholder { color: #2e2e2e; }
        @keyframes flashSlide {
          0%   { transform: translateX(-100%); opacity: 1; }
          100% { transform: translateX(200%);  opacity: 0; }
        }
        @keyframes burst {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(-60px) rotate(720deg) scale(0); opacity: 0; }
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", overflow: "hidden" }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          display: "flex", alignItems: "center",
          height: 48, flexShrink: 0, padding: "0 24px",
          borderBottom: `1px solid ${BORDER}`,
          background: `linear-gradient(180deg, #141210 0%, ${BG} 100%)`,
        }}>
          {/* Brand */}
          <div style={{ marginRight: 28, lineHeight: 1 }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 13, fontWeight: 700, color: GOLD,
              letterSpacing: "5px", textTransform: "uppercase",
            }}>Palacio Apple</div>
            <div style={{ fontSize: 7, letterSpacing: "3px", color: MUTED, textTransform: "uppercase", marginTop: 3 }}>
              Command Center · 2026
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 24, background: BORDER2, marginRight: 24 }} />

          {/* Ritual Diario — simplified, clear hierarchy */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, boxShadow: `0 0 6px ${GOLD}` }} />
              <span style={{ fontSize: 8, letterSpacing: "3px", color: GOLD_MID, fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                Ritual Diario
              </span>
            </div>
            <span style={{ fontSize: 11, color: LIGHT_MID, whiteSpace: "nowrap" }}>
              {doneAll === totalAll && totalAll > 0
                ? "¡Todo cerrado! ✦"
                : `${totalAll - doneAll} tarea${totalAll - doneAll !== 1 ? "s" : ""} pendiente${totalAll - doneAll !== 1 ? "s" : ""}`}
            </span>
            {/* Progress pills */}
            <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
              {Array.from({ length: Math.min(totalAll, 12) }).map((_, i) => (
                <div key={i} style={{
                  width: 14, height: 3, borderRadius: 1,
                  background: i < doneAll ? GOLD : BORDER2,
                  transition: "background 0.4s",
                }} />
              ))}
              <span style={{ fontSize: 8, color: MUTED, marginLeft: 4 }}>{pctAll}%</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 0, marginLeft: 16 }}>
            {[
              { n: `${doneAll}/${totalAll}`, l: "HOY" },
              { n: doneAll, l: "LISTOS" },
              { n: totalAll, l: "TOTAL" },
            ].map((s, i) => (
              <div key={s.l} style={{
                textAlign: "center", padding: "0 18px",
                borderLeft: i > 0 ? `1px solid ${BORDER2}` : "none",
              }}>
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
          gridTemplateColumns: "1fr 210px 1fr 255px",
        }}>
          <Desk
            member="fede" name="Fede"
            tasks={tasks.fede} onToggle={toggleTask} onAdd={addTask}
            avatar={null}
          />
          <CenterPanel tasks={tasks} />
          <Desk
            member="zikiel" name="Zikiel"
            tasks={tasks.zikiel} onToggle={toggleTask} onAdd={addTask}
            avatar={null}
          />
          <NotesPanel notes={notes} onAdd={addNote} />
        </div>
      </div>
    </>
  );
}
