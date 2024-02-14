import styled from "styled-components";
import { ChangeEventHandler, useState } from "react";
import Image from "next/image";

export interface SearchFieldProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export default function SearchField({ onChange }: SearchFieldProps) {
  const [icon, setIcon] = useState<"search" | "clear-search">("search");

  function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchValue = event.target.value;
    onChange(event);
    if (searchValue.length > 0) {
      setIcon("clear-search");
    } else {
      setIcon("search");
    }
  }

  function clearInput() {
    if (icon === "clear-search") {
      onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
      setIcon("search");
      const searchInput = document.getElementById("search") as HTMLInputElement;
      if (searchInput) {
        searchInput.value = ""; 
      }
  }
}

  return (
    <InputWrapper>
        <StyledImage
          $icon={icon}
          onClick={clearInput}
          src={
            icon === "search"
              ? "/assets/magnifyingGlass.svg"
              : "/assets/x-mark.svg"
          }
          alt="Search Icon"
          width={30}
          height={30}
        />

      <SearchFieldInput
        type="search"
        id="search"
        placeholder="Search for plants"
        onChange={handleOnChange}
      />
    </InputWrapper>
  );
}

const StyledImage = styled(Image)<{ $icon: "search" | "clear-search" }>`
  cursor: ${({ $icon }) => ($icon === "clear-search" ? "pointer" : "")};
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 39px;
  overflow: hidden;
  background-color: none;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  padding: 0 1rem;
  max-width: 21rem;
  margin: auto;

  @media (min-width: 1024px) {
    max-width: 31rem;
  }
`;

const SearchFieldInput = styled.input`
  border-radius: 0.4rem;
  padding: 0.8rem;
  background-color: ${({ theme }) => theme.primaryGreen};
  border: none;
  padding-left: 40px;
  color: ${({ theme }) => theme.white};

  &::placeholder {
    color: ${({ theme }) => theme.white};
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    display: none;
  }
`;
