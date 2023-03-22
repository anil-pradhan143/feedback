import React, { useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import MultiSelectOption from "./common-component/MultiSelectOption";
import { AppContext } from "./AppContext";
import HomeCard from "./common-component/Card";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import { useFormControl } from "@mui/material/FormControl";
import axios from "axios";
import { baseUrl } from "./Constants";

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
  const [suggetionBox, setSuggetionBox] = useState(
    feedbackData?.[`page${currentPage + 1}`]?.extraParams
  );
  const { error } = useFormControl() || {};

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

  const CardType = (responseData) => {
    let responseDataKey = responseData?.key?.toLowerCase();
    if (responseDataKey === "contact") {
      setCardType("form");
    } else if (responseDataKey === "thankyou") {
      setCardType(responseDataKey);
    } else if (responseData?.options !== undefined) {
      setCardType(
        responseData?.options[0]?.label?.includes(":card") ? "card" : "list"
      );
    } else if (responseDataKey === "8") {
      setCardType("address");
    } else {
      setCardType("text");
    }
  };

  const handleNext = (selectedValue, extraParams) => {
    let currentPageData = {
      key: pageData?.key,
      value: selectedValue.toString(),
      extraParams: extraParams,
    };
    setFeedbackData((prevData) => {
      return {
        ...prevData,
        [`page${currentPage + 1}`]: currentPageData,
      };
    });
    setCurrentpage(currentPage + 1);
    PatchRequest(currentPageData);
  };

  const handlePrev = () => {
    if (currentPage.toString() === "2") {
      GetRequest();
    } else {
      PatchRequest(feedbackData?.[`page${currentPage - 1}`]);
    }
    setCurrentpage(currentPage - 1);
  };

  const handleConfirmation = (label) => {
    handleNext(label);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (error) {
      alert("error");
      return false;
    }
    let selectedValues = Object.keys(formValues)
      .map((k) => formValues[k])
      .join(",");
    handleNext(selectedValues, formValues);
  };

  const getCheckBoxState = (optionData) => {
    if (feedbackData[`page${currentPage + 1}`]?.value) {
      let splittedArray =
        feedbackData[`page${currentPage + 1}`]?.value.split(",");
      let isIndexMatch = false;
      for (let i = 0; i < splittedArray?.length; i++) {
        if (splittedArray[i] === optionData?.label) isIndexMatch = true;
      }
      return isIndexMatch;
    } else {
      return false;
    }
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
          <MultiSelectOption
            handleNext={handleNext}
            handlePrev={handlePrev}
            pageData={{ options: newArr, label: pageData?.label }}
          />
        ) : null;
      case "address":
        return (
          <HomeCard handleSubmit={handleConfirmation} pageData={pageData} />
        );
      case "text":
        return (
          <>
            <Typography variant="h5" sx={{ mt: 3 }}>
              {pageData?.label}
            </Typography>
            {pageData?.useFreeText && (
              <Box sx={{ m: 2 }}>
                <TextField
                  id="useFreeTextbox"
                  label=""
                  multiline
                  rows={4}
                  value={suggetionBox}
                  fullWidth
                  onChange={(event) => {
                    setSuggetionBox(event.target.value);
                  }}
                />
              </Box>
            )}
            <CardActions sx={{ justifyContent: "center" }}>
              <button
                className="btnPrev"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handlePrev();
                }}
              >
                Prev
              </button>
              <button
                className="btnNext"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleNext(pageData?.key, suggetionBox);
                }}
              >
                Next
              </button>
            </CardActions>
          </>
        );
      case "form":
        return (
          <>
            <form>
              <Grid sx={{ flexGrow: 1, mt: 2 }} container spacing={2}>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" spacing={2}>
                    {pageData?.options?.map((items, index) => (
                      <Grid key={items?.label} item xs={12}>
                        <TextField
                          id={items?.value}
                          label={items?.label}
                          value={formValues[items?.value] ?? ""}
                          required={
                            pageData?.useOptionForm[index] >= 0 ? true : false
                          }
                          onBlur={(event) => {
                            formValues[items.value] = event.target.value;
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <CardActions sx={{ justifyContent: "center" }}>
                <button
                  className="btnSubmit"
                  type="submit"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  SUBMIT
                </button>
              </CardActions>
            </form>
          </>
        );
      case "thankyou":
        return (
          <>
            <Typography variant="h5" sx={{ mt: 3 }}>
              {pageData?.label}
            </Typography>
          </>
        );
      default:
        return <HomeCard handleSubmit={handleNext} pageData={pageData} />;
    }
  };

  return PageComponent();
};

export default Feedback;
