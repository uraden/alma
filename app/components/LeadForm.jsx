"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Checkbox, message, Upload } from "antd";
import { GiPerspectiveDiceSixFacesThree } from "react-icons/gi";
import { FaHeart } from "react-icons/fa6";
import { InboxOutlined } from "@ant-design/icons";
import { getUsers, uploadFile, addUser } from "./request";
import { AiFillFileExclamation } from "react-icons/ai";


export default function LeadForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);


  const props = {
    name: "file",
    multiple: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: 'uploading', 
          },
        ]);

        
        const response = await uploadFile(file);

        
        setFileList([
          {
            uid: file.uid,
            name: response.data.name,
            status: 'done', 
            url: response.data.downloadPage,
          },
        ]);

        onSuccess(response, file);
        message.success(`${file.name} uploaded successfully.`);
      } catch (error) {
        
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: 'error',
          },
        ]);

        onError(error);
        message.error(`${file.name} upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
    };
    fetchUsers();
  }, []);

  const router = useRouter();

  const [form] = Form.useForm();

  const { TextArea } = Input;

  const onSubmit = async (values) => {
    const resumeUrl = fileList.length > 0 ? fileList[0].url : null;

    const formValues = {
      ...values,
      resumeUrl,
      status: "pending",
    };
    setIsFormSubmitted(true);

    const response = await addUser(formValues);

    if (response) {
      form.resetFields();
      setFileList([]);
      messageApi.success("Form submitted successfully");
      setIsFormSubmitted(false); // Move here
      router.push(`/confirmation?email=${values.email}`);
    } else {
      messageApi.error("Form submission failed");
      setIsFormSubmitted(false);
    }

   
  };

  return (
    <div className="min-h-screen flex flex-col">
      {contextHolder}
      <div>
        <img src="/alma-banner.png" alt="" className="w-full h-auto" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded w-full max-w-2xl">
          <AiFillFileExclamation
            size={70}
            color="#8C8AFE"
            className="mx-auto"
          />
          <h2 className="text-[24px] font-bold text-center my-2">
            Want to understand your visa options?
          </h2>
          <p className="mb-4 text-center font-semibold text-[18px]">
            Submit the form below and our team of experienced attorneys will
            review your information and send the preliminary assessment of your
            case based on your goals.
          </p>
          <div className="flex items-center justify-center min-h-screen">
          <Form
            form={form}
            onFinish={onSubmit}
            className="space-y-6 w-[80%] p-6 bg-white rounded-lg "
            layout="horizontal"
            wrapperCol={{ span: 24 }}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "First Name is required" }]}
            >
              <Input placeholder="First Name" size="large" />
            </Form.Item>

            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Last Name is required" }]}
            >
              <Input placeholder="Last Name" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Please enter your email" },
                {
                  validator: (_, value) => {
                    if (!value.includes("@")) {
                      return Promise.reject(
                        new Error("Please enter a valid email")
                      );
                    }
                    return Promise.resolve();
                    
                }
              }
              ]}
            >
              <Input placeholder="Email" size="large" />
            </Form.Item>

            <Form.Item
              name="linkedInUrl"
              rules={[
                { required: true, message: "LinkedIn Profile is required" },
                {
                  validator: (_, value) => {
                    if (value && !value.includes("linkedin.com")) {
                      return Promise.reject(
                        new Error("Please enter a valid LinkedIn profile URL")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="LinkedIn Profile" size="large" />
            </Form.Item>

            <div className="mt-[40px]">
              <GiPerspectiveDiceSixFacesThree
                size={70}
                color="#8C8AFE"
                className="mx-auto"
              />
              <h2 className="text-[24px] font-bold text-center mb-2">
                Visa Categories of Interest?
              </h2>
            </div>

            <Form.Item
              name="visasOfInterest"
              rules={[
                {
                  required: true,
                  message: "Select at least one visa category",
                },
              ]}
            >
              <Checkbox.Group
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <Checkbox value="O-1" style={{ fontSize: "16px" }}>
                  O-1 (Extraordinary Ability)
                </Checkbox>
                <Checkbox value="EB-1" style={{ fontSize: "16px" }}>
                  EB-1 (Extraordinary Ability)
                </Checkbox>
                <Checkbox value="EB-2 NIW" style={{ fontSize: "16px" }}>
                  EB-2 NIW (National Interest Waiver)
                </Checkbox>
                <Checkbox value="I don’t know" style={{ fontSize: "16px" }}>
                  I don’t know
                </Checkbox>
              </Checkbox.Group>
            </Form.Item>

            <div className="mt-[40px]">
              <FaHeart size={70} color="#8C8AFE" className="mx-auto" />
              <h2 className="text-[24px] font-bold text-center mb-2">
                How can we help you?
              </h2>
            </div>

            <Form.Item
              name="resumeUrl"
              rules={[{ required: true, message: "Resume/CV is required" }]}
            >
              <Upload.Dragger {...props} fileList={fileList}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag CV to this area to upload
                </p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item
             
              name="additionalInfo"
              rules={[
                {
                  required: true,
                  message: "Additional information is required",
                },
              ]}
            >
              <TextArea
                placeholder="Tell us more about your needs..."
                autoSize={{ minRows: 4 }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="default" 
                htmlType="submit"
                block
                size="large"
                style={{
                  backgroundColor: "black", 
                  borderColor: "black",
                  color: "white", 
                }}
                loading={isFormSubmitted}
                disabled={isFormSubmitted}
                className="submit-button"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
