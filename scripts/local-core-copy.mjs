/**
 * Short, scenario-based service copy. These are available types of work,
 * not claims about the prevalence of a fault in any particular locality.
 * Keep strings as plain text: the page renderer owns escaping and markup.
 */
export const coreCopy = {
  antenas: [
    {
      id: 'antenas-toma-sin-senal',
      title: 'Una toma pierde la televisión',
      text: 'Cuando la televisión funciona en unas habitaciones y en otra no, revisamos la toma, el latiguillo y el tramo interior que la alimenta. La comparación entre puntos permite localizar pérdidas sin comenzar cambiando la antena exterior.',
      ask: 'Anota en qué habitaciones funciona la televisión y si has cambiado recientemente cables, tomas o muebles.',
      question: '¿Puedo comparar la avería con otro televisor?',
      answer: 'Probar un equipo que funciona en otra toma aporta una referencia útil. Indica también si usaste el mismo latiguillo, porque ese cable puede cambiar el resultado.'
    },
    {
      id: 'antenas-perdida-general',
      title: 'Sin señal en toda la vivienda',
      text: 'La pérdida de todos los canales requiere comprobar qué tienen en común los televisores afectados. Revisamos recepción, alimentación y distribución para distinguir una avería de antena de un corte en el recorrido de señal dentro del inmueble.',
      ask: 'Explica cuándo empezó el fallo, cuántos televisores afecta y si otros vecinos conservan la señal.',
      question: '¿Conviene volver a buscar los canales si desaparecen todos?',
      answer: 'Primero interesa saber si llega señal a la toma. Una búsqueda sin recepción puede dejar la lista vacía y dificultar la comparación con los canales que fallaban.'
    },
    {
      id: 'antenas-orientacion-parabolica',
      title: 'Orientación y revisión de parabólicas',
      text: 'En una parabólica revisamos orientación, fijación, LNB y conexiones hasta el receptor. El montaje se plantea según la posición orbital buscada y el número de equipos conectados, tanto para recuperar señal como para preparar una instalación nueva.',
      ask: 'Facilita el modelo del receptor, el satélite que utilizas y cuántos equipos dependen de la parabólica.',
      question: '¿Basta con cambiar el LNB para recuperar la recepción?',
      answer: 'Depende de dónde esté el fallo. La medida de señal y la comprobación del coaxial permiten valorar el LNB junto con la orientación y las conexiones.'
    },
    {
      id: 'antenas-toma-adicional',
      title: 'Televisión en otra habitación',
      text: 'Añadir una toma de televisión exige revisar el reparto disponible, el recorrido del coaxial y las pérdidas que introduce la ampliación. Preparamos la conexión para el nuevo equipo y comprobamos cómo quedan las tomas que ya se utilizan.',
      ask: 'Señala dónde está la toma actual, dónde irá la nueva y si existe canalización aprovechable.',
      question: '¿Se puede aprovechar una canalización existente?',
      answer: 'Se comprueba su recorrido, espacio y estado antes de presupuestar el tendido. Las fotos de los puntos de entrada y salida ayudan a preparar esa revisión.'
    },
    {
      id: 'antenas-reforma-vivienda',
      title: 'Reordenar la instalación tras una reforma',
      text: 'Una reforma puede dejar empalmes, tomas o repartidores que limitan la recepción. Revisamos la distribución interior y proponemos el recorrido del cableado según la nueva ubicación de los televisores, con atención a los puntos que hayan quedado desconectados.',
      ask: 'Cuenta qué estancias se reformaron y si el problema apareció al mover alguna toma de televisión.',
      question: '¿Hay que revisar la antena del edificio después de una reforma?',
      answer: 'La información sobre otras viviendas ayuda a decidirlo. Si conservan buena recepción, se puede comenzar por los elementos y recorridos modificados dentro del piso reformado.'
    },
    {
      id: 'antenas-tras-viento',
      title: 'Revisión de la antena después del viento',
      text: 'Cuando los cortes aparecen después de viento o lluvia, comprobamos fijaciones, orientación y conexiones exteriores. La revisión contempla el mástil, el estado del coaxial y la entrada de humedad, además de medir la calidad de recepción.',
      ask: 'Indica si el fallo comenzó tras un temporal y qué cambios observas desde una zona accesible.',
      question: '¿Puede seguir habiendo imagen con la antena desplazada?',
      answer: 'Sí, algunos canales pueden conservar recepción mientras otros pierden margen. Conviene identificar los afectados y si los cortes aparecen de forma continua o solo en ciertos momentos.'
    },
    {
      id: 'antenas-red-comunitaria',
      title: 'Averías de televisión en comunidades',
      text: 'Si varias viviendas pierden los mismos canales, organizamos la revisión desde los elementos compartidos hacia la distribución. Se comprueban captación, cabecera y puntos de reparto para localizar el tramo común que puede estar afectando al edificio.',
      ask: 'Reúne los canales afectados, las viviendas que lo han comprobado y el contacto para acceder a la cabecera.',
      question: '¿Qué información puede reunir la comunidad antes de la visita?',
      answer: 'Ayuda comparar viviendas de plantas diferentes, anotar los canales concretos y confirmar quién facilita el acceso a las zonas comunes y a los equipos de distribución.'
    },
    {
      id: 'antenas-recepcion-inestable',
      title: 'Pixelación y canales que entran y salen',
      text: 'Los cortes intermitentes se estudian comparando nivel y calidad de señal, no solo la presencia de imagen. Revisamos conexiones y recepción para diferenciar pérdidas de la red, orientación deficiente o una instalación con poco margen de funcionamiento.',
      ask: 'Apunta dos o tres canales que fallen y si los cortes coinciden con lluvia o una hora concreta.',
      question: '¿Sirve el indicador de señal del televisor para localizar el problema?',
      answer: 'Sirve como referencia inicial, aunque las escalas cambian entre modelos. La medición de la instalación permite comparar puntos con criterios comunes y comprobar el margen disponible.'
    }
  ],
  amplificacion: [
    {
      id: 'amplificacion-fuente-previo',
      title: 'Fuente y alimentación del previo',
      text: 'Un amplificador de mástil puede dejar de funcionar si falla su alimentación. Revisamos la fuente, el coaxial y las conexiones antes de decidir qué equipo sustituir, separando la falta de tensión de una pérdida de recepción exterior.',
      ask: 'Facilita una foto exterior de la fuente y cuenta si la señal desapareció de golpe o por intervalos.',
      question: '¿Una fuente de antena sirve para cualquier amplificador?',
      answer: 'La sustitución debe respetar las necesidades del equipo alimentado y la instalación. La referencia de ambos componentes permite comprobar compatibilidad antes de elegir una fuente nueva.'
    },
    {
      id: 'amplificacion-monocanal',
      title: 'Revisión de módulos monocanal',
      text: 'Cuando una comunidad pierde un grupo de canales, comprobamos el módulo correspondiente, su ajuste y la alimentación compartida. Medir la entrada y la salida permite plantear una reparación concreta o valorar el estado del conjunto de cabecera.',
      ask: 'Anota los canales que faltan y aporta, si está disponible, una fotografía de los módulos instalados.',
      question: '¿Se puede cambiar un único módulo de la cabecera?',
      answer: 'Es una posibilidad si se confirma su avería y existe una sustitución compatible. También se revisan la fuente común y los ajustes del resto de la instalación.'
    },
    {
      id: 'amplificacion-central-programable',
      title: 'Ajuste de centrales programables',
      text: 'Revisamos la configuración de centrales programables cuando faltan canales o cambian las condiciones de recepción. El ajuste se basa en las señales medidas en la entrada y en lo que necesita la red de distribución del edificio.',
      ask: 'Indica el modelo de central y si el problema empezó tras una intervención o un cambio de canales.',
      question: '¿La misma programación funciona en cualquier edificio?',
      answer: 'Cada instalación puede recibir niveles distintos y tener diferentes pérdidas de distribución. Conviene conservar la identificación del equipo y revisar sus ajustes según las medidas de esa red.'
    },
    {
      id: 'amplificacion-exceso-ganancia',
      title: 'Regular una señal demasiado amplificada',
      text: 'Subir la ganancia puede empeorar la recepción cuando una etapa trabaja saturada. Comparamos la señal antes y después del amplificador y revisamos el reparto, buscando un ajuste equilibrado que permita recibir los canales con estabilidad.',
      ask: 'Explica si los cortes comenzaron después de añadir un amplificador o de modificar sus ajustes.',
      question: '¿Más potencia de señal significa mejor imagen?',
      answer: 'La recepción depende también de la calidad y del margen de funcionamiento. Un nivel elevado con señal degradada puede dar cortes aunque el indicador del televisor parezca alto.'
    },
    {
      id: 'amplificacion-plantas-finales',
      title: 'Señal desigual entre plantas',
      text: 'Si la televisión se recibe de forma distinta según la planta, revisamos niveles y pérdidas a lo largo de la distribución. La comprobación incluye derivadores, conexiones y tomas para ajustar la amplificación a la red existente.',
      ask: 'Compara al menos dos viviendas de plantas diferentes y señala dónde se conserva mejor la recepción.',
      question: '¿Hace falta poner un amplificador en cada vivienda?',
      answer: 'La revisión de la red común permite decidirlo. Una pérdida localizada en un derivador o conexión puede requerir una reparación concreta en lugar de añadir equipos interiores.'
    },
    {
      id: 'amplificacion-reparto-adicional',
      title: 'Ampliar el reparto de televisión',
      text: 'Antes de incorporar nuevas tomas revisamos si la instalación dispone de margen para alimentar más puntos. Calculamos el reparto y comprobamos el amplificador existente para que la ampliación encaje con el uso previsto de la vivienda o comunidad.',
      ask: 'Indica cuántas tomas funcionan ahora, cuántas quieres añadir y la distancia aproximada hasta los nuevos puntos.',
      question: '¿Puedo añadir varios repartidores seguidos?',
      answer: 'Cada reparto introduce pérdidas y debe encajar con el nivel disponible. Un esquema sencillo de las tomas actuales ayuda a estudiar un recorrido adecuado para la ampliación.'
    },
    {
      id: 'amplificacion-cortes-intermitentes',
      title: 'Amplificación que falla por intervalos',
      text: 'Los cortes que aparecen y desaparecen requieren observar alimentación, temperatura de funcionamiento y conexiones. Revisamos fuente y amplificador junto con el comportamiento de la señal para localizar una incidencia que puede pasar desapercibida durante una comprobación aislada.',
      ask: 'Anota cuánto dura cada corte y si la recepción vuelve sola o cambia al cabo de un tiempo.',
      question: '¿Cómo preparo una consulta por una avería intermitente?',
      answer: 'Un registro de horarios, duración y canales afectados resulta útil. Añade si sucede en todos los televisores a la vez y si ha habido cambios recientes de equipos.'
    },
    {
      id: 'amplificacion-renovacion-cabecera',
      title: 'Actualizar una cabecera antigua',
      text: 'La renovación de una cabecera se estudia según los servicios recibidos, el estado de los módulos y las necesidades de distribución. Revisamos qué elementos pueden aprovecharse y qué ajustes exige la solución propuesta para la comunidad.',
      ask: 'Prepara el número de viviendas, los servicios que se utilizan y alguna referencia de los equipos actuales.',
      question: '¿El presupuesto debe incluir el ajuste final de la instalación?',
      answer: 'Conviene concretar los equipos, la puesta en servicio y las comprobaciones previstas en la red. Así se puede valorar el alcance de la renovación antes de aprobarla.'
    }
  ],
  porteros: [
    {
      id: 'porteros-sin-llamada',
      title: 'El portero ha dejado de llamar',
      text: 'Una llamada que falla puede tener origen en el pulsador, el telefonillo o el circuito compartido. Comparamos el funcionamiento entre viviendas y revisamos la placa para distinguir una incidencia individual de una avería general del edificio.',
      ask: 'Comprueba si otros vecinos reciben la llamada y cuenta si el sonido y la apertura siguen funcionando.',
      question: '¿Importa saber si falla un pulsador o todos?',
      answer: 'Sí, esa diferencia ayuda a delimitar la revisión. También conviene indicar si el fallo es permanente, aparece al pulsar de cierta forma o afecta a llamadas consecutivas.'
    },
    {
      id: 'porteros-audio-un-sentido',
      title: 'Conversación que solo se oye en un sentido',
      text: 'Si desde la calle se oye pero desde la vivienda no, revisamos por separado los recorridos de conversación. Comprobamos telefonillo, placa y conexiones, teniendo en cuenta si la incidencia aparece en una vivienda o en varias.',
      ask: 'Describe desde qué lado se escucha y si el problema empezó al cambiar algún telefonillo.',
      question: '¿Qué diferencia hay entre falta de audio y volumen bajo?',
      answer: 'Una conversación débil, un ruido continuo y la ausencia total de sonido son síntomas distintos. Explicar qué se oye en cada extremo permite preparar mejor la revisión.'
    },
    {
      id: 'porteros-abrepuertas',
      title: 'El telefonillo funciona y la puerta no abre',
      text: 'La apertura depende de la orden eléctrica y del ajuste del cierre. Revisamos pulsador, alimentación, conductores y cerradero, además de comprobar si la puerta presenta roces o desalineación que dificultan el funcionamiento del conjunto de acceso.',
      ask: 'Indica si se oye actuar el cerradero y si la puerta abre con normalidad usando la llave.',
      question: '¿Puede fallar la apertura aunque se oiga el zumbido?',
      answer: 'Sí, el sonido por sí solo no confirma una apertura correcta. El encaje de la puerta, el mecanismo y la alimentación deben revisarse como parte del conjunto.'
    },
    {
      id: 'porteros-telefonillo-compatible',
      title: 'Sustituir un telefonillo compatible',
      text: 'Para cambiar un telefonillo identificamos la tecnología y el modelo de la instalación. La elección debe encajar con la placa y el cableado existentes, conservando las funciones de llamada, conversación y apertura que utiliza la vivienda.',
      ask: 'Facilita la marca y referencia visibles del telefonillo y una fotografía exterior de la placa de calle.',
      question: '¿Puedo elegir un telefonillo solo por su aspecto?',
      answer: 'La apariencia no identifica el sistema. Antes de comprar conviene comprobar la referencia y la compatibilidad indicada por el fabricante para evitar un equipo que no funcione.'
    },
    {
      id: 'porteros-placa-exterior',
      title: 'Placas y pulsadores deteriorados',
      text: 'Una placa exterior puede necesitar reparación de pulsadores, audio o elementos de montaje. Revisamos su estado y la disponibilidad de recambios para valorar una intervención concreta o la renovación de la placa manteniendo la compatibilidad del sistema.',
      ask: 'Señala qué pulsadores fallan y si la placa presenta golpes, piezas sueltas o deterioro visible.',
      question: '¿Se puede renovar la placa sin cambiar todos los telefonillos?',
      answer: 'Depende de la tecnología y de los equipos compatibles disponibles. Identificar la instalación permite estudiar si se conserva la parte interior o si necesita una renovación conjunta.'
    },
    {
      id: 'porteros-ruidos-conversacion',
      title: 'Zumbidos y ruidos al hablar',
      text: 'Los ruidos de conversación se comprueban comparando viviendas, alimentación y conexiones del portero. Revisamos si aparecen de forma continua o durante la llamada, así como las modificaciones recientes que puedan haber alterado el funcionamiento de la instalación.',
      ask: 'Cuenta cuándo aparece el ruido y si se escucha en la placa, en el telefonillo o en ambos.',
      question: '¿Puede influir un telefonillo cambiado recientemente?',
      answer: 'Conviene revisar ese cambio si coincide con el inicio del problema. La referencia del aparato sustituido y del nuevo ayuda a comprobar compatibilidad y funcionamiento del sistema.'
    },
    {
      id: 'porteros-segundo-telefonillo',
      title: 'Otro punto para atender el portero',
      text: 'La instalación de un segundo telefonillo se estudia según el sistema existente, el recorrido del cable y las funciones necesarias. Comprobamos las posibilidades de ampliación para atender la llamada desde otra estancia sin alterar el uso comunitario.',
      ask: 'Indica dónde quieres atender la llamada y si existe un recorrido disponible desde el telefonillo actual.',
      question: '¿Dos telefonillos pueden compartir la llamada de una vivienda?',
      answer: 'Algunos sistemas admiten esa ampliación con condiciones específicas. Hay que comprobar el modelo, la alimentación y la configuración prevista antes de decidir cómo incorporar el segundo punto.'
    },
    {
      id: 'porteros-renovacion-edificio',
      title: 'Renovar el portero de la comunidad',
      text: 'Una renovación comunitaria requiere inventariar viviendas, accesos y equipos antes de elegir el sistema. Estudiamos el aprovechamiento del cableado y la organización del cambio para que placa, telefonillos y apertura queden definidos dentro del mismo trabajo.',
      ask: 'Reúne el número de viviendas y accesos, y aclara qué funciones quiere conservar o ampliar la comunidad.',
      question: '¿Qué debe quedar definido antes de aprobar la renovación?',
      answer: 'Conviene acordar equipos incluidos, trabajos en viviendas, aprovechamiento del cableado y puesta en servicio. Las necesidades particulares de cada vivienda pueden identificarse antes de cerrar el alcance.'
    }
  ],
  videoporteros: [
    {
      id: 'videoporteros-pantalla-negra',
      title: 'Llama, pero el monitor no muestra imagen',
      text: 'Una pantalla sin imagen se revisa junto con la llamada, el audio y la apertura. Comprobamos si el monitor recibe alimentación y si otras viviendas pueden ver la cámara, para orientar el diagnóstico hacia el equipo o la instalación compartida.',
      ask: 'Explica si la pantalla está apagada o se enciende en negro y si otro monitor muestra imagen.',
      question: '¿Tengo que cambiar el monitor si la imagen desaparece?',
      answer: 'Primero se comprueba qué funciones conserva y cómo responden otros equipos. El fallo también puede encontrarse en la cámara, la alimentación o el recorrido común de señal.'
    },
    {
      id: 'videoporteros-pasar-a-video',
      title: 'Pasar de portero de audio a vídeo',
      text: 'La incorporación de vídeo exige estudiar placa, monitores, alimentación y cableado como un conjunto. Revisamos la instalación existente y las posibilidades de aprovechamiento para definir qué debe cambiar y cómo se atenderá la llamada desde cada vivienda.',
      ask: 'Indica cuántas viviendas participan y si se pretende renovar toda la comunidad o consultar una vivienda concreta.',
      question: '¿Poner un monitor en casa basta para disponer de vídeo?',
      answer: 'El sistema necesita una cámara y equipos compatibles a lo largo de la instalación. Se comprueba la tecnología de la comunidad antes de plantear una ampliación individual.'
    },
    {
      id: 'videoporteros-varios-monitores',
      title: 'Más de un monitor en la vivienda',
      text: 'Para atender el videoportero desde varias estancias estudiamos el número de monitores admitidos, la alimentación y el recorrido del cable. La ampliación se configura según el sistema para coordinar la llamada y las funciones de cada equipo.',
      ask: 'Señala cuántos monitores quieres instalar y la marca y referencia del equipo que ya tienes.',
      question: '¿Los monitores adicionales pueden instalarse en cualquier habitación?',
      answer: 'La ubicación depende del recorrido disponible y de las condiciones del sistema. Conviene identificar los puntos deseados para valorar el tendido y la alimentación antes del montaje.'
    },
    {
      id: 'videoporteros-contraluz',
      title: 'Una cámara que no permite reconocer bien',
      text: 'Cuando la imagen resulta oscura, deslumbrada o mal encuadrada, revisamos iluminación, orientación y estado exterior de la cámara. El diagnóstico diferencia una limitación del emplazamiento de un fallo del monitor o de la transmisión de vídeo.',
      ask: 'Describe en qué momento se ve peor y si el problema también aparece en otros monitores.',
      question: '¿Ayuda una fotografía de la imagen que muestra el monitor?',
      answer: 'Una fotografía de la pantalla puede orientar la consulta si se indica la hora y la iluminación de la entrada. Añade si el defecto se repite con distintas visitas.'
    },
    {
      id: 'videoporteros-imagen-intermitente',
      title: 'Imagen que se corta durante la llamada',
      text: 'Los cortes de vídeo se revisan comprobando alimentación, conexiones y respuesta de los monitores. Observamos si la imagen desaparece al llamar, al abrir o después de cierto tiempo, porque cada secuencia aporta información sobre el origen de la incidencia.',
      ask: 'Anota cuándo se corta la imagen y si en ese momento también se pierde el sonido.',
      question: '¿Importa si la imagen falla justo al accionar la apertura?',
      answer: 'Sí, conviene comunicar esa coincidencia. Permite revisar el comportamiento de la alimentación y del conjunto durante la maniobra, además de comprobar el funcionamiento del monitor por separado.'
    },
    {
      id: 'videoporteros-cambiar-monitor',
      title: 'Sustituir un monitor antiguo',
      text: 'La sustitución de un monitor comienza identificando su referencia y el sistema comunitario. Revisamos las opciones compatibles, el montaje y las funciones disponibles, para elegir un equipo que encaje con la placa y la instalación que se conserva.',
      ask: 'Facilita la referencia del monitor actual y explica si buscas sustituirlo por avería o mejorar alguna función.',
      question: '¿Un monitor nuevo incorpora automáticamente funciones de móvil?',
      answer: 'Las funciones dependen del modelo y del sistema completo. Si quieres atender desde el móvil, hay que comprobar sus requisitos y la compatibilidad de la instalación existente.'
    },
    {
      id: 'videoporteros-varios-accesos',
      title: 'Videoportero con varias entradas',
      text: 'En inmuebles con más de un acceso revisamos cómo se identifican las llamadas y qué puerta acciona cada mando. El proyecto contempla placas, cámaras y monitores para organizar el uso de las entradas de acuerdo con el sistema elegido.',
      ask: 'Enumera los accesos y aclara desde cuáles se necesita llamar, ver la imagen y abrir la puerta.',
      question: '¿Se puede distinguir desde qué puerta están llamando?',
      answer: 'Esa función debe comprobarse en el sistema propuesto y en su configuración. Definir los accesos desde el principio ayuda a elegir equipos que respondan al uso previsto.'
    },
    {
      id: 'videoporteros-renovacion-conjunta',
      title: 'Renovación conjunta de placa y monitores',
      text: 'Cuando varios equipos han envejecido, estudiamos la renovación del videoportero como una instalación completa. Comprobamos el cableado aprovechable, la ubicación de la cámara y las necesidades de cada vivienda para definir un alcance coherente para la comunidad.',
      ask: 'Prepara el número de viviendas y monitores, y señala si hay equipos averiados o accesos pendientes de actualizar.',
      question: '¿Cómo se organiza el cambio de los equipos interiores?',
      answer: 'Conviene coordinar el acceso a las viviendas y concretar las pruebas de llamada, imagen y apertura. La planificación se acuerda según el alcance de la renovación comunitaria.'
    }
  ],
  starlink: [
    {
      id: 'starlink-kit-nuevo',
      title: 'Montaje de un kit Starlink nuevo',
      text: 'Preparamos el emplazamiento de la antena, el soporte y el recorrido hasta el router antes del montaje. La instalación se adapta al modelo del kit y a la ubicación del inmueble, comprobando las obstrucciones desde el punto elegido.',
      ask: 'Indica qué kit has adquirido y dónde te gustaría situar la antena y el router dentro del inmueble.',
      question: '¿El montaje incluye la contratación del servicio Starlink?',
      answer: 'Conviene separar instalación, equipo y suscripción al solicitar presupuesto. Indica qué parte tienes ya preparada para concretar el alcance del montaje y de la configuración necesaria.'
    },
    {
      id: 'starlink-obstrucciones',
      title: 'Buscar un emplazamiento con menos obstáculos',
      text: 'Árboles, chimeneas o construcciones próximas pueden limitar el campo de visión de la antena. Estudiamos ubicaciones posibles con la comprobación de obstrucciones de la aplicación, valorando también el soporte y un recorrido de cable adecuado para el montaje.',
      ask: 'Explica qué obstáculos rodean el lugar previsto y si dispones de una comprobación de la aplicación.',
      question: '¿La ubicación más alta es siempre la mejor?',
      answer: 'Se valora el campo de visión junto con la fijación y el recorrido del cable. Las comprobaciones del emplazamiento permiten comparar opciones antes de decidir dónde montar.'
    },
    {
      id: 'starlink-recorrido-cable',
      title: 'Llevar el cable hasta el router',
      text: 'El recorrido entre antena y router forma parte del montaje de Starlink. Estudiamos entradas al inmueble, canalización y ubicación interior del equipo para preparar un tendido protegido y compatible con los componentes del kit que se va a instalar.',
      ask: 'Señala por dónde podría entrar el cable y la habitación en la que necesitas colocar el router.',
      question: '¿Conviene elegir primero dónde irá el router?',
      answer: 'Ayuda definir su posición antes de montar la antena. Así se puede estudiar el recorrido completo y valorar cómo se repartirá la conexión por el interior del inmueble.'
    },
    {
      id: 'starlink-soporte-fijacion',
      title: 'Un soporte adecuado para la antena',
      text: 'La fijación se elige según el modelo de antena y la superficie disponible. Revisamos las posibilidades de montaje y el estado del punto de apoyo para plantear un soporte estable, con acceso razonable y un recorrido de cable protegido.',
      ask: 'Facilita el modelo del kit y una fotografía del lugar donde se podría fijar el soporte.',
      question: '¿Se puede reutilizar un soporte de otra antena?',
      answer: 'Hay que comprobar su estado, dimensiones y compatibilidad con el montaje previsto. Una fotografía orienta la consulta, aunque la decisión depende de revisar el punto de fijación.'
    },
    {
      id: 'starlink-wifi-interior',
      title: 'Separar la conexión exterior de la cobertura Wi-Fi',
      text: 'Si el servicio llega al router pero se pierde rendimiento en algunas estancias, revisamos la distribución interior. El diagnóstico diferencia la conexión de Starlink de la cobertura Wi-Fi para plantear la ubicación y los puntos de conexión necesarios.',
      ask: 'Indica en qué habitaciones funciona mejor y si el problema cambia al acercarte al router.',
      question: '¿Mover la antena mejora la Wi-Fi dentro de casa?',
      answer: 'La cobertura interior depende de la distribución de la red y de sus obstáculos. Conviene comparar el funcionamiento cerca del router con las estancias donde aparecen las dificultades.'
    },
    {
      id: 'starlink-reubicacion',
      title: 'Reubicar una antena ya instalada',
      text: 'Cuando cambia el uso del inmueble o aparecen obstáculos alrededor de la antena, estudiamos otro emplazamiento. Revisamos el soporte, el recorrido del cable y la posición del router para definir qué elementos pueden conservarse durante el traslado.',
      ask: 'Explica por qué quieres mover la antena y qué zonas del inmueble podrían servir como nueva ubicación.',
      question: '¿Se puede presupuestar el traslado con fotos de la instalación?',
      answer: 'Las fotos y el modelo del kit ayudan a preparar una primera valoración. También conviene conocer el recorrido actual y las diferencias entre el emplazamiento existente y el propuesto.'
    },
    {
      id: 'starlink-montaje-fachada',
      title: 'Valorar un montaje en fachada',
      text: 'Una fachada puede ofrecer un punto de montaje cuando reúne condiciones adecuadas de visión y fijación. Comparamos esa opción con otras superficies disponibles, teniendo en cuenta ventanas, salientes y el acceso necesario para instalar antena, soporte y cableado.',
      ask: 'Describe la fachada disponible y si puedes aportar imágenes del punto previsto y de su entorno inmediato.',
      question: '¿Qué conviene definir para una instalación en una zona común?',
      answer: 'Hay que concretar el lugar disponible, quién autoriza el trabajo y cómo se accederá al montaje. Esa información permite preparar la intervención y el recorrido hacia la vivienda.'
    },
    {
      id: 'starlink-modelo-equipo',
      title: 'Preparar el montaje según el modelo',
      text: 'Los componentes y accesorios deben elegirse para el kit concreto que se va a montar. Identificamos el equipo y sus necesidades de instalación antes de definir soportes, recorrido del cable y ubicación del router dentro del inmueble.',
      ask: 'Envía la referencia del kit o una fotografía de sus componentes y señala qué accesorios tienes disponibles.',
      question: '¿Todos los kits utilizan los mismos accesorios de montaje?',
      answer: 'La compatibilidad se comprueba para cada modelo. Conocer la referencia permite revisar qué elementos incluye el equipo y cuáles necesita el emplazamiento antes de preparar la instalación.'
    }
  ]
};

