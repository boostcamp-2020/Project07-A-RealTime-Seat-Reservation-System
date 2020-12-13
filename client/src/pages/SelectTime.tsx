import React, { useEffect } from "react";
import { MainHeader, ContentsArea, ConcertDetails } from "../components";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { changeSelectedConcert } from "../modules/concertInfo";
import useConcertInfo from "../hooks/useConcertInfo";

interface Params {
  concertId: string;
}

export default function SelectTime() {
  const dispatch = useDispatch();
  const concertInfo = useConcertInfo();
  const { concertId } = useParams<Params>();
  const GET_TITLE = gql`
    query GetItem($id: ID) {
      itemDetail(itemId: $id) {
        name
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_TITLE, {
    variables: { id: concertId },
  });
  useEffect(() => {
    if (data) dispatch(changeSelectedConcert(concertId, data.itemDetail.name));
  }, [data]);

  if (error) return <>`Error! ${error.message}`</>;
  return (
    <>
      <MainHeader title={concertInfo.name} />
      <ContentsArea concertId={concertId} />
      <ConcertDetails />
    </>
  );
}
