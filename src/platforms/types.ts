export interface SelfUpdateStatus {
  available: boolean;
  enabled: boolean;
}

export interface LanMode {
  mode: string;
  options: Record<string, unknown>;
}

export interface WirelessMode {
  enabled: boolean;
  mode: string;
  options: Record<string, unknown>;
}

export interface WirelessNetwork {
  ssid: string;
  quality: number;
  encryption: boolean;
  configured: boolean;
  connected: boolean;
}

export interface NetworkAddresses {
  lan: string;
  wlan: {
    ip: string;
    ssid: string;
  };
}
