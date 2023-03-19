import React, { useState, createContext } from "react";
export const AppContext = createContext();

export const AppProvider = (props) => {
  const [selectedKeys, setSelectedKeys] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const [feedbackId, setFeedbackId] = useState("");
  const [cardType, setCardType] = useState("");
  const [currentPage, setCurrentpage] = useState(1);
  const [pageData, setPageData] = useState({});
  const [feedbackData, setFeedbackData] = useState({});

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
        }}
      >
        {props.children}
      </AppContext.Provider>
    </>
  );
};
