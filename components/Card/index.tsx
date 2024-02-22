import Image from "next/image";
import styled from "styled-components";
import Link from "next/link";
import FavoriteButton from "../FavoriteButton";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import React from "react";
import { Plant } from "../../types/plant";
import { Category } from "../../types/category";

interface PlantCardProps {
  onToggleFavorite: (plantId: string) => void;
  isFavorite: boolean;
  plant: Plant;
  theme: string;
}

export default function PlantCard({
  onToggleFavorite,
  isFavorite,
  plant,
  theme,
}: PlantCardProps) {

  const { data: categories, error: categoriesError } =
    useSWR("/api/categories");
  const { data: plants, error: plantsError } = useSWR("/api/plants");
  const { status } = useSession();

  if (plantsError || categoriesError)
    return <div>Error occurred while fetching data</div>;
  if (!plants || !categories) return <div>Loading...</div>;

  const category: Category | undefined = (categories as Category[]).find(
    (category) => category.slug === plant.categorySlug
  );

  // TODO set proper default color
  const categoryColor: string = category ? 
    (theme === "light" ? category?.bgcolor : category?.bgcolorDark) : "fffff";

  return (
    <StyledListItem>
      {status === "authenticated" && (
        <FavoriteButton
          onClick={() => onToggleFavorite(plant._id)}
          isFavorite={isFavorite}
        />
      )}
      <StyledLink href={`/plants/${plant?._id}`}>
        <StyledFigure categoryColor={categoryColor}>
          <Image
            src={plant?.image}
            width={150}
            height={150}
            alt={plant?.commonName}
          />
          <StyledCaption>{plant?.commonName}</StyledCaption>
        </StyledFigure>
      </StyledLink>
    </StyledListItem>
  );
}

interface StyledFigureProps {
  theme: string;
  categoryColor: string;
}

const StyledListItem = styled.li`
  position: relative;
`;

const StyledFigure = styled.figure<StyledFigureProps>`
  margin: 0;
  width: 9rem;
  height: 13rem;
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.cardBorder};
  overflow: hidden;
  background-color: ${({ categoryColor }) => categoryColor};
`;

const StyledCaption = styled.figcaption`
  color: ${({ theme }) => theme.infoText};
  text-align: center;
  justify-content: center;
  margin: 0.25rem;
`;

const StyledLink = styled(Link)`
  position: relative;
  text-decoration: none;
`;
