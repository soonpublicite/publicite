import { ClientSession, ObjectId, Types } from 'mongoose';
import { User, UserPreferences } from '../entity/user.entity';
import { UserPerson } from '../entity/userPerson.entity';
import { UserBusiness } from '../entity/userBusiness.entity';
import { UserBusinessUpdateDto } from '../entity/dto/user.business.update.dto';
import { UserPersonalUpdateDto } from '../entity/dto/user.personal.update.dto';
import { UserPreferencesEntityDto } from '../entity/dto/user.preferences.update.dto';
import { UP_clerkUpdateRequestDto } from 'src/contexts/module_webhook/clerk/application/dto/UP-clerk.update.request';
import { UserClerkUpdateDto } from '../entity/dto/user.clerk.update.dto';
import { UserFindAllResponse } from '../../application/adapter/dto/HTTP-RESPONSE/user.response.dto';
import { UserRelation } from '../entity/userRelation.entity';
import { UserType } from '../entity/enum/user.enums';

export interface UserRepositoryInterface {
  createPubliciteRelation(id: any): Promise<any>;
  deleteAccount(id: string): Promise<any>;
  getUsersOfAllApp(): Promise<any>;
  findAllUsers(
    user: string,
    limit: number,
    page: number,
  ): Promise<UserFindAllResponse>;
  findUserByIdByOwnUser(_id: string): Promise<any>;

  getUserPersonalInformationByUsername(username: string): Promise<any>;

  getUserPreferencesByUsername(
    username: string,
  ): Promise<UserPreferences | null>;

  getRelationsFromUserByUserId(userRequestId: string): Promise<any>;
  getMongoIdByClerkId(clerk_id: string): Promise<void>;
  getPostAndLimitsFromUserByUserId(author: string): Promise<any>;
  getLimitContactsFromUserByUserId(
    userRequestId: string,
    session?: any,
  ): Promise<any>;
  getActiveRelationsOfUser(userRequestId: string, session?: any): Promise<any>;
  getPostAndContactLimitsFromUserByUserId(author: string): Promise<any>;
  getProfileUserByExternalUserById(
    _id: string,
    conditionOfVisibility: any,
  ): Promise<any>;

  pushNotification(
    notification: any,
    userId: string,
    session?: any,
  ): Promise<any>;
  pushNewFriendRequestOrRelationRequestToUser(
    notificationId: Types.ObjectId,
    backData: any,
    session: any,
  ): Promise<any>;
  pushActiveRelationToUser(
    userRequestId: any,
    userRelationId: any,
    session: any,
  ): Promise<void>;
  save(reqUser: User, session?: ClientSession): Promise<string>;

  saveBusinessAccount(
    baseObj: any,
    user: UserBusiness,
    options?: { session?: ClientSession },
  ): Promise<User>;

  saveNewPost(
    postId: string,
    authorId: string,
    options?: { session?: ClientSession },
  ): Promise<any>;
  setSubscriptionToUser(
    external_reference: string,
    sub_id: any,
    session: any,
  ): Promise<any>;
  savePersonalAccount(
    baseObj: any,
    user: UserPerson,
    options?: { session?: ClientSession },
  ): Promise<User>;
  setNewActiveUserRelations(
    activeRelations: string[],
    userRequestId: string,
  ): Promise<any>;

  removeFriendRequest(
    previousNotificationId: string,
    backData: {
      userIdFrom: string;
      userIdTo: string;
    },
    session: any,
  ): Promise<any>;
  removeFriend(relationId: string, friendRequestId?: string): Promise<any>;
  removeActiveRelationOfUser(
    userRequestId: string,
    contactsToDelete: any[],
    session?: any,
  ): Promise<any>;

  makeFriendRelationBetweenUsers(
    userRelation: UserRelation,
    session: any,
  ): Promise<string | null>;
  update(
    _id: string,
    reqUser: UserPersonalUpdateDto | UserBusinessUpdateDto,
    type: UserType,
  ): Promise<UserPersonalUpdateDto | UserBusinessUpdateDto>;

  updateFriendRelationOfUsers(
    userRelationId: string,
    typeOfRelation: string,
    session: any,
  ): Promise<void>;

  updateByClerkId(
    clerkId: string,
    reqUser: UP_clerkUpdateRequestDto,
  ): Promise<UserClerkUpdateDto>;

  updateUserPreferencesByUsername(
    username: string,
    userPreference: UserPreferencesEntityDto,
  ): Promise<UserPreferencesEntityDto | null>;
}

