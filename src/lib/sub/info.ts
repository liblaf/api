import { HTTPException } from "hono/http-exception";
import { makeProvider } from "./provider";

export type UserInfo = {
  name: string;
  url: string;
  web_page_url?: string;
  upload?: number;
  download?: number;
  total?: number;
  expire?: number;
};

export async function fetchInfo(
  urls: URL[],
  backend: URL,
): Promise<UserInfo[]> {
  return await Promise.all(urls.map((url) => fetchInfoOnce(url, backend)));
}

export async function fetchInfoOnce(url: URL, backend: URL): Promise<UserInfo> {
  const provider = makeProvider(url, backend);
  const response = await fetch(provider.userInfoUrl);
  if (!response.ok) {
    throw new HTTPException(response.status as any, {
      message: await response.text(),
    });
  }
  const info: UserInfo = {
    name: provider.name,
    url: provider.url.toString(),
  };
  const webPageUrl = response.headers.get("profile-web-page-url");
  if (webPageUrl) info.web_page_url = webPageUrl;
  const subscriptionUserInfo = response.headers.get("subscription-userinfo");
  if (subscriptionUserInfo) {
    subscriptionUserInfo.split(";").forEach((item) => {
      const [key, value] = item.split("=").map((s) => s.trim());
      switch (key) {
        case "upload":
          info.upload = parseInt(value);
          break;
        case "download":
          info.download = parseInt(value);
          break;
        case "total":
          info.total = parseInt(value);
          break;
        case "expire":
          info.expire = parseInt(value);
          break;
      }
    });
  }
  return info;
}
