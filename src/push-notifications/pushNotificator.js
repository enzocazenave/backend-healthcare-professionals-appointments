import admin from 'firebase-admin';
import db from '../config/index.js'
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

const firebaseKeyPath = path.resolve('/etc/secrets/firebase-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(firebaseKeyPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export const checkNext24hAppointments = async () => {
  const now = new Date();
  const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const appointments = await db.Appointment.findAll({
    where: {
      appointment_state_id: 1,
      already_notified: false,
      [Op.and]: [
        Sequelize.where(
          Sequelize.literal(`CAST(date || 'T' || start_time AS TIMESTAMP)`),
          {
            [Op.between]: [now.toISOString(), in24h.toISOString()],
          }
        )
      ]
    },
    attributes: {
      exclude: ['professional_id', 'patient_id', 'appointment_state_id', 'specialty_id']
    },
    include: [
      {
        model: db.User,
        as: 'patient',
        attributes: ['id', 'push_token', 'full_name'],
      },
      {
        model: db.User,
        as: 'professional',
        attributes: ['full_name'],
      },
      {
        model: db.Specialty,
        attributes: ['name'],
      }
    ]
  });

  if (appointments.length === 0) {
    console.log('No hay turnos para notificar en las proximas 24hs')
    return
  };

  await Promise.allSettled(
    appointments.map(async (appointment) => {
      if (!appointment.patient.push_token) return;

      const formattedDate = new Date(appointment.date).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long'
      })

      const formattedTime = new Date(appointment.start_time).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires'
      })

      try {
        const message = `Tenés un turno el ${formattedDate} a las ${formattedTime} con ${appointment.professional.full_name} en la especialidad de ${appointment.specialty.name}`

        const notificationResponse = await admin.messaging().send({
          token: appointment.patient.push_token,
          notification: {
            title: 'Recordatorio de turno',
            body: message,
          },
          android: {
            notification: {
              channelId: 'default',
              icon: 'ic_launcher',
              color: '#48A6A7',
              priority: 'high',
            },
          },
        });

        if (typeof notificationResponse === 'string') {
          await db.Appointment.update({
            already_notified: true
          }, {
            where: {
              id: appointment.id
            }
          })

          await db.Notification.create({
            user_id: appointment.patient.id,
            message: message
          })
        } else {
          console.log('Error notificando turno', notificationResponse)
        }
      } catch (err) {
        console.error(`Error notificando turno ${appointment.id}:`, err);
      }
    })
  );
}