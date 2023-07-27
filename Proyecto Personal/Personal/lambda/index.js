/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

var persistenceAdapter = getPersistenceAdapter();

function getPersistenceAdapter() {
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET ? true : false;
    }
    const tableName = 'info_usuario';
    if(isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({ 
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({ 
            tableName: tableName,
            createTable: true
        });
    }
}

const createDirectivePayload = (aplDocumentId, dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + aplDocumentId
        },
        datasources: dataSources
    }
};

const info = require('./texto');

const datasourceLaunch = {
    "mensaje": {
        "logo": "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2",
        "msg": "Bienvenido a la skill, en donde obtendrás información, recomendaciones acerca de la diabetes, puedes probar diciendo Información.",
        "encabezado": "Bienvenido",
        "imagen": "https://img.freepik.com/vector-gratis/medico-lupa-medidor-glucosa-sangre-diabetes-mellitus-diabetes-tipo-2-concepto-produccion-insulina-sobre-fondo-blanco-ilustracion-aislada-bluevector-coral-rosado_335657-1530.jpg?w=2000",
        "prueba": "Prueba diciendo 'Información'"
    }
};

const datasourceInfo = {
    "mensaje": {
        "logo": "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2",
        "encabezado": "Definicion.",
        "msg": "De acuerdo con la OMS, La diabetes es una enfermedad metabólica crónica caracterizada por niveles elevados de glucosa en sangre (o azúcar en sangre), que con el tiempo conduce a daños graves en el corazón, los vasos sanguíneos, los ojos, los riñones y los nervios.",
        "imagen": "https://static.vecteezy.com/system/resources/previews/011/420/406/original/world-diabetes-day-elements-png.png",
        "prueba": "Prueba diciendo 'Sintomas'"
    }
};

const datasourceSinto = {
     "mensaje": {
            "logo": "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2",
            "imagen": "https://pbs.twimg.com/media/EJXLmBxXsAwtcxf?format=jpg&name=4096x4096",
            "encabezado": "Sintomas.",
            "msg": "Los síntomas incluyen excreción excesiva de orina (poliuria), sed (polidipsia), hambre constante, pérdida de peso, cambios en la visión y fatiga. Estos síntomas pueden ocurrir repentinamente.",
            "prueba": "Prueba diciendo 'Información'"
        }
};

const datasourcePreven = {
     "mensaje": {
            "imagen": "https://www.semana.com/resizer/x9R_YUdvLVqYpy5A--WTguVUCOA=/1280x720/smart/filters:format(jpg):quality(80)/cloudfront-us-east-1.images.arcpublishing.com/semana/PRXHUOH5PBFDDNP3FBOFNY6EPQ.jpg",
            "encabezado": "Prevención.",
            "msg": "Lograr y mantener un peso corporal saludable, Ser físicamente activo: realice al menos 30 minutos de actividad regular de intensidad moderada la mayoría de los días, Se requiere más actividad para controlar el peso ,seguir una dieta saludable, evitando el azúcar y las grasas saturadas; y, Evitar el consumo de tabaco: fumar aumenta el riesgo de diabetes y enfermedades cardiovasculares.",
            "prueba": "Prueba diciendo 'Información'"
        }
};

const datasourceMarco = {
    "mensaje": {
        "imagen": "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2",
        "encabezado": "Marco legal",
        "primera": "La presente Skill de Alexa sobre Diabetes es una herramienta de información desarrollada para proporcionar a los usuarios información general sobre la enfermedad de la diabetes. La Skill no recibe ningún tipo de entrada de datos por parte de los usuarios y no brinda consejos médicos personalizados. Al utilizar la Skill, usted acepta cumplir con los términos y condiciones establecidos en este marco legal.",
        "segunda": "El desarrollador de la Skill no se hace responsable de ningún daño, pérdida o perjuicio que pueda surgir del uso o la incapacidad para usar la Skill, o de la confianza en la información proporcionada por la Skill. El desarrollador no garantiza la precisión, integridad, calidad o actualidad de la información proporcionada por la Skill y no asume ninguna responsabilidad por errores u omisiones en la información.",
        "tercera": "Dado que la Skill no recopila ni almacena ninguna información personal o de salud de los usuarios, no se aplican políticas de privacidad específicas. Sin embargo, es importante tener en cuenta que al utilizar la Skill, usted está sujeto a las políticas de privacidad de Amazon y de Alexa, que pueden recopilar y almacenar información sobre su uso de la Skill y otros servicios de Alexa."
    }
};

