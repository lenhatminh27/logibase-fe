import { Form, Input, Button, Typography, Row, Col } from "antd"
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons"
import Logo from "../../components/Logo"
import banner from "../../assets/banner.jpg"
import { instance } from "../../config/axios"
import type { RegisterRequest, RegisterResponse } from "../../shared/types/auth"
import type { Response } from "../../shared/types/response"

const { Title, Link } = Typography

interface RegisterForm extends RegisterRequest {
  confirmPassword: string
}

function RegisterPage() {
  const [form] = Form.useForm()

  const onFinish = async (values: RegisterForm) => {
    console.log("Received values of form: ", values)
    const { confirmPassword, ...rest } = values
    try {
      const response = await instance.post("/api/auth/register", rest)
      const resData: Response<RegisterResponse> = response.data
      console.log(resData)
    } catch (error) {
      console.log(error)
    }
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
          <Form
            form={form}
            name="register_form"
            onFinish={onFinish}
            validateTrigger="onSubmit"
            layout="vertical"
            size="large"
            className="space-y-1"
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
                  <Input placeholder="Tên" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ của bạn!" },
                  ]}
                  className="!mb-0 sm:!mb-0">
                  <Input placeholder="Họ" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
              className="!mb-4">
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Username"
              />
            </Form.Item>
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
              />
            </Form.Item>
            <Form.Item className="!mb-6">
              <Button
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
