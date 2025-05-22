import { useState } from "react"
import { Form, Input, Button, Steps, message } from "antd"
import { MailOutlined, LockOutlined } from "@ant-design/icons"
import { instance } from "../../../config/axios"
import { useNavigate } from "react-router-dom"
import type { ErrorResponse } from "../../../shared/types/response"
import type { AxiosError } from "axios"

const { Step } = Steps

function ForgotPasswordForm() {
  const [step, setStep] = useState(0)
  const [form] = Form.useForm()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSendEmail = async () => {
    setIsLoading(true)
    const values = await form.validateFields(["email"])
    try {
      await instance.post("/api/auth/forgot-password", { email: values.email })
      setEmail(values.email)
      message.success("Đã gửi mã OTP đến email.")
      setStep(1)
      setIsLoading(false)
    } catch (error) {
      const errorData: ErrorResponse = (error as AxiosError).response
        ?.data as ErrorResponse
      message.error(errorData?.message)
    }
  }

  const handleVerifyOtp = async () => {
    const values = await form.validateFields(["otp"])
    try {
      await instance.post("/api/auth/verify-otp", {
        email,
        otp: values.otp,
      })
      setOtp(values.otp)
      message.success("Xác thực OTP thành công.")
      setStep(2)
    } catch (error) {
      const errorData: ErrorResponse = (error as AxiosError).response
        ?.data as ErrorResponse
      message.error(errorData?.message)
    }
  }

  const handleResendOtp = async () => {
    setIsLoading(true)
    try {
      await instance.post("/api/auth/forgot-password", { email })
      message.success("Mã OTP mới đã được gửi.")
    } catch (error) {
      const errorData: ErrorResponse = (error as AxiosError).response
        ?.data as ErrorResponse
      message.error(errorData?.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    const values = await form.validateFields(["newPassword", "confirmPassword"])

    try {
      await instance.post("/api/auth/reset-password", {
        otp,
        newPassword: values.newPassword,
      })
      message.success("Đổi mật khẩu thành công.")
      navigate("/login")
      form.resetFields()
    } catch (error) {
      const errorData: ErrorResponse = (error as AxiosError).response
        ?.data as ErrorResponse
      message.error(errorData?.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-xl">
      <h2 className="text-2xl font-semibold text-center mb-6">Quên mật khẩu</h2>

      <Steps current={step} size="small" className="mb-6">
        <Step title="Email" />
        <Step title="OTP" />
        <Step title="Mật khẩu" />
      </Steps>

      <Form form={form} layout="vertical" className="!mt-10">
        {step === 0 && (
          <>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
              <Input
                size="large"
                placeholder="Nhập email của bạn"
                prefix={<MailOutlined />}
                className="rounded-md"
              />
            </Form.Item>
            <Button
              type="primary"
              block
              onClick={handleSendEmail}
              disabled={isLoading}>
              Gửi mã OTP
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <Form.Item
              name="otp"
              label="Nhập mã OTP"
              rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}>
              <Input.OTP
                size="large"
                length={6}
                autoFocus
                className="rounded-md"
              />
            </Form.Item>
            <Button
              type="primary"
              block
              onClick={handleVerifyOtp}
              className="mt-2 rounded-md"
              loading={isLoading}>
              Xác thực
            </Button>

            <Button
              type="link"
              block
              onClick={handleResendOtp}
              className="mt-1 text-blue-500 hover:underline"
              disabled={isLoading}>
              Gửi lại mã OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ]}>
              <Input.Password
                placeholder="Nhập mật khẩu mới"
                prefix={<LockOutlined />}
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"))
                  },
                }),
              ]}>
              <Input.Password
                placeholder="Nhập lại mật khẩu"
                prefix={<LockOutlined />}
                className="rounded-md"
                required
              />
            </Form.Item>

            <Button
              type="primary"
              block
              onClick={handleChangePassword}
              className="mt-2 rounded-md">
              Đặt lại mật khẩu
            </Button>
          </>
        )}
      </Form>
    </div>
  )
}

export default ForgotPasswordForm
