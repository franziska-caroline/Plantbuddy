import Layout from "../components/Layout";
import GlobalStyle from "../styles";
import useLocalStorageState from "use-local-storage-state";
import { uid } from "uid";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../components/Theme";
import { SWRConfig } from "swr";
import fetcher from "../utils/fetcher";
import useSWR from "swr";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Preference } from "../types/preference";
import { Entry } from "../types/entry";

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const [theme, setTheme] = useLocalStorageState<string>("theme", {
    defaultValue: "light",
  });

  function toggleTheme(): void {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  const [favorites, setFavorites] = useLocalStorageState<string[]>(
    "favorites",
    {
      defaultValue: [],
    }
  );

  const [preferences, setPreferences] = useLocalStorageState<Preference[]>(
    "preferences",
    {
      defaultValue: [],
    }
  );

  // const [entries, setEntries] = useLocalStorageState<Entry[]>("entries", {
  //   defaultValue: [],
  // });

  function handleToggleFavorite(plantId: string) {
    if (favorites.includes(plantId)) {
      setFavorites(favorites?.filter((favorite) => favorite !== plantId));
    } else {
      setFavorites([...favorites, plantId]);
    }
  }

  function handleAddPreference(newPreference: Omit<Preference, "id">) {
    const newId = uid();
    const newPrefWithId: Preference = {
      ...newPreference,
      id: newId
    };
    const updatedPreferences = [...preferences, newPrefWithId];
    setPreferences(updatedPreferences);
  }

  function handleEditPreference(editedPreference: Preference) {
    setPreferences(
      preferences.map((preference) =>
        preference.id === editedPreference.id ? editedPreference : preference
      )
    );
  }

  function handleDeletePreference(id: string | undefined ) {
    setPreferences(preferences.filter((preference) => preference.id !== id));
  }

  // Fetch Data
  const { data: plants, error: plantsError } = useSWR("/api/plants", fetcher);
  const { data: categories, error: categoriesError } = useSWR(
    "/api/categories",
    fetcher
  );
    const { data: entries, error: entriesError } = useSWR("/api/entries", fetcher);


  if (plantsError || categoriesError || entriesError)
    return <div>Error occurred while fetching data</div>;
  if (!plants || !categories ) return <div>Loading...</div>;

  function handleFormSubmit(data: Omit<Entry, "id">) {
    const newEntryId = uid();
    const newEntryWithId: Entry = {...data, id: newEntryId };
    const updatedEntry = [...entries, newEntryWithId];
    setEntries(updatedEntry);
  }

  function handleEditEntry(editedEntry: Entry) {
    setEntries(
      entries.map((entry) =>
        entry.id === editedEntry.id ? editedEntry : entry
      )
    );
  }

  function handleDeleteEntry(id: string) {
    setEntries(entries.filter((entry) => entry.id !== id));
  }

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <SWRConfig value={{ fetcher }}>
            <Layout theme={theme}>
              <GlobalStyle />
              <Component
                {...pageProps}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                plants={plants}
                categories={categories}
                preferences={preferences}
                handleAddPreference={handleAddPreference}
                handleDeletePreference={handleDeletePreference}
                onEditPreference={handleEditPreference}
                theme={theme}
                toggleTheme={toggleTheme}
                onFormSubmit={handleFormSubmit}
                entries={entries}
                handleDeleteEntry={handleDeleteEntry}
                onEditEntry={handleEditEntry}
              />
            </Layout>
          </SWRConfig>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
