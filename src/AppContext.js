import React, { useState, createContext } from "react";
export const AppContext = createContext();

export const AppProvider = (props) => {
  const [selectedKeys, setSelectedKeys] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const [feedbackId, setFeedbackId] = useState("");
  const [cardType, setCardType] = useState("");
  const [currentPage, setCurrentpage] = useState(8);
  const [pageData, setPageData] = useState({});
  const [feedbackData, setFeedbackData] = useState({});
  const [footerButtons, setFooterButtons] = useState(["Prev", "Next"]);

  return (
    <>
      <AppContext.Provider
        value={{
          selectedKeys,
          setSelectedKeys,
          pageData,
          setPageData,
          feedbackId,
          setFeedbackId,
          selectedItems,
          setSelectedItems,
          cardType,
          setCardType,
          feedbackData,
          setFeedbackData,
          currentPage,
          setCurrentpage,
          footerButtons,
          setFooterButtons,
        }}
      >
        {props.children}
      </AppContext.Provider>
    </>
  );
};
