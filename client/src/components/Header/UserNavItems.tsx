import { Link, NavbarItem, NavbarMenuToggle } from "@nextui-org/react";
import SecondaryButton from "../buttons/SecondaryButton";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Notifications from "./Notifications/Notifications";
import DropdownItems from "./DropdownItems";
import UserButtonModal from "@/app/(root)/(configuracion)/UserButtonPage";

const UserNavItems = ({
  isMenuOpen,
  isFocused,
  setIsMenuOpen,
}: {
  isMenuOpen: boolean;
  isFocused: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <NavbarItem className="max-lg:hidden flex gap-2 items-center">
        <SignedIn>
          <Notifications />
          <UserButtonModal />
          <DropdownItems setIsMenuOpen={setIsMenuOpen} />
        </SignedIn>
        <SignedOut>
          <SecondaryButton as={Link} href="/iniciar-sesion" variant="flat">
            Iniciar Sesión
          </SecondaryButton>
        </SignedOut>
      </NavbarItem>
      <SignedIn>
        <NavbarItem
          className={`lg:hidden w-20 flex gap-1 items-center !transition-all duration-300 ${
            isFocused ? "!w-0 flex-shrink" : ""
          }`}
        >
          <Notifications />
          <UserButtonModal />
        </NavbarItem>
      </SignedIn>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="lg:hidden min-h-12"
      />
    </>
  );
};

export default UserNavItems;
