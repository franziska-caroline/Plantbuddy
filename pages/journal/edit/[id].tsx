import { useRouter } from "next/router";
import styled from "styled-components";
import Headline from "../../../components/Headline";
import EntryForm from "../../../components/JournalEntryForm";
import Head from "next/head";
import ProtectedRoute from "../../../components/ProtectedRoute";
import BackButton from "../../../components/BackButton";
import { StyledTitle } from "../../../components/Title/StyledTitle";
import useSWR from "swr";
import { Entry } from "../../../types/entry";


interface EditJournalProps {
  onEditEntry: (entry: Entry) => void;
}

export default function EditJournal({ onEditEntry }: EditJournalProps) {
  const router = useRouter();
  const { id } = router.query;
  const { data: thisEntry, error: entryError } = useSWR(`/api/entries/${id}`);

  if (entryError) return <div>Error occurred while fetching data</div>;
  if (!thisEntry) return <div>Entry not Found</div>;

  return (
    <>
      <Head>
        <title>Edit Entry</title>
      </Head>
      <ProtectedRoute fallback={"/"}>
        <StyledBackButton>
          <BackButton />
        </StyledBackButton>
        <Headline />
        <main>
          <StyledTitle>Edit your Entry</StyledTitle>
          <EntryForm entry={thisEntry} onFormSubmit={onEditEntry} />
        </main>
      </ProtectedRoute>
    </>
  );
}

const StyledBackButton = styled.div`
  position: fixed;
  top: 2.75rem;
  z-index: 3;
`;
