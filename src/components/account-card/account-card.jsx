import React from "react";

const ProfileCard = ({ userName, accountNumber, accountType, balance, avatarUrl }) => {
  const maskAccountNumber = (number) => {
    if (!number) return "";
    const lastFour = number.slice(-4);
    return `****${lastFour}`;
  };

  const recentTransactions = [
    { id: 1, label: "Supermarket", date: "2023-10-15", amount: -85.5 },
    { id: 2, label: "Salary", date: "2023-10-14", amount: 2500.0 },
    { id: 3, label: "Online Purchase", date: "2023-10-13", amount: -120.75 },
    { id: 4, label: "ATM Withdrawal", date: "2023-10-12", amount: -50.0 },
    { id: 5, label: "Transfer In", date: "2023-10-11", amount: 300.0 },
  ];

  const monthlySummary = {
    spending: 1250.0,
    income: 3200.0,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 px-6 py-10 flex items-center justify-center">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-blue-100">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600" />

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="h-16 w-16 rounded-full border-4 border-blue-500 shadow-lg"
              />
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Signed in as</p>
              <h2 className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-2xl font-bold text-transparent">
                {userName || "User Name"}
              </h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-500">Current Balance</p>
            <p className="text-4xl font-extrabold text-emerald-600 drop-shadow-sm">
              ${balance ? balance.toFixed(2) : "0.00"}
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-blue-50 bg-white/70 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Account Number</p>
              <p className="text-lg font-bold text-slate-800">{maskAccountNumber(accountNumber)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Account Type</p>
              <p className="text-lg font-bold text-slate-800">{accountType || "Checking"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Status</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="inline-block border-b-2 border-blue-500 pb-1 text-xl font-semibold text-slate-800">
            Recent Transactions
          </h3>
          <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-blue-50 bg-white/70 p-4 shadow-inner">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800">{transaction.label}</span>
                  <span className="text-xs text-slate-500">{transaction.date}</span>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    transaction.amount > 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="inline-block border-b-2 border-blue-500 pb-1 text-xl font-semibold text-slate-800">
            Monthly Summary
          </h3>
          <div className="mt-4 grid gap-4 rounded-xl border border-blue-50 bg-white/70 p-4 shadow-sm md:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-lg bg-gradient-to-br from-rose-50 to-white p-4 ring-1 ring-rose-100">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                <span>Spending</span>
                <span>{((monthlySummary.spending / monthlySummary.income) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-rose-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400"
                  style={{
                    width: `${(monthlySummary.spending / monthlySummary.income) * 100}%`,
                  }}
                />
              </div>
              <span className="text-lg font-bold text-rose-600">
                ${monthlySummary.spending.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-2 rounded-lg bg-gradient-to-br from-emerald-50 to-white p-4 ring-1 ring-emerald-100">
              <span className="text-sm font-semibold text-slate-600">Income</span>
              <div className="h-3 w-full overflow-hidden rounded-full bg-emerald-100">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" />
              </div>
              <span className="text-lg font-bold text-emerald-600">
                ${monthlySummary.income.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <button
            className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            onClick={() => alert("Transfer functionality not implemented yet")}
          >
            <span className="absolute inset-y-0 left-[-120%] w-1/2 bg-white/20 blur-2xl transition group-hover:left-[120%]" />
            Transfer
          </button>
          <button
            className="group relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            onClick={() => alert("Statements functionality not implemented yet")}
          >
            <span className="absolute inset-y-0 left-[-120%] w-1/2 bg-white/25 blur-2xl transition group-hover:left-[120%]" />
            Statements
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
