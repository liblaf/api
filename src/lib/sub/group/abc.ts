import type { Provider } from "@lib/sub/provider/abc";

export interface SmartGroup {
	name: string;
	filter: (outbound: string, provider: Provider) => boolean;
}
