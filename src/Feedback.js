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
        setPageData(data?.data);
        CardType(data?.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const CardType = (responseData) => {
    if (responseData?.key === "contact") {
      setCardType("form");
    } else if (responseData?.key === "submit") {
      setCardType("submit");
    } else if (responseData?.options !== undefined) {
      setCardType(
        responseData?.options[0]?.label?.includes(":card") ? "card" : "list"
      );
    } else if (responseData?.key === "8") {
      setCardType("address");
    } else {
      setCardType("text");
    }
  };

  const handleNext = (selectedValue) => {
    console.log("feedback Data ==> ", feedbackData);
    let currentPageData = {
      key: pageData?.key,
      value: selectedValue.toString(),
    };
    setFeedbackData((prevData) => {
      return {
        ...prevData,
        [`page${currentPage + 1}`]: currentPageData,
      };
    });
    PatchRequest(currentPageData);
    setCurrentpage(currentPage + 1);
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

  const handleFormSubmit = (formData) => {
    handleNext("Anil pradhan,1234567890");
  };

  const PageComponent = () => {
    let newArr = pageData?.options;
    if (cardType === "list" && pageData?.options?.length > 0) {
      for (let i = 0; i < pageData?.options.length; i++) {
        newArr[i].checked = false;
      }
      console.log("feedback", newArr);
    }

    switch (cardType) {
      case "card":
        return <HomeCard handleSubmit={handleNext} pageData={pageData} />;
      case "list":
        return (
          <MultiSelectOption
            handleNext={handleNext}
            handlePrev={handlePrev}
            pageData={{ options: newArr, label: pageData?.label }}
          />
        );
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
                  id="outlined-multiline-static"
                  label=""
                  multiline
                  rows={4}
                  defaultValue=""
                  fullWidth
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
                  handleNext(pageData?.key, "");
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
                          required={
                            pageData?.useOptionForm[index] >= 0 ? true : false
                          }
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
                    e.preventDefault();
                    handleFormSubmit(e);
                  }}
                >
                  Submit
                </button>
              </CardActions>
            </form>
          </>
        );
      case "submit":
        return (
          <>
            <Typography variant="h5" sx={{ mt: 3 }}>
              Thank You for Your Feedback
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
