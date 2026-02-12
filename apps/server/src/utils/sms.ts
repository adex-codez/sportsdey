export async function sendSms(opts: {
	ref_id: string;
	sender_id: string;
	recipients: string;
	telco?: string;
	message: string;
}) {
	const url = "https://bulkapi.eudormsg.com/v1/sms/send";
	const token = "eudor_MWw5O61Af43-iwnmDkGWbGuQ0jmfbussuE0BCr3uTyc=";

	const payload = {
		ref_id: opts.ref_id,
		sender_id: opts.sender_id,
		recipient: opts.recipients,
		message: opts.message,
	};

	try {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		let body = null;
		try {
			body = await res.json();
		} catch (e) {
			body = null;
		}

		return { ok: res.ok, status: res.status, body };
	} catch (error: any) {
		return { ok: false, error: error?.message || String(error) };
	}
}
