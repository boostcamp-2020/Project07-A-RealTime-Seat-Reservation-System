import { Box, CardMedia } from "@material-ui/core";
import { makeStyles, Theme, styled } from "@material-ui/core/styles";
import React, { useState, useEffect, PropsWithRef } from "react";
import { colors } from "../../styles/variables";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@material-ui/icons/PlayCircleFilledWhiteOutlined";
import { useQuery, gql } from "@apollo/client";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useLocation } from "react-router-dom";
import { Props } from "../../types/concertInfo";
import { Loading } from "../common";
interface Price {
  price: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  contents: {
    paddingBottom: "14px",
    padding: "0 20px 14px",
    borderBottom: `1px solid ${colors.borderLightGray}`,
    backgroundColor: `${colors.naverWhite}`,
  },
  contentsTop: {
    height: "100%",
  },
  titleArea: {
    paddingTop: "1rem",
    letterSpacing: "-1px",
  },
  title: {
    paddingTop: "5px",
    fontSize: "24px",
    lineHeight: "27px",
    color: `${colors.naverFontBlack}`,
    maxHeight: "54px",
  },
  price: {
    minHeight: "24px",
    paddingTop: "4px",
    fontSize: "21px",
    lineHeight: "24px",
    color: `${colors.naverRed}`,
  },
  infoArea: {
    paddingTop: "7px",
    fontSize: "15px",
    lineHeight: "23px",
    color: `${colors.naverFontSub}`,
  },
  infoIcon: {
    width: "0.9rem",
    height: "0.9rem",
    marginRight: "3px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
  },
  loading: {
    width: "100%",
    padding: "50px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Poster = styled(CardMedia)((props) => ({
  minHeight: "210px",
  backgroundSize: "cover",
  backgroundPosition: "50% 50%",
}));
export default function ContentsArea({ concertId }: Props) {
  const classes = useStyles();
  const location: any = useLocation();
  const [itemId, setItemId] = useState<any>("");
  const intl = new Intl.NumberFormat("ko-KR");

  const GET_ITEMS = gql`
    query ItemDetail($id: ID) {
      itemDetail(itemId: $id) {
        name
        startDate
        endDate
        prices {
          price
        }
        img
        runningTime
        ageLimit
      }
    }
  `;
  useEffect(() => {
    setItemId(concertId);
  }, []);

  const { loading, error, data } = useQuery(GET_ITEMS, {
    variables: { id: concertId },
  });

  if (loading)
    return (
      <Box className={classes.contents}>
        <Box className={classes.loading}>
          <Loading />
        </Box>
      </Box>
    );
  if (error) return <>`Error! ${error.message}`</>;
  const { name, startDate, endDate, prices, img, runningTime, ageLimit } = data.itemDetail;
  const pricesArr = prices.map((price: Price) => price.price);

  return (
    <>
      <Poster image={img}></Poster>
      <Box className={classes.contents}>
        <Box className={classes.contentsTop}>
          <Box className={classes.titleArea}>
            <strong className={classes.title}>{name}</strong>
            <Box className={classes.price}>
              <strong>
                {intl.format(Math.min(...pricesArr))}원 ~ {intl.format(Math.max(...pricesArr))}원
              </strong>
            </Box>
          </Box>
          <Box className={classes.infoArea}>
            <Box className={classes.infoRow}>
              <DateRangeOutlinedIcon className={classes.infoIcon} fontSize="small" />
              <span>
                {format(new Date(startDate), "yyyy.M.d(ccc)", {
                  locale: ko,
                })}{" "}
                ~{" "}
                {format(new Date(endDate), "yyyy.M.d(ccc)", {
                  locale: ko,
                })}
              </span>
            </Box>
            <Box className={classes.infoRow}>
              <PlayCircleFilledWhiteOutlinedIcon className={classes.infoIcon} fontSize="small" />
              <span>
                {runningTime}, {ageLimit}
              </span>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
