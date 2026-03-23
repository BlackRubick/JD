// Definición de los 4 tests psicológicos con preguntas y opciones

export const TESTS = [
  {
    id: 'cesd',
    name: 'CES-D',
    instructions: 'Indica con qué frecuencia has experimentado cada situación durante la última semana.',
    options: [
      { label: 'Raramente o nunca: Menos de 1 día', value: 0 },
      { label: 'Algo o poco: Entre 1-2 días', value: 1 },
      { label: 'A veces o bastante: Entre 3-4 días', value: 2 },
      { label: 'Mucho o siempre: Entre 5-7 días', value: 3 }
    ],
    questions: [
      'Me he enfadado por cosas que habitualmente no me molestan',
      'No he tenido ganas de comer, mi apetito era malo',
      'He sentido que no me podía liberar de la tristeza ni con la ayuda de familiares o amigos',
      'Sentía que era tan bueno como cualquier persona',
      'Me ha costado trabajo concentrarme en lo que hacía',
      'Me he sentido pesimista',
      'Me ha costado un esfuerzo hacer cualquier cosa',
      'Me he sentido ilusionado por mi destino',
      'He pensado que mi vida había sido un fracaso',
      'Me he sentido asustado',
      'Mi sueño ha sido inquieto',
      'Estuve contento',
      'Hablaba menos de lo habitual',
      'Me he sentido muy solo',
      'La gente era poco amistosa',
      'He disfrutado de la vida',
      'He llorado a ratos',
      'Me he sentido triste',
      'He sentido que la gente me tenía antipatía',
      'No me podía poner en marcha'
    ]
  },
  {
    id: 'pss14',
    name: 'PSS-14',
    instructions: 'En el último mes, ¿con qué frecuencia ha experimentado lo siguiente?',
    options: [
      { label: 'Nunca', value: 0 },
      { label: 'Casi nunca', value: 1 },
      { label: 'De vez en cuando', value: 2 },
      { label: 'A menudo', value: 3 },
      { label: 'Muy a menudo', value: 4 }
    ],
    questions: [
      '¿Con qué frecuencia ha estado afectado por algo que ha ocurrido inesperadamente?',
      '¿Con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?',
      '¿Con qué frecuencia se ha sentido nervioso o estresado?',
      '¿Con qué frecuencia ha manejado con éxito los pequeños problemas irritantes de la vida?',
      '¿Con qué frecuencia ha sentido que ha afrontado efectivamente los cambios importantes que han estado ocurriendo en su vida?',
      '¿Con qué frecuencia ha estado seguro sobre su capacidad para manejar sus problemas personales?',
      '¿Con qué frecuencia ha sentido que las cosas le van bien?',
      '¿Con qué frecuencia ha sentido que no podía afrontar todas las cosas que tenía que hacer?',
      '¿Con qué frecuencia ha podido controlar las dificultades de su vida?',
      '¿Con qué frecuencia ha sentido que tenía todo bajo control?',
      '¿Con qué frecuencia ha estado enfadado porque las cosas que le han ocurrido estaban fuera de su control?',
      '¿Con qué frecuencia ha pensado sobre las cosas que le quedan por hacer?',
      '¿Con qué frecuencia ha podido controlar la forma de pasar el tiempo?',
      '¿Con qué frecuencia ha sentido que las dificultades se acumulan tanto que no puede superarlas?'
    ]
  },
  {
    id: 'idare',
    name: 'IDARE',
    instructions: 'Marca la opción que mejor describe cómo te sientes actualmente (Estado) y habitualmente (Rasgo).',
    optionsEstado: [
      { label: 'No en lo absoluto', value: 1 },
      { label: 'Un poco', value: 2 },
      { label: 'Bastante', value: 3 },
      { label: 'Mucho', value: 4 }
    ],
    optionsRasgo: [
      { label: 'Casi nunca', value: 1 },
      { label: 'Algunas veces', value: 2 },
      { label: 'Frecuentemente', value: 3 },
      { label: 'Casi siempre', value: 4 }
    ],
    preguntasEstado: [
      'Me siento calmado',
      'Me siento seguro',
      'Estoy tenso',
      'Estoy contrariado',
      'Me siento a gusto',
      'Me siento alterado',
      'Estoy preocupado actualmente por algún posible contratiempo',
      'Me siento descansado',
      'Me siento ansioso',
      'Me siento cómodo',
      'Me siento con confianza en mí mismo',
      'Me siento nervioso',
      'Estoy agitado',
      'Me siento a punto de explotar',
      'Me siento relajado',
      'Me siento satisfecho',
      'Estoy preocupado',
      'Me siento muy preocupado y aturdido',
      'Me siento alegre',
      'Me siento bien'
    ],
    preguntasRasgo: [
      'Me siento mal',
      'Me canso rápidamente',
      'Siento ganas de llorar',
      'Quisiera ser tan feliz como otras personas parecen ser',
      'Pierdo oportunidades por no poder decidirme',
      'Me siento descansado',
      'Soy una persona tranquila, serena y sosegada',
      'Siento que las dificultades se me amontonan',
      'Me preocupo demasiado por cosas sin importancia',
      'Soy feliz',
      'Tomo las cosas muy a pecho',
      'Me falta confianza en mí mismo',
      'Me siento seguro',
      'Trato de evitar crisis y dificultades',
      'Me siento melancólico',
      'Me siento satisfecho',
      'Algunas ideas poco importantes pasan por mi mente',
      'Me afectan mucho los desengaños',
      'Soy una persona estable',
      'Me tenso al pensar en mis asuntos'
    ]
  },
  {
    id: 'bss',
    name: 'BSS',
    instructions: 'Selecciona la opción que mejor describe tu situación actual para cada pregunta.',
    questions: [
      {
        text: 'Deseo de vivir',
        options: [
          { label: 'Moderado a fuerte', value: 0 },
          { label: 'Débil', value: 1 },
          { label: 'Ninguno', value: 2 }
        ]
      },
      {
        text: 'Deseo de morir',
        options: [
          { label: 'Ninguno', value: 0 },
          { label: 'Débil', value: 1 },
          { label: 'Moderado a fuerte', value: 2 }
        ]
      },
      {
        text: 'Razones para vivir/morir',
        options: [
          { label: 'Porque seguir viviendo vale más que morir', value: 0 },
          { label: 'Aproximadamente iguales', value: 1 },
          { label: 'Porque la muerte vale más que seguir viviendo', value: 2 }
        ]
      },
      {
        text: 'Deseo de intentar activamente el suicidio',
        options: [
          { label: 'Ninguno', value: 0 },
          { label: 'Débil', value: 1 },
          { label: 'Moderado a fuerte', value: 2 }
        ]
      },
      {
        text: 'Deseos pasivos de suicidio',
        options: [
          { label: 'Puede tomar precauciones para salvaguardar la vida', value: 0 },
          { label: 'Puede dejar de vivir/morir por casualidad', value: 1 },
          { label: 'Puede evitar las etapas necesarias para seguir con vida', value: 2 }
        ]
      },
      {
        text: 'Dimensión temporal (duración de la ideación/deseo suicida)',
        options: [
          { label: 'Breve, períodos pasajeros', value: 0 },
          { label: 'Por amplios períodos de tiempo', value: 1 },
          { label: 'Continuo (crónico) o casi continuo', value: 2 }
        ]
      },
      {
        text: 'Dimensión temporal (frecuencia del suicidio)',
        options: [
          { label: 'Raro, ocasional', value: 0 },
          { label: 'Intermitente', value: 1 },
          { label: 'Persistente o continuo', value: 2 }
        ]
      },
      {
        text: 'Actitud hacia la ideación/deseo',
        options: [
          { label: 'Rechazo', value: 0 },
          { label: 'Ambivalente, indiferente', value: 1 },
          { label: 'Aceptación', value: 2 }
        ]
      },
      {
        text: 'Control sobre la actividad suicida/deseos de acting out',
        options: [
          { label: 'Tiene sentido del control', value: 0 },
          { label: 'Inseguro', value: 1 },
          { label: 'No tiene sentido del control', value: 2 }
        ]
      },
      {
        text: 'Disuasivos para un intento activo (familia, religión, irreversibilidad)',
        options: [
          { label: 'Puede no intentarlo a causa de un disuasivo', value: 0 },
          { label: 'Alguna preocupación sobre los medios pueden disuadirlo', value: 1 },
          { label: 'Mínima o ninguna preocupación o interés por ellos', value: 2 }
        ]
      },
      {
        text: 'Razones para el intento contemplado',
        options: [
          { label: 'Manipular el entorno, llamar la atención, vengarse', value: 0 },
          { label: 'Combinación de 0 y 2', value: 1 },
          { label: 'Escapar, solucionar los problemas, finalizar de forma absoluta', value: 2 }
        ]
      },
      {
        text: 'Método (especificidad/planificación del intento contemplado)',
        options: [
          { label: 'No considerado', value: 0 },
          { label: 'Considerado, pero detalles no calculados', value: 1 },
          { label: 'Detalles calculados/bien formulados', value: 2 }
        ]
      },
      {
        text: 'Método (accesibilidad/oportunidad para el intento contemplado)',
        options: [
          { label: 'Método no disponible, inaccesible. No hay oportunidad', value: 0 },
          { label: 'El método puede tomar tiempo o esfuerzo. Oportunidad escasa', value: 1 },
          { label: 'Método y oportunidad accesibles', value: 2 }
        ]
      },
      {
        text: 'Sentido de «capacidad» para llevar adelante el intento',
        options: [
          { label: 'No tiene valor, demasiado débil, miedoso, incompetente', value: 0 },
          { label: 'Inseguridad sobre su valor', value: 1 },
          { label: 'Seguro de su valor, capacidad', value: 2 }
        ]
      },
      {
        text: 'Expectativas/espera del intento actual',
        options: [
          { label: 'No', value: 0 },
          { label: 'Incierto', value: 1 },
          { label: 'Sí', value: 2 }
        ]
      },
      {
        text: 'Preparación actual para el intento contemplado',
        options: [
          { label: 'Ninguna', value: 0 },
          { label: 'Parcial (ej. empieza a almacenar pastillas, etc.)', value: 1 },
          { label: 'Completa (ej. tiene las pastillas, pistola cargada, etc.)', value: 2 }
        ]
      },
      {
        text: 'Nota suicida',
        options: [
          { label: 'Ninguna', value: 0 },
          { label: 'Piensa sobre ella o comenzada y no terminada', value: 1 },
          { label: 'Nota terminada', value: 2 }
        ]
      },
      {
        text: 'Actos finales en anticipación de la muerte',
        options: [
          { label: 'Ninguno', value: 0 },
          { label: 'Piensa sobre ello o hace algunos arreglos', value: 1 },
          { label: 'Hace planes definitivos o terminó los arreglos finales', value: 2 }
        ]
      },
      {
        text: 'Engaño/encubrimiento del intento contemplado',
        options: [
          { label: 'Reveló las ideas abiertamente', value: 0 },
          { label: 'Frenó lo que estaba expresando', value: 1 },
          { label: 'Intentó engañar, ocultar, mentir', value: 2 }
        ]
      }
    ]
  }
];
