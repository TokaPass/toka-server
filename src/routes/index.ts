import type { Context, Hono } from "hono"

/**
 * Handle GET / requests.
 *
 * @param {import('hono').Context} ctx Request context.
 * @return {Response}
 */
const handleIndexPage = (ctx: Context) => {
  return ctx.text("marabalar")
}

/**
 * Handle GET /status requests.
 * 
 * @param {import('hono').Context} ctx Request context.
 * @return {Response}
 */
const handleStatusPage = (ctx: Context) => {
  return ctx.json({
    code: 200
  })
}

/**
 * Register core routes.
 *
 * @param {import('hono').Hono} app App instance.
 */
export default (app: Hono) => {
  app.get("/", handleIndexPage)

  app.get("/status", handleStatusPage)
}