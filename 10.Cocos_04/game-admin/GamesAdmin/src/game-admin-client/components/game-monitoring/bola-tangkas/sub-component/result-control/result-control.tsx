import React from "react";
import styles from "./result-control.module.scss";
import { Container, Row, Col } from "reactstrap";
import Card from "../../../../shared/card/card";
import CardModel, { SuitEmojis } from "../../../../common/model/CardModel";
import Select from "react-select";

type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  userId?: number;
  gameId?: number;
  toggleModal: Function;
  sendMessage: Function;
  userOption: Array<string>;
  cards: Array<CardModel>;
  handleCardChange: Function;
};

type State = {
  cards: Array<CardModel>;
  cardSelected: number;
  selectedValueIndex: number;
  selectedSuitIndex: number;
  disabledValueOptions: Array<number>;
  disabledSuitOptions: Array<number>;
  userName: string;
  errorMessage: string;
};

export default class ResultControl extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      cardSelected: -1,
      userName: "",
      cards: props.cards,
      selectedValueIndex: -1,
      selectedSuitIndex: -1,
      disabledSuitOptions: [],
      disabledValueOptions: [],
      errorMessage: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit() {
    if (this.validateInput()) {
      const cards = this.state.cards;

      this.props.toggleModal();
      this.props.sendMessage({
        set_cards: {
          userName: this.state.userName,
          cards: [cards[0], cards[2], cards[4], cards[5], cards[6], cards[3], cards[1]],
        },
      });
    }

    this.props.handleCardChange(this.state.cards);
  }

  validateInput() {
    const { cards, userName } = this.state;
    let result = true;

    if (userName == "") {
      this.setState({
        errorMessage: "User is not selected !",
      });
      result = false;
    }

    result &&
      cards.forEach((card) => {
        if (card.value == -1 || card.suit == -1) {
          this.setState({
            errorMessage: "Please assign value for 7 cards !",
          });
          result = false;
        }
      });

    result &&
      this.setState({
        errorMessage: "",
      });
    return result;
  }

  selectCard(id) {
    const { cardSelected, selectedValueIndex, selectedSuitIndex, cards } = this.state;

    if (
      cardSelected != -1 &&
      !this.isDefaultCard(selectedValueIndex, selectedSuitIndex) &&
      !this.isValidCard(selectedValueIndex, selectedSuitIndex)
    ) {
      return;
    }

    this.setState({
      cardSelected: id,
      selectedSuitIndex: cards[id].suit,
      selectedValueIndex: cards[id].value,
      disabledSuitOptions: this.getDisabledSuitOptions(cards[id].value, cards[id].suit),
      disabledValueOptions: this.getDisabledValueOptions(cards[id].suit, cards[id].value),
    });
  }

  isValidCard(value: number, suit: number) {
    return value >= 0 && suit >= 0;
  }

  isDefaultCard(value: number, suit: number) {
    return value == -1 && suit == -1;
  }

  changeValueHandle(value: number) {
    const cardIndex = this.state.cardSelected;

    if (cardIndex == -1) {
      return;
    }

    const cloneCards = this.state.cards;

    cloneCards[cardIndex].value = value;
    cloneCards[cardIndex].suit = -1;

    this.setState({
      selectedValueIndex: value,
      cards: cloneCards,
      disabledSuitOptions: this.getDisabledSuitOptions(value),
    });
  }

  changeSuitHandle(suit: number) {
    const cardIndex = this.state.cardSelected;

    if (cardIndex == -1) {
      return;
    }

    const cloneCards = this.state.cards;

    cloneCards[cardIndex].suit = suit;

    this.setState({
      selectedSuitIndex: suit,
      cards: cloneCards,
      disabledValueOptions: this.getDisabledValueOptions(suit),
    });
  }

  getDisabledSuitOptions(value: number, suit: number = this.state.selectedSuitIndex) {
    const { cards } = this.state;
    const result = [];

    cards.map((card) => {
      if (card.value == value && card.suit != suit) {
        result.push(card.suit);
      }
    });

    return result;
  }

  getDisabledValueOptions(suit: number, value: number = this.state.selectedValueIndex) {
    const { cards } = this.state;
    const result = [];
    let jokerCount = 0;

    cards.map((card) => {
      card.value == 13 && jokerCount++;

      if (card.suit == suit && card.value != value && card.value != 13) {
        result.push(card.value);
      }
    });

    if (jokerCount == 2) {
      result.push(13);
    }

    return result;
  }

  handleInputChange(selectedItem) {
    this.setState({
      userName: selectedItem.value,
    });
  }

  renderCardValueOptions() {
    const { disabledValueOptions, selectedValueIndex } = this.state;
    const result = [];

    for (let i = 0; i < 14; i++) {
      let label = "";

      switch (i) {
        case 0:
          label = "Ace";
          break;
        case 13:
          label = "JOK";
          break;
        case 12:
          label = "K";
          break;
        case 11:
          label = "Q";
          break;
        case 10:
          label = "J";
          break;
        default:
          label = i + 1 + "";
      }

      result.push(
        <div className={styles["value-option"]}>
          <input
            type={"radio"}
            name={"card-value"}
            value={i}
            id={`value-${i}`}
            onClick={() => this.changeValueHandle(i)}
            checked={selectedValueIndex == i}
            disabled={disabledValueOptions.includes(i)}
          />
          <label htmlFor={`value-${i}`}>{label}</label>
        </div>
      );
    }

    return result;
  }

  renderCardSuitOptions() {
    const { selectedSuitIndex, disabledSuitOptions, selectedValueIndex } = this.state;
    const result = [];

    const index = selectedValueIndex == 13 ? 4 : 0;
    const max = selectedValueIndex == 13 ? 6 : 4;

    for (let i = index; i < max; i++) {
      result.push(
        <div className={styles["suit-option"]}>
          <input
            type="radio"
            name="card-suit"
            value={i}
            id={`suit-${i}`}
            checked={selectedSuitIndex == i}
            disabled={disabledSuitOptions.includes(i)}
            onClick={() => this.changeSuitHandle(i)}
          />
          <label htmlFor={`suit-${i}`} className={[0, 1, 4].includes(i) && styles["suit-red"]}>
            {SuitEmojis[i]}
          </label>
        </div>
      );
    }

    return result;
  }

  renderCards() {
    const { cardSelected, cards } = this.state;
    const result = [];

    for (let i = 0; i < 7; i++) {
      result.push(
        <div className={`${styles["card-options"]} ${cardSelected == i && styles.selected}`} onClick={() => this.selectCard(i)}>
          <Card key={`card-${i}`} value={cards[i].value} suit={cards[i].suit} />
        </div>
      );
    }

    return result;
  }

  getSelectOptions(data) {
    const result = [];

    data.forEach((item) => {
      result.push({
        label: item,
        value: item,
      });
    });

    return result;
  }

  render() {
    return (
      <Container>
        <Row className={styles["error-message"]}>{this.state.errorMessage != "" && <label>{this.state.errorMessage}</label>}</Row>
        <Row className={styles["filter-wrapper"]}>
          <Col lg={8}>
            <Select
              className={styles.filter}
              options={this.getSelectOptions(this.props.userOption)}
              onChange={this.handleInputChange}
              placeholder="Select User"
            ></Select>
          </Col>
        </Row>
        <Row className={styles["cards-wrapper"]}>{this.renderCards()}</Row>
        <Row className={styles["value-select"]}>{this.renderCardValueOptions()}</Row>
        <Row className={styles["suit-select"]}>{this.renderCardSuitOptions()}</Row>
        <Row className="action-group">
          <button onClick={() => this.handleSubmit()} className="btn-submit">
            Submit
          </button>
          <button onClick={() => this.props.toggleModal()} className="btn-cancel">
            Cancel
          </button>
        </Row>
      </Container>
    );
  }
}
