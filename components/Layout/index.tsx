import styled from "styled-components";
import { useSession } from "next-auth/react";
import { NextRouter, useRouter } from "next/router";
import Navigation from "../Navigation";
import React from "react";

export interface LayoutProps {
  children: React.ReactNode;
  theme: string;
}

export default function Layout({ children, theme }: LayoutProps) {

  const { status } = useSession();
  const router: NextRouter = useRouter();

  return (
    <>
      <StyledMain pathname={router.pathname} status={status}>
        {children}
      </StyledMain>
      <Navigation theme={theme} />
    </>
  );
}

interface StyledMainProps {
  pathname: string;
  status: string;
}

const StyledMain = styled.main<StyledMainProps>`
  padding-top: ${({ pathname, status }) =>
    pathname === "/plants/[_id]" ||
    pathname === "/categories/[slug]" ||
    pathname === "/journal/[id]"
      ? "0"
      : status === "authenticated"
      ? "9rem"
      : "6rem"};
  padding-bottom: ${({ pathname }) =>
    pathname === "/plants/[_id]" ||
    pathname === "/categories/[slug]"
      ? "0"
      : "6rem"};
`;
