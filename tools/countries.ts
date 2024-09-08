import { FLAGS } from "@sub/group/filter/infer/country";

const PATTERNS: Record<string, string[]> = {
  DE: ["German"],
  TR: ["Turkey"],
};

function getCountryFlag(country: string): string {
  return country
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 0x1f1a5))
    .join("");
}

const name = new Intl.DisplayNames("en", { style: "narrow", type: "region" });
for (const country in FLAGS) {
  console.log(`${country}: "${getCountryFlag(country)} ${name.of(country)}",`);
}
console.log();

const names = [];
for (const locale of ["en", "zh"]) {
  for (const style of ["narrow", "short", "long"]) {
    names.push(
      new Intl.DisplayNames(locale, {
        style: style as Intl.RelativeTimeFormatStyle,
        type: "region",
      }),
    );
  }
}
for (const country in FLAGS) {
  const patterns = [getCountryFlag(country), country];
  for (const name of names) {
    const n = name.of(country);
    if (n && !patterns.includes(n)) patterns.push(n);
  }
  for (const p of PATTERNS[country] || []) {
    if (!patterns.includes(p)) patterns.push(p);
  }
  console.log(`${country}: /${patterns.join("|")}/,`);
}
