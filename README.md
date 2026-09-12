# TradeLens AI — Trading Research Assistant

> Turn a trading question into a testable experiment and learn from historical evidence.

TradeLens AI is a small AI-assisted financial research prototype that helps users move from an informal trading idea to a structured historical experiment.

The application follows a simple research workflow:

**ASK → CLARIFY → DEFINE → TEST → LEARN**

The goal is not to provide trading advice or predict future market movements. Instead, the system helps users make their assumptions explicit and evaluate a trading hypothesis using historical market data.

---

## 1. Problem

Trading questions are often vague.

For example:

> "Does buying NIFTY after a sharp fall work?"

This question does not define:

- What counts as a sharp fall?
- How long should the position be held?
- Which historical period should be tested?
- What costs should be considered?

If these assumptions are not defined, the experiment can produce misleading results.

TradeLens AI addresses this by converting an informal question into a structured experiment before testing it.

---

## 2. Research Workflow

### ASK

The user enters a trading research question.

Example:

> Does buying NIFTY after a sharp fall work?

---

### CLARIFY

The system identifies important missing information and presents assumptions that need to be confirmed.

For example:

- Sharp fall threshold: 1%
- Holding period: 1 trading day
- Test period: Last 5 years

The user can change these assumptions before continuing.

---

### DEFINE

The selected assumptions are converted into an explicit experiment.

Example:

| Parameter | Definition |
|---|---|
| Market | NIFTY 50 |
| Condition | Daily fall ≥ selected threshold |
| Entry | Buy at the signal day's closing price |
| Exit | After selected holding period |
| Holding Period | 1 / 3 / 5 trading days |
| Test Period | Last 5 / 10 years |
| Cost | 0.10 percentage-point round-trip assumption |

---

### TEST

The backend downloads historical NIFTY 50 daily data and identifies days that satisfy the selected condition.

For each signal:

1. Identify a qualifying daily fall.
2. Enter at that day's closing price.
3. Hold for the selected number of trading days.
4. Exit at the corresponding closing price.
5. Calculate the return.
6. Aggregate the results.

The system reports:

- Number of signals
- Win rate
- Average return
- Return after assumed transaction costs
- Sample qualifying trades

---

### LEARN

The system separates:

**What the data shows**

from

**What the system concludes**

This prevents a positive historical result from automatically being treated as proof that a strategy will work in the future.

The system also suggests follow-up questions for further investigation.

---

## 3. Example Result

For one test configuration, the prototype may produce results such as:

- 122 qualifying signals
- 50% win rate
- 0.03% average return before costs
- -0.07% average return after the assumed cost

These numbers are examples from a historical run and can change when the experiment assumptions or data period change.

A negative after-cost result suggests that the tested setup does not provide strong evidence of a useful short-term edge under those assumptions.

---

## 4. Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Python
- Flask
- Flask-CORS

### Data & Research

- Pandas
- NumPy
- yfinance

### Data Source

Historical NIFTY 50 market data is retrieved through Yahoo Finance using the `yfinance` Python library.

---

## 5. Project Architecture

```text
                         ┌─────────────────────┐
                         │    React Frontend    │
                         │                     │
                         │ ASK → CLARIFY       │
                         │ DEFINE → TEST       │
                         │ LEARN               │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / JSON
                                    ▼
                         ┌─────────────────────┐
                         │    Flask Backend    │
                         │                     │
                         │ /api/analyze        │
                         │ /api/test           │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
          ┌──────────────────┐           ┌──────────────────┐
          │ AI Analyzer      │           │ Research Engine  │
          │                  │           │                  │
          │ Question         │           │ Historical data  │
          │ assumptions      │           │ signals          │
          │ hypothesis       │           │ returns          │
          └──────────────────┘           └────────┬─────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────┐
                                         │ Evidence &      │
                                         │ Learning        │
                                         └─────────────────┘