
import React, { useState, useCallback, useMemo } from 'react';
import { UserConstraints, DecisionResult, ComparisonRow } from './types';
import { calculateDecisionTable } from './logic';
import { getExpertAnalysis } from './geminiService';

// --- Sub-components ---

const RadioGroup: React.FC<{
  label: string;
  name: keyof UserConstraints;
  options: string[];
  value: string;
  onChange: (name: keyof UserConstraints, val: any) => void;
}> = ({ label, name, options, value, onChange }) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(name, opt)}
          className={`px-4 py-2 rounded-lg text-sm transition-all border ${
            value === opt
              ? 'bg-blue-600 border-blue-600 text-white shadow-md'
              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400'
          }`}
        >
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

const ComparisonTable: React.FC<{ data: ComparisonRow[] }> = ({ data }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
    <table className="w-full text-left border-collapse bg-white">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-sm font-bold text-gray-900 border-b">Feature</th>
          <th className="px-6 py-4 text-sm font-bold text-gray-900 border-b">AWS Lambda</th>
          <th className="px-6 py-4 text-sm font-bold text-gray-900 border-b">AWS EC2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <React.Fragment key={idx}>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b">{row.feature}</td>
              <td className={`px-6 py-4 text-sm border-b ${row.winner === 'lambda' ? 'bg-green-50' : ''}`}>
                {row.lambda}
              </td>
              <td className={`px-6 py-4 text-sm border-b ${row.winner === 'ec2' ? 'bg-green-50' : ''}`}>
                {row.ec2}
              </td>
            </tr>
            {row.reason && (
              <tr>
                <td colSpan={3} className="px-6 py-2 bg-blue-50/30 text-xs text-blue-700 italic border-b">
                  <i className="fas fa-info-circle mr-2"></i> Heuristic Result: {row.reason}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Main App ---

export default function App() {
  const [constraints, setConstraints] = useState<UserConstraints>({
    budget: 'medium',
    traffic: 'steady',
    scalability: 'automatic',
    control: 'medium',
    devSpeed: 'high',
  });

  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConstraintChange = (name: keyof UserConstraints, value: any) => {
    setConstraints((prev) => ({ ...prev, [name]: value }));
  };

  const comparisonData = useMemo(() => calculateDecisionTable(constraints), [constraints]);

  const handleGenerateAnalysis = async () => {
    setLoading(true);
    const result = await getExpertAnalysis(constraints);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
          <i className="fas fa-gavel text-2xl"></i>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">The Referee</h1>
        <p className="mt-2 text-lg text-gray-600">Decision-Support System: AWS Lambda vs. AWS EC2</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Inputs */}
        <aside className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <i className="fas fa-sliders-h mr-3 text-blue-500"></i> Set Constraints
          </h2>

          <RadioGroup
            label="Budget Availability"
            name="budget"
            options={['low', 'medium', 'high']}
            value={constraints.budget}
            onChange={handleConstraintChange}
          />

          <RadioGroup
            label="Traffic Pattern"
            name="traffic"
            options={['low', 'steady', 'unpredictable', 'high']}
            value={constraints.traffic}
            onChange={handleConstraintChange}
          />

          <RadioGroup
            label="Scalability Preference"
            name="scalability"
            options={['manual', 'automatic']}
            value={constraints.scalability}
            onChange={handleConstraintChange}
          />

          <RadioGroup
            label="Infrastructure Control"
            name="control"
            options={['low', 'medium', 'high']}
            value={constraints.control}
            onChange={handleConstraintChange}
          />

          <RadioGroup
            label="Dev Speed Priority"
            name="devSpeed"
            options={['low', 'high']}
            value={constraints.devSpeed}
            onChange={handleConstraintChange}
          />

          <button
            onClick={handleGenerateAnalysis}
            disabled={loading}
            className="w-full mt-4 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <i className="fas fa-circle-notch fa-spin mr-2"></i> Analyzing...
              </span>
            ) : (
              "Get AI Trade-off Analysis"
            )}
          </button>
        </aside>

        {/* Right Panel: Results */}
        <main className="lg:col-span-8 space-y-8">
          {/* Comparison Framework Section */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Comparison Matrix</h2>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full uppercase">
                Dynamic Matrix
              </span>
            </div>
            <ComparisonTable data={comparisonData} />
          </section>

          {/* Pros & Cons Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
              <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                <i className="fas fa-bolt mr-2"></i> AWS Lambda Edge
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-green-800">
                  <i className="fas fa-check-circle mt-1 mr-2 flex-shrink-0"></i>
                  No idle costs; perfect for sporadic traffic.
                </li>
                <li className="flex items-start text-sm text-green-800">
                  <i className="fas fa-check-circle mt-1 mr-2 flex-shrink-0"></i>
                  Hands-off maintenance (managed).
                </li>
                <li className="flex items-start text-sm text-green-800">
                  <i className="fas fa-check-circle mt-1 mr-2 flex-shrink-0"></i>
                  Deployment is just uploading code.
                </li>
              </ul>
            </div>
            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
              <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                <i className="fas fa-server mr-2"></i> AWS EC2 Advantage
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start text-sm text-purple-800">
                  <i className="fas fa-check-circle mt-1 mr-2 flex-shrink-0"></i>
                  Complete flexibility over the OS stack.
                </li>
                <li className="flex items-start text-sm text-purple-800">
                  <i className="fas fa-check-circle mt-1 mr-2 flex-shrink-0"></i>
                  Cheaper for high-volume, sustained workloads.
                </li>
                <li className="flex items-start text-sm text-purple-800">
                  <i className="fas fa-check-circle mt-1 mr-2 flex-shrink-0"></i>
                  Standard Linux/Windows ecosystem compatibility.
                </li>
              </ul>
            </div>
          </section>

          {/* AI Analysis Result */}
          {analysis && (
            <section className="bg-gray-900 text-gray-100 p-8 rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fas fa-brain text-8xl"></i>
              </div>
              <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">
                The Referee's Verdict: Trade-off Analysis
              </h2>
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="whitespace-pre-wrap leading-relaxed text-gray-300">
                  {analysis}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-700 text-sm text-gray-400">
                <p className="font-semibold uppercase tracking-wider text-gray-500 text-xs mb-2">Final Guidance</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <span className="font-bold text-blue-400">Choose Lambda if:</span>
                    <p className="mt-1">Traffic is unpredictable, dev speed is the priority, and you want zero management.</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <span className="font-bold text-purple-400">Choose EC2 if:</span>
                    <p className="mt-1">You need deep OS control, run long-running processes, or have a steady, heavy traffic base.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!analysis && !loading && (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-2xl">
              <i className="fas fa-magic text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 font-medium">Click the button on the left to generate an AI-powered expert analysis.</p>
            </div>
          )}
        </main>
      </div>
      
      {/* Footer / Blog Context */}
      <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} The Referee Decision System</p>
        <div className="mt-2 flex items-center justify-center space-x-4">
          <a href="#" className="hover:text-blue-600"><i className="fab fa-github mr-1"></i> View Code</a>
          <a href="#" className="hover:text-blue-600"><i className="fas fa-book mr-1"></i> Tech Blog</a>
        </div>
      </footer>
    </div>
  );
}
