import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useActivity } from '../../activities/api/activities.hooks';
import { useMarkAttendance } from '../api/attendance.hooks';
import { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';

export const AdminScan = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const { data: activity } = useActivity(activityId || '');
  const markAttendanceMutation = useMarkAttendance();
  const navigate = useNavigate();

  const [lastScanned, setLastScanned] = useState<{
    name: string;
    type: string;
    time: string;
    success: boolean;
  } | null>(null);

  const [isScanning, setIsScanning] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);

  const readerElementId = 'qr-reader';

  const onScanSuccess = useCallback((decodedText: string) => {
    if (!activityId) {
      toast.error('No activity selected');
      return;
    }

    // 🚫 Prevent duplicate processing
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Pause scanning while processing
    scannerRef.current?.pause();

    markAttendanceMutation.mutate(
      {
        activityId,
        qrToken: decodedText,
        scanMethod: 'QR_SCAN',
      },
      {
        onSuccess: (response) => {
          setLastScanned({
            name: response.userName,
            type: response.attendanceType,
            time: new Date().toLocaleTimeString(),
            success: true,
          });

          toast.success(
            `${response.userName} marked as ${response.attendanceType}`
          );
        },
        onError: (error: Error) => {
          setLastScanned({
            name: 'Error',
            type: error.message || 'Failed to mark attendance',
            time: new Date().toLocaleTimeString(),
            success: false,
          });

          toast.error(error.message || 'Failed to mark attendance');
        },
        onSettled: () => {
          // ⏳ Cooldown before allowing next scan
          setTimeout(() => {
            scannerRef.current?.resume();
            isProcessingRef.current = false;
            setLastScanned(null);
          }, 1500);
        },
      }
    );
  }, [activityId, markAttendanceMutation]);

  const onScanError = useCallback((errorMessage: string) => {
    if (!errorMessage.includes('NotFoundException')) {
      console.error('QR Scan Error:', errorMessage);
    }
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(readerElementId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            aspectRatio: 1, // Force square camera view
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrSize = Math.floor(minEdge * 0.7);
              return { width: qrSize, height: qrSize };
            },
          },
          onScanSuccess,
          onScanError
        );

        setIsScanning(true);
      } catch (err) {
        console.error('Failed to start scanner:', err);
        toast.error('Failed to start camera. Please check permissions.');
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScanError, onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col text-white">
      <header className="flex items-center justify-between p-6">
        <button
          onClick={() => navigate('/admin/activities')}
          className="p-2 bg-slate-800 rounded-xl"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="text-center">
          <h2 className="text-lg font-bold">QR Scanner</h2>
          <p className="text-xs text-slate-400">
            {activity?.title || 'Loading...'}
          </p>
        </div>

        <div className="w-10" />
      </header>

      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] aspect-square relative rounded-[3rem] overflow-hidden bg-slate-800 border-4 border-slate-700">
          <div id={readerElementId} className="w-full h-full" />

          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <p className="text-slate-400">Initializing camera...</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {lastScanned ? (
          <div
            className={`rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom ${lastScanned.success ? 'bg-green-500' : 'bg-red-500'
              }`}
          >
            {lastScanned.success ? (
              <CheckCircle2 size={28} />
            ) : (
              <XCircle size={28} />
            )}

            <div>
              <p className="text-xs font-bold">
                {lastScanned.success ? 'Verified' : 'Error'}
              </p>
              <p className="font-bold">{lastScanned.name}</p>
              <p className="text-xs opacity-90">{lastScanned.type}</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <AlertCircle size={24} className="text-blue-400" />
            <div>
              <p className="text-xs font-bold text-slate-400">
                Ready to Scan
              </p>
              <p className="text-sm">Point camera at QR code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
