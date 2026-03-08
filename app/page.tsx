"use client";

import { useState } from "react";

type CalcResult = {
  totalOwed: string;
  received: string;
  shortage: string;
  isShort: boolean;
  totalHours: number;
  paidHours: string;
  unpaidHours: string;
};

export default function Home() {
  const [formData, setFormData] = useState({
    hourlyRate: "",
    hoursWorked: "",
    payReceived: "",
  });
  const [result, setResult] = useState<CalcResult | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(formData.hourlyRate) || 0;
    const hours = parseFloat(formData.hoursWorked) || 0;
    const received = parseFloat(formData.payReceived) || 0;

    const regularHours = Math.min(hours, 40);
    const overtimeHours = Math.max(hours - 40, 0);
    const totalOwed = regularHours * rate + overtimeHours * (rate * 1.5);

    const shortage = totalOwed - received;
    const isShort = shortage > 0.01;
    const paidHours = rate > 0 ? (received / rate).toFixed(1) : "0";
    const unpaidHours = rate > 0 && isShort ? (shortage / rate).toFixed(1) : "0";

    setResult({
      totalOwed: totalOwed.toFixed(2),
      received: received.toFixed(2),
      shortage: isShort ? shortage.toFixed(2) : "0.00",
      isShort,
      totalHours: hours,
      paidHours,
      unpaidHours,
    });
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <div className="mb-8 md:mb-12">
          <p className="text-xs tracking-[0.24em] uppercase text-neutral-500 mb-3">WageShield</p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight mb-4">
            Get the money your boss owes you.
          </h1>
          <p className="text-neutral-400 text-base md:text-lg max-w-2xl">
            Instant wage check for hourly workers. Enter your hours and paycheck, and we calculate whether you were underpaid.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          <section className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 md:p-6">
            <form onSubmit={calculate} className="space-y-5" noValidate>
              <Field
                id="hourlyRate"
                label="Hourly wage"
                value={formData.hourlyRate}
                onChange={(v) => setFormData({ ...formData, hourlyRate: v })}
                prefix="$"
              />

              <Field
                id="hoursWorked"
                label="Hours worked this pay period"
                value={formData.hoursWorked}
                onChange={(v) => setFormData({ ...formData, hoursWorked: v })}
              />

              <Field
                id="payReceived"
                label="Paycheck before taxes"
                value={formData.payReceived}
                onChange={(v) => setFormData({ ...formData, payReceived: v })}
                prefix="$"
              />

              <button
                type="submit"
                className="w-full h-12 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors"
              >
                Check my paycheck
              </button>

              <p className="text-xs text-neutral-500 leading-relaxed">
                WageShield is educational and not legal advice. Final amounts can vary by state law, contract terms, and payroll deductions.
              </p>
            </form>
          </section>

          <section className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-5 md:p-6 min-h-[320px]">
            {!result ? (
              <div className="h-full flex flex-col justify-center">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">Result</p>
                <h2 className="text-2xl font-semibold mb-3">No calculation yet.</h2>
                <p className="text-neutral-400">
                  Fill the form and tap <span className="text-white">Check my paycheck</span> to see your estimated shortage and next steps.
                </p>
              </div>
            ) : result.isShort ? (
              <>
                <p className="text-xs uppercase tracking-[0.2em] text-amber-400 mb-3">Potential Wage Theft</p>
                <h2 className="text-3xl font-semibold mb-5">You may be owed ${result.shortage}</h2>

                <div className="space-y-3 text-sm mb-6">
                  <Row label="Total owed (incl. overtime)" value={`$${result.totalOwed}`} />
                  <Row label="Amount received" value={`$${result.received}`} />
                  <Row label="Estimated shortage" value={`$${result.shortage}`} strong />
                  <Row label="Estimated unpaid hours" value={`${result.unpaidHours}h`} />
                </div>

                <div className="border-t border-neutral-800 pt-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-3">Suggested next steps</p>
                  <ol className="list-decimal pl-5 text-sm text-neutral-300 space-y-2">
                    <li>Keep a daily log of start/end times and breaks.</li>
                    <li>Save all pay stubs and screenshots.</li>
                    <li>Contact your state labor board to file a wage claim.</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-400 mb-3">Looks Okay</p>
                <h2 className="text-3xl font-semibold mb-3">Paycheck looks accurate.</h2>
                <p className="text-neutral-400 mb-6">
                  Based on your inputs, your gross pay (${result.received}) meets or exceeds estimated owed pay (${result.totalOwed}).
                </p>
                <div className="space-y-3 text-sm">
                  <Row label="Hours worked" value={`${result.totalHours}h`} />
                  <Row label="Amount received" value={`$${result.received}`} />
                  <Row label="Estimated owed" value={`$${result.totalOwed}`} />
                </div>
              </>
            )}
          </section>
        </div>

        <footer className="mt-10 pt-6 border-t border-neutral-900 text-xs text-neutral-600 text-center">
          Built by <a href="https://infinite-machines-production.up.railway.app" className="text-neutral-400 hover:text-white">Infinite Machines</a>
        </footer>
      </div>
    </main>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  prefix,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-neutral-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">{prefix}</span>}
        <input
          id={id}
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 rounded-lg border border-neutral-700 bg-black text-white text-base focus:outline-none focus:ring-2 focus:ring-neutral-400 ${prefix ? "pl-7 pr-3" : "px-3"}`}
        />
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
      <span className="text-neutral-500">{label}</span>
      <span className={strong ? "font-semibold text-white" : "text-neutral-200"}>{value}</span>
    </div>
  );
}
