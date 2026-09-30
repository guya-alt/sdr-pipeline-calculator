import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Target, 
  ArrowUpRight, 
  ArrowDownRight,
  Briefcase,
  Layers,
  Percent,
  History,
  Info
} from 'lucide-react';

export default function App() {
  const [sdrCount, setSdrCount] = useState(5);
  const [targetRevenue, setTargetRevenue] = useState(150000);
  const [multiplier, setMultiplier] = useState(3);
  const [asp, setAsp] = useState(39345);
  const [qualRate, setQualRate] = useState(24);
  const [lastYearMeetings, setLastYearMeetings] = useState(248);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatNum = (val) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);
  const formatPct = (val) => new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(val / 100);

  const dealsWon = asp > 0 ? targetRevenue / asp : 0;
  const pipelineDeals = dealsWon * multiplier;
  const pipelineRevenue = targetRevenue * multiplier;
  const meetingsPerSdr = qualRate > 0 ? pipelineDeals / (qualRate / 100) : 0;
  const totalMeetings = meetingsPerSdr * sdrCount;
  
  const increaseNeeded = totalMeetings - lastYearMeetings;
  const pctIncrease = lastYearMeetings > 0 ? ((totalMeetings / lastYearMeetings) - 1) * 100 : 0;
  const isPositiveGap = increaseNeeded >= 0;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-zinc-900 font-sans selection:bg-zinc-200 p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="pb-6 border-b border-zinc-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white border border-zinc-200 rounded-md shadow-sm">
              <Calculator className="w-5 h-5 text-zinc-800" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Pipeline Calculator</h1>
          </div>
          <p className="text-zinc-500 text-sm">Reverse-engineer meeting requirements based on revenue targets.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {}
          <section className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h2 className="text-sm font-medium text-zinc-800">Variables</h2>
            </div>
            
            <div className="space-y-5">
              <InputRow 
                icon={<Users className="w-4 h-4" />} 
                label="Number of SDRs" 
                value={sdrCount} 
                setter={setSdrCount} 
                step="1" 
              />
              <InputRow 
                icon={<Target className="w-4 h-4" />} 
                label="Target Revenue per SDR ($)" 
                value={targetRevenue} 
                setter={setTargetRevenue} 
                step="1000" 
              />
              <InputRow 
                icon={<Layers className="w-4 h-4" />} 
                label="Pipeline Multiplier (x)" 
                value={multiplier} 
                setter={setMultiplier} 
                step="0.5" 
              />
              <InputRow 
                icon={<Briefcase className="w-4 h-4" />} 
                label="Average Selling Price ($)" 
                value={asp} 
                setter={setAsp} 
                step="100" 
              />
              <InputRow 
                icon={<Percent className="w-4 h-4" />} 
                label="Qualification Rate (%)" 
                value={qualRate} 
                setter={setQualRate} 
                step="1" 
              />
              <InputRow 
                icon={<History className="w-4 h-4" />} 
                label="Last Year's Meetings" 
                value={lastYearMeetings} 
                setter={setLastYearMeetings} 
                step="10" 
                tooltip="eng group size between 1-101, created in the last 365d , deal owner is known"
              />
            </div>
          </section>

          {}
          <section className="lg:col-span-8 flex flex-col space-y-8">
            
            {/* Primary Result: The Gap */}
            <div className="bg-zinc-900 text-white rounded-xl p-8 shadow-sm border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <TrendingUp className="w-48 h-48" />
              </div>
              <div className="relative z-10">
                <h3 className="text-zinc-400 text-sm font-medium mb-4 flex items-center gap-2">
                  Target Delta
                </h3>
                <div className="flex items-end gap-4 mb-2">
                  <div className="text-5xl md:text-6xl font-semibold tracking-tight">
                    {isPositiveGap ? "+" : ""}{formatNum(increaseNeeded)}
                  </div>
                  <div className={`flex items-center gap-1 text-lg mb-2 px-2 py-1 rounded-md font-medium ${isPositiveGap ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-800 text-zinc-400'}`}>
                    {isPositiveGap ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    {formatNum(Math.abs(pctIncrease))}%
                  </div>
                </div>
                <p className="text-zinc-400 text-sm max-w-md leading-relaxed mt-4">
                  To hit the new targets, the team must generate <strong className="text-zinc-200">{formatNum(Math.abs(increaseNeeded))}</strong> {isPositiveGap ? 'more' : 'fewer'} meetings compared to last year's baseline of {lastYearMeetings}.
                </p>
              </div>
            </div>

            {/* Secondary Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Total Meetings" value={formatNum(totalMeetings)} />
              <MetricCard label="Meetings per SDR" value={formatNum(meetingsPerSdr)} />
              <MetricCard label="Pipeline Deals" value={formatNum(pipelineDeals)} />
              <MetricCard label="Deals Won (SDR)" value={formatNum(dealsWon)} />
            </div>

            {}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
                <h3 className="text-sm font-medium text-zinc-800 flex items-center gap-2">
                  Formula Breakdown
                </h3>
              </div>
              <div className="p-6 text-sm text-zinc-600 font-mono space-y-4 overflow-x-auto">
                <FormulaRow 
                  step="1"
                  title="Deals Won Needed" 
                  formula="Target Revenue / ASP" 
                  calc={`${formatCurrency(targetRevenue)} / ${formatCurrency(asp)}`} 
                  result={formatNum(dealsWon)} 
                />
                <FormulaRow 
                  step="2"
                  title="Pipeline Deals" 
                  formula="Deals Won * Multiplier" 
                  calc={`${formatNum(dealsWon)} * ${multiplier}`} 
                  result={formatNum(pipelineDeals)} 
                />
                <FormulaRow 
                  step="3"
                  title="Pipeline Revenue" 
                  formula="Target Revenue * Multiplier" 
                  calc={`${formatCurrency(targetRevenue)} * ${multiplier}`} 
                  result={formatCurrency(pipelineRevenue)} 
                />
                <FormulaRow 
                  step="4"
                  title="Meetings (per SDR)" 
                  formula="Pipeline Deals / Qual Rate" 
                  calc={`${formatNum(pipelineDeals)} / ${qualRate}%`} 
                  result={formatNum(meetingsPerSdr)} 
                />
                <FormulaRow 
                  step="5"
                  title="Total Team Meetings" 
                  formula="Meetings per SDR * SDRs" 
                  calc={`${formatNum(meetingsPerSdr)} * ${sdrCount}`} 
                  result={formatNum(totalMeetings)} 
                />
                <div className="pt-3 border-t border-zinc-100">
                  <FormulaRow 
                    step="6"
                    title="Meeting Delta" 
                    formula="Total Meetings - Baseline" 
                    calc={`${formatNum(totalMeetings)} - ${lastYearMeetings}`} 
                    result={`${isPositiveGap ? '+' : ''}${formatNum(increaseNeeded)}`}
                    highlight 
                  />
                </div>
              </div>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}

function InputRow({ icon, label, value, setter, step, tooltip }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-600 mb-1.5 relative group w-fit cursor-default">
        <span className="flex items-center gap-2">
          <span className="text-zinc-400">{icon}</span>
          {label}
        </span>
        {tooltip && (
          <div className="relative flex items-center">
            <Info className="w-4 h-4 text-zinc-400 hover:text-zinc-600 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2.5 bg-zinc-800 text-zinc-100 text-xs font-normal rounded-md shadow-lg z-50 text-center pointer-events-none leading-relaxed">
              {tooltip}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-zinc-800"></div>
            </div>
          </div>
        )}
      </label>
      <input 
        type="number" 
        step={step}
        value={value} 
        onChange={(e) => setter(Number(e.target.value))} 
        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all outline-none" 
      />
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
      <span className="text-xs font-medium text-zinc-500 mb-2">{label}</span>
      <span className="text-2xl font-semibold tracking-tight text-zinc-900">{value}</span>
    </div>
  );
}

function FormulaRow({ step, title, formula, calc, result, highlight = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1">
      <div className="flex items-center gap-3 min-w-[240px]">
        <span className="text-zinc-400 select-none">{step}.</span>
        <span className="font-medium text-zinc-700">{title}</span>
      </div>
      <div className="hidden sm:block text-zinc-400 text-xs truncate flex-1 px-4">
        {formula}
      </div>
      <div className="flex items-center gap-3 text-right">
        <span className="text-zinc-400 text-xs hidden md:inline-block">{calc}</span>
        <span className="text-zinc-300 hidden md:inline-block">=</span>
        <span className={`font-semibold ${highlight ? 'text-zinc-900' : 'text-zinc-700'}`}>{result}</span>
      </div>
    </div>
  );
}