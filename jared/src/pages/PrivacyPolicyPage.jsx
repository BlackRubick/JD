import Shell from '../components/Shell';

function PrivacyPolicyPage({ role, onLogout }) {
  return (
    <Shell role={role} onLogout={onLogout}>
      <main style={{ padding: '48px 24px', minHeight: 'calc(100vh - 220px)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ marginBottom: 28 }}>
            <h2 className="serif" style={{ fontSize: '2rem', fontWeight: 700, color: '#e2eaf8' }}>Aviso de privacidad</h2>
            <p style={{ color: '#bfdbfe', marginTop: 10 }}>Plataforma Psybioneer</p>
            <div style={{ width: 56, height: 3, background: 'linear-gradient(90deg, var(--gold), var(--accent))', borderRadius: 2, marginTop: 10 }} />
          </div>

          <div className="card" style={{ padding: '32px', lineHeight: 1.75 }}>
            <p>
              Antes de comenzar la evaluación, le solicitamos leer cuidadosamente la siguiente información.
              Este documento describe el propósito de la plataforma, el uso de la información recopilada y sus derechos como usuario.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>1. Propósito de la plataforma</h3>
            <p>
              Psybioneer es una plataforma digital diseñada para realizar evaluaciones preliminares de bienestar psicológico
              mediante cuestionarios estandarizados utilizados en investigación académica.
            </p>
            <p>
              El objetivo principal es identificar de manera temprana posibles indicadores de malestar emocional,
              tales como síntomas depresivos, ansiedad, estrés percibido o ideación suicida,
              con el fin de proporcionar orientación inicial y facilitar el acceso a apoyo profesional cuando sea necesario.
            </p>
            <p>
              Es importante señalar que los resultados obtenidos no constituyen un diagnóstico clínico,
              ni sustituyen la evaluación realizada por un profesional de la salud mental.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>2. Procedimiento de evaluación</h3>
            <p>
              La evaluación consiste en responder una serie de cuestionarios psicológicos de autorreporte
              que evalúan distintos aspectos del bienestar emocional.
            </p>
            <p>
              El tiempo estimado para completar la evaluación es de aproximadamente 10 a 20 minutos.
              Al finalizar, el sistema generará automáticamente un reporte informativo que incluirá
              una interpretación general de los resultados y recomendaciones orientativas.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>3. Uso de la información recopilada</h3>
            <p>La información proporcionada durante la evaluación será utilizada con los siguientes fines:</p>
            <ul style={{ paddingLeft: 20 }}>
              <li>Generar el reporte individual de resultados para el usuario.</li>
              <li>Facilitar, en caso de que el usuario lo solicite, el contacto con profesionales del área de psicología para orientación o seguimiento.</li>
              <li>Contribuir a fines académicos y de investigación relacionados con el bienestar psicológico en la población universitaria.</li>
            </ul>
            <p>
              Para fines de investigación, los datos podrán ser utilizados de forma anonimizada,
              es decir, sin información que permita identificar personalmente al usuario.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>4. Confidencialidad y protección de datos</h3>
            <p>
              La información proporcionada será tratada con estricta confidencialidad y será almacenada en servidores protegidos.
              Únicamente los profesionales autorizados vinculados al proyecto podrán acceder a los resultados individuales
              cuando el usuario solicite seguimiento profesional.
              En ningún caso los resultados individuales serán publicados ni compartidos públicamente.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>5. Tratamiento de datos personales sensibles</h3>
            <p>
              La información recopilada incluye datos relacionados con la salud mental del usuario,
              los cuales son considerados datos personales sensibles.
              Al aceptar el presente documento, el usuario otorga su consentimiento expreso
              para el tratamiento de estos datos conforme a las finalidades descritas.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>6. Participación voluntaria y eliminación de cuenta</h3>
            <p>
              La participación en esta evaluación es completamente voluntaria.
              El usuario puede decidir no responder alguna pregunta o abandonar la evaluación en cualquier momento sin ninguna consecuencia.
              Asimismo, después de recibir sus resultados, el usuario podrá decidir libremente si desea solicitar seguimiento profesional o no.
            </p>
            <p>
              El usuario también tiene derecho a solicitar la eliminación de su cuenta en cualquier momento.
              Una vez realizada la solicitud, la cuenta entrará en un periodo de recuperación de 60 días,
              durante el cual podrá ser reactivada por el usuario.
              Transcurrido dicho plazo sin haberse solicitado la reactivación,
              la cuenta y la información asociada serán eliminadas de manera permanente e irreversible.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>7. Derechos ARCO</h3>
            <p>
              El usuario tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales.
              Para ejercer estos derechos, el usuario podrá realizar una solicitud a través de los medios de contacto
              que la plataforma ponga a su disposición.
              La solicitud deberá contener la información necesaria para identificar al titular de los datos
              y describir claramente el derecho que desea ejercer.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>8. Seguimiento profesional</h3>
            <p>
              En caso de que el usuario desee recibir orientación adicional,
              la plataforma ofrecerá la opción de contactar con profesionales del área de psicología
              a través de un sistema de comunicación dentro de la plataforma.
              Este contacto inicial tiene como finalidad facilitar la orientación y,
              en caso necesario, apoyar en la programación de una consulta profesional.
            </p>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>9. Protocolo en caso de detección de alto riesgo</h3>
            <p>
              Si durante la evaluación se identifican indicadores elevados de riesgo para la salud mental,
              particularmente relacionados con ideación suicida,
              el sistema podrá activar un protocolo de atención prioritaria.
            </p>
            <p>En estos casos:</p>
            <ul style={{ paddingLeft: 20 }}>
              <li>El usuario recibirá recomendaciones claras para buscar apoyo profesional de manera inmediata.</li>
              <li>Con base en el consentimiento otorgado, se podrá notificar a un profesional autorizado del proyecto para facilitar la orientación correspondiente.</li>
            </ul>

            <h3 className="serif" style={{ marginTop: 20, color: 'var(--navy)' }}>10. Aceptación del consentimiento</h3>
            <p>Al seleccionar la opción “Acepto y deseo continuar”, usted declara que:</p>
            <ul style={{ paddingLeft: 20 }}>
              <li>He leído y comprendido la información presentada en este documento.</li>
              <li>Entiendo que esta evaluación tiene fines informativos y de investigación.</li>
              <li>Otorgo mi consentimiento para el tratamiento de mis datos personales, incluyendo datos sensibles.</li>
              <li>Acepto participar voluntariamente en la evaluación psicológica digital.</li>
            </ul>
          </div>
        </div>
      </main>
    </Shell>
  );
}

export default PrivacyPolicyPage;
