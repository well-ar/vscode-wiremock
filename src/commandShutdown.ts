import axios from 'axios';
import { WireMockInstance } from './WiremockInstance';

export async function commandShutdown() {
    const wireMockInstance = WireMockInstance.getInstance();
    const url = `http://localhost:${wireMockInstance.port}/__admin/shutdown`;
  
    try {
        await axios.post(url);
        wireMockInstance.outputChannel.appendLine('Wiremock shutdown');
    } catch (_ex) {
    }
}