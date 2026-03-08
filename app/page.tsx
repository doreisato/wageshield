"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    hourlyRate: "",
    hoursWorked: "",
    payReceived: ""
  });
  const [result, setResult] = useState<any>(null);

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
    const missingHours = isShort ? (shortage / rate).toFixed(2) : "0";

    setResult({
      totalOwed: totalOwed.toFixed(2),
      received: received.toFixed(2),
      shortage: isShort ? shortage.toFixed(2) : "0",
      missingHours: missingHours,
      isShort: isShort
    });
  };

  return (
    <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-6 py-12">
      <div className="flex-1">
        <h1 className="text-3xl font-medium tracking-tight mb-2">WageShield</h1>
        <p className="text-neutral-500 mb-8 leading-relaxed">Instantly verify your paycheck for wage theft. Calculates standard rate plus time-and-a-half overtime over 40 hours.</p>

        <form onSubmit={calculate} className="space-y-6 mb-12 bg-neutral-950 border border-neutral-900 rounded-lg p-6">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Hourly Rate ($)</label>
            <input
              type="number" step="0.01" min="0" required
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded text-white focus:outline-none focus:border-neutral-500"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Hours Worked (in pay period)</label>
            <input
              type="number" step="0.1" min="0" required
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded text-white focus:outline-none focus:border-neutral-500"
              value={formData.hoursWorked}
              onChange={(e) => setFormData({...formData, hoursWorked: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Actual Gross Pay Received ($)</label>
            <input
              type="number" step="0.01" min="0" required
              className="w-full bg-neutral-900 border border-neutral-800 p-3 rounded text-white focus:outline-none focus:border-neutral-500"
              value={formData.payReceived}
              onChange={(e) => setFormData({...formData, payReceived: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-white text-black font-medium py-3 rounded hover:bg-neutral-200 transition">
            Calculate Shortage
          </button>
        </form>

        {result && (
          <div className={`p-6 rounded-lg border mb-12 ${result.isShort ? 'border-red-900 bg-red-950/10' : 'border-emerald-900 bg-emerald-950/10'}`}>
            <h2 className="text-xl font-medium mb-4">{result.isShort ? "Wage Theft Detected" : "Paycheck Accurate"}</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Total Owed (inc. OT)</span>
                <span className="font-medium">${result.totalOwed}</span>
              </div>
              <div className="flex justify-between text-sm border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Amount Received</span>
                <span className="font-medium">${result.received}</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-neutral-400">Shortage Amount</span>
                <span className={`font-medium ${result.isShort ? 'text-red-400' : 'text-emerald-400'}`}>${result.shortage}</span>
              </div>
            </div>

            {result.isShort && (
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded text-sm text-neutral-300">
                <p className="mb-2"><strong>Unpaid Time:</strong> You are missing approximately {result.missingHours} hours of pay.</p>
                <p className="text-xs text-neutral-500 mt-4 uppercase tracking-widest font-medium">Next Steps</p>
                <ul className="list-disc pl-4 mt-2 text-neutral-400 text-xs space-y-1">
                  <li>Take screenshots of your timesheets immediately.</li>
                  <li>Email your manager asking for a payroll correction in writing.</li>
                  <li>If ignored, file an unpaid wage claim with your state Labor Board.</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-neutral-600 border-t border-neutral-900 pt-6">
          <p>Disclaimer: This is an educational tool, not legal advice. Computations assume standard federal overtime (1.5x after 40 hours). State laws may vary. Consult Department of Labor or an employment attorney for official claims.</p>
        </div>
      </div>

      <footer className="mt-12 py-6 text-center text-xs text-neutral-600">
        Built by <a href="https://infinite-machines-production.up.railway.app" className="text-neutral-400 hover:text-white transition">Infinite Machines</a>
      </footer>
    </main>
  );
}