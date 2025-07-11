import admin from 'firebase-admin';
import db from '../config/index.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

const firebaseKeyPath = path.resolve('/etc/secrets/firebase-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(firebaseKeyPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const checkNext24hAppointments = async () => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const today = now.toISOString().slice(0, 10);
  const tomorrow = in24h.toISOString().slice(0, 10);

  const appointmentsRaw = await db.Appointment.findAll({
    where: {
      date: {
        [Op.between]: [today, tomorrow]
      },
      appointment_state_id: 1,
      already_notified: false,
    },
    attributes: {
      exclude: ['professional_id', 'patient_id', 'appointment_state_id', 'specialty_id'],
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
      },
    ],
  });

  const appointments = appointmentsRaw.filter(a => {
    const fullDate = (() => {
      const d = new Date(a.date);
      if (typeof a.start_time === 'string') {
        const [h, m, s] = a.start_time.split(':').map(Number);
        d.setHours(h, m, s, 0);
      } else {
        d.setHours(
          a.start_time.getHours(),
          a.start_time.getMinutes(),
          a.start_time.getSeconds(),
          0
        );
      }
      return d;
    })();

    return fullDate >= now && fullDate <= in24h;
  });

  if (appointments.length === 0) {
    console.log('No hay turnos para notificar en las próximas 24hs');
    return;
  }

  await Promise.allSettled(
    appointments.map(async (appointment) => {
      if (!appointment.patient.push_token) return;

      const timeStr = appointment.start_time.toTimeString().slice(0, 8);
      const fullDate = new Date(`${appointment.date}T${timeStr}`);

      const formattedDate = fullDate.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
      });

      const formattedTime = fullDate.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Argentina/Buenos_Aires',
      });

      try {
        const message = `Tenés un turno el ${formattedDate} a las ${formattedTime} con ${appointment.professional.full_name} en la especialidad de ${appointment.specialty.name}`;

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
          await db.Appointment.update(
            { already_notified: true },
            { where: { id: appointment.id } }
          );

          await db.Notification.create({
            user_id: appointment.patient.id,
            message,
          });
        } else {
          console.log('Error notificando turno', notificationResponse);
        }
      } catch (err) {
        console.error(`Error notificando turno ${appointment.id}:`, err);
      }
    })
  );
};
