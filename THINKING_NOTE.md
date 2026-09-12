# Thinking Note — TradeLens AI

## 1. Problem Understanding

The core problem is not simply to calculate whether buying NIFTY after a fall makes money. The important challenge is to convert a vague market question into a clearly defined and testable experiment.

The starting question is:

> "Does buying NIFTY after a sharp fall work?"

This question is ambiguous because terms such as "sharp fall", "work", "holding period", and "historical period" are not clearly defined.

Therefore, the system follows:

**ASK → CLARIFY → DEFINE → TEST → LEARN**

This prevents the system from directly producing a conclusion from an incomplete question.

---

## 2. Ambiguity and Missing Information

The original question does not specify:

- What percentage fall should be considered a "sharp fall"?
- How long should NIFTY be held after the fall?
- Which historical period should be tested?
- What should "work" mean: positive average return, high win rate, or something else?
- What transaction costs should be considered?

Instead of hiding these uncertainties, the prototype makes the assumptions visible to the user.

For the current prototype, the main experiment uses NIFTY and allows the user to define the fall threshold, holding period, and test period.

This was an important design decision because a backtest can produce a precise number even when the original question is poorly defined. A precise number does not automatically mean a meaningful answer.

---

## 3. Experiment Definition

The experiment is structured around the following assumptions:

- **Market:** NIFTY 50
- **Signal:** NIFTY daily close falls by at least the selected percentage
- **Entry:** Buy at the signal day's closing price
- **Holding period:** User-selected number of trading days
- **Exit:** Closing price after the selected holding period
- **Historical period:** User-selected historical period
- **Transaction cost assumption:** 0.10 percentage point deducted from the average return
- **Outcome:** Return of each qualifying trade

The hypothesis is:

> Buying NIFTY after a sharp fall may produce a positive short-term return.

The purpose of the experiment is not to prove that the strategy will always work. It is to examine whether the historical evidence supports the hypothesis under the chosen assumptions.

---

## 4. Why This Test?

A simple event-based experiment was selected instead of building a complex trading strategy.

The reason is that the assignment focuses on thinking and experimentation rather than production-grade backtesting.

The test answers a focused question:

> After NIFTY experiences a sufficiently large one-day fall, what happened over the following holding period?

For every qualifying event, the prototype calculates the subsequent return. It then summarizes the evidence using:

- Number of signals
- Win rate
- Average return
- Average return after the simplified transaction cost assumption
- Individual sample trades

This makes the result easier to inspect instead of presenting only one final number.

---

## 5. What the Data Shows vs What the System Concludes

The prototype deliberately separates evidence from interpretation.

### What the data shows

For the current example configuration, the historical test produced:

- **122 signals**
- **50.00% win rate**
- **0.03% average return**
- **-0.07% average return after the 0.10 percentage-point cost assumption**

The individual trade results also contain both positive and negative outcomes.

### System conclusion

The observed average return is very small and becomes negative after the simplified transaction cost assumption.

Therefore, under this specific experiment definition, the historical evidence does **not** provide strong support for the idea that buying NIFTY after a 1% daily fall produces a useful short-term edge.

This is not the same as saying the strategy can never work.

The conclusion is limited to the tested assumptions, historical period, signal definition, holding period, and cost assumption.

---

## 6. Limitations

This prototype is intentionally small and has several limitations.

First, the experiment uses historical market data and therefore does not guarantee future performance.

Second, the transaction cost model is simplified. Real trading can involve brokerage, taxes, slippage, spread, and other costs.

Third, the current entry assumption uses the signal day's closing price. In real trading, execution at exactly that closing price may not always be possible.

Fourth, the experiment does not yet include position sizing, risk management, drawdown analysis, or portfolio-level effects.

Finally, the experiment tests one relatively simple relationship. A negative result does not mean all forms of buying after a fall are ineffective.

---

## 7. What I Would Test Next

If the first experiment does not show a strong edge, I would not immediately conclude that the overall idea is useless.

I would investigate:

1. Does a larger fall threshold, such as 2% or 3%, behave differently?
2. Does a 3-day or 5-day holding period produce different results?
3. Does the result change across different market periods?
4. Are results different during high-volatility periods?
5. Does using the next day's opening price instead of the signal day's close change the conclusion?
6. How does a more realistic transaction-cost and slippage model affect the result?

The goal of these follow-up experiments would be to understand **why** the observed result occurs rather than simply searching for a profitable parameter.

---

## 8. Key Design Principle

The main principle behind TradeLens AI is:

> **Build less. Think more.**

The prototype is intentionally focused on turning an ambiguous question into a transparent experiment.

The value of the system is therefore not just the final return number. It is the reasoning chain:

**Question → Missing Information → Experiment Definition → Evidence → Learning**

This makes the result easier to understand, challenge, and improve.