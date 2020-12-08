import React, { useEffect } from "react";
import { MainHeader, ContentsArea, ConcertDetails } from "../components";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { useDispatch } from "react-redux";
import { changeSelectedConcert } from "../modules/concertInfo";

interface Params {
  concertId: string;
}

export default function SelectTime() {
  const dispatch = useDispatch();
  const { concertId } = useParams<Params>();
  const GET_TITLE = gql`
    query GetItem($id: ID) {
      itemDetail(itemId: $id) {
        name
      }
    }
  `;
  useEffect(() => {
    dispatch(changeSelectedConcert(concertId));
  }, []);
  const { loading, error, data } = useQuery(GET_TITLE, {
    variables: { id: concertId },
  });

  if (loading) return <p> loading.... </p>;
  if (error) return <>`Error! ${error.message}`</>;
  const { name } = data.itemDetail;
  return (
    <>
      <MainHeader title={name} />
      <ContentsArea concertId={concertId} />
      <ConcertDetails />
    </>
  );
}
