function toBasicAuth(username, password) {
	// btoa expects Latin1; for typical emails/passwords this is fine.
	return btoa(`${username}:${password}`);
}

async function safeJson(res) {
	try {
		return await res.json();
	} catch {
		return null;
	}
}

export async function login({ username, password }) {
	const credentials = toBasicAuth(username, password);

	const res = await fetch("/v1/token", {
		method: "POST",
		headers: {
			Authorization: `Basic ${credentials}`,
		},
	});

	const data = await safeJson(res);

	if (!res.ok) {
		const message = data?.errorMessage || "Invalid username or password";
		const err = new Error(message);
		err.status = res.status;
		err.data = data;
		throw err;
	}

	const isSuccess =
		data?.success === true || data?.success === "true" || data?.success === "SUCCESS";
	const loginAccessKey = data?.loginAccessKey;

	if (!isSuccess || !loginAccessKey) {
		const message = data?.errorMessage || "Login failed";
		const err = new Error(message);
		err.status = res.status;
		err.data = data;
		throw err;
	}

	return {
		loginAccessKey,
		data,
	};
}

export async function createUser({ username, password }) {
	const res = await fetch("/v1/user", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password }),
	});

	const data = await safeJson(res);

	if (!res.ok) {
		const message =
			data?.errorMessage ||
			(res.status === 400
				? "An account with this email already exists. Please log in."
				: "Could not create user. Please try again.");
		const err = new Error(message);
		err.status = res.status;
		err.data = data;
		throw err;
	}

	return { data };
}

export async function createProfile({ loginAccessKey, email, firstName, lastName, idNumber }) {
	const res = await fetch("/client/v1/profile", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${loginAccessKey}`,
		},
		body: JSON.stringify({ email, firstName, lastName, idNumber }),
	});

	const data = await safeJson(res);

	if (!res.ok) {
		const message = data?.errorMessage || "Profile creation failed. Please try again.";
		const err = new Error(message);
		err.status = res.status;
		err.data = data;
		throw err;
	}

	return { data };
}