const datasourceAyuda = {
    "mensaje": {
        "logo": "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2",
        "encabezado": "AYUDA",
        "msg": "En esta skill obtendrás información acerca de la diabetes, prueba diciendo información.",
        "imagen": "https://img.freepik.com/vector-premium/nino-pregunta-signo-interrogacion_59690-276.jpg",
        "prueba": "pruba diciendo 'Información'"
    }
};

const datasourceCancel = {
    "mensaje": {
        "logo": "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2",
        "encabezado": "Adiós",
        "msg": "Hasta la próxima, recuerda comer sano, hacer ejercicio y beber agua",
        "imagen": "https://img.freepik.com/vector-premium/fondo-despedida-dibujado-mano_23-2147974948.jpg?w=2000",
        "prueba": "Prueba diciendo 'Información'"
    }
};

const datasourceGlucosa = {
       "mensaje": {
        "logo": "https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2",
        "msg": "Tu nivel se encuentra entre los parámetros normales, sigue cuidándote y alimentando sanamente ",
        "encabezado": "Nivel",
        "verde": "https://static.vecteezy.com/system/resources/previews/009/759/647/non_2x/eps10-green-danger-notice-or-risk-icon-isolated-on-white-background-danger-alert-symbol-in-a-simple-flat-trendy-modern-style-for-your-website-design-logo-pictogram-and-mobile-application-vector.jpg",
        "amarillo": "https://static.vecteezy.com/system/resources/previews/013/474/420/non_2x/caution-icon-exclamation-mark-warning-signs-isolated-attention-triangle-symbol-on-white-background-warning-alert-error-concept-with-black-yellow-and-red-colors-warning-icon-vector.jpg",
        "rojo": "https://upload.wikimedia.org/wikipedia/commons/8/88/Red_triangle_alert_icon.png",
        "imagen": "https://raw.githubusercontent.com/JESUSDAViD23/Archivos/main/s.png",
        "prueba": "Prueba diciendo 'Información'",
        "icono": "https://static.vecteezy.com/system/resources/previews/009/759/647/non_2x/eps10-green-danger-notice-or-risk-icon-isolated-on-white-background-danger-alert-symbol-in-a-simple-flat-trendy-modern-style-for-your-website-design-logo-pictogram-and-mobile-application-vector.jpg"
    }
};


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        let speakOutput = "funciona";
        let BienSources = datasourceLaunch.mensaje;
        const DOCUMENT_LAUNCHE = "launche";
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        const titulo = requestAttributes.t('WEL');
        BienSources.msg = speakOutput;
        BienSources.encabezado = titulo;
        
        let mensaje =  BienSources.msg;
        
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_LAUNCHE, datasourceLaunch);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(mensaje)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const InforIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'informacionIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('MSG_INFO');
        const encabezado = requestAttributes.t('INFO');
        let infosource = datasourceInfo.mensaje;
        infosource.msg= speakOutput;
        infosource.encabezado = encabezado;
        
        const DOCUMENT_Info = "informacion";
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_Info,datasourceInfo);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const SintomasIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'sintomasIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('MSG_SINTM');
        const encabezado = requestAttributes.t('SINTM');
        let sintsource = datasourceSinto.mensaje;
        sintsource.msg= speakOutput;
        sintsource.encabezado = encabezado;
        
        const DOCUMENT_SINTOMAS = "sintomas";
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_SINTOMAS,datasourceSinto);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const GlucosaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'glucosaIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const intent = handlerInput.requestEnvelope.request.intent;
        const nivel = intent.slots.glucosa.value;
        let speakOutput;
        let gluco = datasourceGlucosa.mensaje;
        let verde = "https://static.vecteezy.com/system/resources/previews/009/759/647/non_2x/eps10-green-danger-notice-or-risk-icon-isolated-on-white-background-danger-alert-symbol-in-a-simple-flat-trendy-modern-style-for-your-website-design-logo-pictogram-and-mobile-application-vector.jpg";
        let amarillo = "https://static.vecteezy.com/system/resources/previews/013/474/420/non_2x/caution-icon-exclamation-mark-warning-signs-isolated-attention-triangle-symbol-on-white-background-warning-alert-error-concept-with-black-yellow-and-red-colors-warning-icon-vector.jpg";
        let rojo = "https://upload.wikimedia.org/wikipedia/commons/8/88/Red_triangle_alert_icon.png";
        
        speakOutput = nivel;
        const DOCUMENT_GLUCOSA = "glucosa";
        
        if(nivel < 100){
            speakOutput = requestAttributes.t('NORMAL');
            gluco.icono = verde;
        } else if(nivel>99 && nivel < 125) {
            speakOutput = requestAttributes.t('PRE');
            gluco.icono = amarillo;
        }else{
            speakOutput = requestAttributes.t('DIA');
            gluco.icono = rojo;
        }
        gluco.msg= speakOutput;
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_GLUCOSA,datasourceGlucosa);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};





const PrevencionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'prevencionIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('MSG_PREVENT');
        const encabezado = requestAttributes.t('PREVENT');
        let preventsource = datasourcePreven.mensaje;
        preventsource.msg= speakOutput;
        preventsource.encabezado = encabezado;
        const DOCUMENT_PREVENCION = "prevencion";
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_PREVENCION,datasourcePreven);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PruebaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PruebaIntent';
    },
    handle(handlerInput) {
        const DOCUMENT_PRUEBA = "prueba";
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_PRUEBA);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        const speakOutput = '';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const MarcoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MarcoLegalIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const primera = requestAttributes.t('MARCO_PRI');
        const segunda = requestAttributes.t('MARCO_SEG');
        const tercera = requestAttributes.t('MARCO_TER');
        const DOCUMENT_MARCO = "marcolegal";
        const encabezado = requestAttributes.t('MAR');
        let marsource = datasourceMarco.mensaje;
        marsource.primera= primera;
        marsource.segunda= segunda;
        marsource.tercera= tercera;
        marsource.encabezado = encabezado;
        
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_MARCO,datasourceMarco);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }
        
        const speakOutput = `${primera} . ${segunda} . ${tercera}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP');
        const DOCUMENT_AYUDA = "ayuda";
        const encabezado = requestAttributes.t('AYU');
        let ayusource = datasourceAyuda.mensaje;
        ayusource.msg= speakOutput;
        ayusource.encabezado = encabezado;
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_AYUDA,datasourceAyuda);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('CANCEL');
        const DOCUMENT_ADIOS = "adios";
        const encabezado = requestAttributes.t('BYE');
        let cansource = datasourceCancel.mensaje;
        cansource.msg= speakOutput;
        cansource.encabezado = encabezado;
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ADIOS, datasourceCancel);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const DOCUMENT_ERROR = "error";
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK');
        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']) {
            // generate the APL RenderDocument directive that will be returned from your skill
            const aplDirective = createDirectivePayload(DOCUMENT_ERROR);
            // add the RenderDocument directive to the responseBuilder
            handlerInput.responseBuilder.addDirective(aplDirective);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Lo siento no entendi lo que dijiste';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// FUNCIONES PARA TRADUCIR
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationRequestInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: info,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    }
  }
};

//FUNCIONES PARA VERIFICAR Y GUARDAR DATOS DE LA SESIÓN
const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        if(handlerInput.requestEnvelope.session['new']){
            const {attributesManager} = handlerInput;
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            handlerInput.attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        const {attributesManager} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);
        if(shouldEndSession || handlerInput.requestEnvelope.request.type === 'SessionEndedRequest') {       
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};




/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        InforIntentHandler,
        SintomasIntentHandler,
        GlucosaIntentHandler,
        PrevencionIntentHandler,
        PruebaIntentHandler,
        MarcoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addResponseInterceptors(
        LoadAttributesRequestInterceptor,
        SaveAttributesResponseInterceptor)
    .addRequestInterceptors(
        LocalizationRequestInterceptor,
        LoggingRequestInterceptor,
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();