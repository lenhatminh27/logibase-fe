import { Form, Input, Button, Checkbox, Typography } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import Logo from "../../../components/Logo"
import banner from "../../../assets/banner.jpg"
import type { LoginRequest, LoginResponse } from "../../../shared/types/auth"
import { instance } from "../../../config/axios"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Alert from "../../../components/Alert"
import { useDispatch } from "react-redux"
import { setAuth } from "../../../redux/auth/auth.slice"
import type { ErrorResponse, Response } from "../../../shared/types/response"
import type { AxiosError } from "axios"
import { Link as RouterLink } from "react-router-dom"

const { Title, Text, Link } = Typography

interface LoginForm extends LoginRequest {
  rememberMe: boolean
}

function LoginPage() {
  const [form] = Form.useForm()
  const [error, setError] = useState<string>("")
  const navigate = useNavigate()

  const dispatch = useDispatch()

  const onFinish = async (values: LoginForm) => {
    console.log("Received values of form: ", values)
    try {
      const { ...rest } = values
      console.log(rest)
      const response = await instance.post("/api/auth/login", {
        ...rest,
        rememberMe: !!rest.rememberMe,
      })
      const resData: Response<LoginResponse> = response.data
      if (resData) dispatch(setAuth(resData.data as LoginResponse))
      if (resData.data?.user.role === "ADMIN") {
        navigate("/admin/courses", { replace: true })
      } else navigate("/")
    } catch (error) {
      const errorData: ErrorResponse = (error as AxiosError).response
        ?.data as ErrorResponse
      setError(errorData.message)
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
              Đăng nhập
            </Title>
            <Link
              href="/register"
              className="text-sm text-blue-600 hover:text-blue-700">
              Mở tài khoản
            </Link>
          </div>
          {error && <Alert message={error} type="error" />}
          <Form
            name="login_form"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            validateTrigger="onSubmit"
            layout="vertical"
            size="large"
            className="space-y-1 !mt-5">
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng điền Email hoặc Username!",
                },
              ]}
              className="!mb-4">
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Điền Email hoặc Username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng điền mật khẩu!" }]}
              className="!mb-2">
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item className="!mb-4">
              <div className="flex justify-between items-center">
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-600">
                    Tự động đăng nhập
                  </Checkbox>
                </Form.Item>
                <RouterLink
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700">
                  Quên mật khẩu?
                </RouterLink>
              </div>
            </Form.Item>

            <Form.Item className="!mb-6">
              <Button
                onClick={() => setError(() => "")}
                type="primary"
                htmlType="submit"
                className="w-full !h-12 !text-base">
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          {/* <Text
            type="secondary"
            className="block text-center text-xs text-gray-500">
            <Link href="#" className="text-gray-500 hover:text-gray-600">
              Điều khoản Thanh toán
            </Link>{" "}
            và{" "}
            <Link href="#" className="text-gray-500 hover:text-gray-600">
              Chính sách Bảo mật
            </Link>
          </Text> */}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
