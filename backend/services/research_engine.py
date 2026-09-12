import yfinance as yf
import pandas as pd


def run_nifty_research(
    sharp_fall=1.0,
    holding_days=1,
    period="5y"
):
    # Download NIFTY 50 historical data
    df = yf.download(
        "^NSEI",
        period=period,
        interval="1d",
        auto_adjust=False,
        progress=False
    )

    if df.empty:
        raise ValueError("Could not download NIFTY data.")

    # Handle yfinance MultiIndex columns
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df.dropna(subset=["Close"]).copy()

    # Daily percentage change
    df["daily_return"] = df["Close"].pct_change() * 100

    # Find days where NIFTY fell by required threshold
    signal_mask = df["daily_return"] <= -abs(sharp_fall)

    signals = []

    for index in df.index[signal_mask]:

        current_position = df.index.get_loc(index)
        exit_position = current_position + holding_days

        # Not enough future data
        if exit_position >= len(df):
            continue

        entry_price = float(df.iloc[current_position]["Close"])
        exit_price = float(df.iloc[exit_position]["Close"])

        return_pct = (
            (exit_price - entry_price)
            / entry_price
        ) * 100

        signals.append({
            "date": index.strftime("%Y-%m-%d"),
            "fall": round(
                float(df.iloc[current_position]["daily_return"]),
                2
            ),
            "return": round(return_pct, 2)
        })

    if not signals:
        return {
            "signals": 0,
            "winRate": 0,
            "avgReturn": 0,
            "afterCosts": 0,
            "trades": []
        }

    trades_df = pd.DataFrame(signals)

    total_signals = len(trades_df)

    winning_trades = (
        trades_df["return"] > 0
    ).sum()

    win_rate = (
        winning_trades / total_signals
    ) * 100

    average_return = trades_df["return"].mean()

    # Simple round-trip transaction cost assumption
    transaction_cost = 0.10

    after_costs = (
        average_return - transaction_cost
    )

    return {
        "signals": total_signals,
        "winRate": round(win_rate, 2),
        "avgReturn": round(average_return, 2),
        "afterCosts": round(after_costs, 2),
        "trades": signals[:10]
    }