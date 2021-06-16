import React from "react";
import { Table } from "reactstrap";
import { SicBoBetList, SicBoUserBetInfo } from "../../../common/model/SicBoModel";
import BetList from "../../../common/model/BetList";
import styles from "./bet-table.module.scss";

type Props = {
  betList: Array<SicBoUserBetInfo>;
};

function getChoice(type: string, choice: string) {
  switch (type) {
    case "bigSmall":
    case "oddEven":
      return choice.charAt(0).toUpperCase() + choice.slice(1);
    case "totalPoint":
      return choice.slice(5);
    case "singleDice":
      return choice.charAt(choice.length - 1);
    case "anyTriple":
      return "Any Triple";
    case "specificDouble":
      return `${choice.charAt(choice.length - 1)}-${choice.charAt(choice.length - 1)}`;
    case "specificTriple":
      return `${choice.charAt(choice.length - 1)}-${choice.charAt(choice.length - 1)}-${choice.charAt(choice.length - 1)}`;
    case "diceCombination":
      return `${choice.charAt(choice.length - 2)}-${choice.charAt(choice.length - 1)}`;
    default:
      return "";
  }
}

function generateUserBetInfo(betList: BetList, type: string) {
  const result = [];
  betList.dataList.forEach((betInfo) => {
    if (betInfo.bet) {
      result.push(
        <div className={`${styles.betInfo} ${betInfo.isWin ? styles.winning : ""}`}>
          [{getChoice(type, betInfo.choice)}] : {betInfo.bet.toLocaleString("en-US")}
        </div>
      );
    }
  });

  return result;
}

function sumAllBet(userBetList: SicBoBetList) {
  return Object.keys(userBetList).reduce((result, betType) => {
    result += userBetList[betType].total;

    return result;
  }, 0);
}

function generateBetTableBody(betList: Array<SicBoUserBetInfo>) {
  const result = betList.map((userBet) => {
    return (
      <tr>
        <td>
          <p>{userBet.userName}</p>
          <p>Stake : {sumAllBet(userBet.betList).toLocaleString("en-US")}</p>
        </td>
        <td>{generateUserBetInfo(userBet.betList.anyTriple, "anyTriple")}</td>
        <td>{generateUserBetInfo(userBet.betList.bigSmall, "bigSmall")}</td>
        <td>{generateUserBetInfo(userBet.betList.oddEven, "oddEven")}</td>
        <td>{generateUserBetInfo(userBet.betList.specificDouble, "specificDouble")}</td>
        <td>{generateUserBetInfo(userBet.betList.singleDice, "singleDice")}</td>
        <td>{generateUserBetInfo(userBet.betList.specificTriple, "specificTriple")}</td>
        <td>{generateUserBetInfo(userBet.betList.totalPoint, "totalPoint")}</td>
        <td>{generateUserBetInfo(userBet.betList.diceCombination, "diceCombination")}</td>
      </tr>
    );
  });

  return result;
}

export default function BetTable(props: Props) {
  return (
    <Table className={styles.container}>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Any Triple</th>
          <th>Big/Small</th>
          <th>Odd/Even</th>
          <th>Specific Double</th>
          <th>Specific Number</th>
          <th>Specific Triple</th>
          <th>Total Point</th>
          <th>Two Dice Combination</th>
        </tr>
      </thead>
      <tbody>{generateBetTableBody(props.betList)}</tbody>
    </Table>
  );
}
