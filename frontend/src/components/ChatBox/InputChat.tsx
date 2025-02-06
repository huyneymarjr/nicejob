import { FormEvent, useState } from "react"
// import { askAI } from "@/app/_api/allRolls"
import { Button, Input } from "antd"
import { SendOutlined } from "@ant-design/icons"
import run from "@/config/chatboxFunc"
interface AIProps {
    question: string
    setQuestion: React.Dispatch<React.SetStateAction<string>>
    setMessage: React.Dispatch<
        React.SetStateAction<
            {
                role: string
                message: string
            }[]
        >
    >
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}
const InputChat = ({
    question,
    setQuestion,
    setMessage,
    setLoading,
}: AIProps) => {
    const handlerSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const questions = {
            role: "user",
            message: question,
        }
        setMessage((prev) => [...prev, questions])
        setQuestion("")
        setLoading(true)
        const response = await run(question)
        const answers = {
            role: "model",
            message: response,
        }
        setMessage((prev) => [...prev, answers])
        setLoading(false)
    }
    return (
        <>
            <form
                className="flex justify-center w-[95%] gap-2 items-center m-2"
                noValidate
                autoComplete="off"
                onSubmit={handlerSubmit}
            >
                <Input
                    placeholder="Câu hỏi...."
                    className="w-full h-full"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <Button
                    type="primary"
                    color="primary"
                    htmlType="submit"
                    className="h-[45px]"
                >
                    <SendOutlined />
                </Button>
            </form>
        </>
    )
}

export default InputChat
