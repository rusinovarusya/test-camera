import { Fragment, useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

import cls from './QrReader.module.css';

interface ICamera {
    id: string;
    label: string;
}

export const QrReader = () => {
    const scanner = useRef<QrScanner>();
    const videoRef = useRef<HTMLVideoElement>(null);
    const qrBoxRef = useRef<HTMLDivElement>(null);

    const [qrOn, setQrOn] = useState<boolean>(true);
    const [scannedResult, setScannedResult] = useState<string | undefined>('');
    // const [cameraList, setCameraList] = useState<string[]>([]);
    // const [cameraList, setCameraList] = useState<unknown[]>([]);
    const [cameraList, setCameraList] = useState<ICamera[]>([]);

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
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
        QrScanner.listCameras().then((cameras) => setCameraList(cameras));
    }, []);
    
    return (
        <div className={cls.qrReader}>
            <video ref={videoRef}></video>
            <video ref={videoRef}></video>
            <div ref={qrBoxRef} className={cls.qrBox}>
                {!videoRef?.current && <img src="" alt="Qr Frame" className={cls.qrFrame} onError={onError} />}
            </div>
            <div className={cls.list}>{cameraList.map((camera) => (
                <Fragment key={camera.id}>
                  {/* <p className={cls.item}>{camera.id}</p> */}
                  <p className={cls.item}>{camera.label}</p>
                </Fragment>
            ))}</div>
            {scannedResult && (
                <>
                    <div className={cls.resultWrapper}></div>
                    <p className={cls.result}>{scannedResult}</p>
                </>
            )}
        </div>
    );
};
