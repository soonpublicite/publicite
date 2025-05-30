import mongoose, { Model, Connection, Types } from "mongoose";
import { TestingModule } from "@nestjs/testing";
import mpTestingModule from "./test.module";
import { getModelToken } from "@nestjs/mongoose";
import { IUser, UserModel } from "src/contexts/module_user/user/infrastructure/schemas/user.schema";

import { MpSubscriptionService } from "../application/service/mp-subscription.service";
import { Subscription_preapproval } from "../domain/entity_mp/subscription_preapproval";
import SubscriptionModel, { SubscriptionDocument } from "../infastructure/schemas/subscription.schema";
import SubscriptionPlanModel, { SubscriptionPlanDocument } from "../infastructure/schemas/subscriptionPlan.schema";
import { MpHandlerEvents } from "../infastructure/adapters/handler/mpHandlerFETCHEvents";
import { get_subscription_preapproval } from "./models/subscription.creator";
import { createPersonalUser } from "../../../../../test/functions_unit_testing/user/create.user";
import { PaymentNotificationService } from "../infastructure/adapters/handler/PaymentNotificationService";


interface SubscriptionPlan {
    mpPreapprovalPlanId: string
    isActive: boolean,
    reason: string,
    description: string,
    features: string[],
    intervalTime: number,
    price: number,
    isFree: boolean,
    postsLibresCount: number,
    postsAgendaCount: number,
    maxContacts: number,
    isPack: boolean
}



