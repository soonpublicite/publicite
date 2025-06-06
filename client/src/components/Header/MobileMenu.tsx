import { CREATE, POSTS, PROFILE } from "@/utils/data/urls";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Link, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { Variants } from "framer-motion";
import React, { Dispatch, SetStateAction } from "react";
import SecondaryButton from "../buttons/SecondaryButton";
import DropdownItems from "./DropdownItems";
import NextLink from "next/link";
import { useUserData } from "@/app/(root)/providers/userDataProvider";

const MobileMenu = ({
  setIsMenuOpen,
  isSignedIn,
}: {
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  isSignedIn: boolean;
}) => {
  const { userIdLogged } = useUserData();
  const menuItems = [
    {
      title: "Inicio",
      url: "/",
    },
    {
      title: "Explorar",
      url: POSTS,
    },
    {
      title: "Publicar",
      url: `${CREATE}`,
      isPrivate: true,
    },
    {
      title: "Mi Cartel de Usuario",
      url: `${PROFILE}/${userIdLogged}`,
      isPrivate: true,
    },
  ];
  const variants: Variants = {
    visible: {
      transform: "translateY(0)",
      height: isSignedIn ? "290px" : "190px",
      opacity: 1,
    },
    hidden: { transform: "translateY(-50px)", height: "0px", opacity: 0 },
  };

  const shownItems = isSignedIn
    ? menuItems
    : menuItems.filter((item) => !item.isPrivate);
  return (
    <NavbarMenu
      motionProps={{
        variants,
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
        transition: { duration: 0.3 },
      }}
      className="bg-white h-fit !w-auto header-spacing rounded-b-xl shadow-2xl fixed items-end gap-2 pr-6 md:pr-8 overflow-y-hidden"
    >
      {shownItems.map((item, index) => (
        <NavbarMenuItem key={`${item}-${index}`}>
          <NextLink href={item.url} passHref>
            <Link
              onClick={() => setIsMenuOpen(false)}
              className={`w-full text-text-color`}
              size="sm"
            >
              {item.title}
            </Link>
          </NextLink>
        </NavbarMenuItem>
      ))}
      <div className="flex gap-2 items-center">
        <SignedIn>
          <DropdownItems setIsMenuOpen={setIsMenuOpen} />
        </SignedIn>
        <SignedOut>
          <SecondaryButton
            as={Link}
            href="/iniciar-sesion"
            variant="flat"
            className="-mr-4 mt-2"
          >
            Iniciar Sesión
          </SecondaryButton>
        </SignedOut>
      </div>
    </NavbarMenu>
  );
};

export default MobileMenu;
