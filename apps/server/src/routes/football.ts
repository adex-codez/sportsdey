import { Hono } from "hono";
import type { ScheduleRes } from "@/types/schedule";
import { transformFootballSchedule } from "@/utils/football";

const footballRoute = new Hono<{ Bindings: Cloudflare.Env }>();

footballRoute.get("/schedule/:date/:lang?", async (c) => {
	const date = c.req.param("date");
	const lang = c.req.param("lang");

	const base = c.env.SPORTRADAR_URL;
	const apiKey = c.env.SPORTRADAR_API_KEY;

	if (!base || !apiKey) {
		return c.json(
			{ error: "Missing SPORTRADAR_URL or SPORTRADAR_API_KEY env variable" },
			500,
		);
	}

	const langSegment = lang ? `${encodeURIComponent(lang)}/` : "en";
	const url = `${base.replace(/\/+$/, "")}/soccer/trial/v4/${langSegment}/schedules/${encodeURIComponent(
		date,
	)}/schedules.json`;

	try {
		const upstream = await fetch(url, {
			headers: { "x-api-key": apiKey, Accept: "application/json" },
		});

		if (!upstream.ok) {
			const body = await upstream.text();
			return c.json({
				error: "An error occured when fetching from external api",
				status: upstream.status,
				body,
			});
		}

		const data = (await upstream.json()) as ScheduleRes;

		// Transform the data before returning
		const transformedData = transformFootballSchedule(data);

		return c.json(transformedData);
	} catch (err) {
		return c.json({ error: String(err) }, 502);
	}
});

footballRoute.get("/schedule/live/:lang?", async (c) => {
	const lang = c.req.param("lang");

	const base = c.env.SPORTRADAR_URL;
	const apiKey = c.env.SPORTRADAR_API_KEY;

	if (!base || !apiKey) {
		return c.json(
			{ error: "Missing SPORTRADAR_URL or SPORTRADAR_API_KEY env variable" },
			500,
		);
	}

	const langSegment = lang ? `${encodeURIComponent(lang)}/` : "en";
	const url = `${base.replace(/\/+$/, "")}/soccer/trial/v4/${langSegment}/schedules/live/schedules.json`;

	try {
		const upstream = await fetch(url, {
			headers: { "x-api-key": apiKey, Accept: "application/json" },
		});

		if (!upstream.ok) {
			const body = await upstream.text();
			return c.json({
				error: "An error occured when fetching from external api",
				status: upstream.status,
				body,
			});
		}

		const data = (await upstream.json()) as ScheduleRes;

		// Transform the data before returning
		const transformedData = transformFootballSchedule(data);

		return c.json(transformedData);
	} catch (err) {
		return c.json({ error: String(err) }, 502);
	}
});

export default footballRoute;
