import React from "react";
import Link from "next/link";
import styled from "styled-components";
import useSWR from "swr";
import Headline from "../../components/Headline";
import { StyledTitle } from "../../components/Title/StyledTitle";
import Head from "next/head";

interface CategoriesOverviewProps {
  theme: string;
}

export default function CategoriesOverview({ theme }: CategoriesOverviewProps) {

  const { data: categories, error: categoriesError } =
    useSWR(`/api/categories`);

  if (categoriesError) return <div>Error occurred while fetching data</div>;
  if (!categories) return <div>Loading...</div>;


  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>
      <Headline />
      <StyledTitle>Categories</StyledTitle>
      <main>
        <StyledPlantList>
          {categories.map((category: { _id: React.Key | null | undefined; slug: any; bgcolor: string; bgcolorDark: string; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }) => (
            <StyledLink
              key={category._id}
              href={`/categories/${category.slug}`}
            >
              <CategoryCard
                bgcolor={
                  theme === "light" ? category.bgcolor : category.bgcolorDark
                }
              >
                <p>{category.title}</p>
              </CategoryCard>
            </StyledLink>
          ))}
        </StyledPlantList>
      </main>
    </>
  );
}

interface StyledLinkProps {
  theme: string;
}

interface CategoryCardProps {
  bgcolor: string;
  theme: string;
}

const StyledPlantList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
`;

const CategoryCard = styled.li<CategoryCardProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 9rem;
  height: 9rem;
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.cardBorder};
  padding: 1rem;
  background-color: ${(props) => props.bgcolor};
`;

const StyledLink = styled(Link)<StyledLinkProps>`
  position: relative;
  text-decoration: none;
  color: ${({ theme }) => theme.infoText};
  font-weight: 600;
`;
