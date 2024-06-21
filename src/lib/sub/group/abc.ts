import type { Provider } from "@lib/sub/provider/abc";

export abstract class SmartGroup {
	abstract name: string;
	abstract filter(name: string, provider: Provider): boolean;
}
