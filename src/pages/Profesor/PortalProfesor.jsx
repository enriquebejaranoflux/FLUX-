import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoFlux from "../../assets/logo-flux.png";

const navegacionProfesor = [
  "Gestión de Cursos",
  "Calificaciones",
  "Subir Actividades",
  "Crear Evaluaciones",
  "Chat Global del Curso",
  "Métricas y Rendimiento"
];

const accionesRapidas = [
  {
    titulo: "📝 Crear Nueva Actividad",
    detalle: "Diseña tareas, rúbricas y fechas límite"
  },
  {
    titulo: "📊 Ingresar Calificaciones",
    detalle: "Actualiza notas y retroalimentación"
  },
  {
    titulo: "📢 Enviar Anuncio al Curso",
    detalle: "Comunica novedades a todos los grupos"
  }
];

const actividades = [
  {
    nombre: "Ensayo: Pensamiento crítico",
    curso: "Lengua y Literatura 10A",
    entregados: "24/30",
    pendientes: 8,
    vencimiento: "Hoy, 18:00"
  },
  {
    nombre: "Laboratorio de cinemática",
    curso: "Física 11B",
    entregados: "18/22",
    pendientes: 5,
    vencimiento: "Mañana"
  },
  {
    nombre: "Quiz: Funciones cuadráticas",
    curso: "Matemáticas 9C",
    entregados: "31/32",
    pendientes: 2,
    vencimiento: "Viernes"
  }
];

const mensajesCurso = [
  {
    autor: "Profesor",
    etiqueta: "Fijado",
    texto: "Recuerden revisar la guía antes de la evaluación del jueves.",
    propio: true
  },
  {
    autor: "Camila R.",
    etiqueta: "Estudiante",
    texto: "Profe, ¿la entrega acepta anexos en PDF?"
  },
  {
    autor: "Profesor",
    etiqueta: "Moderación",
    texto: "Sí, y dejaré el mensaje fijado con el formato esperado.",
    propio: true
  }
];

const alertasRendimiento = [
  "7 estudiantes requieren seguimiento por asistencia",
  "Promedio general subió 6% esta semana",
  "3 entregas necesitan retroalimentación prioritaria"
];

