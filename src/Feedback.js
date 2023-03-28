import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import MultiSelectCardList from "./common-component/MultiSelectCardList";
import { AppContext } from "./AppContext";
import HomeCard from "./common-component/CardList";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import axios from "axios";
import { baseUrl } from "./Constants";
import CarTaxi from "./assets/cars-taxi.png";

const CtTaxiNumber = styled(Box)(() => ({
  color: "#2D1F7A",
  opacity: "66%",
  fontSize: "11px",
  lineHeight: "14px",
}));

const Feedback = () => {
  const history = useHistory();
  const { search } = useLocation();
  const {
    selectedKeys,
    pageData,
    setPageData,
    feedbackId,
    feedbackData,
    setFeedbackData,
    currentPage,
    setCurrentpage,
    setFeedbackId,
  } = useContext(AppContext);
  const [cardType, setCardType] = useState(null);

  let formValues = {};

  useEffect(() => {
    setPageData({});
    if (currentPage < 2) {
      GetRequest();
    } else {
      PatchRequest(selectedKeys);
    }
  }, []);

  const GetRequest = () => {
    axios
      .get(baseUrl + search)
      .then((data) => {
        if (data?.data === "Invalid or Expired QR code") {
          history.push("/404");
        } else {
          setFeedbackId(data?.data?.feedbackId);
          setPageData(data?.data);
          CardType(data?.data);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const PatchRequest = (reqData) => {
    setPageData({});
    axios
      .patch(
        `${baseUrl}/${feedbackId}`,
        {
          key: reqData?.key,
          value: reqData?.value,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Accept-Language": "EN",
          },
        }
      )
      .then((data) => {
        if (data?.data?.key?.toLowerCase() === "submit") {
          PatchRequest({ key: data?.data?.key, value: "" });
        } else {
          setPageData(data?.data);
          CardType(data?.data);
        }
      })
      .catch(() => {});
  };

  const CardType = (responseData) => {
    let responseDataKey = responseData?.key?.toLowerCase();
    if (responseDataKey === "contact") {
      setCardType("form");
    } else if (responseDataKey === "thankyou") {
      setCardType(responseDataKey);
    } else if (responseData?.useMultiSelect) {
      setCardType("list");
    } else if (responseDataKey === "8") {
      setCardType("address");
    } else if (responseData?.useFreeText) {
      setCardType("suggetion");
    } else {
      setCardType("card");
    }
  };

  const handleNext = (currentPageData) => {
    setCurrentpage(currentPage + 1);
    PatchRequest(currentPageData);
  };

  const getFooterButtons = () => {
    let FooterButtons = [];
    if (currentPage === 1 && !pageData?.useMultiSelect) {
      FooterButtons.push("Prev");
    } else if (cardType === "form") {
      FooterButtons.push("Submit");
    } else if (cardType === "thankyou") {
      FooterButtons.push("Go to CarsTaxi.ae");
    } else if (cardType === "card") {
    } else {
      FooterButtons.push("Prev");
      FooterButtons.push("Next");
    }
    return FooterButtons;
  };

  const handlePrev = () => {
    if (currentPage.toString() === "2") {
      GetRequest();
    } else {
      PatchRequest(feedbackData?.[`page${currentPage - 1}`]);
    }
    setCurrentpage(currentPage - 1);
  };

  const handleClick = (clickEvent) => {
    if (cardType === "thankyou") {
      window.open(pageData?.redirect, "_self");
    } else if (clickEvent?.target?.textContent === "Prev") {
      handlePrev();
    } else {
      handleNext(feedbackData?.[`page${currentPage}`]);
    }
  };

  const handleConfirmation = (label) => {
    handleNext(label);
  };

  const getCheckBoxState = (optionData) => {
    if (feedbackData[`page${currentPage}`]?.value) {
      let splittedArray = feedbackData[`page${currentPage}`]?.value.split(",");
      let isIndexMatch = false;
      for (let i = 0; i < splittedArray?.length; i++) {
        if (splittedArray[i] === optionData?.label) isIndexMatch = true;
      }
      return isIndexMatch;
    } else {
      return false;
    }
  };

  const handleSuggetion = (suggestionEvent) => {
    let currentPageData = {
      key: pageData?.key,
      value: suggestionEvent?.target?.value,
    };
    setFeedbackData((prevData) => {
      return {
        ...prevData,
        [`page${currentPage}`]: currentPageData,
      };
    });
  };

  const PageComponent = () => {
    let newArr = pageData?.options;
    if (cardType === "list" && newArr?.length > 0) {
      for (let i = 0; i < newArr?.length; i++) {
        newArr[i].checked = getCheckBoxState(newArr[i]);
      }
    }

    switch (cardType?.toLowerCase()) {
      case "card":
        return <HomeCard handleSubmit={handleNext} pageData={pageData} />;
      case "list":
        return pageData?.options?.length > 0 ? (
          <MultiSelectCardList
            handleNext={handleNext}
            handlePrev={handlePrev}
            pageData={{
              options: newArr,
              label: pageData?.label,
              key: pageData?.key,
            }}
          />
        ) : null;
      case "address":
        return (
          <HomeCard handleSubmit={handleConfirmation} pageData={pageData} />
        );
      case "suggetion":
        return (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "roboto",
                  fontSize: "20px",
                  lineHeight: "26px",
                  fontWeight: 400,
                  color: "rgba(45, 31, 122, 0.9)",
                  opacity: "70%",
                  textDecoration: "none",
                  textTransform: "capitalize",
                }}
              >
                {pageData?.label}
              </Typography>
            </Box>
            {pageData?.useFreeText && (
              <Box sx={{ border: "1px solid #362593", borderRadius: "10px" }}>
                <TextField
                  id="useFreeTextbox"
                  label=""
                  multiline
                  rows={4}
                  value={feedbackData?.[`page${currentPage}`]?.value}
                  fullWidth
                  onChange={(suggestionEvent) =>
                    handleSuggetion(suggestionEvent)
                  }
                />
              </Box>
            )}
          </Box>
        );
      case "form":
        return (
          <form>
            <Grid sx={{ flexGrow: 1, mt: 2 }} container spacing={2}>
              <Grid item xs={12}>
                <Typography
                  sx={{
                    color: "#2D1F7A",
                    fontSize: "14px",
                    fontWeight: 600,
                    opacity: "70%",
                  }}
                >
                  {pageData?.label}
                </Typography>
                <Grid container justifyContent="center" spacing={2}>
                  {pageData?.options?.map((items, index) => (
                    <Grid key={items?.label} item xs={12}>
                      <Typography sx={{ display: "flex", color: "#362593" }}>
                        {items?.label}
                        {pageData?.useOptionForm[index] !== index &&
                          " (optional)"}
                      </Typography>
                      <TextField
                        sx={{
                          border: "1px solid #2D1F7A",
                          borderRadius: "10px",
                        }}
                        id={items?.value}
                        label=""
                        value={
                          feedbackData?.[`page${currentPage}`]?.[
                            items?.value
                          ] ?? formValues[items?.value]
                        }
                        required={
                          pageData?.useOptionForm[index] >= 0 ? true : false
                        }
                        onChange={(event) => {
                          setFeedbackData((prevData) => {
                            return {
                              ...prevData,
                              [`page${currentPage}`]: {
                                ...prevData?.[`page${currentPage}`],
                                ["key"]: pageData?.key,
                                ["value"]: {
                                  ...prevData?.[`page${currentPage}`]?.value,
                                  [items?.value]: event?.target?.value,
                                },
                              },
                            };
                          });
                        }}
                        fullWidth
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </form>
        );
      case "thankyou":
        return (
          <Box
            sx={{
              mt: "50%",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "#2D1F7A",
                fontSize: "22px",
                fontWeight: 400,
                opacity: "70%",
                padding: "10%",
              }}
            >
              {pageData?.label}
            </Typography>
          </Box>
        );
      default:
        return pageData?.options?.length > 0 ? (
          <MultiSelectCardList
            handleNext={handleNext}
            handlePrev={handlePrev}
            pageData={{
              options: newArr,
              label: pageData?.label,
              key: pageData?.key,
            }}
          />
        ) : null;
    }
  };

  return (
    <Box
      className="container"
      sx={{ display: "flex", flexDirection: "column", height: "764px" }}
    >
      <Box className="header" sx={currentPage === 1 ? {} : { pb: "50px" }}>
        <img src={CarTaxi} alt="Car Taxi" loading="lazy" />
      </Box>
      <Box className="component" sx={{ flex: 1 }}>
        {PageComponent()}
      </Box>
      <Box className="footer">
        {currentPage === 2 && (
          <Box>
            <Typography
              sx={{
                color: "#2D1F7A",
                fontSize: "14px",
                fontWeight: 600,
                opacity: "70%",
                mb: "50px",
              }}
            >
              {pageData?.message}
            </Typography>
          </Box>
        )}
        {currentPage !== 1 && getFooterButtons().length > 0 && (
          <Box onClick={(clickEvent) => handleClick(clickEvent)}>
            {getFooterButtons().map((button) => {
              let currrentButton = button?.toLowerCase();
              return (
                <Paper
                  elevation={2}
                  id={button}
                  className="radioGroupItems"
                  sx={{
                    padding: "10px 20px",
                    font: "Raleway",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "16px",
                    gap: "10px",
                    minWidth: "80%",
                    background:
                      currrentButton === "prev" ? "#FFFFFF" : "#34248F",
                    border: "1px solid rgba(45, 31, 122, 0.66)",
                    borderRadius: "5px",
                    marginBottom: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "roboto",
                      fontSize: "14px",
                      fontWeight: 600,
                      lineHeight: "16px",
                      color: currrentButton === "prev" ? "#2D1F7A" : "#FFFFFF",
                      opacity: currrentButton === "prev" ? "70%" : "100%",
                      textDecoration: "none",
                      textTransform: "none",
                    }}
                  >
                    {button}
                  </Typography>
                </Paper>
              );
            })}
          </Box>
        )}
        {currentPage === 1 && (
          <CtTaxiNumber>
            <Typography>{pageData?.ctNum}</Typography>
          </CtTaxiNumber>
        )}
      </Box>
    </Box>
  );
};

export default Feedback;
