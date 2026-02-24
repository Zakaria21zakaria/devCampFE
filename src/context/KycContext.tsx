import { createContext, useContext, useMemo, useState} from "react";
import type {ReactNode, Dispatch, SetStateAction } from "react";

interface KycContextType {
	proofOfResidenceUploaded: boolean;
	selfieUploaded: boolean;
	setProofOfResidenceUploaded: Dispatch<SetStateAction<boolean>>;
	setSelfieUploaded: Dispatch<SetStateAction<boolean>>;
	resetKyc: () => void;
}

const KycContext = createContext<KycContextType | null>(null);

export function KycProvider({ children }: { children: ReactNode }) {
	const [proofOfResidenceUploaded, setProofOfResidenceUploaded] = useState<boolean>(false);
	const [selfieUploaded, setSelfieUploaded] = useState<boolean>(false);

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

export function useKyc(): KycContextType {
	const ctx = useContext(KycContext);
	if (!ctx) {
		throw new Error("useKyc must be used within a KycProvider");
	}
	return ctx;
}