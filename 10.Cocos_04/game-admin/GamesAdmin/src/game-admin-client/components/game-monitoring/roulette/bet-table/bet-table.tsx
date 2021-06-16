import React from "react";
import { Table } from "reactstrap";
import { RouletteUserBetInfo, RouletteBetList } from "../../../common/model/RouletteModel";
import BetList from "../../../common/model/BetList";
import styles from "./bet-table.module.scss";

const DOZEN_CHOICE_MAPPER = {
  1: "1-12",
  2: "13-24",
  3: "25-36",
};

const COLUMN_CHOICE_MAPPER = {
  1: "1-34",
  2: "2-35",
  3: "3-36",
};

type Props = {
  betList: Array<RouletteUserBetInfo>;
};

function getChoice(type, choice) {
  switch (type) {
    case "dozen":
      return DOZEN_CHOICE_MAPPER[choice];
    case "column":
      return COLUMN_CHOICE_MAPPER[choice];
    case "line":
    case "split":
    case "street":
    case "triangle":
    case "corner":
    case "fourNumbers":
      return choice.replace(/-/g, ",");
    default:
      return choice.charAt(0).toUpperCase() + choice.slice(1);
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

function sumAllBet(userBetList: RouletteBetList) {
  return Object.keys(userBetList).reduce((result, betType) => {
    result += userBetList[betType].total;

    return result;
  }, 0);
}

function generateBetTableBody(betList: Array<RouletteUserBetInfo>) {
  const result = betList.map((userBet) => {
    return (
      <tr>
        <td>
          <p>{userBet.userName}</p>
          <p>Stake : {sumAllBet(userBet.betList).toLocaleString("en-US")}</p>
        </td>
        <td>{generateUserBetInfo(userBet.betList.straightUp, "straightUp")}</td>
        <td>{generateUserBetInfo(userBet.betList.split, "split")}</td>
        <td>{generateUserBetInfo(userBet.betList.street, "street")}</td>
        <td>{generateUserBetInfo(userBet.betList.triangle, "triangle")}</td>
        <td>{generateUserBetInfo(userBet.betList.corner, "corner")}</td>
        <td>{generateUserBetInfo(userBet.betList.fourNumbers, "fourNumbers")}</td>
        <td>{generateUserBetInfo(userBet.betList.line, "line")}</td>
        <td>{generateUserBetInfo(userBet.betList.column, "column")}</td>
        <td>{generateUserBetInfo(userBet.betList.dozen, "dozen")}</td>
        <td>{generateUserBetInfo(userBet.betList.redBlack, "redBlack")}</td>
        <td>{generateUserBetInfo(userBet.betList.oddEven, "oddEven")}</td>
        <td>{generateUserBetInfo(userBet.betList.bigSmall, "bigSmall")}</td>
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
          <th>Straight up</th>
          <th>Split</th>
          <th>Street</th>
          <th>Triangle</th>
          <th>Corner</th>
          <th>Four number</th>
          <th>Line</th>
          <th>Column</th>
          <th>Dozen</th>
          <th>Red/Black</th>
          <th>Odd/Even</th>
          <th>Big/Small</th>
        </tr>
      </thead>
      <tbody>{generateBetTableBody(props.betList)}</tbody>
    </Table>
  );
}
