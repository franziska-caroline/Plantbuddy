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
import React, { useEffect, useState } from "react";
import { Preference } from "../types/preference";
import { Entry } from "../types/entry";
import { useRouter } from "next/router";

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  // Fetch Data
  const { data: plants, error: plantsError } = useSWR("/api/plants", fetcher);
  const { data: categories, error: categoriesError } = useSWR(
    "/api/categories",
    fetcher
  );
  const {
    data: entriesData,
    error: entriesError,
    mutate: mutateEntries,
  } = useSWR("/api/entries/", fetcher);

  const { id } = router.query;

  const [theme, setTheme] = useLocalStorageState<string>("theme", {
    defaultValue: "light",
  });

  function toggleTheme(): void {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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

  const [entries, setEntries] = useState<Entry[]>([]);

  React.useEffect(() => {
    if (entriesData) {
      setEntries(entriesData);
    }
  }, [entriesData]);

  // Entries
  async function fetchEntries() {
    try {
      const response = await fetch("/api/entries");
      if (response.ok) {
        const entriesData = await response.json();
        setEntries(entriesData);
      } else {
        throw new Error("Failed to fetch entries");
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  async function handleFormSubmit(data: Entry) {
    const response = await fetch("/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      router.push("/journal");
      mutateEntries();
      console.log("Eintrag erfolgreich hinzugefügt");
    } else {
      console.error("Fehler beim Hinzufügen des Eintrags");
    }
  }

  async function handleEditEntry(editedEntry: Entry) {
    const response = await fetch(`/api/entries/${editedEntry._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedEntry),
    });
    if (response.ok) {
      router.push("/journal");
      mutateEntries();
      console.log("Eintrag erfolgreich bearbeitet");
    } else {
      console.error("Fehler beim Bearbeiten des Eintrags");
    }
    setEntries(entries.filter((entry) => entry._id !== editedEntry._id));
  }

  async function handleDeleteEntry(_id: string) {
    await fetch(`/api/entries/${_id}`, {
      method: "DELETE",
    });
    setEntries(entries.filter((entry) => entry._id !== _id));
  }

  // Favorite
  function handleToggleFavorite(plantId: string) {
    if (favorites.includes(plantId)) {
      setFavorites(favorites?.filter((favorite) => favorite !== plantId));
    } else {
      setFavorites([...favorites, plantId]);
    }
  }

  // Preference
  function handleAddPreference(newPreference: Omit<Preference, "id">) {
    const newId = uid();
    const newPrefWithId: Preference = {
      ...newPreference,
      id: newId,
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

  function handleDeletePreference(id: string | undefined) {
    setPreferences(preferences.filter((preference) => preference.id !== id));
  }

  if (plantsError || categoriesError || entriesError)
    return <div>Error occurred while fetching data</div>;
  if (!plants || !categories) return <div>Loading...</div>;

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
