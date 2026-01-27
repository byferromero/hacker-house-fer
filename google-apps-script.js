// Google Apps Script - Con notificaciones por email
// IMPORTANTE: Después de actualizar, haz Deploy > Manage deployments > Editar > Nueva versión > Deploy

// Tu email para recibir notificaciones
var ADMIN_EMAIL = "byferromero@gmail.com";

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    var data = JSON.parse(e.postData.contents);

    // Guardar en la hoja
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.project || "",
      data.experience || "",
      data.accommodation || "",
      data.dietary || "",
      data.referral || "",
      data.days || "",
      data.loom || "",
      data.comments || "",
      "Pendiente" // Columna de estado
    ]);

    // 1. Notificación al admin
    sendAdminNotification(data);

    // 2. Confirmación al usuario
    sendUserConfirmation(data);

    return ContentService.createTextOutput("OK");

  } catch (error) {
    sheet.appendRow([new Date(), "ERROR", error.toString()]);
    return ContentService.createTextOutput("ERROR: " + error.toString());
  }
}

// Email de notificación para ti
function sendAdminNotification(data) {
  var subject = "🏠 Nueva solicitud Hacker House: " + data.name;

  var body = `
Nueva solicitud de registro en Hacker House:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 DATOS PERSONALES
• Nombre: ${data.name}
• Email: ${data.email}
• Teléfono: ${data.phone}

💡 PROYECTO
${data.project}

🎯 PERFIL
• Tipo: ${data.experience}
• Alojamiento: ${data.accommodation === "1" ? "Sí necesita" : "No necesita"}
• Dieta: ${data.dietary || "Sin restricciones"}

📅 DISPONIBILIDAD
• Días: ${data.days}

🎥 VIDEO LOOM
${data.loom}

📝 COMENTARIOS
${data.comments || "Ninguno"}

💬 ¿CÓMO NOS CONOCIÓ?
${data.referral || "No especificado"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ver todas las solicitudes: ${SpreadsheetApp.getActiveSpreadsheet().getUrl()}
  `;

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: subject,
    body: body
  });
}

// Email de confirmación para el usuario
function sendUserConfirmation(data) {
  var subject = "✅ Hemos recibido tu solicitud - Hacker House";

  var body = `
¡Hola ${data.name}!

Hemos recibido tu solicitud para Hacker House. 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESUMEN DE TU SOLICITUD

• Proyecto: ${data.project}
• Días seleccionados: ${data.days}
• Video: ${data.loom}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PRÓXIMOS PASOS

1. Revisaremos tu solicitud y tu video de Loom
2. Te contactaremos en 24-48h por email o WhatsApp
3. Si eres seleccionado, recibirás los detalles de confirmación

Si tienes alguna pregunta, responde a este email.

¡Gracias por tu interés!

— El equipo de Hacker House
  `;

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    body: body,
    replyTo: ADMIN_EMAIL
  });
}

function doGet() {
  return ContentService.createTextOutput("API OK");
}
