import React from "react";
import { Table } from "reactstrap";
import { BigSmallBetList, BigSmallUserBetInfo } from "../../../common/model/BigSmallBaseModel";
import styles from "./table-bet.module.scss";
import BetList from "../../../common/model/BetList";

type Props = {
  betList: Array<BigSmallUserBetInfo>;
  type: string;
};

function generateUserBetInfo(betList: BetList) {
  const result = [];
  betList.dataList.forEach((betInfo) => {
    if (betInfo.bet) {
      result.push(
        <div className={`${styles.betInfo} ${betInfo.isWin ? styles.winning : ""}`}>
          {betInfo.bet.toLocaleString("en-US")}
        </div>
      );
    }
  });

  return result;
}

function sumAllBet(userBetList: BigSmallBetList) {
  return Object.keys(userBetList).reduce((result, betType) => {
    result += userBetList[betType].total;

    return result;
  }, 0);
}

function generateBetTableBody(betList: Array<BigSmallUserBetInfo>) {
  const result = betList.map((userBet) => {
    return (
      <tr>
        <td>
          <p>{userBet.userName}</p>
          <p>Stake : {sumAllBet(userBet.betList).toLocaleString("en-US")}</p>
        </td>
        <td>{generateUserBetInfo(userBet.betList.firstBetType)}</td>
        <td>{generateUserBetInfo(userBet.betList.secondBetType)}</td>
      </tr>
    );
  });

  return result;
}

function getBetTypeNameFromType(type: string) {
  switch(type){
    case "taixiu":
      return {firstLabel: "Big", secondLabel: "Small"}
    case "chanle":
        return {firstLabel: "Odd", secondLabel: "Even"}
  }
}

export default function BetTable(props: Props) {
  const { type } = props;
  return (
    <Table className={styles.container}>
      <thead>
        <tr>
          <th>User Name</th>
          <th>{getBetTypeNameFromType(type).firstLabel}</th>
          <th>{getBetTypeNameFromType(type).secondLabel}</th>
        </tr>
      </thead>
      <tbody>{generateBetTableBody(props.betList)}</tbody>
    </Table>
  );
}
