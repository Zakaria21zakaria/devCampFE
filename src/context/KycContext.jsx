import { createContext, useContext, useMemo, useState } from "react";

const KycContext = createContext(null);

export function KycProvider({ children }) {
	const [proofOfResidenceUploaded, setProofOfResidenceUploaded] = useState(false);
	const [selfieUploaded, setSelfieUploaded] = useState(false);

	const value = useMemo(
		() => ({
			proofOfResidenceUploaded,
			selfieUploaded,
			setProofOfResidenceUploaded,
			setSelfieUploaded,
			resetKyc: () => {
				setProofOfResidenceUploaded(false);
				setSelfieUploaded(false);
			},
		}),
		[proofOfResidenceUploaded, selfieUploaded],
	);

	return <KycContext.Provider value={value}>{children}</KycContext.Provider>;
}

export function useKyc() {
	const ctx = useContext(KycContext);
	if (!ctx) {
		throw new Error("useKyc must be used within a KycProvider");
	}
	return ctx;
}
