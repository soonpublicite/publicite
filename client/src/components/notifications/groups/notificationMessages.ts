import { GroupNotificationType } from "@/types/groupTypes";
import { acceptGroupInvitation, declineGroupInvitation } from "./actions";

// Base messages object
export const groupNotificationBaseMessages: Record<
  GroupNotificationType,
  {
    message: string;
    showUser: boolean;
  }
> = {
  notification_group_user_new_admin: {
    message: "te ha asignado administrador del grupo",
    showUser: true,
  },
  notification_group_user_accepted: {
    message: "Has sido aceptado en el grupo",
    showUser: false,
  },
  notification_group_user_rejected: {
    message: "Has sido rechazado en el grupo",
    showUser: false,
  },
  notification_group_new_user_invited: {
    message: "te ha invitado al grupo",
    showUser: true,
  },
  notification_group_user_removed_from_group: {
    message: "Has sido eliminado del grupo",
    showUser: false,
  },
  notification_group_user_request_group_invitation: {
    message: "ha solicitado unirse al grupo",
    showUser: true,
  },
  notification_group_user_rejected_group_invitation: {
    message: "ha rechazado tu invitación al grupo",
    showUser: true,
  },
  notification_group_new_user_added: {
    message: "ha aceptado tu invitación al grupo",
    showUser: true,
  },
  notification_group_user_removed_admin: {
    message: "Te han quitado el rol de administrador en el grupo ",
    showUser: false,
  },
};

// Actions object extending base messages
export const groupNotificationMessages: Record<
  GroupNotificationType,
  {
    message: string;
    showUser: boolean;
    acceptAction?: Function;
    rejectAction?: Function;
    seeNotifications?: boolean;
  }
> = {
  ...groupNotificationBaseMessages,
  notification_group_new_user_invited: {
    ...groupNotificationBaseMessages.notification_group_new_user_invited,
    acceptAction: acceptGroupInvitation,
    rejectAction: declineGroupInvitation,
  },
  notification_group_user_request_group_invitation: {
    ...groupNotificationBaseMessages.notification_group_user_request_group_invitation,
    seeNotifications: true,
  },
};
