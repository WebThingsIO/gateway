export interface SelfUpdateStatus {
  available: boolean; // Automatic updates are possible
  enabled: boolean; // Automatic updates are enabled
  configurable: boolean; // Automatic updates can be turned on and off
  triggerable: boolean; // Updates can be manually triggered by the user
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
