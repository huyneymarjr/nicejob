import { checkCode } from "@/config/api"
import { Button, Input, message, notification } from "antd"
import React from "react"

const StepVerification = ({
    setCurrentStep,
    idUser,
    setLoading,
}: {
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
    idUser: string
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [code, setCode] = React.useState<string>("")
    const handlerClickSend = async () => {
        if (code === "") {
            message.error("Vui lòng nhập mã xác nhận")
            return
        }
        try {
            setLoading(true)
            const res = await checkCode({
                code,
                _id: idUser,
            })
            if (res.data) {
                setCurrentStep(2)
                setLoading(false)
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message,
                    duration: 5,
                })
                setLoading(false)
            }
        } catch (error: any) {
            console.log("Failed:", error)
            message.error(
                error?.response?.data?.message || "Mã xác nhận không đúng"
            )
        }
    }
    return (
        <div className="flex flex-col gap-2">
            <div> Vui lòng nhập mã xác nhận</div>
            <Input
                type="email"
                placeholder="Vui lòng nhập mã xác nhận"
                value={code}
                onChange={(e) => setCode(() => e.target.value)}
            ></Input>
            <Button
                className="w-[20%]"
                type="primary"
                onClick={handlerClickSend}
            >
                Xác nhận
            </Button>
        </div>
    )
}
export default StepVerification
