export function inferEmby(tag: string): boolean {
	return !!tag.match(/emby/i);
}

export function inferLimit(tag: string): boolean {
	return !!tag.match(/限速/i);
}
