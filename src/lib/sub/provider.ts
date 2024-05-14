interface ProviderFactory {
  pattern: RegExp;
  name?: (sub: URL) => string;
  userInfoUrl?: (sub: URL) => URL;
  singBoxUrl?: (sub: URL) => URL;
}

function constName(name: string) {
  return (sub: URL): string => name;
}

function setSearchParams(params: [string, string][]) {
  return (sub: URL): URL => {
    const url = new URL(sub);
    for (const [key, value] of params) {
      url.searchParams.set(key, value);
    }
    return url;
  };
}

function subConvert(sub: URL, target: string, backend: URL): URL {
  const url = new URL(backend);
  url.searchParams.set("target", target);
  url.searchParams.set("list", "true");
  url.search += `&url=${encodeURIComponent(sub.toString())}`;
  return url;
}

const PROVIDERS: ProviderFactory[] = [
  {
    pattern: /aca/,
    name: constName("ACA"),
    userInfoUrl: setSearchParams([["flag", "clash"]]),
  },
  {
    pattern: /fldylink/,
    name: constName("FastLink"),
    userInfoUrl: setSearchParams([
      ["clash", "1"],
      ["extend", "1"],
    ]),
  },
  {
    pattern: /fbsublink/,
    name: constName("FlyingBird"),
    userInfoUrl: setSearchParams([
      ["extend", "1"],
      ["sub", "2"],
    ]),
  },
  {
    pattern: /nthu/,
    name: constName("NTHU.CC"),
    userInfoUrl: setSearchParams([["flag", "clash"]]),
  },
  {
    pattern: /cos.cat/,
    name: constName("🏳️‍⚧️ 私房菜"),
    userInfoUrl: setSearchParams([["flag", "sing"]]),
    singBoxUrl: setSearchParams([["flag", "sing"]]),
  },
  {
    pattern: /jmssub.net/,
    name: constName("JMS"),
  },
  {
    pattern: /.*/,
  },
];

export type Provider = {
  name: string;
  url: URL;
  singBoxUrl: URL;
  userInfoUrl: URL;
};

export function makeProvider(sub: URL, backend: URL): Provider {
  for (const { pattern, name, userInfoUrl, singBoxUrl } of PROVIDERS) {
    if (pattern.test(sub.hostname)) {
      return {
        name: name ? name(sub) : sub.hostname,
        url: sub,
        userInfoUrl: userInfoUrl ? userInfoUrl(sub) : sub,
        singBoxUrl: singBoxUrl
          ? singBoxUrl(sub)
          : subConvert(sub, "singbox", backend),
      };
    }
  }
  throw new Error(`Unsupported subscription: ${sub}`);
}
