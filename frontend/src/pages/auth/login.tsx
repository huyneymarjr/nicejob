import {
  Flex,
  Checkbox,
  Image,
  Button,
  Divider,
  Form,
  Input,
  message,
  notification,
} from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { callLogin } from "config/api"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUserLoginInfo } from "@/redux/slice/accountSlide"
import styles from "styles/auth.module.scss"
import { useAppSelector } from "@/redux/hooks"
import ModalAuthenAccount from "./Modal/ModalAuthenAccount"
import logo from "@/assets/Images/logo3.png"

const LoginPage = () => {
  const navigate = useNavigate()
  const [isSubmit, setIsSubmit] = useState(false)
  const dispatch = useDispatch()
  const isAuthenticated = useAppSelector(
      (state) => state.account.isAuthenticated
  )
  const [isModalVisibleAuthen, setIsModalVisibleAuthen] =
      useState<boolean>(false)

  let location = useLocation()
  let params = new URLSearchParams(location.search)
  const callback = params?.get("callback")

  useEffect(() => {
      //đã login => redirect to '/'
      if (isAuthenticated) {
          // navigate('/');
          window.location.href = "/"
      }
  }, [])

  const onFinish = async (values: any) => {
      const { username, password } = values
      setIsSubmit(true)
      const res = await callLogin(username, password)
      setIsSubmit(false)
      if (res?.data) {
          localStorage.setItem("access_token", res.data.access_token)
          dispatch(setUserLoginInfo(res.data.user))
          message.success("Đăng nhập tài khoản thành công!")
          window.location.href = callback ? callback : "/"
      } else {
          notification.error({
              message: "Có lỗi xảy ra",
              description:
                  res.message && Array.isArray(res.message)
                      ? res.message[0]
                      : res.message,
              duration: 5,
          })
          if (
              res.message ===
              "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt tài khoản."
          ) {
              setIsModalVisibleAuthen(true)
          }
      }
  }

  return (
      <div className={"text-black bg-light "}>
          {isModalVisibleAuthen && (
              <ModalAuthenAccount
                  isOpenModal={isModalVisibleAuthen}
                  setIsOpenModal={setIsModalVisibleAuthen}
              />
          )}
          <main>
              <div
                  className={
                      "flex flex-col justify-center items-center max-w-[80rem] min-h-screen  px-8 mx-auto"
                  }
              >
                  <img
                      className="max-w-[28rem] w-full"
                      src={logo}
                      style={{ filter: "grayscale(100%) brightness(0%)" }}
                  />
                  <section
                      className={
                          "max-w-[36rem] w-full my-8 mx-auto p-8 px-10 border-none outline-none rounded-lg text-black shadow-large bg-white"
                      }
                  >
                      <div>
                          <h2
                              className={`text-[2rem] font-[600] text-black text-center `}
                          >
                              Đăng nhập
                          </h2>
                          <Divider />
                      </div>
                      <Form
                          name="login"
                          className="w-full h-auto mt-8"
                          onFinish={onFinish}
                          autoComplete="off"
                      >
                          <Form.Item
                              labelCol={{ span: 24 }}
                              label="Email"
                              name="username"
                              rules={[
                                  {
                                      required: true,
                                      message: "Email không được để trống!",
                                  },
                              ]}
                              normalize={(value) => value.trim()}
                          >
                              <Input
                                  className="p-1.5"
                                  prefix={<UserOutlined className="p-1.5" />}
                                  placeholder="Email"
                              />
                          </Form.Item>

                          <Form.Item
                              labelCol={{ span: 24 }}
                              label="Mật khẩu"
                              name="password"
                              rules={[
                                  {
                                      required: true,
                                      message:
                                          "Mật khẩu không được để trống!",
                                  },
                              ]}
                              normalize={(value) => value.trim()}
                          >
                              <Input
                                  prefix={<LockOutlined className="p-1.5" />}
                                  type="password"
                                  placeholder="Mật khẩu"
                                  className="p-1.5"
                              />
                          </Form.Item>
                          <Form.Item>
                              <Flex justify="space-between" align="center">
                                  {/* <Form.Item
                                      name="remember"
                                      valuePropName="checked"
                                      noStyle
                                  >
                                      <Checkbox
                                          onChange={(e) => {
                                              if (e.target.checked) {
                                                  localStorage.setItem(
                                                      "rememberMe",
                                                      "true"
                                                  )
                                              } else {
                                                  localStorage.removeItem(
                                                      "rememberMe"
                                                  )
                                              }
                                          }}
                                      >
                                          Nhớ tài khoản
                                      </Checkbox>
                                  </Form.Item> */}
                                  <div></div>
                                  <Link className="text-blue" to="/forgot">
                                      {""}
                                      Quên mật khẩu
                                  </Link>
                              </Flex>
                          </Form.Item>
                          <Form.Item
                          // wrapperCol={{ offset: 6, span: 16 }}
                          >
                              <Button
                                  block
                                  type="primary"
                                  htmlType="submit"
                                  loading={isSubmit}
                                  className="transition duration-300 ease-in-out transform hover:scale-105 "
                              >
                                  Đăng nhập
                              </Button>
                          </Form.Item>
                          <Divider>Hoặc</Divider>
                          <p className="text text-normal">
                              Chưa có tài khoản?
                              <span>
                                  <Link className="text-blue" to="/register">
                                      {" "}
                                      Đăng ký ngay
                                  </Link>
                              </span>
                          </p>
                      </Form>
                  </section>
              </div>
          </main>
      </div>
  )
}

export default LoginPage