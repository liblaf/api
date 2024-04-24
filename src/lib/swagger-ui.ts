import { html } from "hono/html";

const HTML = html`
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Swagger UI" />
      <title>Swagger UI</title>
      <link
        id="swagger-theme"
        rel="stylesheet"
        href="https://registry.npmmirror.com/swagger-ui-dist/latest/files/swagger-ui.css"
      />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script
        src="https://registry.npmmirror.com/swagger-ui-dist/latest/files/swagger-ui-bundle.js"
        crossorigin
      ></script>
      <script>
        function setColorScheme(scheme) {
          const link = document.getElementById("swagger-theme");
          switch (scheme) {
            case "dark":
              link.href =
                "https://jcphlux.github.io/swagger-ui-themes/css/swagger-dark-modern-ui.css";
              break;
            case "light":
              link.href =
                "https://registry.npmmirror.com/swagger-ui-dist/latest/files/swagger-ui.css";
              break;
            default:
              setColorScheme("light");
              break;
          }
        }

        function getPreferredColorScheme() {
          if (window.matchMedia) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
              return "dark";
            } else {
              return "light";
            }
          }
          return "light";
        }

        function updateColorScheme() {
          setColorScheme(getPreferredColorScheme());
        }

        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: "/openapi.json",
            dom_id: "#swagger-ui",
          });
          if (window.matchMedia) {
            var colorSchemeQuery = window.matchMedia(
              "(prefers-color-scheme: dark)",
            );
            colorSchemeQuery.addEventListener("change", updateColorScheme);
          }
          updateColorScheme();
        };
      </script>
    </body>
  </html>
`;

export default HTML;
