import { Form, Input, Button, Typography, Row, Col, message } from "antd"
import {
  MailOutlined,
  LockOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons"
import Logo from "../../../components/Logo"
import banner from "../../../assets/banner.jpg"
import { instance } from "../../../config/axios"
import type {
  RegisterRequest,
  RegisterResponse,
} from "../../../shared/types/auth"
import type { ErrorResponse, Response } from "../../../shared/types/response"
import { useState } from "react"
import Alert from "../../../components/Alert"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

const { Title, Link } = Typography

interface RegisterForm extends RegisterRequest {
  confirmPassword: string
}

function RegisterPage() {
  const [form] = Form.useForm()
  const [error, setError] = useState<string>("")
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const navigate = useNavigate()

  const onFinish = async (values: RegisterForm) => {
    console.log("Received values of form: ", values)
    const { confirmPassword, ...rest } = values
    try {
      const response = await instance.post("/api/auth/register", rest)
      const resData: Response<RegisterResponse> = response.data
      message.success("Đăng ký thành công!")
      navigate("/login")
      form.resetFields()
      console.log(resData)
    } catch (error) {
      const errorData: ErrorResponse = (error as AxiosError).response
        ?.data as ErrorResponse
      setError(errorData.message)
      setIsSuccess(false)
    }
  }

  const handleChange = (name: string) => {
    form.setFields([
      {
        name: name,
        errors: [],
      },
    ])
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden lg:block lg:w-1/2 xl:w-3/5">
        <img
          src={banner}
          alt="Logistics Background"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          <Logo />
          <div className="flex justify-between items-baseline mb-6">
            <Title
              level={2}
              className="!text-2xl !font-semibold !text-gray-800 !mb-0">
              Tạo một tài khoản
            </Title>
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-700">
              hoặc đăng nhập
            </Link>
          </div>
          {error && (
            <Alert
              message={error}
              type="error"
              closable={true}
              onClose={() => setError("")}
            />
          )}
          {isSuccess && (
            <Alert
              message="Đăng ký thành công!"
              type="success"
              closable={true}
              onClose={() => setIsSuccess(false)}
            />
          )}
          <Form
            form={form}
            name="register_form"
            onFinish={onFinish}
            validateTrigger="onSubmit"
            layout="vertical"
            size="large"
            className="space-y-1 !mt-5"
            requiredMark={false}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
              className="!mb-4">
              <Input
                prefix={
                  <MailOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Email"
                onChange={(e) => handleChange(e.target.name)}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu của bạn!" },
              ]}
              className="!mb-4">
              <Input
                type="password"
                prefix={
                  <LockOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Password"
                onChange={(e) => handleChange(e.target.name)}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận lại mật khẩu của bạn!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    )
                  },
                }),
              ]}
              className="!mb-4">
              <Input
                type="password"
                prefix={
                  <LockOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Xác nhận mật khẩu"
                onChange={(e) => handleChange(e.target.name)}
              />
            </Form.Item>

            <Row gutter={16} className="!mb-4">
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên của bạn!" },
                  ]}
                  className="!mb-0 sm:!mb-0">
                  <Input
                    placeholder="Tên"
                    onChange={(e) => handleChange(e.target.name)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ của bạn!" },
                  ]}
                  className="!mb-0 sm:!mb-0">
                  <Input
                    placeholder="Họ"
                    onChange={(e) => handleChange(e.target.name)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="address"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ của bạn!" },
              ]}
              className="!mb-4">
              <Input
                prefix={
                  <HomeOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Địa chỉ"
                onChange={(e) => handleChange(e.target.name)}
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^\d{9,11}$/,
                  message: "Số điện thoại không hợp lệ (9-11 số)!",
                },
              ]}
              className="!mb-4">
              <Input
                prefix={
                  <PhoneOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Số điện thoại"
                onChange={(e) => handleChange(e.target.name)}
              />
            </Form.Item>
            <Form.Item className="!mb-6">
              <Button
                onClick={() => setError(() => "")}
                type="primary"
                htmlType="submit"
                className="w-full !h-12 !text-base bg-blue-600 hover:bg-blue-700">
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
