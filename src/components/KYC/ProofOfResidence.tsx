import { useState } from "react";
import { Card, Button, Space, Typography, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { useNavigate } from "react-router";
import classes from "./ProofOfResidence.module.css";
import { useKyc } from "../../context/KycContext";

const { Title, Text } = Typography;

export default function ProofOfResidence() {
  const navigate = useNavigate();
  const { setProofOfResidenceUploaded } = useKyc();

  type BeforeUploadFile = Parameters<NonNullable<UploadProps["beforeUpload"]>>[0];

  const [file, setFile] = useState<BeforeUploadFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]); // control the Upload list

  const handleUpload = async () => {
    if (!file) {
      message.warning("Please attach a file first");
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(
        storage,
        `kyc/proof-of-residence/${Date.now()}-${file.name}`,
      );

      await uploadBytes(storageRef, file);

      message.success("File uploaded successfully");

      setProofOfResidenceUploaded(true);

      // Clear state and Upload UI
      setFile(null);
      setFileList([]);

      navigate("/kyc", { replace: true });
    } catch (error: unknown) {
      console.error(error);
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <Title level={4}>Proof of Residence</Title>
        <Text type="secondary">
          Upload a document or photo showing your address.
        </Text>

        <Space orientation="vertical" size="large" className={classes.actions}>
          {/* Upload photo OR PDF */}
          <Upload
            style={{ width: "100%" }}

            className={classes.upload}
            beforeUpload={(selectedFile) => {
              setFile(selectedFile);
              setFileList([
                {
                  uid: String(Date.now()),
                  name: selectedFile.name,
                  status: "done",
                  originFileObj: selectedFile,
                },
              ]);
              return false; // prevent auto upload; we upload on "Submit"
            }}
            fileList={fileList}
            accept="image/*,.pdf,application/pdf"
            maxCount={1}
            showUploadList={{ showRemoveIcon: true }}
            onRemove={() => {
              setFile(null);
              setFileList([]);
            }}
          >
            <Button block size="large" icon={<UploadOutlined />}>
              Upload Proof Of Residence (Photo or PDF)
            </Button>
          </Upload>

          {/* Submit button */}
          <Button
            type="primary"
            size="large"
            block
            loading={uploading}
            onClick={handleUpload}
          >
            Submit
          </Button>

          <Button
            size="large"
            block
            type="link"
            onClick={() => navigate("/kyc")}
          >
            Not now
          </Button>
        </Space>
      </Card>
    </div>
  );
}
