import { retryActive } from "@/config/api"
import { Button, Input, message, notification } from "antd"
import React from "react"

const StepLogin = ({
    setCurrentStep,
    setIdUser,
}: {
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
    setIdUser: React.Dispatch<React.SetStateAction<string>>
}) => {
    const [email, setEmail] = React.useState<string>("")
    const handlerClickSend = async () => {
        if (email === "") {
            message.error("Vui lòng nhập email")
            return
        }
        try {
            const response = await retryActive({ email })
            if (response?.data) {
                setIdUser(response?.data?._id)
                setCurrentStep(1)
            } else if (response?.message) {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: response?.message,
                    duration: 5,
                })
            }
        } catch (error: any) {
            console.log("Failed:", error)
            message.error(
                error?.response?.data?.message || "Email không tồn tại"
            )
        }
    }
    return (
        <div className="flex flex-col gap-2">
            <div> Tài khoản của bạn chưa được kích hoạt</div>
            <Input
                type="email"
                placeholder="Vui lòng nhập email"
                value={email}
                onChange={(e) => setEmail(() => e.target.value)}
            ></Input>
            <Button
                className="w-[20%]"
                type="primary"
                onClick={handlerClickSend}
            >
                Gửi
            </Button>
        </div>
    )
}

export default StepLogin
