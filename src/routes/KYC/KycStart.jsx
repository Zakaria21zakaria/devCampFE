import { useEffect, useState } from "react";
import { Card, Button, Space, Typography } from "antd";
import {
  HomeOutlined,
  CameraOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import classes from "./KycStart.module.css";

const { Title, Text } = Typography;

export default function KycStart() {
  const navigate = useNavigate();
  const [proofOfResidenceUploaded, setProofOfResidenceUploaded] =
    useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  useEffect(() => {
    try {
      setProofOfResidenceUploaded(
        localStorage.getItem("kyc.proofOfResidenceUploaded") === "true",
      );
      setSelfieUploaded(localStorage.getItem("kyc.selfieUploaded") === "true");
    } catch {
      setProofOfResidenceUploaded(false);
      setSelfieUploaded(false);
    }
  }, []);

  const identityVerified = proofOfResidenceUploaded && selfieUploaded;

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <Title level={3}>
          <span>
            {" "}
            {identityVerified
              ? `Identity Verification Successful`
              : `Identity Verification`}{" "}
          </span>
        </Title>
        {!identityVerified && (
          <Text type="secondary">
            We are committed to providing a safe secure shopping experience for
            our community and therefore your account must be verified by
            completing a KYC verification.
          </Text>
        )}

        <Space orientation="vertical" size="large" className={classes.actions}>
          <Button
            size="large"
            block
            icon={<HomeOutlined />}
            disabled={proofOfResidenceUploaded}
            onClick={() => navigate("/kyc/residence")}
            className={
              proofOfResidenceUploaded ? classes.completedButton : undefined
            }
          >
            <span className={classes.buttonContent}>
              <span>
                {proofOfResidenceUploaded
                  ? "Proof of Residence Uploaded"
                  : "Upload Proof of Residence"}
              </span>
              {proofOfResidenceUploaded && <CheckCircleOutlined />}
            </span>
          </Button>

          <Button
            size="large"
            block
            icon={<CameraOutlined />}
            disabled={selfieUploaded}
            onClick={() => navigate("/kyc/selfie")}
            className={selfieUploaded ? classes.completedButton : undefined}
          >
            <span className={classes.buttonContent}>
              <span>
                {selfieUploaded ? "Selfie Uploaded" : "Upload Selfie"}
              </span>
              {selfieUploaded && <CheckCircleOutlined />}
            </span>
          </Button>

          {identityVerified ? (
            <Button
              size="large"
              block
              type="primary"
              onClick={() => navigate("/")}
            >
              Continue to Home
            </Button>
          ) : (
            <Button
              size="large"
              block
              type="link"
              onClick={() => navigate("/")}
            >
              Not now
            </Button>
          )}
        </Space>
      </Card>
    </div>
  );
}
