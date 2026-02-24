type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

type ApiEnvelope = {
	success?: boolean | string;
	loginAccessKey?: string;
	errorMessage?: string;
	[key: string]: JsonValue | undefined;
};

export class ApiError<TData = unknown> extends Error {
	status: number;
	data: TData;

	constructor(message: string, status: number, data: TData) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
}

function toBasicAuth(username: string, password: string): string {
	// btoa expects Latin1; for typical emails/passwords this is fine.
	return btoa(`${username}:${password}`);
}

async function safeJson<T = unknown>(res: Response): Promise<T | null> {
	try {
		return await res.json();
	} catch {
		return null;
	}
}

export type LoginRequest = { username: string; password: string };
export type LoginResponse = { loginAccessKey: string; data: ApiEnvelope | null };

export async function login({ username, password }: LoginRequest): Promise<LoginResponse> {
	const credentials = toBasicAuth(username, password);

	const res = await fetch("/v1/token", {
		method: "POST",
		headers: {
			Authorization: `Basic ${credentials}`,
		},
	});

	const data = await safeJson<ApiEnvelope>(res);

	if (!res.ok) {
		const message = data?.errorMessage || "Invalid username or password";
		throw new ApiError(message, res.status, data);
	}

	const isSuccess =
		data?.success === true || data?.success === "true" || data?.success === "SUCCESS";
	const loginAccessKey = data?.loginAccessKey;

	if (!isSuccess || !loginAccessKey) {
		const message = data?.errorMessage || "Login failed";
		throw new ApiError(message, res.status, data);
	}

	return {
		loginAccessKey,
		data,
	};
}

export type CreateUserRequest = { username: string; password: string };
export type CreateUserResponse = { data: ApiEnvelope | null };

export async function createUser({ username, password }: CreateUserRequest): Promise<CreateUserResponse> {
	const res = await fetch("/v1/user", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password }),
	});

	const data = await safeJson<ApiEnvelope>(res);

	if (!res.ok) {
		const message =
			data?.errorMessage ||
			(res.status === 400
				? "An account with this email already exists. Please log in."
				: "Could not create user. Please try again.");
		throw new ApiError(message, res.status, data);
	}

	return { data };
}

export type CreateProfileRequest = {
	loginAccessKey: string;
	email: string;
	firstName: string;
	lastName: string;
	idNumber: string;
};
export type CreateProfileResponse = { data: ApiEnvelope | null };

export async function createProfile({
	loginAccessKey,
	email,
	firstName,
	lastName,
	idNumber,
}: CreateProfileRequest): Promise<CreateProfileResponse> {
	const res = await fetch("/client/v1/profile", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${loginAccessKey}`,
		},
		body: JSON.stringify({ email, firstName, lastName, idNumber }),
	});

	const data = await safeJson<ApiEnvelope>(res);

	if (!res.ok) {
		const message = data?.errorMessage || "Profile creation failed. Please try again.";
		throw new ApiError(message, res.status, data);
	}

	return { data };
}
