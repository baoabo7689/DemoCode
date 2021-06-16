enum SuitEmojis {
  "♥️" = 0,
  "♦️",
  "♣️",
  "♠️",
  "R",
  "B",
}

export default class CardModel {
  value: number;
  suit: number;
  size?: string;

  constructor(value: number = -1, suit: number = -1) {
    this.value = value;
    this.suit = suit;
  }
}

export { SuitEmojis };
