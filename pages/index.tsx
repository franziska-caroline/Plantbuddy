import React, { useState } from "react";
import SearchField from "../components/SearchField";
import Headline from "../components/Headline";
import styled from "styled-components";
import SortPlants from "../components/SortPlants";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Header from "next/head";
import Link from "next/link";
import PlantList from "../components/PlantList";
import { Plant } from "../types/plant";

interface HomePageProps {
  onToggleFavorite: (plantId: string) => void; 
  favorites: string[];
  plants: Plant[];
  theme: string;
  toggleTheme: (theme: string) => void,
}

export default function HomePage({
  onToggleFavorite,
  favorites,
  plants,
  theme,
  toggleTheme,
}:HomePageProps) {
  const [search, setSearch] = useState("");
  const [sortPlants, setSortPlants] = useState(plants);
  const { status } = useSession();

  const searchResult = plants.filter((plant) => {
    return plant.commonName.toLowerCase().startsWith(search.toLowerCase());
  });
  function handleSortUpdate(newSortedPlants: Plant[]) {
    setSortPlants(newSortedPlants);
  }

  return (
    <>
    <Header>
      <title>PlantBuddy</title>
    </Header>
      <Headline />
      <StyledIconContainer status={status}>
      <Link href="/about">
      <Image src= {theme === "light" ? "/assets/About.svg" : "/assets/About_light-01.svg"}
       alt="About Icon"
       width={25}
       height={25}>
      </Image>
      </Link>
      <StyledThemeToggler onClick={() => toggleTheme(theme === "light" ? "dark" : "light")} status={status}>
        {theme === "light" ? (
          <Image
            src="/assets/DarkModeIcon.svg"
            alt="Darkmode Icon"
            width={25}
            height={25}
          />
        ) : (
          <Image
            src="/assets/LightModeIcon.svg"
            alt="Lightmode Icon"
            width={25}
            height={25}
          />
        )}
      </StyledThemeToggler>
      </StyledIconContainer>
      <main>
      <SearchField onChange={(event) => setSearch(event.target.value)} />
        {search === "" && (
          <SortPlants onSortUpdate={handleSortUpdate} plants={plants} />
        )}
        <PlantList
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          plants={plants}
          search={search}
          searchResult={searchResult}
          sortedPlants={sortPlants}
          theme={theme}
        />
      </main>
    </>
  );
}

const StyledThemeToggler = styled.button<{status: string}>`
  position: fixed;
  top: ${({ status }) => (status === "authenticated" ? "3.5rem" : "0.5rem")};
  right: 0.5rem;
  z-index: 3;
  border: 0;
  background: none;
  padding: 0;
`;

const StyledIconContainer = styled.div<{status: string}>`
  position: fixed;
  top: ${({ status }) => (status === "authenticated" ? "3.5rem" : "0.5rem")};
  left: 0.5rem;
  z-index: 3;
`;
