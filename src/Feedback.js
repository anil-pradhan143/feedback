import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import MultiSelectCardList from "./common-component/MultiSelectCardList";
import { AppContext } from "./AppContext";
import HomeCard from "./common-component/CardList";
import { Grid, CircularProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import axios from "axios";
import { baseUrl } from "./Constants";
import CarTaxi from "./assets/Car-Taxi.png";
import ThanksForFeedback from "./assets/thanks.png";
import { FieldMapper } from "./common-component";
import { useForm } from "react-hook-form";
import { styled } from "@mui/material/styles";
import TriggersTooltips from "./common-component/ToolTip";
import "./App.css";

const StyledCard = styled(Box)(() => ({
  outline: "0px",
  textAlign: "center",
  overflow: "auto",
  margin: "auto",
  border: 0,
}));

const StyledFooter = styled(Box)(() => ({
  outline: "0px",
  textAlign: "center",
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "#F0F5FA",
  height: "56px",
}));

const Feedback = () => {
  //state variables
  const history = useHistory();
  const { search } = useLocation();
  const [cardType, setCardType] = useState(null);
  const [loader, setLoader] = useState(false);
  const {
    register,
    setError,
    formState: { errors, isValid },
    handleSubmit,
    clearErrors,
    setValue,
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
  let footerFullButtons = ["submit", "previous", "go to carstaxi.ae"];
  useEffect(() => {
    setPageData({});
    if (currentPage < 2) {
      GetRequest();
    } else {
      PatchRequest(selectedKeys);
    }
  }, []);

  const GetRequest = () => {
    setLoader(true);
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
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(false);
      });
  };

  const PatchRequest = (reqData) => {
    setLoader(true);
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
        setLoader(false);
      })
      .catch((err) => {
        console.log("err", err);
        setLoader(false);
      });
  };
  //this function handles the card type of the compenent to be rendered
  const CardType = (responseData) => {
    const responseDataKey = responseData?.key?.toLowerCase();
    if (responseDataKey === "contact") {
      setCardType("form");
    } else if (responseDataKey === "thankyou") {
      setCardType(responseDataKey.toLowerCase());
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
      pageData?.redirect !== "end"
        ? FooterButtons.push("Go to CarsTaxi.ae")
        : (FooterButtons = []);
    } else if (pageData?.key === "8") {
      FooterButtons.push("Prev");
    } else if (
      feedbackData?.[`page${currentPage}`]?.value ||
      cardType === "suggetion"
    ) {
      if (
        feedbackData?.[`page${currentPage}`]?.value === "Others" &&
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
          value: {
            ...prevData?.[`page${currentPage}`]?.value,
            [name]: value,
          },
        },
      };
    });
  };
  //this function handles form submit data
  const onFormSubmitHandler = () => {
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
    let currenttext = clickEvent?.currentTarget?.id?.toLowerCase();
    if (cardType === "thankyou") {
      window.open(pageData?.redirect, "_self");
    } else if (currenttext === "prev" || currenttext === "previous") {
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
      handleSubmit(onFormSubmitHandler)(); //NEED THIS LINE TO SHOW ERROR ON BLANK FORM
      // onFormSubmitHandler();
    } else {
      handleNext(feedbackData?.[`page${currentPage}`]);
    }
  };
  //this function handles suggestion box data.by pass to next page if not entered any value
  const handleSuggetion = (suggestionEvent) => {
    const val = suggestionEvent.target.value || "";
    const scriptFilteredValue = val.replace("<script", "O_o");
    const currentPageData = {
      key: pageData?.key,
      value: scriptFilteredValue,
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

    switch (cardType) {
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
                  color: "#1F4D7A",
                  textDecoration: "none",
                  textTransform: "capitalize",
                }}
              >
                {pageData?.label}
              </Typography>
            </Box>
            {pageData?.useFreeText && (
              <Box sx={{ border: "1px solid #0555A4", borderRadius: "10px" }}>
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
            <Grid sx={{ flexGrow: 1 }}>
              <Grid item xs={12} sx={{ p: 1 }}>
                <Typography
                  className="subTitleTextStyle"
                  sx={{ color: "#0555A4", fontWeight: "600" }}
                >
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
                  setValue={setValue}
                />
              </Grid>
            </Grid>
          </form>
        );
      case "thankyou":
        return (
          <Box
            sx={{
              mt: "20%",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Caudex",
                color: "#1F4D7A",
                fontSize: "24px",
                fontWeight: 400,
                lineHeight: "31px",
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

  const StyledHeader = (fullWidth) => ({
    outline: "0px",
    textAlign: "center",
    padding: "24px",
    boxShadow: "5px 5px 5px 2px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    maxWidth: "600px",
    position: "absolute",
    top: "24px",
    left: "24px",
    right: "24px",
    bottom: fullWidth ? "24px" : "80px",
    background: "#fff",
    overflow: "auto",
    height: "auto",
  });

  return (
    <StyledCard variant="outlined" className="root">
      <Box
        sx={StyledHeader(
          currentPage === 1 || cardType === "thankyou" ? true : false
        )}
      >
        <Box className="header">
          <img src={CarTaxi} alt="Car Taxi" loading="lazy" />
        </Box>

        {currentPage === 2 && (
          <Box>
            <Typography
              sx={{
                fontFamily: "Raleway",
                color: "#737373",
                fontSize: "14px",
                fontWeight: 600,
                opacity: "70%",
                mt: 3,
              }}
            >
              {pageData?.message}
            </Typography>
          </Box>
        )}

        {loader ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "70%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box className="component" sx={{ flex: 1, pb: 3, pt: 3 }}>
            {PageComponent()}
          </Box>
        )}
        {currentPage === 1 && (
          <Box sx={{ position: "absolute", bottom: "0px", right: "20px" }}>
            <TriggersTooltips msg={pageData?.ctNum} />
          </Box>
        )}
      </Box>

      {currentPage !== 1 && getFooterButtons().length > 0 && (
        <StyledFooter>
          {loader ? null : (
            <Box sx={{ marginTop: "20px" }}>
              {getFooterButtons().map((button, index) => {
                const currrentButton = button?.toLowerCase();
                return footerFullButtons.includes(currrentButton) ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 0,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        onClick={(clickEvent) => {
                          clickEvent.preventDefault();
                          handleClick(clickEvent);
                        }}
                        id={button}
                        style={{ display: "flex" }}
                      >
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 800,
                            lineHeight: "16px",
                            color: "#0555A4",
                            textDecoration: "none",
                            textTransform: "none",
                            cursor: "pointer",
                          }}
                        >
                          {button}
                        </Typography>
                      </span>
                    </div>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", padding: "0px 30px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexGrow: 0,
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        onClick={(clickEvent) => {
                          clickEvent.preventDefault();
                          handleClick(clickEvent);
                        }}
                        id="prev"
                        style={{ display: "flex" }}
                      >
                        <i
                          className="arrow left"
                          style={{
                            border: "solid #0555A4",
                            borderWidth: "0px 3px 3px 0px",
                          }}
                        />
                        <Typography
                          sx={{
                            paddingLeft: "10px",
                            fontSize: "14px",
                            fontWeight: 800,
                            fontFamily: "Raleway",
                            color: "#0555A4",
                            lineHeight: "normal",
                          }}
                        >
                          Prev
                        </Typography>
                      </span>
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
                        cursor: "pointer",
                      }}
                    >
                      <span
                        onClick={(clickEvent) => {
                          clickEvent.preventDefault();
                          currrentButton === "next" && handleClick(clickEvent);
                        }}
                        id="next"
                        style={{ display: "flex" }}
                      >
                        <Typography
                          sx={{
                            paddingRight: "10px",
                            fontFamily: "Raleway",
                            fontSize: "14px",
                            fontWeight: 800,
                            lineHeight: "normal",
                            color:
                              currrentButton === "next" ? "#0555A4" : "#BFBFBF",
                          }}
                        >
                          Next
                        </Typography>
                        <i
                          className="arrow right"
                          style={{
                            borderColor:
                              currrentButton === "next" ? "#0555A4" : "#BFBFBF",
                            borderStyle: "solid",
                            borderWidth: "0px 3px 3px 0px",
                          }}
                        />
                      </span>
                    </div>
                  </Box>
                );
              })}
            </Box>
          )}
        </StyledFooter>
      )}
    </StyledCard>
  );
};

export default Feedback;
