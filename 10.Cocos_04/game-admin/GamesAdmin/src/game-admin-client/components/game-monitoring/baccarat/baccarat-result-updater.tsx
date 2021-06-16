import React from "react";
import styles from "./baccarat-result-updater.module.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row } from "reactstrap";
import { generateResult } from "./generate-baccarat-result";

type Props = {
  modal: boolean;
  toggle: Function;
  submit: Function;
  isMini?: boolean;
};

type State = {
  modal: boolean;
  errors: string;
  types: Array<OptionType>;
};

type OptionType = {
  name: string;
  displayName: string;
  value: boolean;
};

const TYPES = {
  group1: ["player", "banker", "tie"],
  group2: ["big", "small"],
  group3: ["playerPair"],
  group4: ["bankerPair"],
};

const TYPES_MAP = {
  player: 0,
  banker: 1,
  tie: 2,
  playerPair: 3,
  bankerPair: 4,
  big: 5,
  small: 6,
};

const CHOICES = [
  { name: "player", displayName: "Player" },
  { name: "banker", displayName: "Banker" },
  { name: "big", displayName: "Big" },
  { name: "small", displayName: "Small" },
  { name: "tie", displayName: "Tie" },
  { name: "playerPair", displayName: "Player Pair" },
  { name: "bankerPair", displayName: "Banker Pair" },
];

const CHOICE_GROUPS = [
  ["player", "banker", "tie"],
  ["big", "small"],
  ["playerPair", "bankerPair"],
];

export default class BaccaratResultUpdater extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      modal: false,
      errors: "",
      types: CHOICES.map((choice) => {
        return { name: choice.name, displayName: choice.displayName, value: false };
      }),
    };

    this.toggle = this.toggle.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.submit = this.submit.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  submit() {
    const choices = this.getCheckedTypes();
    if (Object.values(choices).filter((x) => x == true).length < 1) {
      this.setState({ errors: "You must choose values." });
    } else {
      const result = generateResult(choices);
      this.props.submit(result);
    }
  }

  handleCheck(type, e) {
    const dependingTypes = this.findDependingTypes(type.name);
    const types = this.updateCheck(dependingTypes, type.name, e.target.checked);

    this.setState({
      types: types,
      errors: "",
    });
  }

  getCheckedTypes() {
    const result = this.state.types.reduce((result, type: OptionType) => {
      result[type.name] = type.value;
      return result;
    }, {});

    return result;
  }

  updateCheck(dependingTypes: any[], typeName: string, typeValue: boolean) {
    const types = this.state.types;
    dependingTypes.forEach((dt) => {
      let type = types.find((o) => o.name === dt);
      if (dt !== typeName) {
        type.value = false;
      } else {
        type.value = typeValue;
      }
    });

    return types;
  }

  findDependingTypes(typeName) {
    const dependingTypes = [];

    Object.keys(TYPES).forEach(function (key) {
      const group: string[] = TYPES[key];
      if (group.indexOf(typeName) >= 0) {
        dependingTypes.push(...group);
      }
    });

    return dependingTypes;
  }

  renderType(type: OptionType, index) {
    return (
      <div className={styles["check-block"]} key={index}>
        <div>{type.displayName}</div>
        <div>
          <input type="checkbox" id="{type.value}" checked={type.value} onChange={(e) => this.handleCheck(type, e)} />
        </div>
      </div>
    );
  }

  renderOptions() {
    const stateTypes = this.state.types;
    const result = [];
    let index = 0;

    CHOICE_GROUPS.forEach((group) => {
      const groupChildren = [];

      group.forEach((option) => {
        const optionType = stateTypes.find((choice) => choice.name == option);
        groupChildren.push(this.renderType(optionType, index));
      });

      result.push(<div>{groupChildren}</div>);
    });

    return result;
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.toggle} className={styles["result-updater"]}>
          <ModalHeader className={styles["custom-modal-header"]} toggle={this.toggle}></ModalHeader>
          <ModalBody className={styles["modal-content"]}>
            <div className={styles["row"]}>{this.renderOptions()}</div>
            <Row className={styles["errors"]}>
              <div>{this.state.errors}</div>
            </Row>
          </ModalBody>
          <ModalFooter className="action-group">
            <Button color="primary" onClick={this.submit} className="btn-submit">
              Submit
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
