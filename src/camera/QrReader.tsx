import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

import cls from './QrReader.module.css';

export const QrReader = () => {
    const scanner = useRef<QrScanner>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const qrBoxRef = useRef<HTMLDivElement>(null);

    const [qrOn, setQrOn] = useState<boolean>(true);
    const [scannedResult, setScannedResult] = useState<string | undefined>('');

    const onScanSuccess = (result: QrScanner.ScanResult) => {
        console.log(result);
        setScannedResult(result?.data);
    };

    const onScanFail = (err: string | Error) => {
        console.log(err);
    };

    const onError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.style.display = 'none';
    };

    useEffect(() => {
        if (videoRef?.current && !scanner.current) {
            scanner.current = new QrScanner(videoRef?.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: 'environment',
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxRef?.current || undefined,
            });

            scanner?.current
                ?.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    if (err) setQrOn(false);
                });
        }

        return () => {
            if (!videoRef.current) {
                scanner?.current?.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (!qrOn) {
            console.log(
                'Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.',
            );
        }
    }, [qrOn]);

    useEffect(() => {
        QrScanner.listCameras().then((cameras) => console.log(cameras));
    }, []);
    
    return (
        <div className={cls.qrReader}>
            <video ref={videoRef}></video>
            <video ref={videoRef}></video>
            <div ref={qrBoxRef} className={cls.qrBox}>
                {!videoRef?.current && <img src="" alt="Qr Frame" className={cls.qrFrame} onError={onError} />}
            </div>
            {scannedResult && (
                <>
                    <div className={cls.resultWrapper}></div>
                    <p className={cls.result}>{scannedResult}</p>
                </>
            )}
        </div>
    );
};