export default function PortalProfesor() {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState(navegacionProfesor[0]);

  const tabMeta = {
    "Gestión de Cursos": {
      eyebrow: "Panel premium para educadores",
      title: "Command center académico",
      description:
        "Gestiona cursos, calificaciones, entregas y comunicación del curso desde una vista administrativa diseñada para profesores.",
      stat: "86%",
      statLabel: "avance semanal del curso"
    },
    Calificaciones: {
      eyebrow: "Control académico",
      title: "Centro de calificaciones",
      description:
        "Revisa entregas pendientes, registra notas y prioriza retroalimentación por curso.",
      stat: "15",
      statLabel: "entregas por calificar"
    },
    "Subir Actividades": {
      eyebrow: "Producción de contenido",
      title: "Subir actividades",
      description:
        "Prepara nuevas consignas, adjunta materiales y configura fechas límite para tus grupos.",
      stat: "3",
      statLabel: "borradores activos"
    },
    "Crear Evaluaciones": {
      eyebrow: "Evaluación docente",
      title: "Constructor de evaluaciones",
      description:
        "Crea pruebas, quizzes y rúbricas con criterios listos para publicar al curso.",
      stat: "4",
      statLabel: "evaluaciones programadas"
    },
    "Chat Global del Curso": {
      eyebrow: "Comunicación moderada",
      title: "Chat global del curso",
      description:
        "Supervisa conversaciones, fija mensajes importantes y modera la participación estudiantil.",
      stat: "28",
      statLabel: "mensajes hoy"
    },
    "Métricas y Rendimiento": {
      eyebrow: "Analítica privada del profesor",
      title: "Métricas y rendimiento",
      description:
        "Monitorea desempeño, asistencia y alertas académicas que solo el equipo docente puede ver.",
      stat: "8.7",
      statLabel: "promedio general"
    }
  };

  const metaActiva = tabMeta[tabActiva];

  return (
    <div className="teacher-shell">
      <header className="teacher-topbar">
        <div className="teacher-brand">
          <button className="teacher-logo-button" onClick={() => navigate("/grupos")} aria-label="Volver a FLUX">
            <img src={logoFlux} alt="FLUX" />
          </button>
          <div>
            <p className="teacher-eyebrow">FLUX Educator Suite</p>
            <h1>Portal del Profesor</h1>
          </div>
        </div>

        <div className="teacher-mode-badge" aria-label="Modo profesor activo">
          <span className="teacher-mode-dot" />
          Profesor activo
        </div>

        <div className="teacher-profile-area">
          <button className="teacher-icon-button" aria-label="Notificaciones">
            <span>3</span>
          </button>
          <div className="teacher-avatar">
            <span>PR</span>
          </div>
        </div>
      </header>

      <div className="teacher-layout">
        <aside className="teacher-sidebar card">
          <div className="teacher-sidebar-head">
            <span className="teacher-sidebar-label">Teacher Mode</span>
            <strong>Centro de gestión</strong>
          </div>

          <nav className="teacher-nav" aria-label="Navegación del profesor">
            {navegacionProfesor.map((item, index) => (
              <button
                key={item}
                className={`teacher-nav-item ${tabActiva === item ? "active" : ""}`}
                onClick={() => setTabActiva(item)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="teacher-main">
          <section className="teacher-hero card">
            <div>
              <p className="teacher-eyebrow">{metaActiva.eyebrow}</p>
              <h2>{metaActiva.title}</h2>
              <p>{metaActiva.description}</p>
            </div>
            <div className="teacher-hero-stat">
              <span>{metaActiva.stat}</span>
              <small>{metaActiva.statLabel}</small>
            </div>
          </section>

          {tabActiva === "Gestión de Cursos" && (
            <>
              <section className="teacher-quick-actions" aria-label="Acciones rápidas del profesor">
                {accionesRapidas.map(action => (
                  <button key={action.titulo} className="teacher-action-card" type="button">
                    <strong>{action.titulo}</strong>
                    <span>{action.detalle}</span>
                  </button>
                ))}
              </section>

              <section className="teacher-split">
                <div className="teacher-activity-panel card">
                  <div className="teacher-card-header">
                    <div>
                      <p className="teacher-eyebrow">Gestión operativa</p>
                      <h3>Panel de Control de Actividades</h3>
                    </div>
                    <button className="teacher-small-action" type="button">Ver todas</button>
                  </div>

                  <div className="teacher-table-wrap">
                    <table className="teacher-table">
                      <thead>
                        <tr>
                          <th>Actividad</th>
                          <th>Entregados</th>
                          <th>Pendientes por calificar</th>
                          <th>Vencimiento</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {actividades.map(actividad => (
                          <tr key={actividad.nombre}>
                            <td>
                              <strong>{actividad.nombre}</strong>
                              <span>{actividad.curso}</span>
                            </td>
                            <td>{actividad.entregados}</td>
                            <td>
                              <span className="teacher-needs-grading">{actividad.pendientes}</span>
                            </td>
                            <td>{actividad.vencimiento}</td>
                            <td>
                              <button className="teacher-grade-button" type="button">Calificar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <aside className="teacher-chat card">
                  <div className="teacher-card-header">
                    <div>
                      <p className="teacher-eyebrow">Canal moderado</p>
                      <h3>Chat del Curso (Profesor)</h3>
                    </div>
                  </div>

                  <div className="teacher-chat-admin">
                    <button type="button">Fijar mensaje</button>
                    <button type="button">Silenciar chat</button>
                  </div>

                  <div className="teacher-chat-feed">
                    {mensajesCurso.map(mensaje => (
                      <div key={`${mensaje.autor}-${mensaje.texto}`} className={`teacher-chat-message ${mensaje.propio ? "own" : ""}`}>
                        <div className="teacher-chat-meta">
                          <strong>{mensaje.autor}</strong>
                          <span>{mensaje.etiqueta}</span>
                        </div>
                        <p>{mensaje.texto}</p>
                      </div>
                    ))}
                  </div>
                </aside>
              </section>
            </>
          )}

          {tabActiva === "Calificaciones" && (
            <section className="teacher-tab-panel card">
              <div className="teacher-card-header">
                <div>
                  <p className="teacher-eyebrow">Pendientes de revisión</p>
                  <h3>Bandeja de calificaciones</h3>
                </div>
                <button className="teacher-small-action" type="button">Exportar notas</button>
              </div>
              <div className="teacher-table-wrap">
                <table className="teacher-table">
                  <thead>
                    <tr>
                      <th>Actividad</th>
                      <th>Curso</th>
                      <th>Entregados</th>
                      <th>Por calificar</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actividades.map(actividad => (
                      <tr key={`grade-${actividad.nombre}`}>
                        <td><strong>{actividad.nombre}</strong></td>
                        <td>{actividad.curso}</td>
                        <td>{actividad.entregados}</td>
                        <td><span className="teacher-needs-grading">{actividad.pendientes}</span></td>
                        <td><button className="teacher-grade-button" type="button">Abrir rúbrica</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tabActiva === "Subir Actividades" && (
            <section className="teacher-tab-grid">
              <div className="teacher-tab-panel card">
                <p className="teacher-eyebrow">Nueva actividad</p>
                <h3>Configurar entrega</h3>
                <div className="teacher-form-preview">
                  <label>Título de la actividad</label>
                  <div>Proyecto integrador de unidad</div>
                  <label>Curso destino</label>
                  <div>Matemáticas 9C</div>
                  <label>Fecha límite</label>
                  <div>Viernes, 23:59</div>
                </div>
                <button className="teacher-primary-action" type="button">Publicar actividad</button>
              </div>

              <div className="teacher-tab-panel card">
                <p className="teacher-eyebrow">Materiales</p>
                <h3>Adjuntos listos</h3>
                <div className="teacher-resource-list">
                  <span>Guía_de_trabajo.pdf</span>
                  <span>Rubrica_proyecto.xlsx</span>
                  <span>Video_introductorio.url</span>
                </div>
              </div>
            </section>
          )}

          {tabActiva === "Crear Evaluaciones" && (
            <section className="teacher-tab-grid">
              <div className="teacher-tab-panel card">
                <p className="teacher-eyebrow">Constructor</p>
                <h3>Evaluación diagnóstica</h3>
                <div className="teacher-builder-list">
                  <div><strong>10</strong><span>preguntas de selección</span></div>
                  <div><strong>4</strong><span>preguntas abiertas</span></div>
                  <div><strong>40 min</strong><span>duración sugerida</span></div>
                </div>
                <button className="teacher-primary-action" type="button">Crear evaluación</button>
              </div>
              <div className="teacher-tab-panel card">
                <p className="teacher-eyebrow">Programación</p>
                <h3>Próximas pruebas</h3>
                <div className="teacher-resource-list">
                  <span>Quiz funciones - Jueves 08:00</span>
                  <span>Examen física - Lunes 10:30</span>
                  <span>Lectura crítica - Viernes 09:00</span>
                </div>
              </div>
            </section>
          )}

          {tabActiva === "Chat Global del Curso" && (
            <section className="teacher-chat teacher-tab-panel card">
              <div className="teacher-card-header">
                <div>
                  <p className="teacher-eyebrow">Permisos de administrador</p>
                  <h3>Chat Global del Curso</h3>
                </div>
                <span className="teacher-private-chip">Moderación activa</span>
              </div>
              <div className="teacher-chat-admin">
                <button type="button">Fijar mensaje</button>
                <button type="button">Silenciar chat</button>
                <button type="button">Revisar reportes</button>
              </div>
              <div className="teacher-chat-feed">
                {mensajesCurso.map(mensaje => (
                  <div key={`global-${mensaje.autor}-${mensaje.texto}`} className={`teacher-chat-message ${mensaje.propio ? "own" : ""}`}>
                    <div className="teacher-chat-meta">
                      <strong>{mensaje.autor}</strong>
                      <span>{mensaje.etiqueta}</span>
                    </div>
                    <p>{mensaje.texto}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tabActiva === "Métricas y Rendimiento" && (
            <section className="teacher-performance card">
              <div className="teacher-card-header">
                <div>
                  <p className="teacher-eyebrow">Analítica privada del profesor</p>
                  <h3>Rendimiento del Curso</h3>
                </div>
                <span className="teacher-private-chip">Solo docentes</span>
              </div>

              <div className="teacher-metrics-grid">
                <div className="teacher-metric">
                  <span>8.7</span>
                  <p>Promedio general</p>
                </div>
                <div className="teacher-metric">
                  <span>92%</span>
                  <p>Asistencia semanal</p>
                </div>
                <div className="teacher-metric">
                  <span>15</span>
                  <p>Entregas con alerta</p>
                </div>
              </div>

              <div className="teacher-alert-list">
                {alertasRendimiento.map(alerta => (
                  <div key={alerta} className="teacher-alert-item">
                    <span />
                    {alerta}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
