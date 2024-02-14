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
import { newPreference } from "../types/newPreference";
import { Preference } from "../types/preference";

interface AppProps {
  Component: React.ComponentType<any>;
  pageProps: any;
}

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const [theme, setTheme] = useLocalStorageState<string>("theme", {
    defaultValue: "light",
  });

  function toggleTheme() {
    theme === "light" ? setTheme("dark") : setTheme("light");
  }

  const [favorites, setFavorites] = useLocalStorageState<string[]>("favorites", {
    defaultValue: [],
  });

  const [preferences, setPreferences] = useLocalStorageState<{ id: string }[]>("preferences", {defaultValue: []});


  const [entries, setEntries] = useLocalStorageState<{id: string}[]>("entries", {
    defaultValue: [],
  });

  function handleToggleFavorite(plantId: string) {
    setFavorites((prevFavorites) =>
    prevFavorites.includes(plantId)
      ? prevFavorites.filter((favorite) => favorite !== plantId)
      : [...prevFavorites, plantId]
  );
  }

  function handleAddPreference(newPreference: newPreference) {
    setPreferences((prevPreferences) => [...prevPreferences, { id: uid(), ...newPreference }]);
  }
  

  function handleEditPreference(editedPreference: Preference) {
    setPreferences((prevPreferences) =>
      prevPreferences.map((preference) =>
        preference.id === editedPreference.id ? editedPreference : preference
      )
    );
  }

  function handleDeletePreference(id: string) {
    setPreferences((prevPreferences) => prevPreferences.filter((preference) => preference.id !== id));
  }

  function handleDeleteEntry(id: string) {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  }

  const { data: plants, error: plantsError } = useSWR("/api/plants", fetcher);
  const { data: categories, error: categoriesError } = useSWR("/api/categories", fetcher);

    if (plantsError || categoriesError)
      return <div>Error occurred while fetching data</div>;
    if (!plants || !categories) return <div>Loading...</div>;

    function handleFormSubmit(data: any ) {
      const newEntry = { id: uid(), ...data };
      setEntries((prevFormEntry) => [...prevFormEntry, newEntry]);
    }
    
    function handleEditEntry(editedEntry: { id: string }) {
      setEntries((prevEntries) =>
        prevEntries.map((entry) => (entry.id === editedEntry.id ? editedEntry : entry))
      );
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
