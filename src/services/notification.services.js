import db from "../config/index.js";

const notificationServices = {
  get: async (userId) => {
    try {
      const notifications = await db.Notification.findAll({
        where: {
          user_id: userId,
          read: false
        }
      });

      return notifications;
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  create: async ({ message, userId }) => {
    try {
      const notification = await db.Notification.create({
        message: message,
        user_id: userId
      });

      return notification.get({ plain: true });
    } catch (error) {
      throw error;
    }
  },

  read: async (notificationId) => {
    try {
      const notification = await db.Notification.findByPk(notificationId);

      if (!notification) throw {
        layer: 'notificationServices',
        key: 'NOTIFICATION_NOT_FOUND',
        statusCode: 404
      }

      await notification.update({
        read: true
      });

      return "La notificación fue leída correctamente.";
    } catch (error) {
      throw error;
    }
  }
}

export default notificationServices;