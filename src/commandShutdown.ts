import axios from 'axios';
import { WireMockInstance } from './WiremockInstance';

export async function commandShutdown() {
    const wireMockInstance = WireMockInstance.getInstance();
    
    if(!wireMockInstance.started) {
        return;
    }
    
    try {
        await axios.post(wireMockInstance.wiremockUrl + "/__admin/shutdown");
        wireMockInstance.started = false;
        wireMockInstance.outputChannel.appendLine('Wiremock shutdown');
    } catch (_ex) {
    }
}