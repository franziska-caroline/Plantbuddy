import Image from "next/image";
import styled from "styled-components";
import { NextRouter, useRouter } from "next/router";
import { MouseEventHandler } from "react";

export interface FavoriteButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isFavorite: boolean;
}

export default function FavoriteButton({ onClick, isFavorite }: FavoriteButtonProps) {
  const router: NextRouter = useRouter();

  const buttonSize = router.pathname === "/plants/[_id]" ? 40 : 30;
  
  return (
    <StyledButton type="button" onClick={onClick} buttonSize={buttonSize} pathname={router.pathname}>
      <Image
        src={
          isFavorite
            ? "/assets/HeartIconLiked.svg"
            : "/assets/HeartIconDisliked.svg"
        }
        alt="Favorite Icon"
        width={buttonSize}
        height={buttonSize}
      />
    </StyledButton>
  );
}

interface StyledButtonProps {
buttonSize: number;
pathname: string;
}

const StyledButton = styled.button<StyledButtonProps>`
  z-index: 1;
  display: flex;
  border: 0;
  background: none;
  padding: 0;
  position: absolute;
  top: ${({ pathname }) => (pathname === "/plants/[_id]" ? "1.25rem" : "0.5rem")};
  right: ${({ pathname }) => (pathname === "/plants/[_id]" ? "1rem" : "0.5rem")};
  border-radius: 50%; 
  padding: 0.2rem; 
  background-color: transparent;
  width: ${({ buttonSize }) => `${buttonSize}px`};
  height: ${({ buttonSize }) => `${buttonSize}px`};
`;

