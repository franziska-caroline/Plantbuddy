import styled from "styled-components";
import { MouseEvent, useState } from "react";
import DeletePopup from "../DeletePopup";
import Image from "next/image";
import Link from "next/link";
import { Entry } from "../../types/entry";

interface EntryCardProps {
  entry: Entry;
  onDeleteEntry: (id: string | undefined) => void;
  url: string | undefined;
}

export default function EntryCard({
  entry,
  onDeleteEntry,
  url,
}: EntryCardProps) {
  const [showPopup, setShowPopup] = useState(false);

  const confirmDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPopup(true);
  };

  const handleConfirm = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onDeleteEntry(entry._id);
    setShowPopup(false);
  };

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPopup(false);
  };

  return (
    <StyledEntryCard>
      <StyledLink href={`/journal/${entry._id}`}>
        <StyledEntryImage
          src={url}
          width={100}
          height={100}
          alt="Uploaded Image"
        />
        <StyledEntryInfo lang="en">{entry.name}</StyledEntryInfo>
      </StyledLink>
      <StyledDeleteButton
        type="button"
        aria-label="Delete Preference"
        onClick={confirmDelete}
      >
        <Image
          src="/assets/x-mark.svg"
          alt="Delete Icon"
          width={20}
          height={20}
        />
      </StyledDeleteButton>
      {showPopup && (
        <DeletePopup
          name="entry"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </StyledEntryCard>
  );
}
const StyledEntryCard = styled.figure`
  position: relative;
  border: 2px solid ${({ theme }) => theme.cardBorder};
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  background-color: ${({ theme }) => theme.primaryGreen};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.white};
  font-weight: 600;
  cursor: pointer;
  max-width: 15rem;
`;

const StyledEntryImage = styled.img`
  margin-right: 16px;
  object-fit: cover;
`;

const StyledEntryInfo = styled.figcaption`
  color: ${({ theme }) => theme.white};
  margin: 0.25rem;
  hyphens: auto;
  max-width: 7rem;
  overflow-x: hidden;
`;

const StyledDeleteButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: 0;
  background: none;
  padding: 0;
`;
