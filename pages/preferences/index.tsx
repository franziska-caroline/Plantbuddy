import Headline from "../../components/Headline";
import PreferenceList from "../../components/PreferenceList";
import FilterForm from "../../components/FilterForm";
import Login from "../../components/Login";
import { useSession } from "next-auth/react";
import { StyledTitle } from "../../components/Title/StyledTitle";
import Head from "next/head";
import { Plant } from "../../types/plant";
import { Preference } from "../../types/preference";

interface PreferencesPageProps {
  plants: Plant[];
  preferences: Preference[];
  handleAddPreference: (NewPreference: Preference) => void;
  handleDeletePreference: (id: string | undefined ) => void;
}

export default function PreferencesPage({
  plants,
  preferences,
  handleAddPreference,
  handleDeletePreference,
}: PreferencesPageProps) {
  const { status } = useSession();

  return (
    <>
      <Head>
        <title>Add Preferences</title>
      </Head>
      <Headline />
      <main>
        <StyledTitle>Add your Plant Preferences</StyledTitle>
        {status !== "authenticated" ? (
          <Login />
        ) : (
          <>
            <FilterForm plants={plants} onAddPreference={handleAddPreference} />
            <PreferenceList
              preferences={preferences}
              handleDeletePreference={handleDeletePreference}
            />
          </>
        )}
      </main>
    </>
  );
}
