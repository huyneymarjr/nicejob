import {
    QuestionCircleOutlined,
    SmileOutlined,
    SolutionOutlined,
    UserOutlined,
} from "@ant-design/icons"
import { Modal, Steps, Tooltip } from "antd"
import React from "react"
import StepLogin from "../components/StepLogin"
import StepVerification from "../components/StepVerification"

const ModalAuthenAccount = ({
    isOpenModal,
    setIsOpenModal,
}: {
    isOpenModal: boolean
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [currentStep, setCurrentStep] = React.useState<number>(0)
    const [loading, setLoading] = React.useState<boolean>(false)
    const [idUser, setIdUser] = React.useState<string>("")
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <StepLogin
                        setCurrentStep={setCurrentStep}
                        setIdUser={setIdUser}
                    />
                )
            case 1:
                return (
                    <StepVerification
                        setCurrentStep={setCurrentStep}
                        setLoading={setLoading}
                        idUser={idUser}
                    />
                )
            case 2:
                return (
                    <div>Tài khoản của bạn đã được kích hoạt thành công.</div>
                )
            default:
                return (
                    <StepLogin
                        setCurrentStep={setCurrentStep}
                        setIdUser={setIdUser}
                    />
                )
        }
    }
    const onCancel = () => {
        setIsOpenModal(false)
        setCurrentStep(0)
    }
    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <p>Kích hoạt tài khoản</p>{" "}
                    <Tooltip
                        title={
                            "Chúng tôi sẽ gửi mã xác thực về email sau khi bạn nhập email của bạn"
                        }
                    >
                        {" "}
                        <QuestionCircleOutlined />
                    </Tooltip>
                </div>
            }
            open={isOpenModal}
            footer={null}
            onCancel={onCancel}
            centered
        >
            <Steps
                items={[
                    {
                        title: "Tài khoản",
                        // status: 'finish',
                        icon: <UserOutlined />,
                    },
                    {
                        title: "Xác thực",
                        // status: 'finish',
                        icon: <SolutionOutlined />,
                    },
                    //   {
                    //     title: 'Pay',
                    //     status: 'process',
                    //     icon: <LoadingOutlined />,
                    //   },
                    {
                        title: "Hoàn thành",
                        // status: loading ? "wait" : "finish",
                        icon: <SmileOutlined />,
                    },
                ]}
                current={currentStep}
            />
            {renderStep()}
        </Modal>
    )
}

export default ModalAuthenAccount
