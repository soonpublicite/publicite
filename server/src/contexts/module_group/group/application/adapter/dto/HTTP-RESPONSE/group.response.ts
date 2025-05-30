import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';

@ObjectType()
export class members_graphQl {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  username: string;

  @Field(() => String, { nullable: true })
  profilePhotoUrl: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  businessName: string;
}
@ObjectType()
export class post_graphql_group {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field(() => [String], { nullable: true })
  imagesUrls: string[];
}
@ObjectType()
export class sections_graphql_group {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field(() => [post_graphql_group], { nullable: true })
  posts: post_graphql_group[];
}

@ObjectType()
export class magazine_graphql_group {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => [sections_graphql_group], { nullable: true })
  sections: sections_graphql_group[];
}

@ObjectType()
export class GroupResponse_admins {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  username: string;

  @Field(() => String, { nullable: true })
  profilePhotoUrl: string;
}

@ObjectType()
class notification_user_populate {
  @Field(() => String, { nullable: true })
  _id: string;

  @Field(() => String, { nullable: true })
  username: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => String, { nullable: true })
  profilePhotoUrl: string;
}
@ObjectType()
class Notification_group {
  @Field(() => [notification_user_populate], { nullable: true })
  groupInvitations: notification_user_populate[];
  @Field(() => [notification_user_populate], { nullable: true })
  joinRequests: notification_user_populate[];
}

@ObjectType()
export class GroupResponse {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => [members_graphQl], { nullable: true })
  members: members_graphQl[];

  @Field(() => [GroupResponse_admins], { nullable: true })
  admins: GroupResponse_admins[];

  @Field(() => String)
  name: string;

  @Field(() => String)
  alias: string;

  @Field(() => notification_user_populate)
  creator: notification_user_populate;

  @Field(() => String, { nullable: true })
  rules: string;

  @Field(() => [magazine_graphql_group], { nullable: true })
  magazines: magazine_graphql_group[];

  @Field(() => String, { nullable: true })
  details: string;

  @Field(() => String, { nullable: true })
  profilePhotoUrl: string;

  @Field(() => String)
  visibility: string;

  @Field(() => String, { nullable: true })
  groupNote: string;


  @Field(() => Notification_group, { nullable: true })
  groupNotificationsRequest: Notification_group;

  constructor(group: any) {
    this._id = group._id;
    this.members = group.members;
    this.admins = group.admins;
    this.name = group.name;
    this.alias = group.alias;
    this.creator = group.creator;
    this.rules = group.rules;
    this.magazines = group.magazines ?? [];
    this.details = group.details;
    this.profilePhotoUrl = group.profilePhotoUrl;
    this.visibility = group.visibility;
    this.groupNotificationsRequest = group.groupNotificationsRequest;
    this.groupNote = group.groupNote

  }
}


@ObjectType()
export class GroupResponseById {
  @Field(() => GroupResponse)
  group: GroupResponse;

  @Field(() => Boolean)
  isMember: boolean;

  @Field(() => Boolean)
  hasJoinRequest: boolean;

  @Field(() => Boolean)
  hasGroupRequest: boolean;
}

@ObjectType()
class GroupList {
  @Field(() => GroupResponse, { nullable: true })
  group: GroupResponse; // Grupo

  @Field(() => Boolean, { nullable: true })
  isMember: Boolean; // Es miembro del grupo?

  @Field(() => Boolean, { nullable: true })
  hasJoinRequest: Boolean; // Tiene una solicitud de unirse aun no aceptada por el grupo

  @Field(() => Boolean, { nullable: true })
  hasGroupRequest: Boolean; // Tiene una solicitud del grupo para que se una
}

@ObjectType()
export class GroupListResponse {
  @Field(() => [GroupList])
  groups: GroupList[];

  @Field(() => Boolean)
  hasMore: boolean;
}
