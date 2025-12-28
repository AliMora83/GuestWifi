import express from 'express';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3003', 10);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', async (req, res) => {
    try {
        const { ssid, password } = req.body;

        if (!ssid) {
            res.status(400).json({ error: 'SSID is required' });
            return; // Ensure we return void
        }

        // WIFI:S:SSID;T:WPA;P:PASSWORD;;
        const wifiString = `WIFI:S:${ssid};T:WPA;P:${password || ''};;`;

        const qrCodeDataUrl = await QRCode.toDataURL(wifiString, {
            errorCorrectionLevel: 'H',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff00' // Transparent background
            }
        });

        res.json({ qrCode: qrCodeDataUrl });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
