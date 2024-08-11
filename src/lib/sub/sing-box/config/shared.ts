export type ListenFields = {
  // TODO: Add more fields
  listen?: string;
  listen_port?: number;
  tcp_fast_open?: boolean;
  tcp_multi_path?: boolean;
  sniff?: boolean;
};

export type DialFields = {
  // TODO: Add more fields
  tcp_fast_open?: boolean;
  tcp_multi_path?: boolean;
};
