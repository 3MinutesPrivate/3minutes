export default {
  /**
   * Cloudflare Worker entrypoint
   * - GET /defaults: returns current default interest rate & other knobs
   * - POST /log: store anonymised override events for later aggregation
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "");

    if (request.method === "GET" && path.endsWith("/defaults")) {
      return this.handleGetDefaults(env);
    }

    if (request.method === "POST" && path.endsWith("/log")) {
      return this.handlePostLog(request, env);
    }

    return new Response("Not found", { status: 404 });
  },

  async handleGetDefaults(env) {
    try {
      let defaults = null;
      if (env.HIVEMIND_DEFAULTS) {
        const raw = await env.HIVEMIND_DEFAULTS.get("defaults");
        if (raw) {
          defaults = JSON.parse(raw);
        }
      }

      if (!defaults) {
        defaults = {
          interestRate: 4.1,
        };
      }

      return new Response(JSON.stringify(defaults), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: "failed_to_load_defaults",
          message: String(e),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },

  async handlePostLog(request, env) {
    try {
      const body = await request.json();
      const event = {
        type: body.type || "UNKNOWN",
        value: body.value,
        ts: body.ts || new Date().toISOString(),
        ua: request.headers.get("User-Agent") || "",
      };

      if (env.HIVEMIND_LOGS) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        await env.HIVEMIND_LOGS.put(id, JSON.stringify(event));
      }

      return new Response(
        JSON.stringify({ ok: true }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: "failed_to_log_event",
          message: String(e),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
