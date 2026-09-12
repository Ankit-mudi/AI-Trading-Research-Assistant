import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [step, setStep] = useState("ask");

  const [sharpFall, setSharpFall] = useState("1%");
  const [holdingPeriod, setHoldingPeriod] =
    useState("1 trading day");
  const [testPeriod, setTestPeriod] =
    useState("Last 5 years");

  const [missingInformation, setMissingInformation] =
    useState([]);

  const [hypothesis, setHypothesis] =
    useState("");

  const [testResult, setTestResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);


  // ==========================================
  // ASK -> AI -> CLARIFY
  // ==========================================

  const handleSubmit = async () => {
    if (!question.trim()) {
      alert("Please enter a trading question.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const result = await response.json();

      console.log("AI Analysis:", result);

      if (!response.ok) {
        throw new Error(
          result.message || "AI analysis failed"
        );
      }

      const data = result.data;

      setSharpFall(
        data.sharpFall || "1%"
      );

      setHoldingPeriod(
        data.holdingPeriod ||
        "1 trading day"
      );

      setTestPeriod(
        data.testPeriod ||
        "Last 5 years"
      );

      setHypothesis(
        data.hypothesis || ""
      );

      setMissingInformation(
        data.missingInformation || []
      );

      setStep("clarify");

    } catch (error) {
      console.error(
        "AI analysis failed:",
        error
      );

      alert(
        "Could not analyze the question. Make sure Flask is running."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // CLARIFY -> DEFINE
  // ==========================================

  const handleClarify = () => {
    setStep("define");
  };


  // ==========================================
  // DEFINE -> TEST
  // ==========================================

  const handleTest = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/test",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            sharpFall: sharpFall,
            holdingPeriod: holdingPeriod,
            testPeriod: testPeriod,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "Research Result:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Research failed"
        );
      }

      setTestResult(result.data);

      setStep("test");

    } catch (error) {
      console.error(
        "Research failed:",
        error
      );

      alert(
        "Research failed. Make sure Flask is running."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // ASK SCREEN
  // ==========================================

  if (step === "ask") {
    return (
      <div className="app">

        <div className="top-label">
          AI-POWERED RESEARCH
        </div>

        <div className="hero">

          <div className="hero-badge">
            ASK → CLARIFY → DEFINE → TEST → LEARN
          </div>

          <h1>
            Turn your trading idea
            <br />
            into evidence.
          </h1>

          <p>
            Ask a question. Clarify the assumptions.
            <br />
            Test it with data. Learn from the result.
          </p>

          <div className="question-box">

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              placeholder="Example: Does buying NIFTY after a sharp fall work?"
              rows="4"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "AI is thinking..."
                : "Analyze Question →"}
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================
  // CLARIFY SCREEN
  // ==========================================

  if (step === "clarify") {
    return (
      <div className="app">

        <div className="top-label">
          STEP 2 OF 5
        </div>

        <div className="content">

          <h2>
            Let's clarify the question.
          </h2>

          <p className="subtitle">
            The AI identified the assumptions
            needed to make this question testable.
          </p>

          <div className="question-display">

            <strong>
              YOUR QUESTION
            </strong>

            <p>
              {question}
            </p>

          </div>


          {missingInformation.length > 0 && (
            <div className="ai-card">

              <span>
                AI IDENTIFIED MISSING INFORMATION
              </span>

              <ul>
                {missingInformation.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}
              </ul>

            </div>
          )}


          <div className="form-group">

            <label>
              What counts as a sharp fall?
            </label>

            <select
              value={sharpFall}
              onChange={(e) =>
                setSharpFall(e.target.value)
              }
            >
              <option>1%</option>
              <option>2%</option>
              <option>3%</option>
              <option>5%</option>
            </select>

          </div>


          <div className="form-group">

            <label>
              Holding period
            </label>

            <select
              value={holdingPeriod}
              onChange={(e) =>
                setHoldingPeriod(
                  e.target.value
                )
              }
            >
              <option>
                1 trading day
              </option>

              <option>
                3 trading days
              </option>

              <option>
                5 trading days
              </option>
            </select>

          </div>


          <div className="form-group">

            <label>
              Test period
            </label>

            <select
              value={testPeriod}
              onChange={(e) =>
                setTestPeriod(
                  e.target.value
                )
              }
            >
              <option>
                Last 5 years
              </option>

              <option>
                Last 10 years
              </option>
            </select>

          </div>


          <button
            className="primary-btn"
            onClick={handleClarify}
          >
            Confirm Assumptions →
          </button>

        </div>

      </div>
    );
  }


  // ==========================================
  // DEFINE SCREEN
  // ==========================================

  if (step === "define") {
    return (
      <div className="app">

        <div className="top-label">
          STEP 3 OF 5
        </div>

        <div className="content">

          <h2>
            Define the experiment.
          </h2>

          <p className="subtitle">
            This is the exact experiment
            that will be tested.
          </p>


          <div className="experiment-card">

            <div className="experiment-row">
              <span>Market</span>
              <strong>NIFTY 50</strong>
            </div>

            <div className="experiment-row">
              <span>Condition</span>
              <strong>
                Fall ≥ {sharpFall}
              </strong>
            </div>

            <div className="experiment-row">
              <span>Entry</span>
              <strong>
                Buy NIFTY after the fall
              </strong>
            </div>

            <div className="experiment-row">
              <span>Exit</span>
              <strong>
                After holding period
              </strong>
            </div>

            <div className="experiment-row">
              <span>Holding</span>
              <strong>
                {holdingPeriod}
              </strong>
            </div>

            <div className="experiment-row">
              <span>Test period</span>
              <strong>
                {testPeriod}
              </strong>
            </div>

          </div>


          <div className="hypothesis-card">

            <span>
              AI-GENERATED HYPOTHESIS
            </span>

            <p>
              {hypothesis}
            </p>

          </div>


          <div className="assumption-card">

            <span>
              COST ASSUMPTION
            </span>

            <p>
              A simple 0.10 percentage-point
              round-trip transaction cost is
              considered in the prototype.
            </p>

          </div>


          <button
            className="primary-btn"
            onClick={handleTest}
            disabled={loading}
          >
            {loading
              ? "Running Research..."
              : "Run Experiment →"}
          </button>

        </div>

      </div>
    );
  }


  // ==========================================
  // TEST SCREEN
  // ==========================================

  if (
    step === "test" &&
    testResult
  ) {

    const trades =
      testResult.trades || [];

    const maxReturn =
      trades.length > 0
        ? Math.max(
            ...trades.map(
              (trade) =>
                Math.abs(
                  Number(trade.return)
                )
            )
          )
        : 1;


    return (
      <div className="app">

        <div className="top-label">
          STEP 4 OF 5
        </div>

        <div className="content">

          <h2>
            Test results.
          </h2>

          <p className="subtitle">
            Based on historical NIFTY 50
            daily market data.
          </p>

          <div className="data-badge">
            REAL HISTORICAL DATA
          </div>


          {/* SUMMARY */}

          <div className="results-grid">

            <div className="result-card">
              <span>Signals</span>

              <strong>
                {testResult.signals}
              </strong>

              <small>
                qualifying market falls
              </small>
            </div>


            <div className="result-card">
              <span>Win Rate</span>

              <strong>
                {testResult.winRate}%
              </strong>

              <small>
                profitable trades
              </small>
            </div>


            <div className="result-card">
              <span>Average Return</span>

              <strong>
                {testResult.avgReturn}%
              </strong>

              <small>
                before costs
              </small>
            </div>


            <div className="result-card">
              <span>After Costs</span>

              <strong>
                {testResult.afterCosts}%
              </strong>

              <small>
                after assumed cost
              </small>
            </div>

          </div>


          {/* =================================
              RETURN CHART
          ================================= */}

          {trades.length > 0 && (

            <div className="chart-card">

              <div className="chart-header">

                <div>
                  <span>
                    RETURN DISTRIBUTION
                  </span>

                  <h3>
                    Sample trade outcomes
                  </h3>
                </div>

                <small>
                  First {trades.length} signals
                </small>

              </div>


              <div className="return-chart">

                {trades.map(
                  (trade, index) => {

                    const value =
                      Number(
                        trade.return
                      );

                    const width =
                      Math.max(
                        8,
                        (
                          Math.abs(value) /
                          maxReturn
                        ) * 100
                      );


                    return (
                      <div
                        className="chart-row"
                        key={index}
                      >

                        <div className="chart-date">
                          {trade.date}
                        </div>


                        <div className="chart-track">

                          <div
                            className={
                              value >= 0
                                ? "chart-bar positive"
                                : "chart-bar negative"
                            }
                            style={{
                              width: `${width}%`
                            }}
                          />

                        </div>


                        <div
                          className={
                            value >= 0
                              ? "chart-value positive-text"
                              : "chart-value negative-text"
                          }
                        >
                          {value >= 0
                            ? "+"
                            : ""}
                          {value}%
                        </div>

                      </div>
                    );

                  }
                )}

              </div>

            </div>

          )}


          {/* =================================
              TRADE EVIDENCE TABLE
          ================================= */}

          {trades.length > 0 && (

            <div className="trade-table-card">

              <div className="trade-table-header">

                <div>

                  <span>
                    TRADE EVIDENCE
                  </span>

                  <h3>
                    Sample qualifying trades
                  </h3>

                </div>

                <small>
                  Showing first {trades.length} signals
                </small>

              </div>


              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>Date</th>
                      <th>Fall</th>
                      <th>Return</th>
                    </tr>

                  </thead>


                  <tbody>

                    {trades.map(
                      (trade, index) => (

                        <tr key={index}>

                          <td>
                            {trade.date}
                          </td>

                          <td>
                            {trade.fall}%
                          </td>

                          <td
                            className={
                              Number(
                                trade.return
                              ) >= 0
                                ? "positive-return"
                                : "negative-return"
                            }
                          >

                            {Number(
                              trade.return
                            ) >= 0
                              ? "+"
                              : ""}

                            {trade.return}%

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}


          {/* =================================
              METHOD
          ================================= */}

          <div className="method-card">

            <h3>
              What was actually tested?
            </h3>

            <p>
              A signal occurs when NIFTY's
              daily close-to-close return is
              equal to or below the selected
              sharp-fall threshold.
            </p>

            <p>
              The strategy enters at that
              day's closing price and exits
              after the selected number of
              trading days.
            </p>

          </div>


          <button
            className="primary-btn"
            onClick={() =>
              setStep("learn")
            }
          >
            Interpret Results →
          </button>

        </div>

      </div>
    );
  }


  // ==========================================
  // LEARN SCREEN
  // ==========================================

  if (
    step === "learn" &&
    testResult
  ) {

    const isPositive =
      Number(
        testResult.afterCosts
      ) > 0;


    return (
      <div className="app">

        <div className="top-label">
          STEP 5 OF 5
        </div>

        <div className="content">

          <h2>
            What did we learn?
          </h2>

          <p className="subtitle">
            Separate what the data shows
            from what we conclude.
          </p>


          <div className="learn-card">

            <span>
              WHAT THE DATA SHOWS
            </span>

            <p>
              The experiment found{" "}
              <strong>
                {testResult.signals}
              </strong>{" "}
              qualifying signals over the
              selected historical period.
            </p>

            <p>
              The average return after the
              assumed transaction cost was{" "}
              <strong>
                {testResult.afterCosts}%
              </strong>.
            </p>

          </div>


          <div className="conclusion-card">

            <span>
              SYSTEM CONCLUSION
            </span>

            {isPositive ? (

              <p>
                The tested setup produced a
                positive average return after
                the assumed cost. However,
                this is not enough to prove
                that the strategy will work
                in the future.
              </p>

            ) : (

              <p>
                The tested setup did not produce
                a positive average return after
                the assumed cost. Based on this
                experiment, there is not enough
                evidence that buying after the
                selected sharp fall provides a
                useful short-term edge.
              </p>

            )}

          </div>


          <div className="next-card">

            <span>
              NEXT QUESTIONS
            </span>

            <ul>

              <li>
                Does a larger fall threshold
                produce a different result?
              </li>

              <li>
                Does a 3-day or 5-day holding
                period perform better?
              </li>

              <li>
                Does the result remain stable
                across different market periods?
              </li>

              <li>
                What happens when transaction
                costs are changed?
              </li>

            </ul>

          </div>


          <button
            className="primary-btn"
            onClick={() => {

              setStep("ask");
              setQuestion("");
              setTestResult(null);
              setMissingInformation([]);
              setHypothesis("");
              setSharpFall("1%");
              setHoldingPeriod(
                "1 trading day"
              );
              setTestPeriod(
                "Last 5 years"
              );

            }}
          >
            Ask Another Question ↗
          </button>

        </div>

      </div>
    );
  }


  return null;
}

export default App;