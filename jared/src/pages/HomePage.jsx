import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Shell from '../components/Shell';

function HomePage({ role, onLogout }) {
    const handleShowFAQ = () => {
      Swal.fire({
        title: 'Preguntas Frecuentes (FAQ)',
        html: `
  <div style='text-align:left;font-size:1rem;'>
  <b>1. ¿Qué es una preevaluación psicológica y para qué sirve?</b><br>
  Es una herramienta de cribado inicial que ayuda a identificar indicadores o síntomas relacionados con la salud mental. Su objetivo no es dar un diagnóstico definitivo, sino ofrecer una orientación preliminar al buscar el apoyo de un profesional especializado.<br><br>

  <b>2. ¿Esta evaluación sustituye una consulta con un psicólogo?</b><br>
  No. Los resultados obtenidos son de carácter informativo y estadístico. Un diagnóstico clínico formal solo puede ser realizado por un psicólogo o psiquiatra colegiado a través de entrevistas y pruebas clínicas estandarizadas.<br><br>

  <b>3. ¿Quién tendrá acceso a mis respuestas?</b><br>
  Los datos están protegidos bajo protocolos de confidencialidad y solo serán utilizados con fines de análisis dentro del proyecto, garantizando que la información sensible no sea compartida con terceros sin tu consentimiento explícito.<br><br>

  <b>4. ¿Cuánto tiempo toma completar la evaluación?</b><br>
  El tiempo estimado es de entre 10 a 15 minutos. Te recomendamos realizarla en un lugar tranquilo y sin interrupciones para que tus respuestas sean lo más sinceras y precisas posible.<br><br>

  <b>5. ¿Qué significan mis resultados?</b><br>
  Al finalizar, recibirás un reporte con una interpretación basada en escalas validadas. Un resultado "alto" en ciertos indicadores no significa una patología, sino una señal de alerta que sugiere que podrías beneficiarte de una conversación con un especialista.<br><br>

  <b>6. ¿Tiene algún costo utilizar esta plataforma?</b><br>
  No, la plataforma es completamente gratuita y forma parte de una iniciativa de innovación tecnológica para facilitar el acceso a herramientas de salud mental.<br><br>

  <b>7. ¿Qué debo hacer si me encuentro en una situación de crisis inmediata?</b><br>
  Nuestra plataforma no es un servicio de atención de emergencias. Si sientes que tú o alguien más está en peligro inmediato, por favor comunícate a las líneas de ayuda locales (como el 911 o 800 911 2000) o acude al centro de salud más cercano.
  </div>
  `,
        width: 700,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'faq-modal' }
      });
    };

    const handleShowStats = () => {
      Swal.fire({
        title: 'Resultados estadísticos de referencia',
        html: `
<div style="text-align:left; max-height:60vh; overflow-y:auto; font-size:1rem; padding-right:8px;">
<b>Diversos estudios realizados en población mexicana han demostrado que los instrumentos utilizados en este sistema presentan alta confiabilidad, validez y consistencia estadística, lo que respalda su uso en procesos de tamizaje y análisis poblacional.</b><br><br>
<b>Depresión — CES-D</b><br>
La escala CES-D ha sido aplicada en una muestra amplia de 57,403 estudiantes mexicanos, reportando una media de 16.2 puntos (DE ≈ 10.4).<br>
<ul style="margin-top:6px;">
  <li>Prevalencia de depresión elevada: 14.7%
    <ul>
      <li>Mujeres: 17.9%</li>
      <li>Hombres: 11.1%</li>
    </ul>
  </li>
  <li>Confiabilidad: α = 0.83</li>
  <li>Varianza explicada: 54.1%</li>
</ul>
Aproximadamente 1 de cada 7 personas presenta síntomas depresivos relevantes. Existe una relación directa con el riesgo suicida, lo que convierte a este instrumento en una herramienta clave de detección temprana.<br><br>

<b>Estrés percibido — PSS-14</b><br>
La escala PSS-14 ha sido validada en población mexicana, incluyendo muestras clínicas como mujeres en etapa puerperal (n ≈ 104), con una media de 22.0 puntos (DE ≈ 8.5).<br>
<ul style="margin-top:6px;">
  <li>Confiabilidad: α = 0.72 – 0.83</li>
  <li>Varianza explicada: hasta 62.2%</li>
  <li>Estructura: 2 factores (estrés percibido y control)</li>
  <li>Correlaciones:
    <ul>
      <li>Depresión: r ≈ 0.40 – 0.60</li>
      <li>Ansiedad: r ≈ 0.40 – 0.60</li>
    </ul>
  </li>
</ul>
El estrés percibido se relaciona de forma moderada con ansiedad y depresión, lo que lo convierte en un indicador útil para evaluar el estado emocional general del paciente.<br><br>

<b>Ansiedad — IDARE</b><br>
El IDARE permite evaluar dos dimensiones: ansiedad como estado (temporal) y como rasgo (estable).<br>
<ul style="margin-top:6px;">
  <li>Media poblacional: 40 – 50 puntos</li>
  <li>Confiabilidad:
    <ul>
      <li>Estado: α = 0.83 – 0.92</li>
      <li>Rasgo: α = 0.84 – 0.90</li>
    </ul>
  </li>
  <li>Varianza explicada: 50% – 60%</li>
  <li>Correlación con depresión: r ≈ 0.50</li>
  <li>Diferencias por sexo: p &lt; 0.05 (mayor en mujeres)</li>
</ul>
Permite diferenciar entre ansiedad momentánea y patrones persistentes, siendo útil para seguimiento clínico y análisis longitudinal.<br><br>

<b>Ideación suicida — BSS</b><br>
La escala BSS evalúa la presencia e intensidad de pensamientos suicidas.<br>
<ul style="margin-top:6px;">
  <li>Media (población general): 5 – 10 puntos</li>
  <li>Media (población de riesgo): &gt; 15 puntos</li>
  <li>Confiabilidad: α = 0.87 – 0.95</li>
  <li>Varianza explicada: 60% – 70%</li>
</ul>
Es el instrumento más sensible del sistema para la detección de riesgo clínico, permitiendo identificar casos que requieren atención inmediata.<br><br>

<b>Conclusión general</b><br>
En conjunto, los instrumentos utilizados presentan:<br>
<ul style="margin-top:6px;">
  <li>Alta confiabilidad</li>
  <li>Adecuada validez estructural</li>
  <li>Relaciones significativas entre variables psicológicas</li>
</ul>
<b>Referencias clínicas</b><br>
<ul style="font-size:0.97em;">
  <li>González-Forteza, Catalina, et al. (2011). Confiabilidad y validez de la escala de depresión CES-D en un censo de estudiantes de nivel medio superior y superior, en la Ciudad de México. Salud mental, 34(1), 53-59. <a href="http://www.scielo.org.mx/scielo.php?script=sci_arttext&pid=S0185-33252011000100007&lng=es&tlng=es" target="_blank">Enlace</a></li>
  <li>Torres-Lagunas, M.A., et al. (2015). Validación psicométrica de escalas PSS-14, AFA-R, HDRS, CES-D, EV en puérperas mexicanas con y sin preeclampsia. Enfermería universitaria, 12(3), 122-133. <a href="https://doi.org/10.1016/j.reu.2015.08.001" target="_blank">Enlace</a></li>
  <li>Reyes Carmona, Carlos, et al. (2017). Ansiedad de los estudiantes de una facultad de medicina mexicana, antes de iniciar el internado. Investigación en educación médica, 6(21), 42-46. <a href="https://doi.org/10.1016/j.riem.2016.05.004" target="_blank">Enlace</a></li>
</ul>
</div>
`,
        width: 700,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#2563eb',
        customClass: { popup: 'faq-modal' },
        scrollbarPadding: false,
      });
    };
  const navigate = useNavigate();

  const handleStartEvaluation = async (instrumentCode = 'CESD') => {
    await Swal.fire({
      icon: 'info',
      title: 'Comenzando evaluación',
      text: 'Serás redirigido para seleccionar el test que deseas realizar.',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#2563eb',
    });
    navigate('/test');
  };

  const features = [
    { icon: '📊', label: 'Estadísticas de investigación', onClick: handleShowStats },
    { icon: '💬', label: 'Preguntas frecuentes', onClick: handleShowFAQ },
  ];

  const stats = [
    { value: '20–30%', desc: 'Universitarios con síntomas depresivos' },
    { value: '4 tests', desc: 'Instrumentos validados clínicamente' },
    { value: '100%', desc: 'Confidencial y anónimo' },
    { value: '∞', desc: 'Acceso libre y gratuito' },
  ];

  return (
    <Shell role={role} onLogout={onLogout}>
      <section className="hero-bg" style={{ padding: '72px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <p className="fade-up" style={{
            fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'var(--blue2)',
            background: '#dbeafe', borderRadius: 999, padding: '5px 16px',
            display: 'inline-block', marginBottom: 20,
          }}>
            Salud mental
          </p>
          <h1 className="serif fade-up fade-up-1" style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 900,
            color: 'var(--navy)', lineHeight: 1.12, marginBottom: 20,
          }}>
            Tu bienestar emocional<br />
            <span style={{ color: 'var(--blue2)' }}>importa</span>
          </h1>
          <p className="fade-up fade-up-2" style={{
            fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36,
          }}>
            Psybioneer es una herramienta de tamizaje temprano diseñada para identificar posibles
            indicadores de malestar emocional en estudiantes universitarios.
          </p>
          <div className="fade-up fade-up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleStartEvaluation} style={{ padding: '13px 30px', fontSize: '0.95rem' }}>
              Comenzar evaluación →
            </button>
            <Link to="/resources" className="btn-ghost" style={{ padding: '13px 28px', fontSize: '0.95rem' }}>
              Ver recursos
            </Link>
          </div>
        </div>
      </section>

      <section style={{
        background: 'var(--navy2)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 24px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12,
        }}>
          {features.map((f) => (
            <div
              key={f.label}
              className="badge-pill"
              style={{ borderRadius: 12, padding: '12px 16px', cursor: f.onClick ? 'pointer' : 'default' }}
              onClick={f.onClick}
            >
              <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.82rem' }}>{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--navy)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-divider" />
            <h2 className="serif" style={{ fontSize: '1.9rem', color: '#e2eaf8', fontWeight: 700 }}>
              Antes de comenzar
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div className="card">
              <div style={{ padding: '6px 0', background: 'linear-gradient(90deg, var(--blue2), var(--sky))', height: 4 }} />
              <div style={{ padding: '28px 28px 32px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                }}>⚠️</div>
                <h3 className="serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
                  Información importante
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.75 }}>
                  Psybioneer es una herramienta digital de tamizaje diseñada para identificar de manera temprana
                  posibles indicadores de malestar emocional en población universitaria.
                </p>
                <ul style={{ marginTop: 14, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['No sustituye un diagnóstico clínico.', 'No sustituye una consulta profesional.', 'No determina la presencia de un trastorno mental.'].map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.85rem', color: '#475569' }}>
                      <span style={{ color: 'var(--blue2)', marginTop: 1, flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card">
              <div style={{ padding: '6px 0', background: 'linear-gradient(90deg, var(--gold), var(--accent))', height: 4 }} />
              <div style={{ padding: '28px 28px 32px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 16,
                  background: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                }}>🎯 </div>
                <h3 className="serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 14 }}>
                  Objetivo
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.75 }}>
                  Ofrecer una orientación preventiva basada en criterios psicológicos estandarizados para
                  apoyar el bienestar emocional de los estudiantes.
                </p>
                <p style={{ marginTop: 14, fontSize: '0.85rem', color: '#475569', lineHeight: 1.75 }}>
                  Los resultados tienen carácter orientativo, no diagnóstico. No existen respuestas
                  correctas o incorrectas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--navy2)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-divider" />
            <h2 className="serif" style={{ fontSize: '1.9rem', color: '#e2eaf8', fontWeight: 700 }}>
              Estadísticas
            </h2>
            <p style={{ color: '#7ea8d4', marginTop: 8, fontSize: '0.9rem' }}>
              Datos basados en investigaciones en población universitaria
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {stats.map((s) => (
              <div key={s.value} className="stat-card" style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  fontSize: '2.4rem',
                  fontWeight: 700,
                  fontVariantNumeric: 'lining-nums tabular-nums',
                  letterSpacing: '0.01em',
                  color: 'var(--gold)',
                  lineHeight: 1
                }}>
                  {s.value}
                </div>
                <div style={{ marginTop: 10, fontSize: '0.82rem', color: '#93c5fd', lineHeight: 1.5 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--navy)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-divider" />
            <h2 className="serif" style={{ fontSize: '1.9rem', color: '#e2eaf8', fontWeight: 700 }}>
              Evaluaciones disponibles
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
            {[
              { code: 'CESD', name: 'CES-D', desc: 'Escala de depresión del Centro de Estudios Epidemiológicos', icon: '🧩', color: '#2563eb' },
              { code: 'PSS', name: 'PSS', desc: 'Escala de estrés percibido', icon: '⚡', color: '#0891b2' },
              { code: 'IDARE', name: 'IDARE', desc: 'Inventario de Ansiedad Estado-Rasgo', icon: '📝', color: '#f59e42' },
              { code: 'BSS', name: 'BSS', desc: 'Escala de desesperanza de Beck', icon: '🕊️', color: '#10b981' },
            ].map((t) => (
              <div key={t.name} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: `${t.color}18`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0,
                  }}>{t.icon}</div>
                  <span className="serif" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy)' }}>{t.name}</span>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.65 }}>{t.desc}</p>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: t.color, fontWeight: 600 }}>
                  <span>Orientativo, no diagnóstico</span>
                </div>
                    <button
                      className="btn-primary"
                      style={{ marginTop: 14, width: '100%', padding: '10px 14px' }}
                      onClick={() => handleStartEvaluation(t.code)}
                    >
                      Realizar {t.name}
                    </button>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>

          </div>
        </div>
      </section>

      <footer style={{
        background: '#080f1e',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 24px',
        textAlign: 'center',
      }}>
        <p className="serif" style={{ fontSize: '1.1rem', color: '#93c5fd', fontWeight: 700, marginBottom: 6 }}>PSYBIONEER</p>
        <p style={{ fontSize: '0.75rem', color: '#475569' }}>
          © 2025 · Herramienta de tamizaje en salud mental · Todos los derechos reservados
        </p>
      </footer>
    </Shell>
  );
}

export default HomePage;