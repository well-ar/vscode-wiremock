import axios from 'axios';
import { WireMockInstance } from './WiremockInstance';

export async function commandReset() {
    const wireMockInstance = WireMockInstance.getInstance();
    const url = `http://localhost:${wireMockInstance.port}/__admin/reset`;
  
    try {
        await axios.post(url);
        wireMockInstance.outputChannel.appendLine("WireMock reset");
    } catch (_ex) {
    }
}