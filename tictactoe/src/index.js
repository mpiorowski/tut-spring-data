import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function checkLines(squares) {
  const lines = [
    [0, 1, 2, 1],
    [3, 4, 5, 1],
    [6, 7, 8, 1],
    [0, 3, 6, 2],
    [1, 4, 7, 2],
    [2, 5, 8, 2],
    [0, 4, 8, 3],
    [2, 4, 6, 4],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return [0,0,0,0];
}

function Square(props) {
  return (
      <button className={props.className} onClick={props.onClick}>
        {props.value}
      </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    let className;
    let lines = this.props.linesSquare;
    if (lines[0] === i || lines[1] === i || lines[2] === i)  {
      if (lines[3] === 1) {
        className = 'square hor-line';
      } else if (lines[3] === 2) {
        className = 'square ver-line';
      } else if (lines[3] === 3) {
        className = 'square crossed-2';
      } else if (lines[3] === 4) {
        className = 'square crossed-1';
      } else {
        className = 'square';
      }
    } else {
      className = 'square';
    }
    return (
        <Square
            value={this.props.squares[i]}
            id={'square' + i}
            className={className}
            onClick={() => this.props.onClick(i)}
        />
    )
  }

  render() {

    return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
    )

  }

}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const lines = checkLines(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
          'Go to move #' + move :
          'Go to game start';
      return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
      )
    })

    return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                linesSquare={lines}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
    );
  }

}

ReactDOM.render(
    <Game/>,
    document.getElementById("root")
)

