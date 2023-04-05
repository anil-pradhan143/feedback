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
import ThanksForFeedback from "./assets/thanks.png";
import { FieldMapper } from "./common-component";
import { useForm } from "react-hook-form";
import "./App.css";

const CtTaxiNumber = styled(Box)(() => ({
  color: "#2D1F7A",
  opacity: "66%",
  fontSize: "11px",
  lineHeight: "14px",
}));

const Feedback = () => {
  //state variables
  const history = useHistory();
  const { search } = useLocation();
  const [cardType, setCardType] = useState(null);
  const {
    register,
    setError,
    formState: { errors, isValid },
    handleSubmit,
    clearErrors,
    control,
  } = useForm({ mode: "onChange" });

  //context variables
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
      .catch((err) => {
        console.log("err", err);
      });
  };
  //this function handles the card type of the compenent to be rendered
  const CardType = (responseData) => {
    const responseDataKey = responseData?.key?.toLowerCase();
    if (responseDataKey === "contact") {
      setCardType("form");
    } else if (responseDataKey === "thankyou") {
      setCardType(responseDataKey);
    } else if (responseData?.useMultiSelect) {
      setCardType("list");
    } else if (responseData?.useFreeText) {
      setCardType("suggetion");
    } else {
      setCardType("card");
    }
  };

  // this function handles footer button logic
  const getFooterButtons = () => {
    let FooterButtons = [];
    if (cardType === "form") {
      FooterButtons.push("Submit");
    } else if (cardType === "thankyou") {
      FooterButtons.push("Go to CarsTaxi.ae");
    } else if (
      feedbackData?.[`page${currentPage}`]?.value ||
      cardType === "suggetion"
    ) {
      if (
        feedbackData?.[`page${currentPage}`]?.value?.toLowerCase() ===
          "others" &&
        !feedbackData?.[`page${currentPage}`]?.extraParams
      ) {
        FooterButtons.push("Prev");
      } else {
        FooterButtons.push("Next");
      }
    } else {
      FooterButtons.push("Prev");
    }
    return FooterButtons;
  };
  //this function maintain the checkbox state as checked or unchecked state
  const getCheckBoxState = (optionData) => {
    if (feedbackData[`page${currentPage}`]?.value) {
      const splittedArray = feedbackData[`page${currentPage}`].value.split(",");
      let isIndexMatch = false;
      for (let i = 0; i < splittedArray?.length; i++) {
        if (splittedArray[i] === optionData?.label) isIndexMatch = true;
      }
      return isIndexMatch;
    } else {
      return false;
    }
  };
  // this is the form chnage handler
  const formOnChangeHandler = (name, value = "") => {
    setFeedbackData((prevData) => {
      return {
        ...prevData,
        [`page${currentPage}`]: {
          ...prevData?.[`page${currentPage}`],
          key: pageData?.key,
          [name]: value,
        },
      };
    });
  };
  //this function handles form submit data
  const onFormSubmitHandler = (data) => {
    if (isValid) {
      handleNext(feedbackData?.[`page${currentPage}`]);
    }
  };
  //this function handles next page count and state
  const handleNext = (currentPageData) => {
    setCurrentpage(currentPage + 1);
    PatchRequest(currentPageData);
  };
  //this function handles prev page count and state
  const handlePrev = () => {
    if (currentPage <= 2) {
      GetRequest();
    } else {
      PatchRequest(feedbackData?.[`page${currentPage - 2}`]);
    }
    setCurrentpage(currentPage - 1);
  };
  //this function handles button click events
  const handleClick = (clickEvent) => {
    if (cardType === "thankyou") {
      window.open(pageData?.redirect, "_self");
    } else if (clickEvent?.target?.textContent?.toLowerCase() === "prev") {
      handlePrev();
    } else if (cardType === "suggetion") {
      const currentPageData = {
        key: pageData?.key,
        value: feedbackData?.[`page${currentPage}`]?.value ?? "",
      };
      setFeedbackData((prevData) => {
        return {
          ...prevData,
          [`page${currentPage}`]: currentPageData,
        };
      });
      handleNext(currentPageData);
    } else if (cardType === "form") {
      handleSubmit(onFormSubmitHandler)();
    } else {
      handleNext(feedbackData?.[`page${currentPage}`]);
    }
  };
  //this function handles suggestion box data.by pass to next page if not entered any value
  const handleSuggetion = (suggestionEvent) => {
    const currentPageData = {
      key: pageData?.key,
      value: suggestionEvent?.target?.value ?? "",
    };
    setFeedbackData((prevData) => {
      return {
        ...prevData,
        [`page${currentPage}`]: currentPageData,
      };
    });
  };
  //this function return page component as per card type
  const PageComponent = () => {
    let pageItemList = pageData?.options;
    if (cardType === "list" && pageItemList?.length > 0) {
      for (let i = 0; i < pageItemList?.length; i++) {
        pageItemList[i].checked = getCheckBoxState(pageItemList[i]);
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
              options: pageItemList,
              label: pageData?.label,
              key: pageData?.key,
            }}
            selectedItemList={
              feedbackData[`page${currentPage}`]?.value
                ? feedbackData[`page${currentPage}`]?.value.split(",")
                : []
            }
          />
        ) : null;
      case "suggetion":
        return (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "georgia",
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
                  value={feedbackData?.[`page${currentPage}`]?.value ?? ""}
                  fullWidth
                  onChange={handleSuggetion}
                />
              </Box>
            )}
          </Box>
        );
      case "form":
        const { options, useOptionForm } = pageData || [];
        return (
          <form>
            <Grid sx={{ flexGrow: 1, mt: 2 }} container spacing={2}>
              <Grid item xs={12}>
                <Typography className="subTitleTextStyle">
                  {pageData?.label}
                </Typography>
                <FieldMapper
                  fieldsFormData={feedbackData}
                  currentPage={currentPage}
                  mandatoryArrayIndex={useOptionForm}
                  fieldSet={options}
                  defaultValues={formValues}
                  register={register}
                  setError={setError}
                  onChange={formOnChangeHandler}
                  clearErrors={clearErrors}
                  errors={errors}
                  control={control}
                />
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
                fontFamily: "georgia",
                color: "#2D1F7A",
                fontSize: "22px",
                fontWeight: 400,
                opacity: "70%",
                padding: "10%",
              }}
            >
              {pageData?.label}
            </Typography>
            <Box sx={{ pb: "50px" }}>
              <img src={ThanksForFeedback} alt="Car Taxi" loading="lazy" />
            </Box>
          </Box>
        );
      default:
        return pageData?.options?.length > 0 ? (
          <MultiSelectCardList
            handleNext={handleNext}
            handlePrev={handlePrev}
            pageData={{
              options: pageItemList,
              label: pageData?.label,
              key: pageData?.key,
            }}
            selectedItemList={
              feedbackData[`page${currentPage}`]?.value
                ? feedbackData[`page${currentPage}`]?.value.split(",")
                : []
            }
          />
        ) : null;
    }
  };

  return (
    <Box
      className="container"
      sx={{ display: "flex", flexDirection: "column", height: "800px" }}
    >
      <Box className="header" sx={currentPage === 1 ? {} : { pb: "50px" }}>
        <img src={CarTaxi} alt="Car Taxi" loading="lazy" />
      </Box>

      {currentPage === 2 && (
        <Box>
          <Typography
            sx={{
              fontFamily: "Raleway",
              color: "#2D1F7A",
              fontSize: "14px",
              fontWeight: 600,
              opacity: "70%",
              mb: 4,
            }}
          >
            {pageData?.message}
          </Typography>
        </Box>
      )}

      <Box className="component" sx={{ flex: 1 }}>
        {PageComponent()}
      </Box>
      <Box className="footer">
        {currentPage !== 1 && getFooterButtons().length > 0 && (
          <Box>
            {getFooterButtons().map((button, index) => {
              const currrentButton = button?.toLowerCase();
              return currrentButton === "submit" ? (
                <Paper
                  key={index}
                  elevation={2}
                  id={button}
                  type={"submit"}
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
                    cursor: "pointer",
                  }}
                  onClick={(clickEvent) => {
                    clickEvent.preventDefault();
                    handleClick(clickEvent);
                  }}
                >
                  <Typography
                    sx={{
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
              ) : (
                <Box sx={{ display: "flex", p: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexGrow: 0,
                      textAlign: "center",
                    }}
                    onClick={(clickEvent) => {
                      clickEvent.preventDefault();
                      handleClick(clickEvent);
                    }}
                  >
                    <i
                      className="arrow left"
                      style={{
                        border: "solid #D6D3E9",
                        borderWidth: "0px 3px 3px 0px",
                      }}
                    ></i>
                    <Typography
                      sx={{
                        paddingLeft: "10px",
                        fontSize: "14px",
                        fontWeight: 800,
                        fontFamily: "Raleway",
                        color: "#D6D3E9",
                      }}
                    >
                      Prev
                    </Typography>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexGrow: 8,
                      textAlign: "center",
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexGrow: 0,
                      textAlign: "center",
                    }}
                    onClick={(clickEvent) => {
                      clickEvent.preventDefault();
                      currrentButton === "next" && handleClick(clickEvent);
                    }}
                  >
                    <Typography
                      sx={{
                        paddingRight: "10px",
                        fontFamily: "Raleway",
                        fontSize: "14px",
                        fontWeight: 800,
                        color:
                          currrentButton === "next" ? "#34248F" : "#D6D3E9",
                      }}
                    >
                      Next
                    </Typography>
                    <i
                      className="arrow right"
                      style={{
                        borderColor:
                          currrentButton === "next" ? "#34248F" : "#D6D3E9",
                        borderStyle: "solid",
                        borderWidth: "0px 3px 3px 0px",
                      }}
                    ></i>
                  </div>
                </Box>
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
