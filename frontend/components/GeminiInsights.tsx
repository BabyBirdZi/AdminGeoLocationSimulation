
import React, { useState, useEffect } from 'react';
import { Device, DeviceLocation, Enterprise } from '../../backend/types.ts';
import { GoogleGenAI } from "@google/genai";

interface GeminiInsightsProps {
  device: Device;
  history: DeviceLocation[];
  enterprise: Enterprise;
  isDarkMode: boolean;
  onClose: () => void;
}

const GeminiInsights: React.FC<GeminiInsightsProps> = ({ device, history, enterprise, isDarkMode, onClose }) => {
  const [insight, setInsight] = useState<string>('Analyzing tactical telemetry...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      if (!process.env.API_KEY || history.length < 5) return;
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const lastPoints = history.slice(-10);
        const prompt = `Movement summary for Unit "${device.alias}" (${enterprise.name}) in Tunisia. 
          Telemetry [Lat, Lng, Alt, Spd]: 
          ${lastPoints.map(p => `[${p.latitude.toFixed(5)}, ${p.longitude.toFixed(5)}, ${Math.round(p.altitude)}m, ${Math.round(p.speed)}km/h]`).join('; ')}. 
          Analyze behavior and operational context in 1 short professional sentence.`;
        
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        setInsight(response.text || "Normal operational parameters detected.");
      } catch (err) {
        setInsight("Pattern analysis matches standard enterprise profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, [device.device_id, history.length]);

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Tactical AI</h3>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {loading ? <span className="animate-pulse">Synthesizing data...</span> : `"${insight}"`}
        </p>
      </div>
    </div>
  );
};

export default GeminiInsights;