describe('MercadopagoService - Subscription create', () => {
    let connection: Connection;


    let mpSubscriptionService: MpSubscriptionService;


    let userModel: Model<IUser>;
    let subscriptionPlanModel: Model<SubscriptionPlanDocument>
    let subscriptionModel: Model<SubscriptionDocument>


    const subcriptionPlanMeli_id = "2c93808494b8c5eb0194be9f312902f1"
    const reason = "Publicité Premium TEST"
    const user_id = new Types.ObjectId("66c49508e80296e90ec637d8");

    beforeAll(async () => {
        connection = mongoose.connection;
        const moduleRef: TestingModule = await mpTestingModule.get("mp_testing_module")();

        mpSubscriptionService = moduleRef.get<MpSubscriptionService>('SubscriptionServiceInterface');

        userModel = moduleRef.get<Model<IUser>>(getModelToken(UserModel.modelName));
        subscriptionPlanModel = moduleRef.get<Model<SubscriptionPlanDocument>>(getModelToken(SubscriptionPlanModel.modelName));
        subscriptionModel = moduleRef.get<Model<SubscriptionDocument>>(getModelToken(SubscriptionModel.modelName));


        await createPersonalUser(userModel, { _id: user_id });
        await subscriptionPlanModel.create({
            mpPreapprovalPlanId: subcriptionPlanMeli_id,
            isActive: true,
            reason: reason,
            description: "Este plan es publicite premium.",
            features: ["TEST"],
            intervalTime: 0,
            price: 0,
            isFree: false,
            postsLibresCount: 0,
            postsAgendaCount: 0,
            maxContacts: 0,
            isPack: false

        })
    });

    afterAll(async () => {
        await subscriptionPlanModel.deleteMany({});
        await connection.close();


    });

    afterEach(async () => {
        await userModel.deleteMany({});
        await subscriptionModel.deleteMany({});
    });


    it('Create a subscription', async () => {

        const subscription_preapproval: Subscription_preapproval = {
            id: subcriptionPlanMeli_id,
            payer_id: 22,
            payer_email: "",
            back_url: "",
            collector_id: 0,
            application_id: 0,
            status: "authorized",
            reason: reason,
            external_reference: "66c49508e80296e90ec637d8",
            date_created: "",
            last_modified: "",
            init_point: "",
            preapproval_plan_id: subcriptionPlanMeli_id,
            auto_recurring: {
                frequency: 0,
                frequency_type: "",
                transaction_amount: 0,
                currency_id: "",
                start_date: "2020-06-02T13:07:14.260Z",
                end_date: "2020-06-02T13:07:14.260Z",
                billing_day_proportional: false,
                has_billing_day: false,
                free_trial: undefined
            },
            summarized: {
                quotas: 0,
                charged_quantity: 0,
                pending_charge_quantity: 0,
                charged_amount: 0,
                pending_charge_amount: 0,
                semaphore: "",
                last_charged_date: "",
                last_charged_amount: 0
            },
            next_payment_date: "TEST",
            payment_method_id: "TEST",
            card_id: "TEXT",
            payment_method_id_secondary: null,
            first_invoice_offset: undefined,
            subscription_id: "",
            owner: undefined
        }
        await mpSubscriptionService.createSubscription_preapproval(subscription_preapproval);

        const user: any = await userModel.findById(user_id).select("subscriptions").populate([
            {
                path: "subscriptions",
                populate: {
                    path: "subscriptionPlan"
                }
            }
        ])
        expect(user?.subscriptions.length).toBe(1);
        expect(user?.subscriptions[0].mpPreapprovalId).toBe(subcriptionPlanMeli_id);
        expect(user?.subscriptions[0].subscriptionPlan.mpPreapprovalPlanId).toBe(subcriptionPlanMeli_id);
        expect(user?.subscriptions[0].subscriptionPlan.reason).toBe(subscription_preapproval.reason);


    });



    it('Create a subscription without auto_recurring', async () => {

        const subscription_preapproval: any = {
            id: subcriptionPlanMeli_id,
            payer_id: 22,
            payer_email: "",
            back_url: "",
            collector_id: 0,
            application_id: 0,
            status: "authorized",
            reason: reason,
            external_reference: "66c49508e80296e90ec637d8",
            date_created: "",
            last_modified: "",
            init_point: "",
            preapproval_plan_id: subcriptionPlanMeli_id,

        }
        await expect(mpSubscriptionService.createSubscription_preapproval(subscription_preapproval))
            .rejects.toThrow(/Invalid subscription data/);



    });

    it('Create a subscription without external_reference', async () => {
        const subscription_preapproval: any = {
            id: subcriptionPlanMeli_id,
            payer_id: 22,
            payer_email: "",
            back_url: "",
            collector_id: 0,
            application_id: 0,
            status: "authorized",
            reason: reason,

            date_created: "",
            last_modified: "",
            init_point: "",
            preapproval_plan_id: subcriptionPlanMeli_id,
            auto_recurring: {
                frequency: 0,
                frequency_type: "",
                transaction_amount: 0,
                currency_id: "",
                start_date: "2020-06-02T13:07:14.260Z",
                end_date: "2020-06-02T13:07:14.260Z",
                billing_day_proportional: false,
                has_billing_day: false,
                free_trial: undefined

            },

        }
        await expect(mpSubscriptionService.createSubscription_preapproval(subscription_preapproval))
            .rejects.toThrow(/Invalid subscription data/);




    });


    it('Create a subscription with invalid Plan ID', async () => {
        const subscription_preapproval: any = {
            id: subcriptionPlanMeli_id,
            payer_id: 22,
            payer_email: "",
            back_url: "",
            collector_id: 0,
            application_id: 0,
            status: "authorized",
            reason: reason,
            external_reference: user_id,
            date_created: "",
            last_modified: "",
            init_point: "",
            preapproval_plan_id: "ID ERROR",
            auto_recurring: {
                frequency: 0,
                frequency_type: "",
                transaction_amount: 0,
                currency_id: "",
                start_date: "2020-06-02T13:07:14.260Z",
                end_date: "2020-06-02T13:07:14.260Z",
                billing_day_proportional: false,
                has_billing_day: false,
                free_trial: undefined

            },

        }
        await expect(mpSubscriptionService.createSubscription_preapproval(subscription_preapproval))
            .rejects.toThrow(/Plan not found, we can't create the subscription/);
    });





})// end



describe('Mercadopago - MpHandlerEvents - Subscription  -> Create', () => {
    let connection: Connection;
    let mpHandlerEvents: MpHandlerEvents;
    let subscriptionModel: Model<SubscriptionDocument>;
    let subscriptionPlanModel: Model<SubscriptionPlanDocument>
    let userModel: Model<IUser>;

    let mockedSubscriptionResponse: any
    let payment: any;
    let mockFetchToMpAdapter: any;
    const subcriptionPlanMeli_id = "2c93808494b8c5eb0194be9f312902f2"
    const external_reference = new Types.ObjectId("67420686b02bdd1f9f0ef449")
    const subscriptionPlan_id = new Types.ObjectId("67420686b02bdd1f9f0ef445")
    let paymentNotification: PaymentNotificationService;

    beforeAll(async () => {
        connection = mongoose.connection;
        const moduleRef: TestingModule = await mpTestingModule.get("mp_testing_module")();
        subscriptionModel = moduleRef.get<Model<SubscriptionDocument>>(getModelToken('Subscription'));
        subscriptionPlanModel = moduleRef.get<Model<SubscriptionPlanDocument>>(getModelToken('SubscriptionPlan'));
        userModel = moduleRef.get<Model<IUser>>(getModelToken('User'));
        mpHandlerEvents = moduleRef.get<MpHandlerEvents>('MpHandlerEventsInterface');
        paymentNotification = moduleRef.get<PaymentNotificationService>(PaymentNotificationService);
        mockFetchToMpAdapter = {
            getDataFromMp_fetch: jest.fn()
        };
        (mpHandlerEvents as any).fetchToMpAdapter = mockFetchToMpAdapter;
        mockedSubscriptionResponse = get_subscription_preapproval(external_reference.toString(), subcriptionPlanMeli_id, false);
        await subscriptionPlanModel.create({
            _id: subscriptionPlan_id,
            mpPreapprovalPlanId: subcriptionPlanMeli_id,
            isActive: true,
            reason: mockedSubscriptionResponse.reason,
            description: mockedSubscriptionResponse.reason,
            features: ["TEST"],
            intervalTime: 0,
            price: 0,
            isFree: false,
            postsLibresCount: 0,
            postsAgendaCount: 0,
            maxContacts: 0,
            isPack: false

        });
        await createPersonalUser(userModel, { _id: external_reference });
    });

    afterAll(async () => {
        await connection.close();
        await subscriptionModel.deleteMany({});
        await subscriptionPlanModel.deleteMany({});
        await userModel.deleteMany({});

    });




    it('Should return true and create a suscription', async () => {
        mockFetchToMpAdapter.getDataFromMp_fetch.mockResolvedValue(mockedSubscriptionResponse);
        await mpHandlerEvents.create_subscription_preapproval("123456");


        const subscriptionSaved = await subscriptionModel.findOne({ mpPreapprovalId: mockedSubscriptionResponse.id });
        if (subscriptionSaved === null) throw new Error("subscriptionSaved not found");
        expect(subscriptionSaved).not.toBeNull();
        expect(subscriptionSaved.mpPreapprovalId).toBe(mockedSubscriptionResponse.id);
        expect(subscriptionSaved.payerId).toBe(mockedSubscriptionResponse.payer_id.toString());
        expect(subscriptionSaved.status).toBe(mockedSubscriptionResponse.status);
        expect(subscriptionSaved.subscriptionPlan).toEqual(subscriptionPlan_id);
        expect(subscriptionSaved.startDate).toBe((mockedSubscriptionResponse.auto_recurring.start_date).split('T')[0]);
        expect(subscriptionSaved.external_reference).toBe(mockedSubscriptionResponse.external_reference);
        expect(subscriptionSaved.nextPaymentDate).toBe(mockedSubscriptionResponse.next_payment_date);
        expect(subscriptionSaved.paymentMethodId).toBe(mockedSubscriptionResponse.payment_method_id);
        expect(subscriptionSaved.cardId).toBe(mockedSubscriptionResponse.card_id);

    });



    it('Should return true and create a suscription(FREE TRIAL)', async () => {
        mockedSubscriptionResponse = get_subscription_preapproval(external_reference.toString(), subcriptionPlanMeli_id, true);
        mockFetchToMpAdapter.getDataFromMp_fetch.mockResolvedValue(mockedSubscriptionResponse);
        const freeTrialMethod = jest.spyOn(mpHandlerEvents, 'sendFreeTrialPaymentNotification');
        const freeTrialPaymentNotificationMethod = jest.spyOn(paymentNotification, 'sendPaymentNotification');
        await mpHandlerEvents.create_subscription_preapproval("123456");
        let { preapproval_plan_id, reason } = mockedSubscriptionResponse;



        const data = {
            subscriptionPlanId: preapproval_plan_id,
            reason: reason,
            status: "free_trial",
            retryAttemp: 1,
            userId: external_reference.toString(),
        }

        expect(freeTrialMethod).toHaveBeenCalledWith(mockedSubscriptionResponse);
        expect(freeTrialPaymentNotificationMethod).toHaveBeenCalledWith(data);
        const subscriptionSaved = await subscriptionModel.findOne({ mpPreapprovalId: mockedSubscriptionResponse.id });
        if (subscriptionSaved === null) throw new Error("subscriptionSaved not found");
        expect(subscriptionSaved).not.toBeNull();
        expect(subscriptionSaved.mpPreapprovalId).toBe(mockedSubscriptionResponse.id);
        expect(subscriptionSaved.payerId).toBe(mockedSubscriptionResponse.payer_id.toString());
        expect(subscriptionSaved.status).toBe(mockedSubscriptionResponse.status);
        expect(subscriptionSaved.subscriptionPlan).toEqual(subscriptionPlan_id);
        expect(subscriptionSaved.startDate).toBe((mockedSubscriptionResponse.auto_recurring.start_date).split('T')[0]);
        expect(subscriptionSaved.external_reference).toBe(mockedSubscriptionResponse.external_reference);
        expect(subscriptionSaved.nextPaymentDate).toBe(mockedSubscriptionResponse.next_payment_date);
        expect(subscriptionSaved.paymentMethodId).toBe(mockedSubscriptionResponse.payment_method_id);
        expect(subscriptionSaved.cardId).toBe(mockedSubscriptionResponse.card_id);

    });

});



describe('Mercadopago - MpHandlerEvents - Subscription  -> Update', () => {
    let connection: Connection;
    let mpHandlerEvents: MpHandlerEvents;
    let subscriptionModel: Model<SubscriptionDocument>;
    let subscriptionPlanModel: Model<SubscriptionPlanDocument>
    let userModel: Model<IUser>;


    let mockedSubscriptionResponse: any
    let payment: any;
    let mockFetchToMpAdapter: any;
    const subcriptionPlanMeli_id = "2c93808494b8c5eb0194be9f312902f2"
    const external_reference = new Types.ObjectId("67420686b02bdd1f9f0ef449")
    const subscriptionPlan_id = new Types.ObjectId("67420686b02bdd1f9f0ef445")
    beforeAll(async () => {
        connection = mongoose.connection;
        const moduleRef: TestingModule = await mpTestingModule.get("mp_testing_module")();
        subscriptionModel = moduleRef.get<Model<SubscriptionDocument>>(getModelToken('Subscription'));
        subscriptionPlanModel = moduleRef.get<Model<SubscriptionPlanDocument>>(getModelToken('SubscriptionPlan'));
        userModel = moduleRef.get<Model<IUser>>(getModelToken(UserModel.modelName));
        mpHandlerEvents = moduleRef.get<MpHandlerEvents>('MpHandlerEventsInterface');
        mockedSubscriptionResponse = get_subscription_preapproval(external_reference.toString(), subcriptionPlanMeli_id, false);

        mockFetchToMpAdapter = {
            getDataFromMp_fetch: jest.fn()
        };


        await createPersonalUser(userModel, { _id: external_reference });


        (mpHandlerEvents as any).fetchToMpAdapter = mockFetchToMpAdapter;


    });

    afterAll(async () => {
        await connection.close();
        await subscriptionModel.deleteMany({});
        await userModel.deleteMany({});

    });




    it('Should update subscription and return true and send notification to user', async () => {
        mockFetchToMpAdapter.getDataFromMp_fetch.mockResolvedValue(mockedSubscriptionResponse);
        await subscriptionPlanModel.create({
            _id: subscriptionPlan_id,
            mpPreapprovalPlanId: subcriptionPlanMeli_id,
            isActive: true,
            reason: mockedSubscriptionResponse.reason,
            description: mockedSubscriptionResponse.reason,
            features: ["TEST"],
            intervalTime: 0,
            price: 0,
            isFree: false,
            postsLibresCount: 0,
            postsAgendaCount: 0,
            maxContacts: 0,
            isPack: false

        });
        await subscriptionModel.create({
            _id: external_reference,
            mpPreapprovalId: mockedSubscriptionResponse.preapproval_plan_id,
            payerId: mockedSubscriptionResponse.payer_id.toString(),
            status: mockedSubscriptionResponse.status,
            subscriptionPlan: subscriptionPlan_id,
            startDate: (mockedSubscriptionResponse.auto_recurring.start_date).split('T')[0],
            endDate: (mockedSubscriptionResponse.auto_recurring.start_date).split('T')[0],
            external_reference: mockedSubscriptionResponse.external_reference,
            nextPaymentDate: mockedSubscriptionResponse.next_payment_date,
            paymentMethodId: mockedSubscriptionResponse.payment_method_id,
            cardId: mockedSubscriptionResponse.card_id
        })


        await mpHandlerEvents.update_subscription_preapproval("123456");

        const subscriptionSaved = await subscriptionModel.findOne({ mpPreapprovalId: subcriptionPlanMeli_id });
        if (subscriptionSaved === null) throw new Error("subscriptionSaved not found");
        expect(subscriptionSaved).not.toBeNull();
        expect(subscriptionSaved.mpPreapprovalId).toBe(mockedSubscriptionResponse.preapproval_plan_id);
        expect(subscriptionSaved.payerId).toBe(mockedSubscriptionResponse.payer_id.toString());
        expect(subscriptionSaved.status).toBe(mockedSubscriptionResponse.status);
        expect(subscriptionSaved.subscriptionPlan).toEqual(subscriptionPlan_id);
        expect(subscriptionSaved.startDate).toBe((mockedSubscriptionResponse.auto_recurring.start_date).split('T')[0]);
        expect(subscriptionSaved.external_reference).toBe(mockedSubscriptionResponse.external_reference);
        expect(subscriptionSaved.nextPaymentDate).toBe(mockedSubscriptionResponse.next_payment_date);
        expect(subscriptionSaved.paymentMethodId).toBe(mockedSubscriptionResponse.payment_method_id);
        expect(subscriptionSaved.cardId).toBe(mockedSubscriptionResponse.card_id);


    });







});
