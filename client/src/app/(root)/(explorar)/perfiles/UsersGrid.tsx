import ProfileCard from "@/components/cards/ProfileCard";
import { User } from "@/types/userTypes";
import { Group } from "@/types/groupTypes";
import { Spinner } from "@nextui-org/react";
import MemberCard from "@/components/cards/MemberCard";
import { useSearchParams } from "next/navigation";

const UsersGrid = ({
  items,
  isLoading = false,
  groupGrid = false,
  group,
  groupRequestGrid,
}: {
  items: User[];
  isLoading?: boolean;
  groupGrid?: boolean;
  group?: Group;
  groupRequestGrid?: boolean;
}) => {
  const isAdmin = (user: User) =>
    group?.admins.some((admin) => (admin as User)._id === user._id);
  const isCreator = (id: string) => group?.creator._id === id;
  const searchParams = useSearchParams();
  const busqueda = searchParams.get("busqueda");
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
        {items &&
          items.map((user: User, index) =>
            groupGrid && group ? (
              <MemberCard
                user={user}
                group={group}
                key={user._id}
                isAdmin={isAdmin(user)}
                isCreator={isCreator(user._id)}
                groupRequestGrid={groupRequestGrid}
              />
            ) : (
              <ProfileCard user={user} key={user._id} />
            )
          )}
      </div>
      {!isLoading && (!items || items.length === 0) && (
        <p className="max-md:text-sm text-light-text">
          {busqueda
            ? `No se encontraron carteles de usuarios para "${busqueda}"`
            : "Por favor, haga una búsqueda en el campo de búsqueda del encabezado"}
        </p>
      )}
      {isLoading && <Spinner color="warning" />}
    </>
  );
};

export default UsersGrid;
