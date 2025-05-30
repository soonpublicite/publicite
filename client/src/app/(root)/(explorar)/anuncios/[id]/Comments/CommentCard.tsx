import { parseIsoDate, showDate } from "@/utils/functions/dates";
import { PostComment, PostDataNotification } from "@/types/postTypes";
import { Card, CardBody } from "@nextui-org/react";
import ReplyForm from "./ReplyForm";
import ReplyCard from "./ReplyCard";
import { Dispatch, SetStateAction } from "react";

const CommentCard = ({
  comment,
  isAuthor,
  post,
  setComments,
}: {
  comment: PostComment;
  isAuthor: boolean;
  post: PostDataNotification & { authorId: string };
  setComments: Dispatch<SetStateAction<PostComment[]>>;
}) => {
  return (
    <div className="flex flex-col gap-2 items-end w-full">
      <Card
        id={`comentario-${comment._id}`}
        shadow="sm"
        className="px-2.5 py-2 w-full"
      >
        <CardBody className="flex flex-row justify-between w-full gap-2 items-start">
          <p className="text-xs md:text-sm xl:text-base">{comment.comment}</p>
          <p className="font-medium text-light-text text-xs xl:text-sm min-w-fit">
            {comment.createdAt ? showDate(parseIsoDate(comment.createdAt)) : ""}
          </p>
        </CardBody>
        <ReplyForm
          comment={comment}
          isAuthor={isAuthor}
          post={post}
          setComments={setComments}
        />
      </Card>
      {comment.response && (
        <ReplyCard
          reply={comment.response}
          isAuthor={isAuthor}
          setComments={setComments}
        />
      )}
    </div>
  );
};

export default CommentCard;
