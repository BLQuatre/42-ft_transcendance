export interface LoginUser {
	name: string;
	password: string;
}
export interface GeneratedSecret {
	ascii: string;
	hex: string;
	base32: string;
	qr_code_ascii?: string | undefined;
	qr_code_hex?: string | undefined;
	qr_code_base32?: string | undefined;
	google_auth_qr: string;
	otpauth_url?: string | undefined;
}

export interface SimpleTfaSecret {
	ascii: string;
	hex: string;
	base32: string;
	otpauth_url: string;
}
