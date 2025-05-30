import { Schema } from 'mongoose';
import NotificationModel, { NotificationDocument } from "./notification.schema";
import { PostType } from '../../domain/entity/enum/post.type.enum';
import { NotificationPostType } from '../../domain/entity/enum/notification.post.type.enum';

interface INotificationPost extends NotificationDocument {
    frontData: {
        postActivity: {
            notificationPostType: NotificationPostType,
            user: {
                username: string;
            },
            post: {
                _id: string;
                title: string;
                imageUrl: string;
                postType: string;
            },
            postReaction?: {
                emoji: string;
            },
            postComment?: {
                comment: string
            },
            postResponse?: {
                author: string,
                commentId: string,
                response: string
            }
        }
    }
}


const NotificationPostSchema = new Schema<INotificationPost>({
    frontData: {
        postActivity: {
            notificationPostType: { type: String, enum: Object.values(NotificationPostType), required: true },
            user: {
                username: { type: String, required: true },
            },
            post: {
                _id: { type: String, required: true },
                title: { type: String, required: true },
                imageUrl: { type: String, default: null },
                postType: { type: String, enum: Object.values(PostType), required: true },
            },
            postReaction: { emoji: { type: String } },
            postComment: { comment: { type: String } },
            postResponse: {
                author: { type: String },
                commentId: { type: String },
                response: { type: String }
            }
        }
    }
})

const NotificationPostModel = NotificationModel.discriminator('NotificationPost', NotificationPostSchema);

export { NotificationPostModel, INotificationPost };