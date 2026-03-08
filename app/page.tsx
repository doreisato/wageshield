"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    hourlyRate: "",
    hoursWorked: "",
    payReceived: "",
  });
  const [result, setResult] = useState<{
    totalOwed: string;
    received: string;
    shortage: string;
    missingHours: string;
    isShort: boolean;
    totalHours: number;
    paidHours: string;
    unpaidHours: string;
  } | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(formData.hourlyRate) || 0;
    const hours = parseFloat(formData.hoursWorked) || 0;
    const received = parseFloat(formData.payReceived) || 0;

    let totalOwed = 0;
    if (hours > 40) {
      const regPay = 40 * rate;
      const otPay = (hours - 40) * (rate * 1.5);
      totalOwed = regPay + otPay;
    } else {
      totalOwed = hours * rate;
    }

    const shortage = totalOwed - received;
    const isShort = shortage > 0.01;
    const paidHours = rate > 0 ? (received / rate).toFixed(1) : "0";
    const unpaidHours = rate > 0 && isShort ? (shortage / rate).toFixed(1) : "0";

    setResult({
      totalOwed: totalOwed.toFixed(2),
      received: received.toFixed(2),
      shortage: isShort ? shortage.toFixed(2) : "0.00",
      missingHours: unpaidHours,
      isShort,
      totalHours: hours,
      paidHours,
      unpaidHours,
    });
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 max-w-[640px] mx-auto px-5 py-16 w-full">
        <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-3">
          WageShield
        </p>
        <h1 className="text-4xl font-semibold leading-tight mb-3">
          Get the money your boss owes you.
        </h1>
        <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
          Find out in seconds if your paycheck is missing money you earned.
        </p>

        <form onSubmit={calculate} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="hourlyRate"
              className="block text-sm text-neutral-300 mb-2"
            >
              How much do you make an hour?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600">
                $
              </span>
              <input
                id="hourlyRate"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                required
                autoFocus
                className="w-full h-12 pl-7 pr-3 rounded-md bg-black border border-neutral-700 text-white text-base focus:outline-none focus:ring-2 focus:ring-white"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="hoursWorked"
              className="block text-sm text-neutral-300 mb-2"
            >
              How many hours did you work?
            </label>
            <input
              id="hoursWorked"
              type="number"
              step="0.5"
              min="0"
              inputMode="decimal"
              required
              className="w-full h-12 px-3 rounded-md bg-black border border-neutral-700 text-white text-base focus:outline-none focus:ring-2 focus:ring-white"
              value={formData.hoursWorked}
              onChange={(e) =>
                setFormData({ ...formData, hoursWorked: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="payReceived"
              className="block text-sm text-neutral-300 mb-2"
            >
              How much was your paycheck before taxes?
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600">
                $
              </span>
              <input
                id="payReceived"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                required
                className="w-full h-12 pl-7 pr-3 rounded-md bg-black border border-neutral-700 text-white text-base focus:outline-none focus:ring-2 focus:ring-white"
                value={formData.payReceived}
                onChange={(e) =>
                  setFormData({ ...formData, payReceived: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-white text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          >
            Check my paycheck
          </button>

          <p className="text-xs text-[#888888] leading-relaxed">
            This tool is a guide, not legal advice. We are not lawyers. Your
            actual missing pay might change slightly based on local taxes and
            state laws.
          </p>
        </form>

        {result && (
          <section className="mt-10 border border-neutral-800 rounded-md p-6">
            {result.isShort ? (
              <>
                <p className="text-xs tracking-[0.16em] uppercase text-neutral-500 mb-2">
                  Result
                </p>
                <h2 className="text-2xl font-semibold mb-4">
                  You are owed ${result.shortage}.
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  You worked {result.totalHours} hours, but you were only paid
                  for {result.paidHours} hours. That means you worked{" "}
                  {result.unpaidHours} hours for free.
                </p>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-500">Total Owed (inc. OT)</span>
                    <span>${result.totalOwed}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-500">Amount Received</span>
                    <span>${result.received}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-neutral-500">Shortage</span>
                    <span className="font-semibold">${result.shortage}</span>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-5">
                  <p className="text-xs tracking-[0.16em] uppercase text-neutral-500 mb-3">
                    Next Steps
                  </p>
                  <ol className="list-decimal pl-5 text-sm text-neutral-300 space-y-2">
                    <li>Write down your hours in a notebook every single day.</li>
                    <li>Keep photos or copies of all your pay stubs.</li>
                    <li>
                      Call your state labor board to report the stolen pay.
                    </li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs tracking-[0.16em] uppercase text-neutral-500 mb-2">
                  Result
                </p>
                <h2 className="text-2xl font-semibold mb-2">
                  Paycheck looks accurate.
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Based on what you entered, your gross pay of ${result.received}{" "}
                  matches or exceeds the ${result.totalOwed} owed for{" "}
                  {result.totalHours} hours of work.
                </p>
              </>
            )}
          </section>
        )}
      </div>

      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-600">
        Built by{" "}
        <a
          href="https://infinite-machines-production.up.railway.app"
          className="text-neutral-500 hover:text-white"
        >
          Infinite Machines
        </a>
      </footer>
    </main>
  );
}