export const introVariants = [
  'Una instalación nueva, un equipo que falla o una reforma requieren revisiones distintas. Preparamos antenas y comunicaciones según el inmueble y el uso previsto.',
  'Televisión en varias habitaciones, comunicación desde el portal o internet por satélite: cada trabajo empieza por identificar los equipos y la instalación existente.',
  'Una avería individual y un fallo de comunidad necesitan comprobaciones diferentes. Revisamos qué funciona, qué falla y qué elementos comparten los equipos afectados.',
  'Para renovar una instalación conviene definir qué se conserva y qué necesitas ampliar. Antenas, porteros y videoporteros se estudian según su estado y compatibilidad.',
  'Las nuevas tomas, los cambios de equipo y las ampliaciones deben encajar con la instalación actual. Preparamos el trabajo según los puntos que necesitas utilizar.',
  'Una vivienda, una comunidad o un local pueden necesitar soluciones distintas. El acceso a los equipos y el recorrido del cable forman parte del estudio.',
  'Desde recuperar canales hasta actualizar la entrada del edificio, el diagnóstico permite concretar materiales, montaje y comprobaciones antes de organizar la intervención.',
  'La recepción de televisión, la llamada del portal y la conexión interior se revisan por separado para localizar el problema y preparar una solución adecuada.'
];
