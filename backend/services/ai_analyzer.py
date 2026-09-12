def analyze_trading_question(question):
    """
    Local AI-style research question analyzer.

    This prototype identifies the important experiment
    parameters from the user's question using simple rules.
    """

    question_lower = question.lower()

    # Default assumptions
    instrument = "NIFTY"
    strategy = "Buy after a sharp fall"
    sharp_fall = "1%"
    holding_period = "1 trading day"
    test_period = "Last 5 years"

    missing_information = []

    # -------------------------
    # Detect instrument
    # -------------------------

    if "nifty" in question_lower:
        instrument = "NIFTY"

    elif "sensex" in question_lower:
        instrument = "SENSEX"

    else:
        missing_information.append(
            "Which market or instrument should be tested?"
        )


    # -------------------------
    # Detect fall threshold
    # -------------------------

    if "2%" in question:
        sharp_fall = "2%"

    elif "3%" in question:
        sharp_fall = "3%"

    elif "5%" in question:
        sharp_fall = "5%"

    else:
        missing_information.append(
            "What percentage fall should count as a sharp fall?"
        )


    # -------------------------
    # Detect holding period
    # -------------------------

    if "5 day" in question_lower:
        holding_period = "5 trading days"

    elif "3 day" in question_lower:
        holding_period = "3 trading days"

    else:
        missing_information.append(
            "How long should the position be held?"
        )


    # -------------------------
    # Detect test period
    # -------------------------

    if "10 year" in question_lower:
        test_period = "Last 10 years"

    else:
        missing_information.append(
            "What historical period should be tested?"
        )


    # -------------------------
    # Hypothesis
    # -------------------------

    hypothesis = (
        f"Buying {instrument} after a sharp fall "
        "may produce a positive short-term return."
    )


    # -------------------------
    # Final result
    # -------------------------

    return {
        "instrument": instrument,
        "strategy": strategy,
        "sharpFall": sharp_fall,
        "holdingPeriod": holding_period,
        "testPeriod": test_period,
        "hypothesis": hypothesis,
        "missingInformation": missing_information
    }