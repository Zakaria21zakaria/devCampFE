import { useRef, useState } from "react";
import { Card, Button, Space, Typography, Upload, message } from "antd";
import { CameraOutlined, UploadOutlined } from "@ant-design/icons";
import Webcam from "react-webcam";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { useNavigate } from "react-router";

const { Title, Text } = Typography;

export default function SelfieUpload() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const captureSelfie = async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) {
      message.error("Could not capture image. Please allow camera access.");
      return;
    }

    const res = await fetch(screenshot);
    const blob = await res.blob();
    const filename = `selfie-${Date.now()}.jpg`;
    const file = new File([blob], filename, {
      type: blob.type || "image/jpeg",
    });

    setFileList([
      {
        uid: String(Date.now()),
        name: file.name,
        status: "done",
        originFileObj: file,
        thumbUrl: screenshot,
      },
    ]);
    setShowCamera(false);
    message.success("Selfie captured");
  };

  const handleUpload = async () => {
    const selectedFile = fileList?.[0]?.originFileObj;
    if (!selectedFile) {
      message.warning("Please attach or capture a selfie first");
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(
        storage,
        `kyc/selfie/${Date.now()}-${selectedFile.name}`,
      );
      await uploadBytes(storageRef, selectedFile);
      message.success("Selfie uploaded successfully");

      try {
        localStorage.setItem("kyc.selfieUploaded", "true");
      } catch {
        // ignore
      }

      setFileList([]);
      navigate("/kyc", { replace: true });
    } catch (error) {
      console.error(error);
      message.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <Card style={{ width: 500 }}>
        <Title level={4}>Selfie Verification</Title>
        <Text type="secondary">
          Take a clear selfie or upload a recent photo.
        </Text>

        <Space
          orientation="vertical"
          size="large"
          style={{ marginTop: 24, width: "100%" }}
        >
          {/* Camera */}
          <Button
            block
            size="large"
            icon={<CameraOutlined />}
            onClick={() => setShowCamera((v) => !v)}
          >
            Take selfie with camera
          </Button>

          {showCamera && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "user" }}
                style={{ width: "100%", borderRadius: 8 }}
              />
              <Button block size="large" type="primary" onClick={captureSelfie}>
                Capture selfie
              </Button>
            </>
          )}

          {/* Upload photo */}
          <Upload
                      style={{ width: "100%" }}

            beforeUpload={() => false}
            accept="image/*"
            listType="picture"
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList: next }) => setFileList(next.slice(-1))}
          >
            <Button block size="large" icon={<UploadOutlined />}>
              Upload photo
            </Button>
          </Upload>

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
