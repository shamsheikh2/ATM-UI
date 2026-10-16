
import { useEffect, useState } from "react";

function App() {
  const [pin, setPin] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem("atmBalance");

    return savedBalance !== null
      ? Number(savedBalance)
      : 100000;
  });
 
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem(
      "atmTransactions"
    );

    return savedTransactions !== null
      ? JSON.parse(savedTransactions)
      : [];
  });

  // Save balance in localStorage
  useEffect(() => {
    localStorage.setItem("atmBalance", String(balance));
  }, [balance]);

  // Save transactions in localStorage
  useEffect(() => {
    localStorage.setItem(
      "atmTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const handleNumberClick = (number) => {
    if (pin.length < 4) {
      setPin(pin + number);
    }
  };

  const handleClear = () => {
    setPin("");
    setMessage("");
  };

  const handleLogin = () => {
    if (pin === "8979") {
      setIsLogin(true);
      setMessage("Login successful!");
    } else {
      setMessage("Wrong PIN! Try again.");
      setPin("");
    }
  };

  const handleLogout = () => {
    setIsLogin(false);
    setPin("");
    setAmount("");
    setMessage("");
  };

  const handleWithdraw = () => {
    const withdrawAmount = Number(amount);

    if (!amount || withdrawAmount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    if (withdrawAmount > balance) {
      setMessage("Insufficient balance.");
      return;
    }

    setBalance((currentBalance) => currentBalance - withdrawAmount);

    setTransactions((currentTransactions) => [
      {
        type: "Withdraw",
        amount: withdrawAmount,
      },
      ...currentTransactions,
    ]);

    setAmount("");
    setMessage(`₹${withdrawAmount} withdrawn successfully.`);
  };

  const handleDeposit = () => {
    const depositAmount = Number(amount);

    if (!amount || depositAmount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    setBalance((currentBalance) => currentBalance + depositAmount);

    setTransactions((currentTransactions) => [
      {
        type: "Deposit",
        amount: depositAmount,
      },
      ...currentTransactions,
    ]);

    setAmount("");
    setMessage(`₹${depositAmount} deposited successfully.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-cyan-400">
            BaNk Of ApF2022 : ATM
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Secure Banking System
          </p>
        </div>

        {!isLogin ? (
          <div>
            <div className="mb-5 rounded-2xl bg-black p-6 text-center">
              <p className="mb-4 text-slate-400">
                Enter Your 4-Digit PIN
              </p>

              <p className="text-3xl tracking-[12px] text-green-400">
                {"•".repeat(pin.length)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => handleNumberClick(number)}
                    className="rounded-xl bg-slate-700 py-4 text-xl font-bold transition hover:bg-slate-600"
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={handleClear}
                className="rounded-xl bg-red-600 py-4 font-bold hover:bg-red-500"
              >
                Clear
              </button>

              <button
                onClick={() => handleNumberClick("0")}
                className="rounded-xl bg-slate-700 py-4 text-xl font-bold hover:bg-slate-600"
              >
                0
              </button>

              <button
                onClick={handleLogin}
                className="rounded-xl bg-green-600 py-4 font-bold hover:bg-green-500"
              >
                Enter
              </button>
            </div>

            <p className="mt-5 text-center text-sm text-slate-400">
              Demo PIN: 1234
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-700 p-5">
              <p className="text-sm text-cyan-100">
                Available Balance
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                ₹{balance.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => setMessage(`Your balance is ₹${balance}.`)}
                className="rounded-xl bg-blue-600 p-4 font-semibold hover:bg-blue-500"
              >
                Balance
              </button>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 p-4 font-semibold hover:bg-red-500"
              >
                Logout
              </button>
            </div>

            <div className="rounded-2xl bg-slate-800 p-4">
              <h2 className="mb-3 text-xl font-bold">
                Cash Transaction
              </h2>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount in ₹"
                className="mb-3 w-full rounded-xl border border-slate-600 bg-slate-900 p-3 text-white outline-none focus:border-cyan-400"
              />

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWithdraw}
                  className="rounded-xl bg-orange-600 p-3 font-semibold hover:bg-orange-500"
                >
                  Withdraw
                </button>

                <button
                  onClick={handleDeposit}
                  className="rounded-xl bg-green-600 p-3 font-semibold hover:bg-green-500"
                >
                  Deposit
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-800 p-4">
              <h2 className="mb-3 text-xl font-bold">
                Transaction History
              </h2>

              {transactions.length === 0 ? (
                <p className="text-slate-400">
                  No transactions yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="flex justify-between rounded-lg bg-slate-700 p-3"
                    >
                      <span>{transaction.type}</span>

                      <span
                        className={
                          transaction.type === "Deposit"
                            ? "text-green-400"
                            : "text-orange-400"
                        }
                      >
                        ₹{transaction.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {message && (
              <p className="mt-4 rounded-xl bg-slate-700 p-3 text-center text-sm text-cyan-300">
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;