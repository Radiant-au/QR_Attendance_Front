
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, CheckCircle2, AlertCircle, X, Maximize } from 'lucide-react';

const AdminScan: React.FC = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState<{ name: string; time: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulated Camera Stream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          setError("Camera access denied. Please enable camera permissions.");
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const simulateScan = () => {
    // Logic to simulate a successful scan since we don't have a real QR decoder in this snippet
    setLastScanned({
      name: `Student #${Math.floor(Math.random() * 9000) + 1000}`,
      time: new Date().toLocaleTimeString(),
    });
    setTimeout(() => setLastScanned(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold">Attendance Scanner</h2>
          <p className="text-xs text-slate-400">Hackathon 2024 - Ongoing</p>
        </div>
        <div className="w-10"></div>
      </header>

      {/* Camera Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] aspect-square relative rounded-[3rem] overflow-hidden bg-slate-800 border-4 border-slate-700">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover grayscale contrast-125"
          />
          
          {/* Scanning Overlay Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
             <div className="w-64 h-64 border-2 border-blue-400/50 rounded-3xl flex items-center justify-center relative">
                {/* Corner Markers */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
                
                {/* Moving Beam */}
                <div className="w-full h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_infinite]"></div>
             </div>
          </div>
          
          {error && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-10 text-center">
               <AlertCircle size={48} className="text-red-500 mb-4" />
               <p className="text-sm font-medium mb-6">{error}</p>
               <button className="px-6 py-2 bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider">Settings</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Success Indicator */}
      <div className="p-8">
        <div className="max-w-md mx-auto relative h-20">
           {lastScanned ? (
             <div className="absolute inset-0 bg-green-500 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom duration-300">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                   <CheckCircle2 size={28} />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-green-900/60">Verified</p>
                   <p className="font-bold text-white">{lastScanned.name}</p>
                </div>
                <div className="ml-auto text-right">
                   <p className="text-[10px] text-green-100 font-medium">Recorded at</p>
                   <p className="text-xs font-bold text-white">{lastScanned.time}</p>
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center gap-4">
                <p className="text-slate-400 text-sm font-medium animate-pulse">Waiting for QR Code...</p>
                <button 
                  onClick={simulateScan}
                  className="px-6 py-2 bg-slate-800 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-700 hover:text-white transition-all"
                >
                  Test Scan
                </button>
             </div>
           )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-32px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(32px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AdminScan;
