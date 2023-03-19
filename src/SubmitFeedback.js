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

const SubmitFeedback = () => {
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
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const PatchRequest = (selectedvalues) => {
    setPageData({});
    axios
      .patch(
        `${baseUrl}/${feedbackId}`,
        {
          key: pageData?.key,
          value: selectedvalues?.toString(),
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

  const handleSubmit = (selectedValue, next) => {
    setFeedbackData((prevData) => {
      return {
        ...prevData,
        [`page${currentPage}`]: selectedValue,
      };
    });
    PatchRequest(selectedValue);
    next ? setCurrentpage(currentPage + 1) : setCurrentpage(currentPage - 1);
  };

  const handleConfirmation = (label) => {
    if (label?.toLowerCase() === "yes") {
      PatchRequest(label);
    } else {
      setCardType("submit");
    }
  };

  const handleFormSubmit = (formData) => {
    PatchRequest("Anil pradhan,1234567890");
  };

  return (
    <>
      {cardType === "card" && (
        <HomeCard handleSubmit={handleSubmit} pageData={pageData} />
      )}
      {cardType === "list" && (
        <MultiSelectOption
          handleSubmit={handleSubmit}
          pageData={pageData}
          path="/voc/feedback"
        />
      )}
      {cardType === "address" && (
        <>
          <HomeCard handleSubmit={handleConfirmation} pageData={pageData} />
        </>
      )}
      {cardType === "text" && (
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
                history.push("./voc/feedback");
              }}
            >
              Prev question
            </button>
            <button
              className="btnNext"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                PatchRequest("");
              }}
            >
              Next question
            </button>
          </CardActions>
        </>
      )}
      {cardType === "form" && (
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
      )}
      {cardType === "submit" && (
        <>
          <Typography variant="h5" sx={{ mt: 3 }}>
            Thank You for Your Feedback
          </Typography>
        </>
      )}
    </>
  );
};

export default SubmitFeedback;
