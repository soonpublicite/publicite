import { UserRelationType } from "./enum/user.relationType.enum";
import { Notification } from "./notification.entity";



export class NotificationUser extends Notification {
    private frontData: {
        userRelation: {
            _id: string;
            userFrom: {
                _id: string;
                username: string;
                profilePhotoUrl: string;
            };
            typeRelation: UserRelationType | null;
        }
    };

    constructor(
        notification: Notification,
        frontData: {
            userRelation: {
                _id: string;
                userFrom: {
                    _id: string;
                    username: string;
                    profilePhotoUrl: string;
                };
                typeRelation: UserRelationType | null;
            }
        }
    ) {
        super(notification.getEvent,
            notification.getViewed,
            notification.getDate,
            notification.getUser,
            notification.getIsActionsAvailable,
            notification.getbackData,
            notification.getSocketJobId,
            notification.getType,
            notification.getNotificationEntityId,
            notification.getpreviousNotificationId as string
        );
        this.frontData = frontData;
    }

    set setNotificationUserRelationId(notificationUserRelationId: string) {
        this.frontData.userRelation._id = notificationUserRelationId
    }
    get getUserRelationId() {
        return this.frontData.userRelation._id;
    }

    get getFrontData() {
        return this.frontData
    }

    get getTypeOfRelation(): UserRelationType {
        return this.frontData.userRelation.typeRelation ?? UserRelationType.contacts;
    }



}