import { Image, Link, Spinner, useDisclosure } from "@nextui-org/react";
import {
  NotificationBody,
  NotificationCard,
  NotificationImage,
  NotificationOptionProps,
  NotificationOptions,
} from "../NotificationCard";
import { ContactSellerNotification } from "@/types/postTypes";
import { FILE_URL, POSTS } from "@/utils/data/urls";
import { parseIsoDate, showDate } from "@/utils/functions/dates";
import { lazy, Suspense } from "react";
import { checkAndAddDeleteNotification } from "../deleteNotification";
import { useNotificationsContext } from "@/app/(root)/providers/notificationsProvider";
import { useNotificationsIsOpen } from "@/components/Header/Notifications/notificationsOptionsProvider";
const ContactPetition = lazy(
  () => import("@/components/modals/ContactPetition/ContactPetition")
);

const NewContactPost = ({
  notification,
}: {
  notification: ContactSellerNotification;
}) => {
  const { setIsOpen } = useNotificationsIsOpen();
  const {
    frontData: {
      contactSeller: { post, client },
    },
    _id,
    event,
    viewed,
  } = notification;
  const { deleteNotification } = useNotificationsContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const messageToDisplay = `${client.name} ${client.lastName} te ha contactado por el anuncio de "${post.title}".`;

  const getNotificationOptionsList = () => {
    const optionsList: NotificationOptionProps[] = [
      {
        label: "Ver Solicitud",
        onPress: onOpen,
      },
      {
        label: "Ver Anuncio",
        as: Link,
        color: "default",
        onClick: () => setIsOpen(false),
        href: `${POSTS}/${post._id}`,
        className: "text-text-color",
      },
    ];
    checkAndAddDeleteNotification(optionsList, event, _id, deleteNotification);
    return optionsList;
  };
  return (
    <NotificationCard isNew={!viewed} id={_id}>
      <NotificationImage>
        <Image
          radius="sm"
          src={
            "imagesUrls" in post && post.imagesUrls
              ? FILE_URL + post.imagesUrls[0]
              : "/logo.png"
          }
          alt={"foto de portada de" + post.title}
          className="object-cover w-full h-full"
          removeWrapper
        />
      </NotificationImage>
      <NotificationBody>{messageToDisplay}</NotificationBody>
      <NotificationOptions
        date={showDate(parseIsoDate(notification.date))}
        items={getNotificationOptionsList()}
      />
      {isOpen && (
        <Suspense fallback={<Spinner color="warning" size="sm" />}>
          <ContactPetition
            isOpen={true}
            onOpenChange={onOpenChange}
            contactPetitionData={{ post, client }}
          />
        </Suspense>
      )}
    </NotificationCard>
  );
};

export default NewContactPost;
