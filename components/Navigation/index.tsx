import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { useRouter } from "next/router";
import React from "react";

export interface NavigationProps {
  theme: string
}

interface ImageSrcProps {
  name: string;
  pathname: string;
}

export default function Navigation({ theme }: NavigationProps) {
  const router = useRouter();

  const handleHomeClick = () => {
    if (router.pathname === "/") {
      router.reload();
    } else {
      router.push("/");
    }
  };

  const imageSrc = ({name, pathname}: ImageSrcProps) => {
    if (theme === "light") {
      return router.pathname === pathname
        ? `/assets/${name}Active.svg`
        : `/assets/${name}Inactive.svg`;
    }

    if (theme === "dark") {
      return router.pathname === pathname
        ? `/assets/${name}Darkmode.svg`
        : `/assets/${name}Active.svg`;
    }
    return `/assets/${name}Inactive.svg`;
  };

  return (
    <StyledNav>
      <StyledList>
        <li>
          <Link href="/" onClick={handleHomeClick}>
            <Image
              src={imageSrc({ name: "Home", pathname: "/" })}
              alt="Home Icon"
              width={40}
              height={40}
            />
          </Link>
        </li>
        <li>
          <Link href="/favorites">
            <Image
              src={imageSrc({name: "Heart", pathname:"/favorites"})}
              alt="Favorite Icon"
              width={40}
              height={40}
            />
          </Link>
        </li>
        <li>
          <Link href="/categories">
            <Image
              src={imageSrc({name:"Category", pathname:"/categories"})}
              alt="Categories Icon"
              width={40}
              height={40}
            />
          </Link>
        </li>
        <li>
          <Link href="/preferences">
            <Image
              src={imageSrc({name: "Preference", pathname:"/preferences"})}
              alt="Preference Icon"
              width={40}
              height={40}
            />
          </Link>
        </li>
        <li>
          <Link href="/journal">
            <Image
              src={imageSrc({name:"Journal", pathname:"/journal"})}
              alt="Journal Icon"
              width={40}
              height={40}
            />
          </Link>
        </li>
      </StyledList>
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  z-index: 2;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.navigation};
`;

const StyledList = styled.ul`
  display: flex;
  justify-content: space-around;
  align-content: center;
`;
