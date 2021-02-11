import "@shopify/polaris/dist/styles.css";
import "../styles/globals.css";
import {
  AppProvider,
  FormLayout,
  Frame,
  Modal,
  Navigation,
  TextField,
  TopBar,
} from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import {
  CircleInformationMajor,
  ListMajor,
  MonerisMajor,
} from "@shopify/polaris-icons";
import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const skipToContentRef = useRef(null);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const handleSubjectChange = useCallback(
    (value) => setSupportSubject(value),
    []
  );
  const handleMessageChange = useCallback(
    (value) => setSupportMessage(value),
    []
  );
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );
  const toggleModalActive = useCallback(
    () => setModalActive((modalActive) => !modalActive),
    []
  );
  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      // userMenu={userMenuMarkup}
      // searchField={searchFieldMarkup}
      // searchResults={searchResultsMarkup}
      // onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const modalMarkup = (
    <Modal
      open={modalActive}
      onClose={toggleModalActive}
      title="Contact support"
      primaryAction={{
        content: "Send",
        onAction: toggleModalActive,
      }}
    >
      <Modal.Section>
        <FormLayout>
          <TextField
            label="Subject"
            value={supportSubject}
            onChange={handleSubjectChange}
          />
          <TextField
            label="Message"
            value={supportMessage}
            onChange={handleMessageChange}
            multiline
          />
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
  const router = useRouter();
  const navigationMarkup = (
    <Navigation location={router.pathname}>
      <Navigation.Section
        // separator
        title="Crypto Rationale"
        items={[
          {
            label: "Summary",
            icon: ListMajor,
            url: "/",
            exactMatch: true,
          },
          {
            label: "Fee Calculator",
            icon: MonerisMajor,
            url: "/calculator",
            exactMatch: true,
          },
          {
            label: "About",
            icon: CircleInformationMajor,
            url: "/about",
            exactMatch: true,
          },
        ]}
        // action={{
        //   icon: ConversationMinor,
        //   accessibilityLabel: "Contact support",
        //   onClick: toggleModalActive,
        // }}
      />
    </Navigation>
  );

  const theme = {
    logo: {
      width: 200,
      topBarSource: "/logo.svg",
      contextualSaveBarSource: "/logo.svg",
      url: "https://cryptorationale.com",
      accessibilityLabel: "Crypto Rationale",
    },
  };

  return (
    <AppProvider i18n={enTranslations} theme={theme}>
      <Frame
        topBar={topBarMarkup}
        navigation={navigationMarkup}
        showMobileNavigation={mobileNavigationActive}
        onNavigationDismiss={toggleMobileNavigationActive}
        skipToContentTarget={skipToContentRef.current}
      >
        <Component {...pageProps} />
      </Frame>
    </AppProvider>
  );
}

export default MyApp;
