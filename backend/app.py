from flask import Flask, jsonify, request
from flask_cors import CORS

from services.research_engine import run_nifty_research
from services.ai_analyzer import analyze_trading_question


app = Flask(__name__)

CORS(app)


# =========================
# HOME
# =========================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "status": "success",
        "message": "Welcome to TradeLens AI Backend"
    })


# =========================
# HEALTH CHECK
# =========================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "success",
        "message": "TradeLens AI backend is running"
    })


# =========================
# ASK -> AI ANALYSIS
# =========================

@app.route("/api/analyze", methods=["POST"])
def analyze_question():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "status": "error",
                "message": "Request body is missing"
            }), 400


        question = data.get(
            "question",
            ""
        ).strip()


        if not question:

            return jsonify({
                "status": "error",
                "message": "Question is required"
            }), 400


        # Send question to local AI analyzer
        result = analyze_trading_question(
            question
        )


        # Add original question
        result["question"] = question


        return jsonify({
            "status": "success",
            "data": result
        })


    except Exception as e:

        print(
            "AI ANALYSIS ERROR:",
            str(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# =========================
# DEFINE -> TEST
# =========================

@app.route("/api/test", methods=["POST"])
def test_experiment():

    try:

        data = request.get_json() or {}


        # -------------------------
        # Sharp fall
        # -------------------------

        sharp_fall_text = data.get(
            "sharpFall",
            "1%"
        )


        sharp_fall = float(
            str(sharp_fall_text)
            .replace("%", "")
            .strip()
        )


        # -------------------------
        # Holding period
        # -------------------------

        holding_period_text = data.get(
            "holdingPeriod",
            "1 trading day"
        )


        if "5" in holding_period_text:

            holding_days = 5

        elif "3" in holding_period_text:

            holding_days = 3

        else:

            holding_days = 1


        # -------------------------
        # Test period
        # -------------------------

        test_period_text = data.get(
            "testPeriod",
            "Last 5 years"
        )


        if "10" in test_period_text:

            period = "10y"

        else:

            period = "5y"


        # -------------------------
        # Run research engine
        # -------------------------

        result = run_nifty_research(
            sharp_fall=sharp_fall,
            holding_days=holding_days,
            period=period
        )


        return jsonify({
            "status": "success",
            "data": result
        })


    except Exception as e:

        print(
            "TEST ERROR:",
            str(e)
        )

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# =========================
# START SERVER
# =========================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )