import React, { useEffect, useRef, useState } from "react"
import TextInput from "./InputChat"
import { MessageLeft, MessageRight } from "./Message"
import { Button, Card, Modal, Typography } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
// import Dialog from "./Dialog";

export default function App({
    setOpen,
}: {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const [loading, setLoading] = useState<boolean>(false)
    const [question, setQuestion] = useState<string>("")
    const [message, setMessage] = useState<
        {
            role: string
            message: string
        }[]
    >([])
    const [openDiaLog, setOpenDiaLog] = useState<boolean>(false)

    const handlerOffAI = () => {
        Modal.confirm({
            title: "Nếu bạn tắt dữ liệu sẽ không được lưu bạn có chắc chắn tắt chứ?",
            icon: <ExclamationCircleOutlined />,
            onOk() {
                setOpen(false)
            },
            onCancel() {
                console.log("Cancel")
            },
            okText: "Đồng ý",
            cancelText: "Không",
        })
    }

    const messagesEndRef = useRef<null | HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [message])

    return (
        <>
            {/* {openDiaLog ? (
                <Dialog
                    openDiaLog={openDiaLog}
                    setOpenDiaLog={setOpenDiaLog}
                    setOpen={setOpen}
                />
            ) : null} */}
            <Card
                className="w-[400px] h-[80vh] flex flex-col items-center justify-around gap-3 card-chatbox"
                bordered
                bodyStyle={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                <div className="flex w-full justify-center items-center relative mb-2">
                    <Typography.Text className="mt-2">
                        Nhắn tin với NiceJob'AI
                    </Typography.Text>
                    <Button
                        type="text"
                        className="absolute right-0"
                        onClick={handlerOffAI}
                    >
                        X
                    </Button>
                </div>

                <div className="w-[400px] flex flex-col items-center relative gap-3 overflow-auto h-[70vh]">
                    <MessageLeft message="Xin chào tôi là NiceJob'AI, tôi có thể giúp được gì cho bạn?" />

                    {message.map((item, index) => {
                        if (item.role === "user") {
                            return (
                                <MessageRight
                                    key={index}
                                    message={item.message}
                                />
                            )
                        } else {
                            return (
                                <MessageLeft
                                    key={index}
                                    message={item.message}
                                    loading={
                                        loading && index === message.length - 1
                                    }
                                />
                            )
                        }
                    })}
                    {loading ? <MessageLeft loading={loading} /> : null}
                    <div ref={messagesEndRef} />
                </div>

                <TextInput
                    question={question}
                    setQuestion={setQuestion}
                    setMessage={setMessage}
                    setLoading={setLoading}
                />
            </Card>
        </>
    )
}
