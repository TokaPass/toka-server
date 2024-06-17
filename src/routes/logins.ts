import type { Context, Hono } from "hono"
import type { Login } from "../types"

/**
 * Handle GET / requests.
 *
 * @param {import('hono').Context} ctx Request context.
 * @return {Response}
 */
const handleIndexPage = (ctx: Context) => {
  return ctx.text("go away")
}

/**
 * Handle GET /dummy requests.
 * 
 * @param {import('hono').Context} ctx Request context.
 * @return {Response}
 */
const handleDummyData = (ctx: Context) => {
  const dummyData: Login[] = [
    {
      id: 1,
      password: "password",
      url: "https://example.com/login.html",
      username: "username"
    }
  ]

  return ctx.json({
    code: 200,
    data: dummyData
  })
}

/**
 * Register core routes.
 *
 * @param {import('hono').Hono} app App instance.
 */
export default (app: Hono) => {
  app.get("/logins", handleIndexPage)

  app.get("/logins/dummy", handleDummyData)
}